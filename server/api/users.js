import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import moment from 'moment';
import shortid from 'shortid';

import { Plans } from './plans.js';
import { BASIC_PLAN_TRIAL_LENGTH_DAYS } from '../../imports/constants/plans.js';
import { resetPasswordEmail } from '../../imports/emailTemplates/resetPasswordEmail.js';

// Don't allow client side writing to profile field
Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  getCurrentUserProfile() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Can also use Meteor.user() instead, which is more performant?
    const user = Meteor.users.findOne({ _id: this.userId }, { fields: {
      _id: 1,
      emails: 1,
      name: 1,
      identity: 1,
      outcomes: 1,
    }});
    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    let email = '';
    if (user.emails && user.emails.length) {
      email = user.emails[0].address
    }

    const name = user.name || '';
    const identity = user.identity || '';
    const outcomes = user.outcomes || [];

    const response = {
      name,
      email,
      identity,
      outcomes,
    };

    return response;
  },
  updateCurrentUserProfile(args) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      args: {
        type: Object
      },
      'args.identity': {
        type: String,
        optional: true
      },
      'args.outcomes': {
        type: Array,
        optional: true
      },
      'args.outcomes.$': {
        type: String,
        optional: true
      },
      'args.accountStatus': {
        type: String,
        optional: true
      },
      'args.accountStatusUpdated': {
        type: Date,
        optional: true
      },
    }).validate({ args });

    Meteor.users.update({
      _id: this.userId,
    }, {
      '$set': args
    });

    return true;
  },
  async getCurrentUserAccountStatus() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const user = Meteor.users.findOne({_id: this.userId});

    if (!user) {
      throw new Meteor.Error('invalid-user');
    }

    // check the trial
    const now = moment().utc();
    // TO TEST:
    // const now = moment().add(14, 'years').utc().toDate(); // isTrialExpired = True
    
    // NOTE: if user doesnt have a createdAt date then isTrialExpired = False
    const isTrialExpired = user.createdAt && moment(user.createdAt).add(BASIC_PLAN_TRIAL_LENGTH_DAYS, 'days').utc() < now;

    // check the plan
    let isPlan = false;
    let isPlanInvalid = true;
    const plan = Plans.findOne({userId: this.userId, status: 'success'});
    if (plan && plan.subscriptionId) {
      isPlan = true;
      // NOTE: if we cant get a subscription (stripe failure) isPlanInvalid = False
      const subscription = await Meteor.call('getSubscription', plan.subscriptionId);
      // console.log('subscription: ', subscription)
      isPlanInvalid = subscription && subscription.status !== 'active';
    }

    // determine status:
    // trial_active -> valid (no modal)
    // trial_expired -> invalid, create new subscription (yes modal)
    // plan_active -> valid (no modal)
    // plan_inactive -> invalid, create new subscription (yes modal)
    let accountStatus = 'trial_active';
    if (isTrialExpired && !isPlan) {
      accountStatus = 'trial_expired';
    } else if (isPlan && isPlanInvalid) {
      accountStatus = 'plan_inactive';
    } else if (isPlan && !isPlanInvalid) {
      accountStatus = 'plan_active';
    }

    // write the account status to the user profile for mongo analytics
    Meteor.call('updateCurrentUserProfile', {accountStatus, accountStatusUpdated: moment().utc().toDate()});

    return accountStatus;
  }
});

// lifecycle method that runs after onCreateUser is called
// use it to validate data on user document before its saved
Accounts.validateNewUser((user) => {
  const name = user.name;
  const email = user.emails[0].address;

  new SimpleSchema({
    name: {
      type: String
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }).validate({ name, email });

  // send welcome email after we've validated the email and all data
  Meteor.call('sendSignupEmail', email);

  return true;
});

// lifecycle method that runs after meteor.accounts signup method is called
// use it to add additional data to user document
Accounts.onCreateUser((options, user) => {
  // note: options has profile on it
  // pass arbitrary data threw the profile object in signup method from client and save it on the user here

  let name = '';
  if (options.profile && options.profile.name) {
    name = options.profile.name;
  }

  new SimpleSchema({
    name: {
      type: String
    },
  }).validate({ name });

  // Add custom data to user account
  // NOTE: Make sure to think about new and existing users with changes to collection (adding data fields)
  user.name = name;
  // target identity (i.e. entrepreneur)
  user.identity = 'peak performing entrepreneur';
  // outcomes from achieving target identity (i.e. health, wealth, sex)
  user.outcomes = [];

  // created
  // Meteor already creates a createdAt field by default (https://docs.meteor.com/api/accounts.html#Meteor-users)
  user.created = moment().utc().toDate();

  // trial end date
  // 7 day trial
  user.trial_end_date = moment().add(7, 'days').utc().toDate();

  user.isBlocked = false;
  user.isDeleted = false;
  user.plan = null;

  return user;
});

// Accounts.emailTemplates
Accounts.emailTemplates.siteName = 'Wombo';
Accounts.emailTemplates.from = 'Wombo <jules@wombo.io>';

Accounts.emailTemplates.resetPassword.subject = (user) => {
  return `Forgotten password reset`;
};

Accounts.emailTemplates.resetPassword.text = (user, url) => {
  // return no body text
  return;
};

Accounts.emailTemplates.resetPassword.html = (user, url) => {
  return resetPasswordEmail(user, url);
};

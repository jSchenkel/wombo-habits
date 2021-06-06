import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import moment from 'moment';
import shortid from 'shortid';

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
    const user = Meteor.users.findOne({ _id: this.userId }, { fields: { _id: 1, emails: 1, isPaid: 1, name: 1, identity: 1, outcomes: 1 }});
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
      isPaid: user.isPaid,
      identity,
      outcomes
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
      },
      'args.outcomes': {
        type: Array,
      },
      'args.outcomes.$': {
        type: String,
      },
    }).validate({ args });

    Meteor.users.update({
      _id: this.userId,
    }, {
      '$set': args
    });

    return true;
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
  user.identity = '';
  // outcomes from achieving target identity (i.e. health, wealth, sex)
  user.outcomes = [];

  user.isBlocked = false;
  user.isDeleted = false;
  user.isPaid = false;
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

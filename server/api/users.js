import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import moment from 'moment';
import shortid from 'shortid';

import { resetPasswordEmail } from '../../imports/emailTemplates/resetPasswordEmail.js';

const stripe = require('stripe')(Meteor.settings.private.STRIPE_SECRET_KEY);

// Don't allow client side writing to profile field
Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  getCurrentUserEmail() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    if (Meteor.isServer) {
      // Can also use Meteor.user() instead, which is more performant?
      const user = Meteor.users.findOne({ _id: this.userId }, { fields: { _id: 1, emails: 1 } });
      let email = '';
      if (user && user.emails && user.emails.length) {
        email = user.emails[0].address
      }
      return email;
    }
  },
  getCurrentUserAccount() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Meteor.isServer) {
      // Can also use Meteor.user() instead, which is more performant?
      const user = Meteor.users.findOne({ _id: this.userId }, { fields: {
        _id: 1,
        emails: 1,
        name: 1,
        username: 1,
        bio: 1,
        phone: 1,
        stripeAccountId: 1,
        timezone: 1,
        profilePictureImageUrl: 1,
        youtube: 1,
        instagram: 1,
        tiktok: 1,
        twitter: 1,
        personal: 1,
        shopping: 1
      }});
      let email = '';
      if (user && user.emails && user.emails.length > 0) {
        email = user.emails[0].address
      }

      let name = '';
      if (user && user.name) {
        name = user.name;
      }

      let username = '';
      if (user && user.username) {
        username = user.username;
      }

      let bio = '';
      if (user && user.bio) {
        bio = user.bio;
      }

      let phone = '';
      if (user && user.phone) {
        phone = user.phone;
      }

      let stripeAccountId = '';
      if (user && user.stripeAccountId) {
        stripeAccountId = user.stripeAccountId;
      }

      let youtube = '';
      if (user && user.youtube) {
        youtube = user.youtube;
      }
      let instagram = '';
      if (user && user.instagram) {
        instagram = user.instagram;
      }
      let tiktok = '';
      if (user && user.tiktok) {
        tiktok = user.tiktok;
      }
      let twitter = '';
      if (user && user.twitter) {
        twitter = user.twitter;
      }
      let personal = '';
      if (user && user.personal) {
        personal = user.personal;
      }
      let shopping = '';
      if (user && user.shopping) {
        shopping = user.shopping;
      }

      let timezone = '';
      if (user && user.timezone) {
        timezone = user.timezone;
      }

      let profilePictureImageUrl = '';
      if (user && user.profilePictureImageUrl) {
        profilePictureImageUrl = user.profilePictureImageUrl;
      }

      const result = {
        _id: user._id,
        name,
        email,
        username,
        bio,
        phone,
        stripeAccountId,
        timezone,
        profilePictureImageUrl,
        youtube,
        instagram,
        tiktok,
        twitter,
        personal,
        shopping
      };

      return result;
    }
  },
  // return the stripe account object for the current user
  // if the current user doesnt have a stripe account. we create one and return it
  async getUserStripeAccount() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Meteor.isServer) {
      const user = Meteor.users.findOne({ _id: this.userId });

      let account = null;

      // if we have a stripe account connected to the user then retrieve the account and check that they're onboarded
      if (user.stripeAccountId) {
        try {
          account = await stripe.accounts.retrieve(
            user.stripeAccountId
          );
        } catch (err) {
          console.log('stripe.accounts.create err: ', err);
          throw new Meteor.Error('stripe-error');
        }
      } else {
        // if the user doesnt have a stripe account then create one (first time users)
        let email = '';
        if (user && user.emails && user.emails.length > 0) {
          email = user.emails[0].address;
        }

        try {
          account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email,
            capabilities: {
              transfers: { requested: true },
            }
          });
        } catch (err) {
          console.log('stripe.accounts.create err: ', err);
          throw new Meteor.Error('stripe-error');
        }

        const stripeAccountId = account.id;

        // user the user in db
        Meteor.users.update({_id: this.userId}, {$set: { stripeAccountId }});
      }

      return account;
    }
  },
  async getUserStripeAccountLink() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Meteor.isServer) {

      const account = await Meteor.call('getUserStripeAccount');

      let url = '';
      let accountLinkType = 'dashboard';

      // if false then they need to still onboard so change the accountLinkType
      if (!account.details_submitted || !account.payouts_enabled) {
        accountLinkType = 'account_onboarding';
      }

      if (accountLinkType === 'account_onboarding') {
        const BASE_URL = Meteor.settings.public.BASE_URL;
        let accountLinks = null;
        try {
          accountLinks = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${BASE_URL}/accounts/edit`,
            return_url: `${BASE_URL}/accounts/edit`,
            type: 'account_onboarding',
          });
          url = accountLinks.url;
        } catch (err) {
          console.log('stripe.accountLinks.create err: ', err);
          throw new Meteor.Error('stripe-error');
        }
      } else if (accountLinkType === 'dashboard') {
        try {
          const dashboardLink = await stripe.accounts.createLoginLink(account.id);
          url = dashboardLink.url
        } catch (err) {
          console.log('stripe.accounts.createLoginLink err: ', err);
          throw new Meteor.Error('stripe-error');
        }
      }

      const result = {
        accountLinkType,
        url
      };

      return result;
    }
  },
  getUserPublicProfile(username) {
    new SimpleSchema({
      username: {
        type: String
      }
    }).validate({username});

    const user = Accounts.findUserByUsername(username, { fields: {
      _id: 1,
      name: 1,
      username: 1,
      bio: 1,
      profilePictureImageUrl: 1,
      youtube: 1,
      instagram: 1,
      tiktok: 1,
      twitter: 1,
      personal: 1,
      shopping: 1,
      verified: 1,
      questionRate: 1,
      isBlocked: 1
    }});

    // if the user is blocked then dont return a profile
    if (user && user.isBlocked) {
      return null;
    }

    return user;
  },
  updateCurrentUserName(name) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      name: {
        type: String
      }
    }).validate({name});

    if (Meteor.isServer) {
      Meteor.users.update({ _id: this.userId }, { $set: { name }});
    }
  },
  updateCurrentUserProfilePicture(profilePictureImageUrl) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      profilePictureImageUrl: {
        type: String
      }
    }).validate({profilePictureImageUrl});

    if (Meteor.isServer) {
      Meteor.users.update({ _id: this.userId }, { $set: { profilePictureImageUrl }});
    }
  },
  updateCurrentUserProfile(name, username, bio, phone, timezone, youtube, instagram, tiktok, twitter, personal, shopping) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      name: {
        type: String
      },
      username: {
        type: String
      },
      bio: {
        type: String
      },
      phone: {
        type: String
      },
      timezone: { type: String },
      youtube: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
      instagram: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
      tiktok: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
      twitter: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
      personal: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
      shopping: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true }
    }).validate({name, username, bio, phone, timezone, youtube, instagram, tiktok, twitter, personal, shopping});

    if (Meteor.isServer) {
      // need to check if the saved username is unique (not used by another user). if it is. throw an error
      const user = Accounts.findUserByUsername(username, {fields: { _id: 1 }});
      if (user && user._id !== this.userId) {
        throw new Meteor.Error('username-unavailable', `This username isn't available. Please try another.`);
      }

      Meteor.users.update({ _id: this.userId }, { $set: { name, username, bio, phone, timezone, youtube, instagram, tiktok, twitter, personal, shopping }});
    }
  },
  // get data for the question settings page
  // checks if stripe is setup
  async getCurrentUserQuestionSettings() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Meteor.isServer) {

      const account = await Meteor.call('getUserStripeAccount');

      let isStripeSetup = true;

      // if false then they need to still onboard so change the accountLinkType
      if (!account.details_submitted || !account.payouts_enabled) {
        isStripeSetup = false;
      }

      // Can also use Meteor.user() instead, which is more performant?
      const user = Meteor.users.findOne({ _id: this.userId }, { fields: {
        _id: 1,
        name: 1,
        username: 1,
        questionRate: 1
      }});

      return {
        ...user,
        isStripeSetup
      };
    }
  },
  updateCurrentUserQuestionSettings(questionRate) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      questionRate: {
        type: Number
      }
    }).validate({questionRate});

    if (Meteor.isServer) {
      Meteor.users.update({ _id: this.userId }, { $set: { questionRate }});
    }
  }
});

// lifecycle method that runs after onCreateUser is called
// use it to validate data on user document before its saved
Accounts.validateNewUser((user) => {
  const name = user.name;
  const username = user.username;
  const email = user.emails[0].address;

  new SimpleSchema({
    name: {
      type: String
    },
    username: {
      type: String,
      min: 3,
      max: 16
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }).validate({ name, username, email });

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
  // Make sure to think about new and existing users with changes to collection (adding data fields)
  user.name = name;
  user.payments = [];
  user.isBlocked = false;
  user.bio = '';
  user.phone = '';
  user.stripeAccountId = '';

  // social links
  user.youtube = '';
  user.instagram = '';
  user.tiktok = '';
  user.twitter = '';
  user.personal = '';
  user.shopping = '';

  // default timezone to pacific los angeles time
  user.timezone = 'America/Los_Angeles';
  // ...
  user.profilePictureImageUrl = '';
  user.questionRate = 0;

  // verified
  // TODO: default to false once we self service signup and a verification process
  user.verified = true;

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

import { Meteor } from 'meteor/meteor';

// startup
import './../imports/startup/simple-schema-configuration.js';
// browser policy
import './../imports/startup/browser-policy-config.js';

// collections and methods

// server
import './api/feedback.js';
import './api/users.js';
import './api/emails.js';
import './api/invites.js';


Meteor.startup(() => {
  // code to run on server at startup
  // override the default password reset link
  Accounts.urls.resetPassword = (token) => Meteor.absoluteUrl(`accounts/reset-password/${token}`);
});

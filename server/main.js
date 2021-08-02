import { Meteor } from 'meteor/meteor';

// startup
import './../imports/startup/simple-schema-configuration.js';
// browser policy
import './../imports/startup/browser-policy-config.js';

// collections and server methods
import './api/feedback.js';
import './api/users.js';
import './api/emails.js';
import './api/habits.js';
import './api/days.js';
import './api/plans.js';
import './api/stripe.js';

Meteor.startup(() => {
  // code to run on server at startup
  // override the default password reset link
  Accounts.urls.resetPassword = (token) => Meteor.absoluteUrl(`accounts/reset-password/${token}`);
});

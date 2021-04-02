import { Meteor } from 'meteor/meteor';

// startup
import './../imports/startup/simple-schema-configuration.js';
// browser policy
import './../imports/startup/browser-policy-config.js';

// collections and methods
import '../imports/api/rooms.js';
import '../imports/api/connections.js';
import '../imports/api/questions.js';
import '../imports/api/bookings.js';
import '../imports/api/invites.js';

// server
import './api/feedback.js';
import './api/webhooks.js';
import './api/payments.js';
import './api/upload.js';
import './api/users.js';
import './api/emails.js';
import './api/products.js';
import './api/twilio.js';
import './api/questions.js';
import './api/invites.js';


Meteor.startup(() => {
  // code to run on server at startup
  // override the default password reset link
  Accounts.urls.resetPassword = (token) => Meteor.absoluteUrl(`accounts/reset-password/${token}`);
});

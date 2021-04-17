import {Meteor} from 'meteor/meteor';
import { Email } from 'meteor/email';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { signupEmail } from './../../imports/emailTemplates/signupEmail.js';
import { systemCalendarEmail } from './../../imports/emailTemplates/systemCalendarEmail.js';

Meteor.methods({
  sendSignupEmail(to) {

    new SimpleSchema({
      to: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      }
    }).validate({to});
    const emailFrom = 'Wombo <jules@wombo.io>';
    const emailSubject = 'Welcome to Wombo!';
    const emailHTML = signupEmail();
    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();
    //to, from, subject, text/html
    Email.send({ to, from: emailFrom, subject: emailSubject, html: emailHTML });
  },
  sendSystemCalendar(to, calString) {

    new SimpleSchema({
      to: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      },
      calString: {
        type: String
      }
    }).validate({to, calString});
    const emailFrom = 'Wombo <jules@wombo.io>';
    const emailSubject = 'Your Wombo Habit System';
    const emailHTML = systemCalendarEmail();
    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();
    //to, from, subject, text/html
    Email.send({ to, from: emailFrom, subject: emailSubject, html: emailHTML, icalEvent: calString });
  }
});

/*
  ~~~ Server functions ~~~
*/

// INTERNAL USE
// send jules an email notification
export const sendJulesEmailNotification = (emailSubject, emailText) => {
  const emailFrom = 'Wombo <jules@wombo.io>';
  const emailTo = 'jules@wombo.io';

  //to, from, subject, text/html
  Email.send({ to: emailTo, from: emailFrom, subject: emailSubject, text: emailText });
}

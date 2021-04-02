import {Meteor} from 'meteor/meteor';
import { Email } from 'meteor/email';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { signupEmail } from '../../imports/emailTemplates/signupEmail.js';
import { bookingCreatorEmail } from '../../imports/emailTemplates/bookingCreatorEmail.js';
import { bookingCustomerEmail } from '../../imports/emailTemplates/bookingCustomerEmail.js';
import { questionCustomerEmail } from '../../imports/emailTemplates/questionCustomerEmail.js';
import { questionCreatorEmail } from '../../imports/emailTemplates/questionCreatorEmail.js';
import { questionAnsweredCustomerEmail } from '../../imports/emailTemplates/questionAnsweredCustomerEmail.js';

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
  }
});

/*
  ~~~ Server functions ~~~
*/

export const sendQuestionCustomerEmail = (
  questionId,
  customerEmail,
  creatorName,
  customerFee,
  customerDescription
) => {
  const emailFrom = 'Wombo <jules@wombo.io>';
  const emailSubject = `Wombo | Question Submitted to ${creatorName}`;
  const emailHTML = questionCustomerEmail(
    questionId,
    creatorName,
    customerFee,
    customerDescription
  );
  //to, from, subject, text/html
  Email.send({ to: customerEmail, from: emailFrom, subject: emailSubject, html: emailHTML });
}

export const sendQuestionCreatorEmail = (
  questionId,
  creatorEmail,
  creatorRate,
  customerName,
  customerDescription
) => {
  const emailFrom = 'Wombo <jules@wombo.io>';
  const emailSubject = `Wombo | Question Submitted`;
  const emailHTML = questionCreatorEmail(
    questionId,
    creatorRate,
    customerName,
    customerDescription
  );
  //to, from, subject, text/html
  Email.send({ to: creatorEmail, from: emailFrom, subject: emailSubject, html: emailHTML });
}

// sent to the customer when the creator submits an answer to their question
export const sendQuestionAnsweredCustomerEmail = (
  questionId,
  customerEmail,
  creatorName,
  customerDescription
) => {
  const emailFrom = 'Wombo <jules@wombo.io>';
  const emailSubject = `Wombo | ${creatorName} Answered Your Question`;
  const emailHTML = questionAnsweredCustomerEmail(
    questionId,
    creatorName,
    customerDescription
  );
  //to, from, subject, text/html
  Email.send({ to: customerEmail, from: emailFrom, subject: emailSubject, html: emailHTML });
}

export const sendBookingCustomerEmail = (
  customerEmail,
  customerCalendarString,
  roomId,
  productName,
  productDuration,
  creatorName,
  customerFee,
  customerDescription,
  selectedTimeCustomerTimezoneFormatted,
  customerSessionAccessCode
) => {
  const emailFrom = 'Wombo <jules@wombo.io>';
  const emailSubject = `Session booked with ${creatorName}`;
  const emailHTML = bookingCustomerEmail(
    roomId,
    productName,
    productDuration,
    creatorName,
    customerFee,
    customerDescription,
    selectedTimeCustomerTimezoneFormatted,
    customerSessionAccessCode
  );
  //to, from, subject, text/html
  Email.send({ to: customerEmail, from: emailFrom, subject: emailSubject, html: emailHTML, icalEvent: customerCalendarString });
}

export const sendBookingCreatorEmail = (
  creatorEmail,
  creatorCalendarString,
  roomId,
  productName,
  productDuration,
  creatorRate,
  customerName,
  customerDescription,
  selectedTimeCreatorTimezoneFormatted,
  creatorSessionAccessCode
) => {
  const emailFrom = 'Wombo <jules@wombo.io>';
  const emailSubject = `Wombo | Session booked | ${productName}`;
  const emailHTML = bookingCreatorEmail(
    roomId,
    productName,
    productDuration,
    creatorRate,
    customerName,
    customerDescription,
    selectedTimeCreatorTimezoneFormatted,
    creatorSessionAccessCode
  );
  //to, from, subject, text/html
  Email.send({ to: creatorEmail, from: emailFrom, subject: emailSubject, html: emailHTML, icalEvent: creatorCalendarString });
}

// INTERNAL USE
// send jules an email notification
export const sendJulesEmailNotification = (emailSubject, emailText) => {
  const emailFrom = 'Wombo <jules@wombo.io>';
  const emailTo = 'jules@wombo.io';

  //to, from, subject, text/html
  Email.send({ to: emailTo, from: emailFrom, subject: emailSubject, text: emailText });
}

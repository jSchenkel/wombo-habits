import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import {sendJulesEmailNotification} from './emails.js';

export const Feedback = new Mongo.Collection('feedback');

// Deny changes to db on client
Feedback.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  //edit feedback for Wombo
  feedbackInsert(subject, message, email, happyWithWombo) {

    new SimpleSchema({
      subject: {
        type: String
      },
      message: {
        type: String
      },
      email: {
        type: String,
        optional: true
      },
      happyWithWombo: {
        type: String
      }
    }).validate({
      subject,
      message,
      email,
      happyWithWombo
    });

    const timestamp = moment().utc().toDate();
    const userId = this.userId || 'notLoggedIn';
    Feedback.insert({
      userId,
      email,
      subject,
      message,
      happyWithWombo,
      timestamp
    });

    // send jules email notification
    const emailSubject = `Wombo | Feedback Submitted | ${subject}`;
    const emailText = `email: ${email}, userId: ${userId}, happyWithWombo: ${happyWithWombo}, subject: ${subject}, message: ${message}`;
    sendJulesEmailNotification(emailSubject, emailText)
  }
});

//DDPRateLimiter Rules
const feedbackInsertRule = {
  type: 'method',
  name: 'feedbackInsert'
};

DDPRateLimiter.addRule(feedbackInsertRule, 10, 10*1000);

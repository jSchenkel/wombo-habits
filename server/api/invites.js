import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';

import { Invites } from '../../imports/api/invites.js';
import {sendJulesEmailNotification} from './emails.js';

Meteor.methods({
  invitesRequestInvite(name, email, instagram, twitter, youtube, audienceSize, source) {
    new SimpleSchema({
      name: {
        type: String
      },
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      },
      instagram: {
        type: String,
        optional: true
      },
      twitter: {
        type: String,
        optional: true
      },
      youtube: {
        type: String,
        optional: true
      },
      audienceSize: {
        type: Number
      },
      source: {
        type: String
      }
    }).validate({ name, email, instagram, twitter, youtube, audienceSize, source });

    if (Meteor.isServer) {
      const timestamp = moment().utc().toDate();
      Invites.insert({
        name,
        email,
        instagram,
        twitter,
        youtube,
        audienceSize,
        source,
        timestamp
      });

      const emailSubject = `Wombo | Invite Requested | ${name}`;
      const emailText = `name: ${name}, email: ${email}, instagram: ${instagram}, twitter: ${twitter}, youtube: ${youtube}, audience size: ${audienceSize}, source: ${source}`;

      // send email notification to Jules
      sendJulesEmailNotification(emailSubject, emailText)
    }
  }
});

//DDPRateLimiter Rules
const invitesRequestInviteRule = {
  type: 'method',
  name: 'invitesRequestInvite'
};

DDPRateLimiter.addRule(invitesRequestInviteRule, 10, 10*1000);

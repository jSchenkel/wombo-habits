import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';

const accountSid = Meteor.settings.private.TWILIO_ACCOUNT_SID;
const authToken = Meteor.settings.private.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


Meteor.methods({
  async twilioCreateToken() {
    let token;

    try {
      token = await client.tokens.create();
      console.log('token: ', token);
    } catch (err) {
      console.log('client.tokens.create err: ', err);
    }

    return token
  }
});

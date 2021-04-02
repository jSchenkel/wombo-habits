import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import moment from 'moment';

export const Questions = new Mongo.Collection('questions');

// Deny changes to db on client
Questions.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('pendingQuestions', function () {
    if (this.userId) {
      return Questions.find({
        creatorId: this.userId,
        isPaymentComplete: true,
        isPendingAnswer: true
      }, {
        fields: {
          _id: 1,
          creatorId: 1,
          isPaymentComplete: 1,
          isPendingAnswer: 1,
          description: 1,
          feeInformation: 1,
          created: 1
        }
      });
    } else {
      this.ready();
    }
  });
}
//
// Meteor.methods({
//
// });

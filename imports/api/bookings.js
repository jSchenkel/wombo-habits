import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import shortid from 'shortid';

export const Bookings = new Mongo.Collection('bookings');

// Deny changes to db on client
Bookings.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


Meteor.methods({
  bookingsGetUserBookingsToday() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Meteor.isServer) {
      // get user and timezone
      const user = Meteor.users.findOne({_id: this.userId}, { fields: { _id: 1, timezone: 1 } });

      if (!user) {
        throw new Meteor.Error('not-authorized');
      }

      // get datetime now using the users timezone
      // subtract one hour so that sessions dont disappear right away (people might be a little late)
      const startDate = momentTimezone().tz(user.timezone).subtract(1, 'hours').toDate(); // now
      const endDate = momentTimezone().tz(user.timezone).endOf('day').toDate(); // end of day

      const bookings = Bookings.find({
        creatorId: this.userId,
        selectedTimeCreatorLocalDate: { $gte: startDate, $lt: endDate }
      },
      {
        sort: { selectedTimeCreatorLocalDate: 1 },
        // only return required fields
        // fields: {}
      }).fetch();

      return bookings;
    }
  }
});

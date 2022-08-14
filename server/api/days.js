import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import shortid from 'shortid';

export const Days = new Mongo.Collection('days');

// Deny changes to db on client
Days.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

/*

Days Collection

userId -> user ref

dayOfWeekCode -> Int (i.e. 0)

dateString -> day string (i.e. monday, tuesday, etc.)

dateObject -> date object
- year - month - date (clear hour, minute, millisecond)
- used for querying for todays day to get state of completed events
- used for sorting by date and get completion streak over past month

completedEvents -> [String, `${habit.title}-${startTime}`]

numTotalEvents -> Int

numCompletedEvents -> Int

morningNote -> Str

eveningNote -> Str

*/

Meteor.methods({
  getCurrentUserDayByDayString(dateString) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      dateString: {
        type: String
      },
    }).validate({
      dateString,
    });

    let day = Days.findOne({userId: this.userId, dateString});

    const timestamp = moment().utc().toDate();
    const _id = shortid.generate();

    const date = moment(dateString, 'MM-DD-YYYY').utc();

    // if we dont have a day created for the given dateString then create one
    if (!day) {
      day = {
        _id,
        userId: this.userId,
        dayOfWeekCode: date.day(),
        dateString,
        dateObject: date.toDate(),
        completedEvents: [],
        numCompletedEvents: 0,
        numTotalEvents: 1,
        morningNote: '',
        eveningNote: '',
        created: timestamp,
        updated: timestamp
      };

      Days.insert(day);
    }

    return day;
  },
  updateDaysHabitCompleted(dayId, habitEventId, numTotalEvents) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      dayId: {
        type: String
      },
      habitEventId: {
        type: String
      },
      numTotalEvents: {
        type: Number
      },
    }).validate({
      dayId,
      habitEventId,
      numTotalEvents
    });

    const timestamp = moment().utc().toDate();

    Days.update({
      _id: dayId,
      userId: this.userId
    }, {
      '$set': {
        updated: timestamp,
        numTotalEvents
      },
      '$push': {
        completedEvents: habitEventId
      },
      '$inc': {
        numCompletedEvents: 1
      },
    });

    return true
  },
  'days.update'(dayId, args) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(args, {
      morningNote: Match.Maybe(String),
      eveningNote: Match.Maybe(String),
    });

    Days.update({
      _id: dayId,
      userId: this.userId,
    }, {
      '$set': args
    });

    return true;
  },
  getPastDays(numPastDays) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      numPastDays: {
        type: Number
      },
    }).validate({
      numPastDays
    });

    const lowerBoundDate = moment().subtract(numPastDays, 'days').toDate();

    const days = Days.find({
      userId: this.userId,
      dateObject: {
        '$gte': lowerBoundDate
      }
    }).fetch();

    const daysMap = {};

    for (const day of days) {
      daysMap[day.dateString] = day;
    }

    const newDays = [];

    for (let i = 0; i < numPastDays; i++) {
      // iterate through the numPastDays and create past date objects
      const date = moment().subtract(i, 'days');
      const dateString = date.format('MM-DD-YYYY');

      // if the dateString already exists in days result then push that
      if (dateString in daysMap) {
        newDays.unshift(daysMap[dateString]);
      // if the dateString wasnt found then push a mock
      } else {
        newDays.unshift({
          userId: this.userId,
          dayOfWeekCode: date.day(),
          dateString,
          dateObject: date.toDate(),
          completedEvents: [],
          numCompletedEvents: 0,
          numTotalEvents: 0,
        });
      }
    }

    return newDays;
  }
});

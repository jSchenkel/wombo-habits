import { Meteor } from 'meteor/meteor';

import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import shortid from 'shortid';

export const Habits = new Mongo.Collection('habits');

// Deny changes to db on client
Habits.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  getCurrentUserHabits() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const habits = Habits.find({userId: this.userId}).fetch();

    return habits;
  },
  getCurrentUserHabitsByDay(day) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      day: {
        type: String
      },
    }).validate({
      day,
    });

    const habits = Habits.find({userId: this.userId, 'events.day': day}).fetch();

    return habits;
  },
  createHabit(title, description, events) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      title: {
        type: String
      },
      description: {
        type: String
      },
    }).validate({
      title,
      description,
    });

    new SimpleSchema({
      day: String,
      startTimeHour: String,
      startTimeMinute: String,
      startTimePeriod: String,
      duration: String,
      targetDuration: {
        type: String,
        optional: true
      }
    }).validate(events);

    const timestamp = moment().utc().toDate();
    const _id = shortid.generate();

    Habits.insert({
      _id,
      userId: this.userId,
      title,
      description,
      events,
      created: timestamp,
      updated: timestamp
    });
  },
  updateHabit(habitId, title, description, events) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      habitId: {
        type: String
      },
      title: {
        type: String
      },
      description: {
        type: String
      },
    }).validate({
      habitId,
      title,
      description,
    });

    new SimpleSchema({
      day: String,
      startTimeHour: String,
      startTimeMinute: String,
      startTimePeriod: String,
      duration: String,
      targetDuration: {
        type: String,
        optional: true
      }
    }).validate(events);

    const timestamp = moment().utc().toDate();

    Habits.update({
      _id: habitId,
      userId: this.userId
    }, {
      '$set': {
        title,
        description,
        events,
        updated: timestamp
      }
    });
  },
  deleteHabit(habitId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      habitId: {
        type: String
      },
    }).validate({
      habitId,
    });

    Habits.remove({
      _id: habitId,
      userId: this.userId
    });
  }
});

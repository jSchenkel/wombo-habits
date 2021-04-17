import { Meteor } from 'meteor/meteor';

import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import ical from 'ical-generator';
import moment from 'moment';

import { convertHourMinuteStringToUtcDate } from './../../imports/helpers/date.js';
import { Recipients } from './recipients.js';

Meteor.methods({
  schedulesSendCalenderEmail(email, schedule, identities) {
    new SimpleSchema({
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      },
      schedule: {
        type: Object,
        blackbox: true
      },
      identities: [String]
    }).validate({
      email,
      schedule,
      identities
    });

    try {
      // validate each list of events
      for (const day in schedule) {
        new SimpleSchema({
          'id': { type: String },
          'title': { type: String },
          'description': { type: String },
          'startTime': { type: String },
          'endTime': { type: String },
          'duration': { type: String },
          'day': { type: String },
        }).validate(schedule[day]);
      }
    } catch (error) {
      console.log('schedulesSendCalenderEmail catch error: ', error);
      throw new Meteor.Error('bad-input');
    }

    // build the icalender object
    const systemCalender = ical({
      name: `Wombo Habit System`,
      domain: 'wombo.io',
      prodId: { company: 'wombo.io', product: 'wombo' },
    });

    // convert the calendar to string
    for (const day in schedule) {
      for (const event of schedule[day]) {
        systemCalender.createEvent({
          start: convertHourMinuteStringToUtcDate(event.startTime),
          end: convertHourMinuteStringToUtcDate(event.endTime),
          summary: event.title,
          description: event.description,
          // url: customerJoinUrl,
          // location: customerJoinUrl,
        });
      }
    }

    // Create cal string
    const systemCalenderString = systemCalender.toString();

    Meteor.call('sendSystemCalendar', email, systemCalenderString);

    // create a recipients record
    const timestamp = moment().utc().toDate();
    Recipients.insert({
      email,
      type: 'schedule',
      timestamp,
      meta: {
        schedule,
        identities
      },
    });
  }
});

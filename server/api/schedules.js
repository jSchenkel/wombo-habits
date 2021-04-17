import { Meteor } from 'meteor/meteor';

import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import ical from 'ical-generator';
import moment from 'moment';

import { convertHourMinuteStringToUtcDate } from './../../imports/helpers/date.js';
import { DAY_STRING_TO_DAY_OF_WEEK_CODE_INT } from './../../imports/constants/schedules.js';
import { Recipients } from './recipients.js';

Meteor.methods({
  schedulesSendCalenderEmail(email, schedule, identities, timezone) {
    new SimpleSchema({
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      },
      schedule: {
        type: Object,
        blackbox: true
      },
      identities: [String],
      timezone: {
        type: String
      }
    }).validate({
      email,
      schedule,
      identities,
      timezone
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
      const dayCode = DAY_STRING_TO_DAY_OF_WEEK_CODE_INT[day];
      for (const event of schedule[day]) {
        const dayOfWeek = moment().day(dayCode);
        if (dayOfWeek.dayOfYear() < moment().dayOfYear()) {
          dayOfWeek.add(7, 'days');
        }

        const start = moment(dayOfWeek).hour(event.startTime.split(':')[0]).minute(event.startTime.split(':')[1]).seconds(0).milliseconds(0);
        const end = moment(dayOfWeek).hour(event.endTime.split(':')[0]).minute(event.endTime.split(':')[1]).seconds(0).milliseconds(0);

        systemCalender.createEvent({
          start,
          end,
          summary: event.title,
          description: event.description,
          organizer: 'Jules <jules@wombo.io>',
          repeating: {
            freq: 'WEEKLY'
          },
          // "floating" time. same time regardless of the timezone (i.e. 1pm everywhere)
          floating: true,
          alarms: [
            {type: 'display', trigger: 600},
            {type: 'audio', trigger: 300}
          ]
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
        identities,
        timezone
      },
    });
  }
});

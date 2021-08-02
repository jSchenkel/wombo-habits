import { SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, ALL_DAY_DURATION } from './../../schedules.js';

// Food habits
export const EAT_HEALTHY_BREAKFAST_HABIT = {
  title: 'Healthy Breakfast',
  description: `Eat a healthy breakfast. Break your 16 hour fast and start your 8 hour feeding window.`,
  events: [
    {
      startTimeHour: '11',
      startTimeMinute: '30',
      startTimePeriod: 'AM',
      duration: '30',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '11',
      startTimeMinute: '30',
      startTimePeriod: 'AM',
      duration: '30',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '11',
      startTimeMinute: '30',
      startTimePeriod: 'AM',
      duration: '30',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '11',
      startTimeMinute: '30',
      startTimePeriod: 'AM',
      duration: '30',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '11',
      startTimeMinute: '30',
      startTimePeriod: 'AM',
      duration: '30',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '11',
      startTimeMinute: '30',
      startTimePeriod: 'AM',
      duration: '30',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '11',
      startTimeMinute: '30',
      startTimePeriod: 'AM',
      duration: '30',
      targetDuration: null,
      day: SATURDAY
    }
  ]
}

export const EAT_HEALTHY_LUNCH_HABIT = {
  title: 'Healthy Lunch',
  description: `Eat a healthy lunch. Something light and mostly vegetables.`,
  events: [
    {
      startTimeHour: '3',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '3',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '3',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '3',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '3',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '3',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '3',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: SATURDAY
    }
  ]
}

export const EAT_HEALTHY_DINNER_HABIT = {
  title: 'Healthy Dinner',
  description: `Eat a healthy dinner. Finish your 8 hour feeding window and start your 16 hour fast.`,
  events: [
    {
      startTimeHour: '6',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: SATURDAY
    }
  ]
}

export const INTERMITTENT_FASTING_HABIT = {
  title: 'Intermittent Fasting',
  description: `
    8 hour eating window. 16 hour fast.
    For example, 8 hour eating window between 12PM-8PM.
    A simple lifestyle change which brings with it numerous benefits to the mind and body.
  `,
  events: [
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: '240',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: '240',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: '240',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: '240',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: '240',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: '240',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: '240',
      targetDuration: null,
      day: SATURDAY
    }
  ]
}

export const DRINK_WATER_HABIT = {
  title: 'Drink 100oz Water',
  description: `Everyone is dehydrated all of the time. Drink 100oz of water every day. You will feel better.`,
  events: [
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '5',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '5',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '5',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '5',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '5',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '5',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '5',
      targetDuration: null,
      day: SATURDAY
    }
  ]
}

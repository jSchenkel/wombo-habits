import { SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY } from './../../schedules.js';

export const RESISTANCE_TRAINING_HABIT = {
  title: 'High Intensity Resistance Training',
  description: `
    De-stress and get better.
    The hard part is sticking to it.
    Don’t overdo it and do too much too fast.
    Celebrate success and trick your brain into liking exercise.
    3-4x per week is all you need. Rest is important.
    "No man has the right to be an amateur in the matter of physical training.
    It is a shame for a man to grow old without seeing the beauty and strength of which his body is capable." - Socrates
  `,
  events: [
    {
      startTimeHour: '6',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: FRIDAY
    },
  ]
}

// omitted for now
export const OUTDOOR_WALK_HABIT = {
  title: 'Outdoor Walk',
  description: `Take a walk outside and in nature. Move your body and clear your mind.`,
  events: [
    {
      startTimeHour: '5',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '5',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '5',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '5',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: SATURDAY
    },
  ]
}

export const SPORTS_HABIT = {
  title: 'Sports',
  description: `
    Sports are a great way to change up your exercise and have fun.
    Pick a sport that you can play with a friend.
    Build good relationships.
    Bonus points if you can do it outdoors.
  `,
  events: [
    {
      startTimeHour: '9',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: '120',
      targetDuration: null,
      day: SATURDAY
    },
  ]
}

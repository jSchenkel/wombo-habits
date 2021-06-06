import { SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, ALL_DAY_DURATION } from './../../schedules.js';

// mind food
export const LONG_FORM_READING_HABIT = {
  title: 'Read Long Form',
  description: `
    Feed your mind and collect mental models. Compound interest of knowledge.
    Build a quality foundation of knowledge. Learn the basics and understand nature.
    Read the greats in math, science, and philosophy.
    Don't fall into the trap of thinking you need to finish a book if you start it.
    If you're not interested in a book, read something else.
  `,
  events: [
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '60',
      targetDuration: null,
      day: SATURDAY
    }
  ]
}

export const REST_HABIT = {
  title: 'Rest Day',
  description: `
    Spend one day a week not working as hard as possible.
    Your goal is to recover as much as you can.
    Do whatever will make you feel the most refreshed when you come back to work.
    Nature is really good for this.
    When you come back your brain will be different and solving problems in a more novel way.
  `,
  events: [
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'AM',
      duration: ALL_DAY_DURATION,
      targetDuration: null,
      day: SUNDAY
    },
  ]
}

export const LIMIT_SOCIAL_MEDIA_HABIT = {
  title: 'Brain Candy Time',
  // Stop feeding your brain garbage.
  // You know when you get a song stuck in your head? All thoughts work that way. Be careful what you consume.
  // Introduce friction and make it harder to use.
  // Turn off notifications and put your phone in another room while you do focused work.
  // You're not learning anything. You're just taking dopamine snacks all day.
  description: `
    A dedicated time block for social media.
    Only browse twitter, instagram, youtube, etc. during this time.
    Social media can be entertaining and fun.
    The problem is that it's just too good and ultimately distracts you from becoming great.
    But we can use it to hack our productivity.
    Reward yourself with Brain Candy Time at the end of your day once you've done everything else that you wanted to do that day.
  `,
  events: [
    {
      startTimeHour: '7',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '7',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '7',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '7',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '7',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '7',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '7',
      startTimeMinute: '30',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: SATURDAY
    }
  ]
}

// mind software
export const MEDITATION_HABIT = {
  title: 'Mindfulness Training',
  description: `
    Train mindfulness. Meditation or yoga.
    You want to move from playing first person to playing third person. Experience yourself in 3rd person.
    Less "I'm angry." More "I'm feeling anger."
    Start thinking about playing in third person and practice mindfulness throughout the day.
    The only way to survive the low points in life is to experience the emotions in 3rd person and not get caught up in it.
    Then you can make the right chess moves.
  `,
  events: [
    {
      startTimeHour: '6',
      startTimeMinute: '10',
      startTimePeriod: 'AM',
      duration: '20',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '10',
      startTimePeriod: 'AM',
      duration: '20',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '10',
      startTimePeriod: 'AM',
      duration: '20',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '10',
      startTimePeriod: 'AM',
      duration: '20',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '10',
      startTimePeriod: 'AM',
      duration: '20',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '10',
      startTimePeriod: 'AM',
      duration: '20',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '6',
      startTimeMinute: '10',
      startTimePeriod: 'AM',
      duration: '20',
      targetDuration: null,
      day: SATURDAY
    }
  ]
}

export const WEEKLY_REFLECTION_HABIT = {
  title: 'Weekly Reflection',
  description: `
    The best people are constantly iterating and trying to improve themselves.
    Don’t be on autopilot.
    What time of day is best for meetings?
    What music makes you particularly productive?
    There may not be a global answer, but there’s a personal one.
    Point is, there’s a lot of data to collect. Gather the information and retrain your model.
  `,
  events: [
    {
      startTimeHour: '4',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '30',
      targetDuration: null,
      day: SUNDAY
    },
  ]
}

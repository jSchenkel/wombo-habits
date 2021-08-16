import { LISTS_DAILY_HABIT, LISTS_WEEKLY_HABIT, LISTS_MONTHLY_HABIT } from './../habits/productivity/lists.js';
import { DEEP_WORK_HABIT } from './../habits/productivity/planned_work.js';

export const SYSTEM_PRODUCTIVITY = [
  {
    key: 'lists',
    title: 'Lists',
    description: `Lists are a great tool for focusing your mind and energy so that you can seamlessly jump from one activity to the next.`,
    habits: [
      LISTS_DAILY_HABIT,
      LISTS_WEEKLY_HABIT,
      LISTS_MONTHLY_HABIT,
    ]
  },
  {
    key: 'planned_work',
    title: 'Planned Work',
    description: `Schedule time blocks for different types of work.`,
    habits: [
      DEEP_WORK_HABIT
    ]
  },
]

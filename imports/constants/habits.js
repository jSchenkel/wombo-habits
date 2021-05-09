import { HEALTHY, WEALTHY, WISE } from './identities.js';
import { SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY } from './schedules.js';

// Habits
// HEALTHY
const HABIT_EXERCISE = {
  title: 'Physical Exercise',
  description: 'Time to build strength, endurance, and speed. Become the best.',
  events: [
    {
      startTime: '18:00',
      duration: '60',
      day: MONDAY
    },
    {
      startTime: '18:00',
      duration: '60',
      day: WEDNESDAY
    },
    {
      startTime: '18:00',
      duration: '60',
      day: FRIDAY
    },
  ]
}

const HABIT_MEDITATION = {
  title: 'Meditation',
  description: 'A warm bath for the mind. Time to clear your mind and relax. Creativity, focus, and ideas will follow.',
  events: [
    {
      startTime: '8:00',
      duration: '15',
      day: MONDAY
    },
    {
      startTime: '8:00',
      duration: '15',
      day: TUESDAY
    },
    {
      startTime: '8:00',
      duration: '15',
      day: WEDNESDAY
    },
    {
      startTime: '8:00',
      duration: '15',
      day: THURSDAY
    },
    {
      startTime: '8:00',
      duration: '15',
      day: FRIDAY
    },
  ]
}

const HABIT_YOGA = {
  title: 'Yoga',
  description: 'Time to heal your body and mind. Relax, increase flexibility, and strengthen your core.',
  events: [
    {
      startTime: '9:00',
      duration: '60',
      day: SUNDAY
    },
  ]
}

// WEALTHY
const HABIT_PRIMARY_LEARNING = {
  title: 'Expert Learning',
  description: 'Time to learn and become the best at what you do. Deepen your knowledge and become an expert in your field.',
  events: [
    {
      startTime: '18:00',
      duration: '60',
      day: TUESDAY
    },
    {
      startTime: '18:00',
      duration: '60',
      day: THURSDAY
    },
  ]
}

// WISE
const HABIT_SECONDARY_LEARNING = {
  title: 'Build Foundational Knowledge',
  description: `Time to gain foundational knowledge and improve your understanding of the world.
    Love to learn and improve your mental models by studying different disciplines.
    I.e. Psychology, mathematics, physics, biology, chemistry, history, etc.`,
  events: [
    {
      startTime: '15:00',
      duration: '60',
      day: SUNDAY
    },
  ]
}

export const IDENTITY_TO_HABIT_MAP = {
  [HEALTHY]: [
    HABIT_EXERCISE,
    HABIT_MEDITATION,
    // HABIT_YOGA
  ],
  [WEALTHY]: [
    HABIT_PRIMARY_LEARNING
  ],
  [WISE]: [
    HABIT_SECONDARY_LEARNING
  ]
}

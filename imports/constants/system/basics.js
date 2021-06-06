import { SLEEP_HABIT, SLEEP_WIND_DOWN_HABIT, SLEEP_WAKE_UP_HABIT } from './../habits/basics/sleep.js';
import { EAT_HEALTHY_BREAKFAST_HABIT, EAT_HEALTHY_LUNCH_HABIT, EAT_HEALTHY_DINNER_HABIT, DRINK_WATER_HABIT } from './../habits/basics/food.js';
import { RESISTANCE_TRAINING_HABIT, OUTDOOR_WALK_HABIT, SPORTS_HABIT } from './../habits/basics/exercise.js';
import { LONG_FORM_READING_HABIT, REST_HABIT, LIMIT_SOCIAL_MEDIA_HABIT, MEDITATION_HABIT, WEEKLY_REFLECTION_HABIT } from './../habits/basics/mind.js';


export const SYSTEM_BASICS = [
  {
    key: 'sleep',
    title: 'Sleep',
    description: 'Sleep is the ultimate nootropic, it just takes a few hours to apply. Not enough sleep leads to reduced cognition.',
    habits: [
      SLEEP_HABIT,
      SLEEP_WIND_DOWN_HABIT,
      SLEEP_WAKE_UP_HABIT
    ]
  },
  {
    key: 'food',
    title: 'Food',
    description: 'Healthy food and intermittent fasting. Garbage food impairs your judgement. Good food helps you think clearly and feel energized throughout the day. Feel good about your choices. Setup your environment for success and remove junk food from the home and office. Eat natural foods and mostly vegetables.',
    habits: [
      EAT_HEALTHY_BREAKFAST_HABIT,
      EAT_HEALTHY_LUNCH_HABIT,
      EAT_HEALTHY_DINNER_HABIT,
      DRINK_WATER_HABIT
    ]
  },
  {
    key: 'exercise',
    title: 'Exercise',
    description: 'Exercise makes you feel good, helps you sleep, and lowers stress. Your competition is probably working out 3-4x times per week and getting better. You should too.',
    habits: [
      RESISTANCE_TRAINING_HABIT,
      OUTDOOR_WALK_HABIT,
      SPORTS_HABIT
    ]
  },
  {
    key: 'mind_food',
    title: 'Mind food',
    description: 'Feed your mind like you feed your body. Your brain is constantly doing pattern recognition, which is powered by the information that you consume.',
    habits: [
      LONG_FORM_READING_HABIT,
      LIMIT_SOCIAL_MEDIA_HABIT,
      REST_HABIT,
    ]
  },
  {
    key: 'mind_software',
    title: 'Mind Software',
    description: 'Train you mind to think more clearly and effectively. Most important thing you want to do is move from playing first person to playing third person. Constantly gather information and retrain your model.',
    habits: [
      MEDITATION_HABIT,
      WEEKLY_REFLECTION_HABIT
    ]
  }
]

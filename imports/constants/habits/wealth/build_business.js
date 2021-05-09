import { SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY } from './../../schedules.js';

export const BUILD_BUSINESS_HABIT = {
  title: 'Build a Business',
  description: `
    Solve a real problem for real people. If you don't personally know someone with the problem then find a different problem.
    You need to have people with the problem that you can talk to and give your solution to. Solving your own problem is a hack for this.
    Now you have a problem and a customer. Your focus now is on two things: building the product/solution and talking to your customer(s).
    Some percentage of your ideas about the problem and solution are wrong. Your goal now is to become less wrong over time through constant iteration.
    Once you have a solution to a problem that your first customer loves and can't live without, focus on scaling it.
  `,
  events: [
    {
      startTimeHour: '12',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '240',
      targetDuration: null,
      day: SUNDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '90',
      targetDuration: null,
      day: MONDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '90',
      targetDuration: null,
      day: TUESDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '90',
      targetDuration: null,
      day: WEDNESDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '90',
      targetDuration: null,
      day: THURSDAY
    },
    {
      startTimeHour: '8',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '90',
      targetDuration: null,
      day: FRIDAY
    },
    {
      startTimeHour: '12',
      startTimeMinute: '00',
      startTimePeriod: 'PM',
      duration: '240',
      targetDuration: null,
      day: SATURDAY
    },
  ]
}


export const ALL_DAY_DURATION = 'ALL_DAY';

export const SUNDAY = 'sunday';
export const MONDAY = 'monday';
export const TUESDAY = 'tuesday';
export const WEDNESDAY = 'wednesday';
export const THURSDAY = 'thursday';
export const FRIDAY = 'friday';
export const SATURDAY = 'saturday';

const SUNDAY_CODE_INT = 0;
const MONDAY_CODE_INT = 1;
const TUESDAY_CODE_INT = 2;
const WEDNESDAY_CODE_INT = 3;
const THURSDAY_CODE_INT = 4;
const FRIDAY_CODE_INT = 5;
const SATURDAY_CODE_INT = 6;

export const AVAILABILITY_DAY_KEYS = [
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
];

export const DAY_OF_WEEK_CODE_INT_TO_DAY_STRING = {
  [SUNDAY_CODE_INT]: SUNDAY,
  [MONDAY_CODE_INT]: MONDAY,
  [TUESDAY_CODE_INT]: TUESDAY,
  [WEDNESDAY_CODE_INT]: WEDNESDAY,
  [THURSDAY_CODE_INT]: THURSDAY,
  [FRIDAY_CODE_INT]: FRIDAY,
  [SATURDAY_CODE_INT]: SATURDAY,
}

export const DAY_STRING_TO_DAY_OF_WEEK_CODE_INT = {
  [SUNDAY]: SUNDAY_CODE_INT,
  [MONDAY]: MONDAY_CODE_INT,
  [TUESDAY]: TUESDAY_CODE_INT,
  [WEDNESDAY]: WEDNESDAY_CODE_INT,
  [THURSDAY]: THURSDAY_CODE_INT,
  [FRIDAY]: FRIDAY_CODE_INT,
  [SATURDAY]: SATURDAY_CODE_INT,
}

export const DAY_STRING_TO_DAY_SHORT_STRING = {
  [SUNDAY]: 'sun',
  [MONDAY]: 'mon',
  [TUESDAY]: 'tue',
  [WEDNESDAY]: 'wed',
  [THURSDAY]: 'thu',
  [FRIDAY]: 'fri',
  [SATURDAY]: 'sat',
}
import { ALL_DAY_DURATION } from '../constants/schedules.js';

// sort the habits by start time. earlier -> later
export const habitCompare = (a, b) => {
  // calculate the total minute equivalent for start time A
  let hourA = parseInt(a.startTimeHour);

  // subtract hours if period is am. handle special case with 12am, which is like 0am
  if (a.startTimePeriod === 'AM' && hourA === 12) {
    hourA -= 12;
  }

  // add hours if period is pm. handle special case with 12pm, which is like 12 + 0pm
  if (a.startTimePeriod === 'PM' && hourA !== 12) {
    hourA += 12;
  }

  const minuteA = parseInt(a.startTimeMinute);
  const totatMinutesA = hourA*60+minuteA;

  // calculate the total minute equivalent for start time B
  let hourB = parseInt(b.startTimeHour);

  // subtract hours if period is am. handle special case with 12am, which is like 0am
  if (b.startTimePeriod === 'AM' && hourB === 12) {
    hourB -= 12;
  }

  // add hours if period is pm. handle special case with 12pm, which is like 0pm
  if (b.startTimePeriod === 'PM' && hourB !== 12) {
    hourB += 12;
  }

  const minuteB = parseInt(b.startTimeMinute);
  const totatMinutesB = hourB*60+minuteB;
  // compare A and B
  if (totatMinutesA < totatMinutesB) {
    return -1;
  } else if (totatMinutesA > totatMinutesB) {
    return 1;
  }
  return 0;
}

// turn event display string to displayable string
export const displayDuration = (duration) => {
  if (duration === ALL_DAY_DURATION) {
    return 'Rest of the day';
  }

  const intDuration = parseInt(duration);

  const hours = Math.floor(intDuration / 60);
  const minutes = intDuration % 60;

  let displayable = '';
  if (hours) {
    displayable += `${hours}h`
  }

  if (minutes) {
    displayable += ` ${minutes}min`
  }

  return displayable;
}

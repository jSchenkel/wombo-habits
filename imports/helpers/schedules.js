
// helper to convert "12:00" hours and minutes string to minutes integer (ex. "12:00" => 720; "12:30" => 750)
export const availabilityHoursMinutesStringToMinutes = (hoursMinutesString) => {
  let result = -1;

  const hoursMinutesStringParts = hoursMinutesString.split(':');

  if (hoursMinutesStringParts && hoursMinutesStringParts.length === 2) {
    const hourString = hoursMinutesStringParts[0];
    const minuteString = hoursMinutesStringParts[1];

    const hour = parseInt(hourString);
    const minute = parseInt(minuteString);

    result = (hour * 60) + minute;
  }

  return result;
};

// sort the habits by start time. earlier -> later
export const habitCompare = (a, b) => {
  // calculate the total minute equivalent for start time A
  let hourA = parseInt(a.startTimeHour);
  // add hours if period is pm. handle special case with 12pm, which is like 12 + 0pm
  if (a.startTimePeriod === 'PM' && hourA !== 12) {
    hourA += 12;
  }
  const minuteA = parseInt(a.startTimeMinute);
  const totatMinutesA = hourA*60+minuteA;

  // calculate the total minute equivalent for start time B
  let hourB = parseInt(b.startTimeHour);
  // add hours if period is pm. handle special case with 12pm, which is like 12 + 0pm
  if (b.startTimePeriod === 'PM' && hourB !== 12) {
    hourB += 12;
  }
  const minuteB = parseInt(b.startTimeMinute);
  const totatMinutesB = hourB*60+minuteB;
  // compare A and B
  if (totatMinutesA < totatMinutesB) {
    return -1;
  }
  return 0;
}

import momentTimezone from 'moment-timezone';

// hourMinuteString => "hour:minute", "14:30"
// timezone => "America/Los_Angeles"

export const convertLocalHourMinuteStringToTimezoneUtcDate = (hourMinuteString, timezone) => {
  return momentTimezone().tz(timezone).hour(hourMinuteString.split(':')[0]).minute(hourMinuteString.split(':')[1]).seconds(0).milliseconds(0).utc();
}

export const convertLocalHourMinuteStringToTimezoneUtcDateString = (hourMinuteString, timezone) => {
  return convertLocalHourMinuteStringToTimezoneUtcDate(hourMinuteString, timezone).format();
}

export const convertUtcDateStringToLocalHourMinuteString = (utcDateString, timezone) => {
  return momentTimezone(utcDateString).tz(timezone).format('HH:mm');
}

export const utcDateStringToMinutes = (utcDateString) => {
  let result = -1;

  if (utcDateString) {
    const date = momentTimezone(utcDateString);
    const hour = date.hour();
    const minute = date.minutes();

    result = (hour * 60) + minute;
    return result;
  }
}

export const displayHourMinuteString = (hourMinuteString, format) => {
  return momentTimezone().hour(hourMinuteString.split(':')[0]).minute(hourMinuteString.split(':')[1]).seconds(0).milliseconds(0).format(format);
}

export const convertHourMinuteStringToUtcDate = (hourMinuteString) => {
  return momentTimezone().hour(hourMinuteString.split(':')[0]).minute(hourMinuteString.split(':')[1]).seconds(0).milliseconds(0).utc();
}

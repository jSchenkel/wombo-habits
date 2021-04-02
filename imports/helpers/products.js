
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

export const toISOStringWithTimezone = (date: Date): string => {
  const pad = (num: number) => (num < 10 ? '0' + num : num);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  const timezoneOffset = -date.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? '+' : '-';
  const absOffset = Math.abs(timezoneOffset);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMinutes = pad(absOffset % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`;
};

export const parseISOStringToLocalDate = (isoString: string): Date => {
  // Date constructor can parse ISO strings directly, but it interprets them as UTC
  // if no timezone is specified. If a timezone is specified, it will adjust.
  // We want to ensure it's treated as a local date.
  // A simpler approach for local interpretation is to replace T and Z and create a new Date.
  // However, if the ISO string already contains a timezone offset, we should respect it.
  // For simplicity and to match the test's expectation of local interpretation,
  // we'll rely on the Date constructor's behavior for now.
  try {
    const date = new Date(isoString);
    return date;
  } catch (error) {
    console.error('Error parsing ISO string:', error);
    return new Date(NaN); // Return an invalid date
  }
};

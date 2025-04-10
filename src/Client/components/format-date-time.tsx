'use client';


/**
 * Renders the given date as a localized string.
 *
 * This component takes a readonly date string, creates a Date object from it, and formats it using the 'en-US' locale. The formatted output includes the numeric day, the full month name, the year, and the time in 12-hour format with hours and minutes.
 *
 * @param date - A readonly string representing the date to be formatted.
 */
export default function FormattedDate({ date }: {readonly date: string }) {


  const getdate = new Date(date);
  const formattedDate =  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return <>{formattedDate.format(getdate)}</>;
}

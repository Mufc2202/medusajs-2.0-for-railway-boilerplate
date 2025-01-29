export function convertDateFormat(dateStr: string): string {
  // Convert to Date object
  const dateObj: Date = new Date(dateStr)

  // Options for formatting
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  // Format to desired output
  return dateObj.toLocaleDateString("en-US", options)
}

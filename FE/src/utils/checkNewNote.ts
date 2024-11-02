export function handleNewNotes(updatedAt: string): boolean {
  const newDate = new Date(updatedAt);
  const differenceInMillis = Date.now() - newDate.getTime();

  // Convert the difference to days and check if it is less than 1 day
  return differenceInMillis < 24 * 60 * 60 * 1000;
}

function truncateString(inputString: string, maxLength: number): string {
  if (inputString.length > maxLength) {
    return inputString.slice(0, maxLength) + '...';
  } else {
    return inputString;
  }
}
export { truncateString };

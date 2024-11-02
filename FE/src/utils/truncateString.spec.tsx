import { truncateString } from './truncateString';

describe('truncateString', () => {
  it('should truncate the string and add ellipsis if inputString length is greater than maxLength', () => {
    const inputString = 'This is a long string that needs to be truncated';
    const maxLength = 20;
    const result = truncateString(inputString, maxLength);

    expect(result).toBe('This is a long strin...');
  });

  it('should return the original string if inputString length is less than or equal to maxLength', () => {
    const inputString = 'Short string';
    const maxLength = 20;
    const result = truncateString(inputString, maxLength);
    expect(result).toBe(inputString);
  });

  it('should return the original string if inputString length is exactly maxLength', () => {
    const inputString = 'Exact length string';
    const maxLength = 19;
    const result = truncateString(inputString, maxLength);
    expect(result).toBe(inputString);
  });
});

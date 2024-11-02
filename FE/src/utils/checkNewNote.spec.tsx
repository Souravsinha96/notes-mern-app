import { handleNewNotes } from './checkNewNote';

describe('handleNewNotes', () => {
  it('should return true if the difference is less than 1 day', () => {
    // Set up a date within the last 24 hours
    const recentDate = new Date();
    recentDate.setHours(recentDate.getHours() - 12);

    const result = handleNewNotes(recentDate.toISOString());
    expect(result).toBe(true);
  });

  it('should return false if the difference is 1 day or more', () => {
    // Set up a date more than 24 hours ago
    const olderDate = new Date();
    olderDate.setDate(olderDate.getDate() - 2);

    const result = handleNewNotes(olderDate.toISOString());
    expect(result).toBe(false);
  });
});

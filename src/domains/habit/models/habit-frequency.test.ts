import { describe, expect, it } from 'vitest';
import { HabitFrequency } from './habit-frequency';

describe('HabitFrequency', () => {
  it('should create a daily habit frequency', () => {
    const frequency = HabitFrequency.create('daily');
    expect(frequency.interval).toBe('daily');
    expect(frequency.daysOfWeek).toBeUndefined();
  });

  it('should create a weekly habit frequency with days of week', () => {
    const frequency = HabitFrequency.create('weekly', [
      'Monday',
      'Wednesday',
      'Friday'
    ]);
    expect(frequency.interval).toBe('weekly');
    expect(frequency.daysOfWeek).toEqual(['Monday', 'Wednesday', 'Friday']);
  });

  it('should throw an error if days of week are not provided for weekly frequency', () => {
    expect(() => HabitFrequency.create('weekly')).toThrowError(
      'Days of week must be provided for a weekly frequency'
    );
  });

  it('should create a weekly habit frequency with days of week', () => {
    const frequency = HabitFrequency.create('custom', [
      'Monday',
      'Wednesday',
      'Friday'
    ]);
    expect(frequency.interval).toBe('custom');
    expect(frequency.daysOfWeek).toEqual(['Monday', 'Wednesday', 'Friday']);
  });

  it('should throw an error if days of week are not provided for custom frequency', () => {
    expect(() => HabitFrequency.create('custom')).toThrowError(
      'Days of week must be provided for a custom frequency'
    );
  });
});

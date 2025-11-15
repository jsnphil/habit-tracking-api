import { describe, expect, it } from 'vitest';
import { HabitFrequency } from './habit-frequency';
import { HabitSchedule } from './habit-schedule';

describe('HabitSchedule', () => {
  it('should create a daily habit schedule with no end date', () => {
    const startDate = new Date('2024-01-01');
    const frequency = HabitFrequency.create('daily');

    const schedule = HabitSchedule.create(startDate, frequency);

    expect(schedule).toBeInstanceOf(HabitSchedule);
    expect(schedule.getStartDate()).toEqual(startDate);
    expect(schedule.getEndDate()).toBeUndefined();
    expect(schedule.getFrequency()).toEqual(frequency);
  });

  it('should create a daily habit schedule with an end date', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    const frequency = HabitFrequency.create('daily');

    const schedule = HabitSchedule.create(startDate, frequency, endDate);

    expect(schedule).toBeInstanceOf(HabitSchedule);
    expect(schedule.getStartDate()).toEqual(startDate);
    expect(schedule.getEndDate()).toEqual(endDate);
    expect(schedule.getFrequency()).toEqual(frequency);
  });

  it('should throw an error if end date is before start date', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2023-12-31');
    const frequency = HabitFrequency.create('daily');

    expect(() => HabitSchedule.create(startDate, frequency, endDate)).toThrow(
      'End date must be after start date'
    );
  });
});

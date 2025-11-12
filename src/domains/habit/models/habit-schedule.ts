import type { HabitFrequency } from './habit-frequency';

export class HabitSchedule {
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly frequency: HabitFrequency;

  private constructor(startDate: Date, frequency: HabitFrequency, endDate?: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.frequency = frequency;
  }

  static create(
    startDate: Date,
    frequency: HabitFrequency,
    endDate?: Date
  ): HabitSchedule {
    if (endDate && endDate < startDate) {
      throw new Error('End date must be after start date');
    }
    return new HabitSchedule(startDate, frequency, endDate);
  }
}

import type { HabitFrequency } from './habit-frequency';

export class HabitSchedule {
  private startDate: Date;
  private endDate?: Date;
  private frequency: HabitFrequency;

  private constructor(
    startDate: Date,
    frequency: HabitFrequency,
    endDate?: Date
  ) {
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

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date | undefined {
    return this.endDate;
  }

  getFrequency(): HabitFrequency {
    return this.frequency;
  }
}

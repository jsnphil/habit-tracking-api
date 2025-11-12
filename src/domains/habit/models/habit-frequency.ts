export class HabitFrequency {
  readonly interval: 'daily' | 'weekly' | 'custom';
  readonly daysOfWeek?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];

  private constructor(
    interval: 'daily' | 'weekly' | 'custom',
    daysOfWeek?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[]
  ) {
    this.interval = interval;
    if ((interval === 'weekly' || interval === 'custom') && !daysOfWeek) {
      throw new Error('Days of week must be provided for weekly and custom frequency');
    }
    this.daysOfWeek = daysOfWeek;
  }

  static create(
    interval: 'daily' | 'weekly' | 'custom',
    daysOfWeek?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[]
  ): HabitFrequency {
    return new HabitFrequency(interval, daysOfWeek);
  }
}

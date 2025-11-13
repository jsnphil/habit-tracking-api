import type { DayOfWeek, FrequencyInterval } from '../types';

export class HabitFrequency {
  readonly interval: FrequencyInterval;
  readonly daysOfWeek?: DayOfWeek[];

  private constructor(interval: FrequencyInterval, daysOfWeek?: DayOfWeek[]) {
    this.interval = interval;
    if ((interval === 'weekly' || interval === 'custom') && !daysOfWeek) {
      throw new Error(
        `Days of week must be provided for a ${interval} frequency`
      );
    }
    this.daysOfWeek = daysOfWeek;
  }

  static create(
    interval: FrequencyInterval,
    daysOfWeek?: DayOfWeek[]
  ): HabitFrequency {
    return new HabitFrequency(interval, daysOfWeek);
  }
}

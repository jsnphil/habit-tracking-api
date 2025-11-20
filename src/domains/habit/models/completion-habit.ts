import type { CompletionHabitProps, ScheduleProps } from '../types';
import { Habit } from './habit';

export class CompletionHabit extends Habit {
  private constructor(
    name: string,
    description: string,
    schedule: ScheduleProps,
    cue?: string,
    obsidianNoteName?: string
  ) {
    super(name, description, 'completion', schedule, cue, obsidianNoteName);
  }

  static create(props: CompletionHabitProps): CompletionHabit {
    const { name, description, schedule, cue, obsidianNoteName } = props;

    return new CompletionHabit(
      name,
      description,
      schedule,
      cue,
      obsidianNoteName
    );
  }

  markCompleted(date: Date): void {
    if (this.getStatus() === 'archived') {
      throw new Error('Cannot mark completion for an archived habit');
    }

    if (this.getStatus() !== 'active') {
      throw new Error('Cannot mark completion for an inactive habit');
    }

    const dateKey = date.toISOString().split('T')[0];
    if (this.completionRecords.has(dateKey)) {
      throw new Error(
        `Status for ${dateKey} already recorded. Habits can only be completed once per day.`
      );
    }
    this.completionRecords.set(dateKey, 'completed');
  }

  markMissed(date: Date): void {
    if (this.getStatus() === 'archived') {
      throw new Error('Cannot mark missed for an archived habit');
    }
    if (this.getStatus() !== 'active') {
      throw new Error('Cannot mark missed for an inactive habit');
    }

    const dateKey = date.toISOString().split('T')[0];
    if (this.completionRecords.has(dateKey)) {
      throw new Error(
        `Status for ${dateKey} already recorded. Habits can only be marked once per day.`
      );
    }
    this.completionRecords.set(dateKey, 'missed');
  }
}

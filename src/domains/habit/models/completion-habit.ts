import { Habit } from './habit';
import type { HabitCue } from './habit-cue';
import type { HabitSchedule } from './habit-schedule';

export class CompletionHabit extends Habit {
  readonly type: 'completion' = 'completion';

  private constructor(
    name: string,
    description: string,
    schedule: HabitSchedule,
    cue: HabitCue
  ) {
    super(name, description, 'completion', schedule, cue);
  }

  static create(
    name: string,
    description: string,
    schedule: HabitSchedule,
    cue: HabitCue
  ): CompletionHabit {
    return new CompletionHabit(name, description, schedule, cue);
  }
}

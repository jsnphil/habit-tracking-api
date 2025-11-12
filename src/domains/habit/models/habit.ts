import { v4 as uuidv4 } from 'uuid';
import type { HabitCue } from './habit-cue';
import type { HabitSchedule } from './habit-schedule';

export class Habit {
  readonly name: string;
  readonly id: string;
  readonly description: string;
  readonly type: 'completion' | 'measured';
  readonly status: 'active' | 'inactive' | 'archived';
  readonly schedule: HabitSchedule;
  readonly cue: HabitCue;

  constructor(
    name: string,
    description: string,
    type: 'completion' | 'measured',
    schedule: HabitSchedule,
    cue: HabitCue
  ) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.id = uuidv4();
    this.status = 'active';
    this.schedule = schedule;
    this.cue = cue;
  }
}

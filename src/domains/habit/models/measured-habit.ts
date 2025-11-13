import { Habit } from './habit';
import type { HabitCue } from './habit-cue';
import type { HabitQuantity } from './habit-quantity';
import type { HabitSchedule } from './habit-schedule';

export class MeasuredHabit extends Habit {
  private progressRecords: Map<string, number> = new Map();
  private quantity: HabitQuantity;

  private constructor(
    name: string,
    description: string,
    quantity: HabitQuantity,
    schedule: HabitSchedule,
    cue: HabitCue
  ) {
    super(name, description, 'measured', schedule, cue, undefined);
    if (!quantity) {
      throw new Error('Measured habits must have a quantity');
    }
    this.quantity = quantity;
  }

  static create(
    name: string,
    description: string,
    quantity: HabitQuantity,
    schedule: HabitSchedule,
    cue: HabitCue
  ): MeasuredHabit {
    return new MeasuredHabit(name, description, quantity, schedule, cue);
  }

  setProgress(date: Date, value: number): void {
    if (this.getStatus() === 'archived') {
      throw new Error('Cannot set progress for an archived habit');
    }
    if (this.getStatus() !== 'active') {
      throw new Error('Cannot set progress for an inactive habit');
    }

    if (value < 0) {
      throw new Error('Progress value cannot be negative');
    }

    const dateKey = date.toISOString().split('T')[0];
    this.progressRecords.set(dateKey, value);

    this.checkCompletion(date);
  }

  addProgress(date: Date, value: number): void {
    if (this.getStatus() === 'archived') {
      throw new Error('Cannot add progress for an archived habit');
    }
    if (this.getStatus() !== 'active') {
      throw new Error('Cannot add progress for an inactive habit');
    }

    if (value < 0) {
      throw new Error('Progress value cannot be negative');
    }

    const dateKey = date.toISOString().split('T')[0];
    const currentProgress = this.progressRecords.get(dateKey) || 0;
    this.progressRecords.set(dateKey, currentProgress + value);

    this.checkCompletion(date);
  }

  private checkCompletion(date: Date): void {
    const dateKey = date.toISOString().split('T')[0];
    const progress = this.progressRecords.get(dateKey);

    if (progress === undefined) {
      return;
    }

    if (
      this.quantity.targetType === 'goal' &&
      progress >= this.quantity.targetAmount
    ) {
      this.completionRecords.set(dateKey, 'completed');
    }
  }

  getProgress(date: Date): number | null {
    const dateKey = date.toISOString().split('T')[0];
    return this.progressRecords.get(dateKey) || null;
  }

  markCompleted(_date: Date) {
    throw new Error(
      'Measured habits cannot be marked as completed. Progress is determined automatically based on goal achievement.'
    );
  }

  markMissed(_date: Date) {
    throw new Error(
      'Measured habits cannot be marked as missed. Progress is determined automatically based on goal achievement.'
    );
  }
}

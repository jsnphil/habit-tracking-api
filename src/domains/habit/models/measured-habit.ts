import type {
  HabitQuantityProps,
  MeasuredHabitProps,
  ScheduleProps
} from '../types';
import { Habit } from './habit';
import { HabitQuantity } from './habit-quantity';

export class MeasuredHabit extends Habit {
  private progressRecords: Map<string, number> = new Map();
  private quantity: HabitQuantity;

  private constructor(
    name: string,
    description: string,
    quantity: HabitQuantityProps,
    schedule: ScheduleProps,
    cue?: string
  ) {
    super(name, description, 'measured', schedule, cue, undefined);
    this.quantity = HabitQuantity.create(
      quantity.amount,
      quantity.unit,
      quantity.targetType
    );
  }

  static create(props: MeasuredHabitProps): MeasuredHabit {
    const { name, description, quantity, schedule, cue } = props;

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

  checkCompletion(date: Date): void {
    const dateKey = date.toISOString().split('T')[0];
    const progress = this.getProgressForDate(dateKey);

    if (progress === null) {
      return; // No progress recorded for this date
    }

    const completionStatus = this.calculateCompletionStatus(progress);
    this.completionRecords.set(dateKey, completionStatus);
  }

  private getProgressForDate(dateKey: string): number | null {
    return this.progressRecords.get(dateKey) ?? null;
  }

  private calculateCompletionStatus(
    progress: number
  ): 'completed' | 'committed' | 'missed' {
    const targetReached = progress >= this.quantity.targetAmount;

    if (this.quantity.targetType === 'goal') {
      return targetReached ? 'completed' : 'committed';
    } else {
      return targetReached ? 'missed' : 'completed';
    }
  }

  getProgress(date: Date): number {
    const dateKey = date.toISOString().split('T')[0];

    if (this.progressRecords.has(dateKey)) {
      return this.progressRecords.get(dateKey) || 0;
    }
    return 0;
  }

  markCompleted(_date: Date): void {
    throw new Error(
      'Measured habits cannot be marked as completed. Progress is determined automatically based on goal achievement.'
    );
  }

  markMissed(_date: Date): void {
    throw new Error(
      'Measured habits cannot be marked as missed. Progress is determined automatically based on goal achievement.'
    );
  }
}

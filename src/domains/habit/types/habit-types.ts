// Habit domain-specific types
export type HabitType = 'completion' | 'measured';
export type MeasuredTargetType = 'goal' | 'limit';
export type HabitStatus = 'active' | 'inactive' | 'archived';
export type CompletionStatus =
  | 'completed'
  | 'missed'
  | 'skipped'
  | 'pending'
  | 'committed';

// Frequency types
export type FrequencyInterval = 'daily' | 'weekly' | 'custom';
export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type HabitProps = {
  name: string;
  description: string;
  schedule: ScheduleProps;
  cue?: string;
  obsidianNoteName?: string;
};

export type CompletionHabitProps = HabitProps & {};

export type MeasuredHabitProps = HabitProps & {
  quantity: HabitQuantityProps;
};

export type HabitQuantityProps = {
  amount: number;
  unit: string;
  targetType: MeasuredTargetType;
};

export type ScheduleProps = {
  startDate: Date;
  endDate?: Date;
  interval: FrequencyInterval;
  daysOfWeek?: DayOfWeek[];
};

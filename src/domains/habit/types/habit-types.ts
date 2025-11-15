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

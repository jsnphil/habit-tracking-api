import {
  CompletionStatus,
  DayOfWeek,
  FrequencyInterval,
  HabitStatus,
  HabitType,
  MeasuredTargetType
} from '../../domains/habit/types';

export interface HabitDTO {
  id: string;
  name: string;
  description: string;
  type: HabitType;
  status: HabitStatus;
  quantity?: {
    amount: number;
    unit: string;
    targetType: MeasuredTargetType;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    interval: FrequencyInterval;
    daysOfWeek?: DayOfWeek[];
  };
  cue?: string;
  obsidianNoteName?: string;
  completionRecords: Record<string, CompletionStatus>;
}

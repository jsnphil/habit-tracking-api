import { describe, expect, it } from 'vitest';
import { HabitCue } from './habit-cue';
import { HabitFrequency } from './habit-frequency';
import { HabitQuantity } from './habit-quantity';
import { HabitSchedule } from './habit-schedule';
import { MeasuredHabit } from './measured-habit';

describe('MeasuredHabit', () => {
  describe('constructor', () => {
    it('should create a goal habit', () => {
      const name = 'Reading';
      const description = 'Read 30 minutes every day';

      const target = 'goal';
      const habitQuantity = HabitQuantity.create(30, 'minutes', target);
      const frequency = HabitFrequency.create('daily');
      const schedule = HabitSchedule.create(new Date(), frequency);
      const cue = HabitCue.create('Morning');
      const habit = MeasuredHabit.create(
        name,
        description,
        habitQuantity,
        schedule,
        cue
      );
      expect(habit).toBeInstanceOf(MeasuredHabit);
      expect(habit.getName()).toBe(name);
      expect(habit.getDescription()).toBe(description);
      expect(habit.getType()).toBe('measured');
      expect(habit.getSchedule()).toEqual(schedule);
      expect(habit.getCue()).toEqual(cue);
    });

    it('should create a habit with a target type of "limit"', () => {
      const name = 'Screen Time';
      const description = 'Limit screen time to 2 hours per day';

      const target = 'limit';
      const habitQuantity = HabitQuantity.create(2, 'hours', target);
      const frequency = HabitFrequency.create('daily');
      const schedule = HabitSchedule.create(new Date(), frequency);
      const cue = HabitCue.create('Evening');
      const habit = MeasuredHabit.create(
        name,
        description,
        habitQuantity,
        schedule,
        cue
      );
      expect(habit).toBeInstanceOf(MeasuredHabit);
      expect(habit.getName()).toBe(name);
      expect(habit.getDescription()).toBe(description);
      expect(habit.getType()).toBe('measured');
      expect(habit.getSchedule()).toEqual(schedule);
      expect(habit.getCue()).toEqual(cue);
    });

    it('should throw an error if quantity is missing', () => {
      const name = 'Exercise';
      const description = 'Exercise for 30 minutes every day';
      const frequency = HabitFrequency.create('daily');
      const schedule = HabitSchedule.create(new Date(), frequency);
      const cue = HabitCue.create('Afternoon');

      expect(() =>
        // biome-ignore lint/suspicious/noExplicitAny: Forcing undefined quantity
        MeasuredHabit.create(name, description, undefined as any, schedule, cue)
      ).toThrow('Measured habits must have a quantity');
    });
  });

  describe('setProgress', () => {
    it('should set progress for a given date', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setProgress(new Date(), 15);
      expect(habit.getProgress(new Date())).toBe(15);
    });

    it('should throw an error for negative progress', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setProgress(new Date(), 15);
      expect(habit.getProgress(new Date())).toBe(15);
    });

    it('should throw an error for negative progress', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      expect(() => habit.setProgress(new Date(), -5)).toThrow(
        'Progress value cannot be negative'
      );
    });

    it('should throw an error when setting progress for an archived habit', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      expect(() => habit.setProgress(new Date(), -5)).toThrow(
        'Progress value cannot be negative'
      );
    });

    it('should throw an error when setting progress for an inactive habit', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setStatus('inactive');
      expect(() => habit.setProgress(new Date(), 10)).toThrow(
        'Cannot set progress for an inactive habit'
      );
    });

    it('should throw an error when setting progress for an archived habit', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setStatus('archived');
      expect(() => habit.setProgress(new Date(), 10)).toThrow(
        'Cannot set progress for an archived habit'
      );
    });

    it('should throw an error when adding progress for an archived habit', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setStatus('archived');
      expect(() => habit.addProgress(new Date(), 10)).toThrow(
        'Cannot add progress for an archived habit'
      );
    });
  });

  describe('addProgress', () => {
    it('should add progress for a given date', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.addProgress(new Date(), 10);
      expect(habit.getProgress(new Date())).toBe(10);
    });

    it('should throw an error for negative progress', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      expect(() => habit.addProgress(new Date(), -5)).toThrow(
        'Progress value cannot be negative'
      );
    });

    it('should throw an error when adding progress for an inactive habit', () => {
      const habit = MeasuredHabit.create(
        'Reading',

        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setStatus('inactive');
      expect(() => habit.addProgress(new Date(), 10)).toThrow(
        'Cannot add progress for an inactive habit'
      );
    });

    it('should throw an error when adding progress for an archived habit', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setStatus('archived');
      expect(() => habit.addProgress(new Date(), 10)).toThrow(
        'Cannot add progress for an archived habit'
      );
    });

    it('should mark habit as completed when progress meets goal', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.addProgress(new Date(), 30);
      expect(habit.getCompletionStatus(new Date())).toBe('completed');
    });

    it('should marked a habit as committed when progress is made but goal is not met', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.addProgress(new Date(), 15);
      expect(habit.getCompletionStatus(new Date())).toBe('committed');
    });

    it('should not change completion status if progress is updated after completion', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.addProgress(new Date(), 30);
      expect(habit.getCompletionStatus(new Date())).toBe('completed');

      habit.addProgress(new Date(), 10);
      expect(habit.getCompletionStatus(new Date())).toBe('completed');
    });
  });

  describe('markCompleted', () => {
    it('should throw an error when marking a habit as completed for a specific date', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      const date = new Date('2024-01-01');

      expect(() => habit.markCompleted(date)).toThrow(
        'Measured habits cannot be marked as completed. Progress is determined automatically based on goal achievement.'
      );
    });
  });

  describe('markMissed', () => {
    it('should throw an error when marking a habit as missed for a specific date', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      const date = new Date('2024-01-01');
      expect(() => habit.markMissed(date)).toThrow(
        'Measured habits cannot be marked as missed. Progress is determined automatically based on goal achievement.'
      );
    });
  });

  describe('getProgress', () => {
    it('should return the current progress for a given date', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setProgress(new Date('2024-01-01'), 15);
      expect(habit.getProgress(new Date('2024-01-01'))).toBe(15);
    });

    it('should return 0 for a date with no progress for a goal habit', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      expect(habit.getProgress(new Date('2024-01-01'))).toBe(0);
    });

    it('should return the target amount for a limit habit with no progress', () => {
      const habit = MeasuredHabit.create(
        'Screen Time',
        'Limit screen time to 2 hours per day',
        HabitQuantity.create(2, 'hours', 'limit'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Evening')
      );

      expect(habit.getProgress(new Date('2024-01-01'))).toBe(2);
    });
  });

  describe('checkCompletion', () => {
    it('should mark habit as completed when progress meets goal', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setProgress(new Date('2024-01-01'), 30);
      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'completed'
      );
    });

    it('should mark habit as committed when progress is made but goal is not met', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setProgress(new Date('2024-01-01'), 15);

      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'committed'
      );
    });

    it('should not change completion status if progress is updated after completion', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setProgress(new Date('2024-01-01'), 30);
      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'completed'
      );
    });

    it('should not change completion status if progress is updated after commitment', () => {
      const habit = MeasuredHabit.create(
        'Reading',
        'Read 30 minutes every day',
        HabitQuantity.create(30, 'minutes', 'goal'),
        HabitSchedule.create(new Date(), HabitFrequency.create('daily')),
        HabitCue.create('Morning')
      );

      habit.setProgress(new Date('2024-01-01'), 15);
      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'committed'
      );

      habit.setProgress(new Date('2024-01-01'), 20);
      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'committed'
      );
    });
  });
});

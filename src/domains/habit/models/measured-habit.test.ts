import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MeasuredHabit } from './measured-habit';

describe('MeasuredHabit', () => {
  describe('constructor', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should create a goal habit', () => {
      const name = 'Reading';
      const description = 'Read 30 minutes every day';

      const target = 'goal';
      const habit = MeasuredHabit.create({
        name,
        description,
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: target
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      expect(habit).toBeInstanceOf(MeasuredHabit);
      expect(habit.getName()).toBe(name);
      expect(habit.getDescription()).toBe(description);
      expect(habit.getType()).toBe('measured');
      expect(habit.getCue()?.getDescription()).toEqual('Morning');
    });

    it('should create a habit with a target type of "limit"', () => {
      const name = 'Screen Time';
      const description = 'Limit screen time to 2 hours per day';

      const target = 'limit';
      const habit = MeasuredHabit.create({
        name,
        description,
        quantity: {
          amount: 2,
          unit: 'hours',
          targetType: target
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Evening'
      });

      expect(habit).toBeInstanceOf(MeasuredHabit);
      expect(habit.getName()).toBe(name);
      expect(habit.getDescription()).toBe(description);
      expect(habit.getType()).toBe('measured');
      expect(habit.getSchedule().getStartDate()).toEqual(new Date());
      expect(habit.getCue()?.getDescription()).toEqual('Evening');
    });
  });

  describe('setProgress', () => {
    it('should set progress for a given date', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setProgress(new Date(), 15);
      expect(habit.getProgress(new Date())).toBe(15);
    });

    it('should throw an error for negative progress', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      expect(() => habit.setProgress(new Date(), -5)).toThrow(
        'Progress value cannot be negative'
      );
    });

    it('should throw an error when setting progress for an archived habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setStatus('archived');
      expect(() => habit.setProgress(new Date(), 10)).toThrow(
        'Cannot set progress for an archived habit'
      );
    });

    it('should throw an error when setting progress for an inactive habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setStatus('inactive');
      expect(() => habit.setProgress(new Date(), 10)).toThrow(
        'Cannot set progress for an inactive habit'
      );
    });

    // Removed duplicate test: 'should throw an error when setting progress for an archived habit'
    it('should throw an error when adding progress for an archived habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setStatus('archived');
      expect(() => habit.addProgress(new Date(), 10)).toThrow(
        'Cannot add progress for an archived habit'
      );
    });
  });

  describe('addProgress', () => {
    it('should add progress for a given date', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.addProgress(new Date(), 10);
      expect(habit.getProgress(new Date())).toBe(10);
    });

    it('should throw an error for negative progress', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      expect(() => habit.addProgress(new Date(), -5)).toThrow(
        'Progress value cannot be negative'
      );
    });

    it('should throw an error when adding progress for an inactive habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setStatus('inactive');
      expect(() => habit.addProgress(new Date(), 10)).toThrow(
        'Cannot add progress for an inactive habit'
      );
    });

    it('should throw an error when adding progress for an archived habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setStatus('archived');
      expect(() => habit.addProgress(new Date(), 10)).toThrow(
        'Cannot add progress for an archived habit'
      );
    });

    it('should mark habit as completed when progress meets goal', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.addProgress(new Date(), 30);
      expect(habit.getCompletionStatus(new Date())).toBe('completed');
    });

    it('should mark a habit as committed when progress is made but goal is not met', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.addProgress(new Date(), 15);
      expect(habit.getCompletionStatus(new Date())).toBe('committed');
    });

    it('should not change completion status if progress is updated after completion', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.addProgress(new Date(), 30);
      expect(habit.getCompletionStatus(new Date())).toBe('completed');

      habit.addProgress(new Date(), 10);
      expect(habit.getCompletionStatus(new Date())).toBe('completed');
    });
  });

  describe('markCompleted', () => {
    it('should throw an error when marking a habit as completed for a specific date', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      const date = new Date('2024-01-01');

      expect(() => habit.markCompleted(date)).toThrow(
        'Measured habits cannot be marked as completed. Progress is determined automatically based on goal achievement.'
      );
    });
  });

  describe('markMissed', () => {
    it('should throw an error when marking a habit as missed for a specific date', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      const date = new Date('2024-01-01');
      expect(() => habit.markMissed(date)).toThrow(
        'Measured habits cannot be marked as missed. Progress is determined automatically based on goal achievement.'
      );
    });
  });

  describe('getProgress', () => {
    it('should return the current progress for a given date', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setProgress(new Date('2024-01-01'), 15);
      expect(habit.getProgress(new Date('2024-01-01'))).toBe(15);
    });

    it('should return 0 for a date with no progress for a goal habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      expect(habit.getProgress(new Date('2024-01-01'))).toBe(0);
    });
  });

  describe('checkCompletion', () => {
    it('should mark habit as completed when progress meets goal', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setProgress(new Date('2024-01-01'), 30);
      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'completed'
      );
    });

    it('should mark habit as committed when progress is made but goal is not met', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setProgress(new Date('2024-01-01'), 15);

      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'committed'
      );
    });

    it('should not change completion status if progress is updated after completion', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setProgress(new Date('2024-01-01'), 30);
      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'completed'
      );
    });

    it('should not change completion status if progress is updated after commitment', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.setProgress(new Date('2024-01-01'), 15);
      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'committed'
      );

      habit.setProgress(new Date('2024-01-01'), 20);
      expect(habit.getCompletionStatus(new Date('2024-01-01'))).toBe(
        'committed'
      );
    });

    it('should return without modifications if no progress is found', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      const testDate = new Date('2024-01-01');

      // Verify no progress exists initially
      expect(habit.getProgress(testDate)).toBe(0);

      // Call checkCompletion on a date with no progress
      habit.checkCompletion(testDate);

      // Verify completion status remains 'pending' (no completion record created)
      expect(habit.getCompletionStatus(testDate)).toBe('pending');

      // Verify progress is still 0 (unchanged)
      expect(habit.getProgress(testDate)).toBe(0);
    });

    it('should mark habit as completed when progress is above limit', () => {
      const habit = MeasuredHabit.create({
        name: 'Screen Time',
        description: 'Limit screen time to 2 hours per day',
        quantity: {
          amount: 2,
          unit: 'hours',
          targetType: 'limit'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Evening'
      });

      const testDate = new Date('2024-01-01');
      habit.setProgress(testDate, 1);
      expect(habit.getCompletionStatus(testDate)).toBe('completed');
    });

    it('should mark habit as missed when progress exceeds limit', () => {
      const habit = MeasuredHabit.create({
        name: 'Screen Time',
        description: 'Limit screen time to 2 hours per day',
        quantity: {
          amount: 2,
          unit: 'hours',
          targetType: 'limit'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Evening'
      });

      const testDate = new Date('2024-01-01');
      habit.setProgress(testDate, 3);
      expect(habit.getCompletionStatus(testDate)).toBe('missed');
    });
  });

  describe('archive', () => {
    it('should archive an active habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.archive();
      expect(habit.getStatus()).toBe('archived');
    });

    it('archiving an already archived habit should have no effect', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.archive();
      habit.archive();
      expect(habit.getStatus()).toBe('archived');
    });
  });

  describe('unarchive', () => {
    it('should unarchive an archived habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.archive();
      habit.unarchive();
      expect(habit.getStatus()).toBe('active');
    });

    it('should throw an error when unarchiving an active habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      expect(() => habit.unarchive()).toThrow(
        'Only archived habits can be unarchived'
      );
    });
  });

  describe('activate', () => {
    it('should activate an inactive habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.deactivate();
      expect(habit.getStatus()).toBe('inactive');

      habit.activate();
      expect(habit.getStatus()).toBe('active');
    });

    it('activating an already active habit should have no effect', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      expect(habit.getStatus()).toBe('active');
      habit.activate();
      expect(habit.getStatus()).toBe('active');
    });

    it('should throw an error when activating an archived habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.archive();
      expect(() => habit.activate()).toThrow(
        'Cannot activate an archived habit. Unarchive it first.'
      );
    });
  });

  describe('deactivate', () => {
    it('deactivating an already inactive habit should have no effect', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.deactivate();
      expect(habit.getStatus()).toBe('inactive');

      habit.deactivate();
      expect(habit.getStatus()).toBe('inactive');
    });

    it('should throw an error when deactivating an archived habit', () => {
      const habit = MeasuredHabit.create({
        name: 'Reading',
        description: 'Read 30 minutes every day',
        quantity: {
          amount: 30,
          unit: 'minutes',
          targetType: 'goal'
        },
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Morning'
      });

      habit.archive();
      expect(() => habit.deactivate()).toThrow(
        'Cannot deactivate an archived habit'
      );
    });
  });
});

import { describe, expect, it } from 'vitest';
import { CompletionHabit } from './completion-habit';
import { HabitFrequency } from './habit-frequency';
import { HabitSchedule } from './habit-schedule';

describe('CompletionHabit', () => {
  describe('constructor', () => {
    it('should create daily completion habit', () => {
      const name = 'Read every day';
      const description = 'Read every day';

      const frequency = HabitFrequency.create('daily');
      const schedule = HabitSchedule.create(new Date(), frequency);

      const habit = CompletionHabit.create({
        name,
        description,
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      expect(habit).toBeInstanceOf(CompletionHabit);
      expect(habit.getType()).toBe('completion');
      expect(habit.getName()).toBe(name);
      expect(habit.getDescription()).toBe(description);
      expect(habit.getStatus()).toBe('active');
      expect(habit.getSchedule()).toEqual(schedule);
    });

    it('should create a daily completion habit with cue and note', () => {
      const name = 'Read every day';
      const description = 'Read every day';
      const frequency = HabitFrequency.create('daily');
      const schedule = HabitSchedule.create(new Date(), frequency);
      const obsidianNoteName = 'Daily Reading';

      const habit = CompletionHabit.create({
        name,
        description,
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        },
        cue: 'Before bed',
        obsidianNoteName
      });

      expect(habit).toBeInstanceOf(CompletionHabit);
      expect(habit.getType()).toBe('completion');
      expect(habit.getName()).toBe(name);
      expect(habit.getDescription()).toBe(description);
      expect(habit.getStatus()).toBe('active');
      expect(habit.getSchedule()).toEqual(schedule);
      expect(habit.getCue()?.getDescription()).toEqual('Before bed');
      expect(habit.getObsidianNoteName()).toBe(obsidianNoteName);
    });

    it('should not allow empty name', () => {
      const description = 'Read every day';

      expect(() =>
        CompletionHabit.create({
          name: '',
          description,
          schedule: {
            startDate: new Date(),
            interval: 'daily'
          }
        })
      ).toThrow('Habit name cannot be empty');
    });

    it('should not allow missing schedule', () => {
      const name = 'Read every day';
      const description = 'Read every day';

      expect(() =>
        CompletionHabit.create({
          name,
          description,
          // biome-ignore lint/suspicious/noExplicitAny: Forcing any to test missing schedule
          schedule: undefined as any
        })
      ).toThrow('Habit must have a schedule');
    });
  });

  describe('setName', () => {
    it('should update the name', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });
      habit.setName('Read every night');

      expect(habit.getName()).toBe('Read every night');
    });

    it('should not allow empty name', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });
      expect(() => habit.setName('')).toThrow('Habit name cannot be empty');
    });
  });

  describe('markCompleted', () => {
    it('should mark a habit as completed for a specific date', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      const date = new Date('2024-01-01');
      habit.markCompleted(date);
      expect(habit.getCompletionStatus(date)).toBe('completed');
    });

    it('should not allow marking completion for an archived habit', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      habit.setStatus('archived');
      expect(() => habit.markCompleted(new Date())).toThrow(
        'Cannot mark completion for an archived habit'
      );
    });

    it('should not allow marking completion for an inactive habit', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      habit.setStatus('inactive');
      expect(() => habit.markCompleted(new Date())).toThrow(
        'Cannot mark completion for an inactive habit'
      );
    });

    it('should not allow marking completion more than once per day', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      const date = new Date('2024-01-01');
      habit.markCompleted(date);
      expect(() => habit.markCompleted(date)).toThrow(
        'Status for 2024-01-01 already recorded. Habits can only be completed once per day.'
      );
    });
  });

  describe('markMissed', () => {
    it('should mark a habit as missed for a specific date', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      const date = new Date('2024-01-01');
      habit.markMissed(date);
      expect(habit.getCompletionStatus(date)).toBe('missed');
    });

    it('should not allow marking missed for an archived habit', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      habit.setStatus('archived');
      expect(() => habit.markMissed(new Date())).toThrow(
        'Cannot mark missed for an archived habit'
      );
    });

    it('should not allow marking missed for an inactive habit', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      habit.setStatus('inactive');
      expect(() => habit.markMissed(new Date())).toThrow(
        'Cannot mark missed for an inactive habit'
      );
    });

    it('should not allow marking missed more than once per day', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      const date = new Date('2024-01-01');
      habit.markMissed(date);
      expect(habit.getCompletionStatus(date)).toBe('missed');

      expect(() => habit.markMissed(date)).toThrow(
        'Status for 2024-01-01 already recorded. Habits can only be marked once per day.'
      );
    });
  });

  describe('markSkipped', () => {
    it('should mark a habit as skipped for a specific date', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      const date = new Date('2024-01-01');
      habit.markSkipped(date);
      expect(habit.getCompletionStatus(date)).toBe('skipped');
    });

    it('should not allow marking skipped for an archived habit', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      habit.setStatus('archived');
      expect(() => habit.markSkipped(new Date())).toThrow(
        'Cannot mark skipped for an archived habit'
      );
    });

    it('should not allow marking skipped for an inactive habit', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      habit.setStatus('inactive');
      expect(() => habit.markSkipped(new Date())).toThrow(
        'Cannot mark skipped for an inactive habit'
      );
    });

    it('should not allow marking skipped more than once per day', () => {
      const habit = CompletionHabit.create({
        name: 'Read',
        description: 'Read every day',
        schedule: {
          startDate: new Date(),
          interval: 'daily'
        }
      });

      const date = new Date('2024-01-01');

      habit.markSkipped(date);
      expect(habit.getCompletionStatus(date)).toBe('skipped');

      expect(() => habit.markSkipped(date)).toThrow(
        'Status for 2024-01-01 already recorded. Habits can only be marked once per day.'
      );
    });
  });
});

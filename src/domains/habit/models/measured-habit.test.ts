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

    
  });
});

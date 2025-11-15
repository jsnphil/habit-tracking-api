import { describe, expect, it } from 'vitest';
import { HabitCue } from './habit-cue';

describe('HabitCue', () => {
  it('should create a habit cue', () => {
    const description = 'Before bed';
    const cue = HabitCue.create(description);

    expect(cue).toBeInstanceOf(HabitCue);
    expect(cue.getDescription()).toBe(description);
  });

  it('should not allow empty description', () => {
    expect(() => HabitCue.create('')).toThrow(
      'Cue description cannot be empty'
    );
  });
});

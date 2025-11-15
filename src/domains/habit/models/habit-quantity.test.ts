import { describe, expect, it } from 'vitest';
import { HabitQuantity } from './habit-quantity';

describe('HabitQuantity', () => {
  describe('constructor', () => {
    it('should create a HabitQuantity instance', () => {
      const targetAmount = 30;
      const unit = 'minutes';
      const targetType = 'goal';
      const habitQuantity = HabitQuantity.create(
        targetAmount,
        unit,
        targetType
      );

      expect(habitQuantity.targetAmount).toBe(targetAmount);
      expect(habitQuantity.unit).toBe(unit);
      expect(habitQuantity.targetType).toBe(targetType);
    });

    it('should throw an error for non-positive target amount', () => {
      expect(() => HabitQuantity.create(0, 'minutes', 'goal')).toThrow(
        'Target amount must be greater than zero'
      );
    });
  });
});

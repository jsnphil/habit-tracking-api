import type { MeasuredTargetType } from '../types';

export class HabitQuantity {
  readonly targetAmount: number;
  readonly unit: string;
  readonly targetType: MeasuredTargetType;

  constructor(
    targetAmount: number,
    unit: string,
    targetType: MeasuredTargetType
  ) {
    if (targetAmount <= 0) {
      throw new Error('Target amount must be greater than zero');
    }

    this.targetAmount = targetAmount;
    this.unit = unit;
    this.targetType = targetType;
  }
}

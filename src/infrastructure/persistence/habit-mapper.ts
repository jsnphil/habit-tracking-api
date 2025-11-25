import { CompletionHabit } from '../../domains/habit/models/completion-habit';
import { Habit } from '../../domains/habit/models/habit';
import { MeasuredHabit } from '../../domains/habit/models/measured-habit';
import type { CompletionStatus } from '../../domains/habit/types';
import type { HabitDTO } from './habit-dto';

export class HabitMapper {
  /**
   * Convert domain entity to DTO for persistence
   */
  static toDTO(habit: Habit): HabitDTO {
    const schedule = habit.getSchedule();
    const frequency = schedule.getFrequency();

    const dto: HabitDTO = {
      id: habit.getId(),
      name: habit.getName(),
      description: habit.getDescription(),
      type: habit.getType(),
      status: habit.getStatus(),
      schedule: {
        startDate: schedule.getStartDate().toISOString(),
        endDate: schedule.getEndDate()?.toISOString(),
        interval: frequency.interval,
        daysOfWeek: frequency.daysOfWeek,
      },
      cue: habit.getCue()?.getDescription(),
      obsidianNoteName: habit.getObsidianNoteName(),
      completionRecords: this.mapToRecord(habit.getCompletionRecords()),
    };

    // Add quantity for measured habits
    if (habit.getType() === 'measured') {
      const measuredHabit = habit as MeasuredHabit;
      const quantity = (measuredHabit as any).quantity;
      dto.quantity = {
        amount: quantity.targetAmount,
        unit: quantity.unit,
        targetType: quantity.targetType,
      };
    }

    return dto;
  }

  /**
   * Convert DTO to domain entity
   */
  static toDomain(dto: HabitDTO): Habit {
    const scheduleProps = {
      startDate: new Date(dto.schedule.startDate),
      endDate: dto.schedule.endDate
        ? new Date(dto.schedule.endDate)
        : undefined,
      interval: dto.schedule.interval,
      daysOfWeek: dto.schedule.daysOfWeek,
    };

    let habit: Habit;

    if (dto.type === 'completion') {
      habit = CompletionHabit.create({
        name: dto.name,
        description: dto.description,
        schedule: scheduleProps,
        cue: dto.cue,
        obsidianNoteName: dto.obsidianNoteName,
      });
    } else if (dto.type === 'measured') {
      if (!dto.quantity) {
        throw new Error('Measured habit must have quantity');
      }

      habit = MeasuredHabit.create({
        name: dto.name,
        description: dto.description,
        quantity: {
          amount: dto.quantity.amount,
          unit: dto.quantity.unit,
          targetType: dto.quantity.targetType,
        },
        schedule: scheduleProps,
        cue: dto.cue,
      });
    } else {
      throw new Error(`Unknown habit type: ${dto.type}`);
    }

    // Restore the ID and status using private property access
    (habit as any).id = dto.id;
    habit.setStatus(dto.status);

    // Restore completion records
    const completionMap = this.mapFromRecord(dto.completionRecords);
    (habit as any).completionRecords = completionMap;

    return habit;
  }

  private static mapToRecord(
    map: Map<string, CompletionStatus>
  ): Record<string, CompletionStatus> {
    const record: Record<string, CompletionStatus> = {};
    map.forEach((value, key) => {
      record[key] = value;
    });
    return record;
  }

  private static mapFromRecord(
    record: Record<string, CompletionStatus>
  ): Map<string, CompletionStatus> {
    const map = new Map<string, CompletionStatus>();
    Object.entries(record).forEach(([key, value]) => {
      map.set(key, value);
    });
    return map;
  }
}

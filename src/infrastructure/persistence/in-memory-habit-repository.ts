import type { HabitRepository } from '../../domains/habit/repositories/habit-repository';
import type { Habit } from '../../domains/habit/models/habit';

export class InMemoryHabitRepository implements HabitRepository {
  private habits: Map<string, Habit> = new Map();

  async save(habit: Habit): Promise<void> {
    if (this.habits.has(habit.getId())) {
      throw new Error(`Habit with id ${habit.getId()} already exists`);
    }
    this.habits.set(habit.getId(), habit);
  }

  async findById(id: string): Promise<Habit | null> {
    return this.habits.get(id) || null;
  }

  async update(habit: Habit): Promise<void> {
    if (!this.habits.has(habit.getId())) {
      throw new Error(`Habit with id ${habit.getId()} does not exist`);
    }
    this.habits.set(habit.getId(), habit);
  }

  async delete(id: string): Promise<boolean> {
    return this.habits.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.habits.has(id);
  }

  // Test helper methods
  clear(): void {
    this.habits.clear();
  }

  count(): number {
    return this.habits.size;
  }
}

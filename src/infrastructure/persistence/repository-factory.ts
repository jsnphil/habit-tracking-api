import type { HabitRepository } from '../../domains/habit/repositories/habit-repository';
import { DynamoDBHabitRepository } from './dynamodb-habit-repository';
import { InMemoryHabitRepository } from './in-memory-habit-repository';

export class RepositoryFactory {
  static createHabitRepository(
    environment: 'production' | 'test' = 'production'
  ): HabitRepository {
    if (environment === 'test') {
      return new InMemoryHabitRepository();
    }

    const tableName = process.env.HABITS_TABLE_NAME || 'Habits';
    const region = process.env.AWS_REGION || 'us-east-1';

    return new DynamoDBHabitRepository(tableName, region);
  }
}

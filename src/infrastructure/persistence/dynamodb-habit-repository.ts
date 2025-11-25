import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { HabitRepository } from '../../domains/habit/repositories/habit-repository';
import type { Habit } from '../../domains/habit/models/habit';
import { HabitMapper } from './habit-mapper';
import type { HabitDTO } from './habit-dto';

export class DynamoDBHabitRepository implements HabitRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string, region = 'us-east-1') {
    const client = new DynamoDBClient({ region });
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async save(habit: Habit): Promise<void> {
    const dto = HabitMapper.toDTO(habit);

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: dto,
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );
  }

  async findById(id: string): Promise<Habit | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
      })
    );

    if (!result.Item) {
      return null;
    }

    return HabitMapper.toDomain(result.Item as HabitDTO);
  }

  async update(habit: Habit): Promise<void> {
    const dto = HabitMapper.toDTO(habit);

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: dto,
        ConditionExpression: 'attribute_exists(id)',
      })
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { id },
          ConditionExpression: 'attribute_exists(id)',
        })
      );
      return true;
    } catch (error) {
      if ((error as any).name === 'ConditionalCheckFailedException') {
        return false;
      }
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
        ProjectionExpression: 'id',
      })
    );

    return !!result.Item;
  }
}

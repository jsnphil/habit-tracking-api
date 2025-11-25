import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateHabitCommandHandler } from '../commands/create-habit-command-handler';
import { RepositoryFactory } from '../infrastructure/persistence/repository-factory';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');

    // Create repository and handler
    const repository = RepositoryFactory.createHabitRepository('production');
    const commandHandler = new CreateHabitCommandHandler(repository);

    // Execute command
    const habitId = await commandHandler.execute(body);

    return {
      statusCode: 201,
      body: JSON.stringify({ id: habitId })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: (error as Error).message })
    };
  }
};

import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CompletionHabit } from '../domains/habit/models/completion-habit';
import type { Habit } from '../domains/habit/models/habit';
import { MeasuredHabit } from '../domains/habit/models/measured-habit';
import { safeValidateCreateHabitPayload } from '../schemas/create-habit.schema';

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Request body is required'
        })
      };
    }

    let requestData: unknown;
    try {
      requestData = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid JSON in request body'
        })
      };
    }

    // Validate payload with Zod
    const validationResult = safeValidateCreateHabitPayload(requestData);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Validation failed',
          details: formattedErrors
        })
      };
    }

    const payload = validationResult.data;

    // Create habit based on type
    let habit: Habit;

    try {
      if (payload.type === 'completion') {
        habit = CompletionHabit.create({
          name: payload.name,
          description: payload.description,
          schedule: {
            startDate: new Date(payload.schedule.startDate),
            endDate: payload.schedule.endDate
              ? new Date(payload.schedule.endDate)
              : undefined,
            interval: payload.schedule.interval,
            daysOfWeek: payload.schedule.daysOfWeek
          },
          cue: payload.cue,
          obsidianNoteName: payload.obsidianNoteName
        });
      } else {
        habit = MeasuredHabit.create({
          name: payload.name,
          description: payload.description,
          schedule: {
            startDate: new Date(payload.schedule.startDate),
            endDate: payload.schedule.endDate
              ? new Date(payload.schedule.endDate)
              : undefined,
            interval: payload.schedule.interval,
            daysOfWeek: payload.schedule.daysOfWeek
          },
          quantity: {
            amount: payload.quantity.amount,
            unit: payload.quantity.unit,
            targetType: payload.quantity.targetType
          },
          cue: payload.cue
        });
      }

      // TODO: Persist habit to database
      // For now, just return success with habit details

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Habit created successfully',
          habit: {
            id: habit.getId(),
            name: habit.getName(),
            type: habit.getType(),
            status: habit.getStatus()
          }
        })
      };
    } catch (domainError) {
      // Handle domain validation errors (e.g., invalid dates, empty names, etc.)
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid habit data',
          message:
            domainError instanceof Error
              ? domainError.message
              : 'Unknown domain error'
        })
      };
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in create-habit handler:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error'
      })
    };
  }
};

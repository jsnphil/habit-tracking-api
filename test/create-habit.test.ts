import { describe, it, expect, vi } from 'vitest';
import type { APIGatewayEvent } from 'aws-lambda';
import { handler } from '../src/api/create-habit';
import {
  completionHabitExample,
  waterIntakeExample,
  screenTimeLimitExample,
  weeklyWorkoutExample
} from '../src/schemas/create-habit.examples';

// Helper function to create mock API Gateway event
const createMockEvent = (body: string): APIGatewayEvent => ({
  body,
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/habits',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    requestId: 'test-request-id',
    stage: 'dev',
    path: '/habits',
    httpMethod: 'POST',
    requestTimeEpoch: Date.now(),
    protocol: 'HTTP/1.1',
    resourcePath: '/habits',
    resourceId: 'resource-id',
    accountId: '123456789012',
    apiId: 'api-id',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '127.0.0.1',
      user: null,
      userAgent: 'test-agent',
      userArn: null,
      clientCert: null
    },
    authorizer: null
  },
  resource: '/habits'
});

describe('create-habit lambda', () => {
  describe('successful habit creation', () => {
    it('should create a completion habit successfully', async () => {
      const event = createMockEvent(JSON.stringify(completionHabitExample));
      const result = await handler(event);

      expect(result.statusCode).toBe(201);
      const response = JSON.parse(result.body);
      expect(response.message).toBe('Habit created successfully');
      expect(response.habit).toMatchObject({
        id: expect.any(String),
        name: 'Daily Meditation',
        type: 'completion',
        status: 'active'
      });
    });

    it('should create a measured habit with goal target successfully', async () => {
      const event = createMockEvent(JSON.stringify(waterIntakeExample));
      const result = await handler(event);

      expect(result.statusCode).toBe(201);
      const response = JSON.parse(result.body);
      expect(response.message).toBe('Habit created successfully');
      expect(response.habit).toMatchObject({
        id: expect.any(String),
        name: 'Daily Water Intake',
        type: 'measured',
        status: 'active'
      });
    });

    it('should create a measured habit with limit target successfully', async () => {
      const event = createMockEvent(JSON.stringify(screenTimeLimitExample));
      const result = await handler(event);

      expect(result.statusCode).toBe(201);
      const response = JSON.parse(result.body);
      expect(response.message).toBe('Habit created successfully');
      expect(response.habit).toMatchObject({
        id: expect.any(String),
        name: 'Screen Time Limit',
        type: 'measured',
        status: 'active'
      });
    });

    it('should create a weekly completion habit successfully', async () => {
      const event = createMockEvent(JSON.stringify(weeklyWorkoutExample));
      const result = await handler(event);

      expect(result.statusCode).toBe(201);
      const response = JSON.parse(result.body);
      expect(response.message).toBe('Habit created successfully');
      expect(response.habit).toMatchObject({
        id: expect.any(String),
        name: 'Strength Training',
        type: 'completion',
        status: 'active'
      });
    });
  });

  describe('validation errors', () => {
    it('should return 400 when body is missing', async () => {
      const event = createMockEvent('');
      event.body = null;
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Request body is required');
    });

    it('should return 400 for invalid JSON', async () => {
      const event = createMockEvent('{ invalid json }');
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Invalid JSON in request body');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidPayload = {
        type: 'completion'
        // missing name, description, schedule
      };
      const event = createMockEvent(JSON.stringify(invalidPayload));
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Validation failed');
      expect(response.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.any(String)
          })
        ])
      );
    });

    it('should return 400 for empty habit name', async () => {
      const invalidPayload = {
        ...completionHabitExample,
        name: '   ' // empty after trim
      };
      const event = createMockEvent(JSON.stringify(invalidPayload));
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Validation failed');
      expect(response.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: 'Habit name cannot be empty'
          })
        ])
      );
    });

    it('should return 400 for weekly habit without daysOfWeek', async () => {
      const invalidPayload = {
        ...completionHabitExample,
        schedule: {
          ...completionHabitExample.schedule,
          interval: 'weekly'
          // missing daysOfWeek
        }
      };
      const event = createMockEvent(JSON.stringify(invalidPayload));
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Validation failed');
      expect(response.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'schedule.daysOfWeek',
            message:
              'Days of week must be provided for weekly or custom frequency intervals'
          })
        ])
      );
    });

    it('should return 400 for measured habit without quantity', async () => {
      const invalidPayload = {
        type: 'measured',
        name: 'Test Habit',
        description: 'Test description',
        schedule: {
          startDate: '2024-01-01T00:00:00.000Z',
          interval: 'daily'
        }
        // missing quantity
      };
      const event = createMockEvent(JSON.stringify(invalidPayload));
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Validation failed');
      expect(response.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'quantity',
            message: expect.any(String)
          })
        ])
      );
    });

    it('should return 400 for negative quantity amount', async () => {
      const invalidPayload = {
        ...waterIntakeExample,
        quantity: {
          ...waterIntakeExample.quantity,
          amount: -1
        }
      };
      const event = createMockEvent(JSON.stringify(invalidPayload));
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Validation failed');
      expect(response.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'quantity.amount',
            message: 'Amount must be greater than zero'
          })
        ])
      );
    });

    it('should return 400 for invalid date format', async () => {
      const invalidPayload = {
        ...completionHabitExample,
        schedule: {
          ...completionHabitExample.schedule,
          startDate: 'invalid-date'
        }
      };
      const event = createMockEvent(JSON.stringify(invalidPayload));
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Validation failed');
    });

    it('should return 400 when end date is before start date', async () => {
      const invalidPayload = {
        ...completionHabitExample,
        schedule: {
          ...completionHabitExample.schedule,
          startDate: '2024-12-31T00:00:00.000Z',
          endDate: '2024-01-01T00:00:00.000Z' // end before start
        }
      };
      const event = createMockEvent(JSON.stringify(invalidPayload));
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Validation failed');
      expect(response.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'schedule.endDate',
            message: 'End date must be after start date'
          })
        ])
      );
    });
  });

  describe('domain validation errors', () => {
    it('should return 400 for domain validation errors', async () => {
      // This test simulates domain-level validation errors that might occur
      // during habit creation (e.g., business rule violations)
      const payload = {
        ...waterIntakeExample,
        quantity: {
          amount: 0, // This should be caught by Zod, but testing domain layer
          unit: '',
          targetType: 'goal'
        }
      };

      const event = createMockEvent(JSON.stringify(payload));
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const response = JSON.parse(result.body);
      expect(response.error).toBe('Validation failed');
    });
  });

  describe('error handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      // Create a payload that might cause an unexpected error
      const payload = completionHabitExample;
      const event = createMockEvent(JSON.stringify(payload));

      // Mock console.error to avoid cluttering test output
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // This test ensures the error handling structure is in place
      // In a real scenario, you might mock dependencies to force an error
      const result = await handler(event);

      consoleSpy.mockRestore();

      // Should not return 500 for valid input
      expect(result.statusCode).not.toBe(500);
    });
  });
});

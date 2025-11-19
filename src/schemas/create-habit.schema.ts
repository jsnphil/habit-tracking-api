import { z } from 'zod';

// Base enums from habit domain
const FrequencyInterval = z.enum(['daily', 'weekly', 'custom']);
const DayOfWeek = z.enum([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]);
const MeasuredTargetType = z.enum(['goal', 'limit']);

// Schedule schema
const ScheduleSchema = z
  .object({
    startDate: z
      .string()
      .datetime({ message: 'Start date must be a valid ISO 8601 datetime' }),
    endDate: z
      .string()
      .datetime({ message: 'End date must be a valid ISO 8601 datetime' })
      .optional(),
    interval: FrequencyInterval,
    daysOfWeek: z.array(DayOfWeek).optional()
  })
  .refine(
    (data) => {
      // Validate that weekly/custom intervals have daysOfWeek
      if (
        (data.interval === 'weekly' || data.interval === 'custom') &&
        !data.daysOfWeek
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Days of week must be provided for weekly or custom frequency intervals',
      path: ['daysOfWeek']
    }
  )
  .refine(
    (data) => {
      // Validate that endDate is after startDate if provided
      if (data.endDate && data.startDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate']
    }
  );

// Quantity schema for measured habits
const QuantitySchema = z.object({
  amount: z.number().positive({ message: 'Amount must be greater than zero' }),
  unit: z.string().trim().min(1, { message: 'Unit cannot be empty' }),
  targetType: MeasuredTargetType
});

// Base habit schema
const BaseHabitSchema = z.object({
  name: z.string().trim().min(1, { message: 'Habit name cannot be empty' }),
  description: z.string(),
  schedule: ScheduleSchema,
  cue: z
    .string()
    .trim()
    .min(1, { message: 'Cue description cannot be empty' })
    .optional(),
  obsidianNoteName: z
    .string()
    .trim()
    .min(1, { message: 'Obsidian note name cannot be empty' })
    .optional()
});

// Completion habit schema
const CompletionHabitSchema = BaseHabitSchema.extend({
  type: z.literal('completion')
});

// Measured habit schema
const MeasuredHabitSchema = BaseHabitSchema.extend({
  type: z.literal('measured'),
  quantity: QuantitySchema
}).omit({
  obsidianNoteName: true // Measured habits don't support obsidianNoteName based on the domain model
});

// Union schema for create habit payload
export const CreateHabitSchema = z.discriminatedUnion('type', [
  CompletionHabitSchema,
  MeasuredHabitSchema
]);

// TypeScript types derived from schemas
export type CreateHabitPayload = z.infer<typeof CreateHabitSchema>;
export type CompletionHabitPayload = z.infer<typeof CompletionHabitSchema>;
export type MeasuredHabitPayload = z.infer<typeof MeasuredHabitSchema>;
export type SchedulePayload = z.infer<typeof ScheduleSchema>;
export type QuantityPayload = z.infer<typeof QuantitySchema>;

// Validation helper function
export const validateCreateHabitPayload = (
  data: unknown
): CreateHabitPayload => {
  return CreateHabitSchema.parse(data);
};

// Safe validation helper that returns result with error details
export const safeValidateCreateHabitPayload = (data: unknown) => {
  return CreateHabitSchema.safeParse(data);
};

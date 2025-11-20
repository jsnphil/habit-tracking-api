# Create Habit API Interface

This document describes the payload interface for the `create-habit` lambda function, which supports creating both completion and measured habits with comprehensive validation using Zod.

## Schema Overview

The API uses a discriminated union based on the `type` field to handle different habit types:
- `completion`: Habits that are simply marked as done/not done
- `measured`: Habits that track numerical progress against targets

## Payload Structure

### Base Fields (Common to All Habits)

```typescript
{
  type: 'completion' | 'measured';
  name: string;           // Required, non-empty after trimming
  description: string;    // Can be empty
  schedule: Schedule;     // Required schedule configuration
  cue?: string;          // Optional habit cue/trigger
}
```

### Schedule Configuration

```typescript
{
  startDate: string;      // ISO 8601 datetime (e.g., "2024-01-01T00:00:00.000Z")
  endDate?: string;       // Optional ISO 8601 datetime, must be after startDate
  interval: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: DayOfWeek[]; // Required for 'weekly' and 'custom' intervals
}

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
```

### Completion Habits

Completion habits support an additional optional field:

```typescript
{
  type: 'completion';
  // ... base fields
  obsidianNoteName?: string; // Optional Obsidian note reference
}
```

### Measured Habits

Measured habits require a quantity configuration:

```typescript
{
  type: 'measured';
  // ... base fields (except obsidianNoteName)
  quantity: {
    amount: number;        // Must be positive
    unit: string;          // Non-empty unit description
    targetType: 'goal' | 'limit';
  }
}
```

#### Target Types
- `goal`: Success when reaching or exceeding the amount (e.g., "drink 8 glasses of water")
- `limit`: Success when staying at or below the amount (e.g., "limit screen time to 2 hours")

## Validation Rules

### Name Validation
- Must not be empty after trimming whitespace
- Leading/trailing whitespace is automatically trimmed

### Schedule Validation
- `startDate` must be valid ISO 8601 datetime
- `endDate` (if provided) must be after `startDate`
- `daysOfWeek` is required when `interval` is 'weekly' or 'custom'
- `daysOfWeek` should not be provided when `interval` is 'daily'

### Quantity Validation (Measured Habits)
- `amount` must be positive (> 0)
- `unit` must be non-empty after trimming
- `targetType` must be either 'goal' or 'limit'

### Cue Validation
- If provided, must be non-empty after trimming

## Example Payloads

### Daily Completion Habit
```json
{
  "type": "completion",
  "name": "Daily Meditation",
  "description": "Practice mindfulness through daily meditation",
  "schedule": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z",
    "interval": "daily"
  },
  "cue": "After morning coffee",
  "obsidianNoteName": "Daily Meditation Log"
}
```

### Weekly Completion Habit
```json
{
  "type": "completion",
  "name": "Strength Training",
  "description": "Complete strength training workout",
  "schedule": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "interval": "weekly",
    "daysOfWeek": ["Monday", "Wednesday", "Friday"]
  },
  "cue": "After work at 6 PM"
}
```

### Measured Habit (Goal)
```json
{
  "type": "measured",
  "name": "Daily Water Intake",
  "description": "Track daily water consumption for optimal hydration",
  "schedule": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "interval": "daily"
  },
  "quantity": {
    "amount": 8,
    "unit": "glasses",
    "targetType": "goal"
  },
  "cue": "Keep water bottle on desk"
}
```

### Measured Habit (Limit)
```json
{
  "type": "measured",
  "name": "Screen Time Limit",
  "description": "Limit recreational screen time",
  "schedule": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "interval": "daily"
  },
  "quantity": {
    "amount": 2,
    "unit": "hours",
    "targetType": "limit"
  }
}
```

## Response Format

### Success Response (201 Created)
```json
{
  "message": "Habit created successfully",
  "habit": {
    "id": "uuid-string",
    "name": "Habit Name",
    "type": "completion" | "measured",
    "status": "active"
  }
}
```

### Validation Error Response (400 Bad Request)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "field.path",
      "message": "Validation error message"
    }
  ]
}
```

### Other Error Responses
- `400`: Request body missing or invalid JSON
- `400`: Domain validation errors (business rule violations)
- `500`: Internal server error

## Usage in Code

```typescript
import { validateCreateHabitPayload, safeValidateCreateHabitPayload } from './schemas/create-habit.schema';

// Throws on validation error
const payload = validateCreateHabitPayload(requestData);

// Returns result object with success/error details
const result = safeValidateCreateHabitPayload(requestData);
if (result.success) {
  const payload = result.data;
  // Use validated payload
} else {
  console.error(result.error.issues);
}
```

## Implementation Notes

1. **Zod Validation**: All validation is handled by Zod schemas with comprehensive error messages
2. **Type Safety**: Full TypeScript type inference from Zod schemas
3. **Discriminated Unions**: Type discrimination based on `type` field ensures correct structure
4. **Domain Integration**: Validated payloads are directly compatible with domain models
5. **Error Handling**: Structured error responses with field-specific validation messages

This interface provides a robust, type-safe way to create habits while ensuring all business rules are enforced at the API boundary.
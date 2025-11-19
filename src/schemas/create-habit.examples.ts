// Example request payloads for the create-habit API

// Example 1: Completion habit (daily meditation)
export const completionHabitExample = {
  type: 'completion' as const,
  name: 'Daily Meditation',
  description: 'Practice mindfulness through daily meditation',
  schedule: {
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-12-31T23:59:59.999Z',
    interval: 'daily' as const
  },
  cue: 'After morning coffee',
  obsidianNoteName: 'Daily Meditation Log'
};

// Example 2: Completion habit (weekly workout)
export const weeklyWorkoutExample = {
  type: 'completion' as const,
  name: 'Strength Training',
  description: 'Complete strength training workout',
  schedule: {
    startDate: '2024-01-01T00:00:00.000Z',
    interval: 'weekly' as const,
    daysOfWeek: ['Monday', 'Wednesday', 'Friday'] as const
  },
  cue: 'After work at 6 PM'
};

// Example 3: Measured habit (water intake goal)
export const waterIntakeExample = {
  type: 'measured' as const,
  name: 'Daily Water Intake',
  description: 'Track daily water consumption for optimal hydration',
  schedule: {
    startDate: '2024-01-01T00:00:00.000Z',
    interval: 'daily' as const
  },
  quantity: {
    amount: 8,
    unit: 'glasses',
    targetType: 'goal' as const
  },
  cue: 'Keep water bottle on desk'
};

// Example 4: Measured habit (limit screen time)
export const screenTimeLimitExample = {
  type: 'measured' as const,
  name: 'Screen Time Limit',
  description: 'Limit recreational screen time',
  schedule: {
    startDate: '2024-01-01T00:00:00.000Z',
    interval: 'daily' as const
  },
  quantity: {
    amount: 2,
    unit: 'hours',
    targetType: 'limit' as const
  }
};

// Example 5: Custom schedule habit
export const customScheduleExample = {
  type: 'completion' as const,
  name: 'Team Standup',
  description: 'Attend daily team standup meetings',
  schedule: {
    startDate: '2024-01-01T00:00:00.000Z',
    interval: 'custom' as const,
    daysOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday'
    ] as const
  }
};

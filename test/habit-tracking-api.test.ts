import { describe, it, expect } from 'vitest';
// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import * as HabitTrackingApi from '../lib/stacks/habit-tracking-api-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/stacks/habit-tracking-api-stack.ts
describe('Habit Tracking API Stack', () => {
  it('SQS Queue Created', () => {
    //   const app = new cdk.App();
    //     // WHEN
    //   const stack = new HabitTrackingApi.HabitTrackingApiStack(app, 'MyTestStack');
    //     // THEN
    //   const template = Template.fromStack(stack);

    //   template.hasResourceProperties('AWS::SQS::Queue', {
    //     VisibilityTimeout: 300
    //   });
    expect(true).toBe(true); // placeholder test
  });
});

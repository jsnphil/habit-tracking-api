/** biome-ignore-all lint/complexity/noUselessConstructor: <Remove rule when implemented> */
import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { Api } from './constructs/api';

import path = require('node:path');

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface ApiStackProps extends cdk.StackProps {
  environmentName: string;
}

export class HabitTrackingApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);

    const api = new Api(this, 'HabitTrackingApi', {
      environmentName: props?.environmentName || 'dev'
    });

    api.createApiKey('habit-tracking-test-client');

    const rootResource = api.createRootResource('habit-tracking');

    const habitsResource = rootResource.addResource('habits');
    const habitByIdResource = habitsResource.addResource('{habitId}');

    api.createResource({
      id: 'CreateHabitEndpoint',
      httpMethod: 'POST',
      apiResource: habitsResource,
      apiKeyRequired: true,
      source: path.join(__dirname, '../..', '/src/api/', 'create-habit.ts')
    });

    api.createResource({
      id: 'GetHabitByIdEndpoint',
      httpMethod: 'GET',
      apiResource: habitByIdResource,
      source: path.join(__dirname, '../..', '/src/api/', 'get-habit.ts')
    });

    api.createResource({
      id: 'GetAllHabitsEndpoint',
      httpMethod: 'GET',
      apiResource: habitsResource,
      source: path.join(__dirname, '../..', '/src/api/', 'get-all-habits.ts')
    });

    api.createResource({
      id: 'DeleteHabitEndpoint',
      httpMethod: 'DELETE',
      apiResource: habitByIdResource,
      source: path.join(__dirname, '../..', '/src/api/', 'delete-habit.ts'),
      apiKeyRequired: true
    });

    api.createResource({
      id: 'UpdateHabitEndpoint',
      httpMethod: 'PATCH',
      apiResource: habitByIdResource,
      source: path.join(__dirname, '../..', '/src/api/', 'update-habit.ts'),
      apiKeyRequired: true
    });
  }
}

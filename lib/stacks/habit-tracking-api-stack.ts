/** biome-ignore-all lint/complexity/noUselessConstructor: <Remove rule when implemented> */
import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { Api } from './constructs/api';

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

    api.createResource({
      id: 'CreateHabitEndpoint',
      method: 'POST',
      parentPath: rootResource,
      resourcePath: 'create-habit',
      apiKeyRequired: true,
      lambdaProps: {
        source: 'create-habit.ts'
      }
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HabitTrackingApiQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}

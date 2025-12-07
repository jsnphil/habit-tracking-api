import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

import { Construct } from 'constructs';
import type { ApiStackProps } from '../habit-tracking-api-stack';

import {
  LambdaApiEndpoint,
  type LambdaApiEndpointProps
} from './lambda-api-endpoint';

export interface ApiProps extends ApiStackProps {
  // Define any additional properties needed for the API stack here
}

export class Api extends Construct {
  private api: apiGateway.RestApi;
  private usagePlan: apiGateway.UsagePlan;
  private rootResource: apiGateway.Resource;

  constructor(scope: Construct, id: string, props?: ApiProps) {
    super(scope, id);

    const { environmentName } = props || {};

    // Initialize API resources here

    this.api = new apiGateway.RestApi(
      this,
      `HabitTrackingApi-${environmentName}`,
      {
        restApiName: `HabitTrackingApi-${environmentName}`,
        description: `Habit Tracking API for ${environmentName}`,
        deployOptions: {
          stageName: environmentName,
          loggingLevel: apiGateway.MethodLoggingLevel.INFO,
          dataTraceEnabled: true
        }
      }
    );

    this.usagePlan = this.api.addUsagePlan('usage-plans', {
      throttle: {
        rateLimit: 10,
        burstLimit: 2
      }
    });

    this.usagePlan.addApiStage({
      stage: this.api.deploymentStage
    });
  }

  public createApiKey(clientName: string) {
    const apiKey = new apiGateway.ApiKey(this, `ApiKey-${clientName}`, {
      apiKeyName: clientName,
      description: `API Key for ${clientName}`
    });

    this.usagePlan.addApiKey(apiKey);
  }

  public createRootResource(resourceName: string): apiGateway.Resource {
    this.rootResource = this.api.root.addResource(resourceName);
    return this.rootResource;
  }

  public createResource(props: LambdaApiEndpointProps) {
    const createHabitEndpoint = new LambdaApiEndpoint(this, props.id, props);

    return createHabitEndpoint;
  }
}

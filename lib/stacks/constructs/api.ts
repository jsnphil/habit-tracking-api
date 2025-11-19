import * as cdk from 'aws-cdk-lib';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';

import { Construct } from 'constructs';
import type { LambdaApiEndpointProps } from '../../types/api-types';
import type { ApiStackProps } from '../habit-tracking-api-stack';

// biome-ignore lint/style/useNodejsImportProtocol: Needed to import path module
import path = require('path');

import { ARCHITECTURE, lambdaEnvironment } from '../../CDKConstructs';

export interface ApiProps extends ApiStackProps {
  // Define any additional properties needed for the API stack here
}

export class Api extends Construct {
  private api: apiGateway.RestApi;
  private role: iam.Role;
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

    this.role = new iam.Role(this, `api-role`, {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com')
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
    const {
      id,
      method,
      parentPath,
      resourcePath,
      apiKeyRequired,
      lambdaProps
    } = props;
    const { source, environment, timeout, memorySize } = lambdaProps;

    const endpointFunction = new lambda.NodejsFunction(this, `${id}-Lambda`, {
      entry: path.join(__dirname, '../../../src/api/', source),
      handler: 'handler',
      environment: {
        ...lambdaEnvironment,
        ...environment
      },
      timeout: cdk.Duration.seconds(timeout || 10),
      memorySize: memorySize || 128,
      architecture: ARCHITECTURE,
      logRetention: logs.RetentionDays.ONE_WEEK
    });

    const endpointResource = parentPath.addResource(resourcePath);
    endpointResource.addMethod(
      method,
      new apiGateway.LambdaIntegration(endpointFunction),
      {
        apiKeyRequired
      }
    );

    return {
      resource: endpointResource,
      lambdaFunction: endpointFunction
    };
  }
}

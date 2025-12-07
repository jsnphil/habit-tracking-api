import * as cdk from 'aws-cdk-lib';
import type { Resource } from 'aws-cdk-lib/aws-apigateway';
import * as nodejsLambda from 'aws-cdk-lib/aws-lambda-nodejs';

import { Construct } from 'constructs';
import {
  ARCHITECTURE,
  lambdaEnvironment,
  NODE_RUNTIME
} from '../../CDKConstructs';

export interface LambdaApiEndpointProps extends cdk.StackProps {
  readonly id: string;
  readonly source: string;
  readonly environment?: { [key: string]: string };
  readonly memorySize?: number;
  readonly timeout?: cdk.Duration;
  readonly httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readonly apiResource: Resource;
  readonly apiKeyRequired?: boolean;
}

export class LambdaApiEndpoint extends Construct {
  constructor(scope: Construct, id: string, props: LambdaApiEndpointProps) {
    super(scope, id);

    const lambda = new nodejsLambda.NodejsFunction(this, `${props.id}-lambda`, {
      runtime: NODE_RUNTIME,
      handler: 'handler',
      entry: props.source,
      environment: {
        ...lambdaEnvironment,
        ...props.environment
      },
      memorySize: props.memorySize ?? 128,
      timeout: props.timeout ?? cdk.Duration.seconds(10),
      architecture: ARCHITECTURE,
      logGroup: new cdk.aws_logs.LogGroup(this, `${props.id}-log-group`, {
        logGroupName: `/aws/lambda/${props.id}`,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        retention: cdk.aws_logs.RetentionDays.ONE_WEEK
      })
    });

    props.apiResource.addMethod(
      props.httpMethod,
      new cdk.aws_apigateway.LambdaIntegration(lambda),
      {
        apiKeyRequired: props.apiKeyRequired ?? false
      }
    );
  }
}

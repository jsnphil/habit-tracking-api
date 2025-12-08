import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { beforeEach, describe, it } from 'vitest';
import { LambdaApiEndpoint } from './lambda-api-endpoint';

describe('LambdaApiEndpoint', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let restApi: apiGateway.RestApi;
  let resource: apiGateway.Resource;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');

    // Create a mock API Gateway REST API and resource for testing
    restApi = new apiGateway.RestApi(stack, 'TestApi', {
      restApiName: 'test-api'
    });
    resource = restApi.root.addResource('test-resource');
  });

  it('creates Lambda function with correct configuration', () => {
    // Arrange
    const props = {
      id: 'TestEndpoint',
      httpMethod: 'GET' as const,
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`
    };

    // Act
    new LambdaApiEndpoint(stack, 'TestLambdaEndpoint', props);

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs22.x',
      Handler: 'index.handler',
      MemorySize: 128,
      Timeout: 10,
      Environment: {
        Variables: Match.objectLike({
          POWERTOOLS_LOG_LEVEL: 'DEBUG',
          AWS_RETRY_MODE: 'standard'
        })
      }
    });
  });

  it('creates Lambda function with custom configuration', () => {
    // Arrange
    const props = {
      id: 'CustomEndpoint',
      httpMethod: 'POST' as const,
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`,
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        CUSTOM_VAR: 'test-value'
      }
    };

    // Act
    new LambdaApiEndpoint(stack, 'CustomLambdaEndpoint', props);

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      MemorySize: 256,
      Timeout: 30,
      Environment: {
        Variables: Match.objectLike({
          POWERTOOLS_LOG_LEVEL: 'DEBUG',
          AWS_RETRY_MODE: 'standard',
          CUSTOM_VAR: 'test-value'
        })
      }
    });
  });

  it('creates API Gateway method with correct HTTP method', () => {
    // Arrange
    const props = {
      id: 'GetEndpoint',
      httpMethod: 'GET' as const,
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`
    };

    // Act
    new LambdaApiEndpoint(stack, 'GetLambdaEndpoint', props);

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ApiKeyRequired: false
    });
  });

  it('creates API Gateway method with API key requirement', () => {
    // Arrange
    const props = {
      id: 'SecureEndpoint',
      httpMethod: 'POST' as const,
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`,
      apiKeyRequired: true
    };

    // Act
    new LambdaApiEndpoint(stack, 'SecureLambdaEndpoint', props);

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ApiKeyRequired: true
    });
  });

  it('supports all HTTP methods', () => {
    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

    httpMethods.forEach((method) => {
      // Arrange
      const props = {
        id: `${method}Endpoint`,
        httpMethod: method,
        apiResource: resource,
        source: `${__dirname}/mock-handler.ts`
      };

      // Act
      new LambdaApiEndpoint(stack, `${method}LambdaEndpoint`, props);
    });

    // Assert
    const template = Template.fromStack(stack);

    httpMethods.forEach((method) => {
      template.hasResourceProperties('AWS::ApiGateway::Method', {
        HttpMethod: method
      });
    });
  });

  it('creates Lambda log group with correct configuration', () => {
    // Arrange
    const props = {
      id: 'LoggedEndpoint',
      httpMethod: 'GET' as const,
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`
    };

    // Act
    new LambdaApiEndpoint(stack, 'LoggedLambdaEndpoint', props);

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: '/aws/lambda/LoggedEndpoint',
      RetentionInDays: 7
    });
  });

  it('creates Lambda integration for API Gateway method', () => {
    // Arrange
    const props = {
      id: 'IntegratedEndpoint',
      httpMethod: 'POST' as const,
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`
    };

    // Act
    new LambdaApiEndpoint(stack, 'IntegratedLambdaEndpoint', props);

    // Assert
    const template = Template.fromStack(stack);

    // Verify Lambda integration exists
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'AWS_PROXY',
        IntegrationHttpMethod: 'POST'
      }
    });
  });

  it('creates exactly one Lambda function per endpoint', () => {
    // Arrange & Act
    new LambdaApiEndpoint(stack, 'Endpoint1', {
      id: 'Endpoint1',
      httpMethod: 'GET',
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`
    });

    new LambdaApiEndpoint(stack, 'Endpoint2', {
      id: 'Endpoint2',
      httpMethod: 'POST',
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`
    });

    // Assert
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 2);
    template.resourceCountIs('AWS::ApiGateway::Method', 2);
  });

  it('applies default values correctly', () => {
    // Arrange
    const props = {
      id: 'DefaultEndpoint',
      httpMethod: 'GET' as const,
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`
    };

    // Act
    new LambdaApiEndpoint(stack, 'DefaultLambdaEndpoint', props);

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      MemorySize: 128,
      Timeout: 10
    });

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: false
    });
  });
});

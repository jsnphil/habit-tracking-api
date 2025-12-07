import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { beforeEach, describe, expect, it } from 'vitest';
import { Api } from './api';

describe('Api', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
  });

  it('creates REST API with correct configuration', () => {
    // Arrange
    const props = {
      environmentName: 'test'
    };

    // Act
    const api = new Api(stack, 'TestApi', props);
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'HabitTrackingApi-test',
      Description: 'Habit Tracking API for test'
    });
  });

  it('creates REST API with default environment when props not provided', () => {
    // Act
    const api = new Api(stack, 'TestApi');
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'HabitTrackingApi-undefined',
      Description: 'Habit Tracking API for undefined'
    });
  });

  it('creates deployment with correct stage configuration', () => {
    // Arrange
    const props = {
      environmentName: 'dev'
    };

    // Act
    const api = new Api(stack, 'TestApi', props);
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    // Assert
    const template = Template.fromStack(stack);

    // Check for Deployment Stage instead of Deployment properties
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'dev'
    });
  });

  it('creates stage with logging and tracing enabled', () => {
    // Arrange
    const props = {
      environmentName: 'prod'
    };

    // Act
    const api = new Api(stack, 'TestApi', props);
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'prod',
      MethodSettings: Match.arrayWith([
        Match.objectLike({
          LoggingLevel: 'INFO',
          DataTraceEnabled: true
        })
      ])
    });
  });

  it('creates usage plan with correct throttling settings', () => {
    // Arrange
    const props = {
      environmentName: 'test'
    };

    // Act
    const api = new Api(stack, 'TestApi', props);
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {
      Throttle: {
        RateLimit: 10,
        BurstLimit: 2
      }
    });
  });

  it('creates API key with correct configuration', () => {
    // Arrange
    const api = new Api(stack, 'TestApi', { environmentName: 'test' });
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    const clientName = 'test-client';

    // Act
    api.createApiKey(clientName);

    // Assert
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: clientName,
      Description: `API Key for ${clientName}`
    });
  });

  it('creates multiple API keys correctly', () => {
    // Arrange
    const api = new Api(stack, 'TestApi', { environmentName: 'test' });
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    // Act
    api.createApiKey('client1');
    api.createApiKey('client2');

    // Assert
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ApiGateway::ApiKey', 2);

    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: 'client1',
      Description: 'API Key for client1'
    });

    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: 'client2',
      Description: 'API Key for client2'
    });
  });

  it('creates API with Lambda endpoint successfully', () => {
    // Arrange
    const api = new Api(stack, 'TestApi', { environmentName: 'test' });
    const rootResource = api.createRootResource('api');

    // Act - Test the createResource method that was originally failing
    const endpoint = api.createResource({
      id: 'TestMethod',
      httpMethod: 'GET',
      apiResource: rootResource,
      source: `${__dirname}/mock-handler.ts`
    });

    // Assert
    expect(endpoint).toBeDefined();

    const template = Template.fromStack(stack);

    // Should create Lambda function via the endpoint
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs22.x',
      Handler: 'index.handler'
    });

    // Should create API Gateway method via the endpoint
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET'
    });

    // Should create the REST API
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'HabitTrackingApi-test',
      Description: 'Habit Tracking API for test'
    });
  });

  it('creates root resource correctly', () => {
    // Arrange
    const api = new Api(stack, 'TestApi', { environmentName: 'test' });
    const resourceName = 'habit-tracking';

    // Act
    const resource = api.createRootResource(resourceName);

    // Assert
    expect(resource).toBeInstanceOf(apiGateway.Resource);

    // Use createResource to exercise the Api construct's method
    api.createResource({
      id: 'TestMethod',
      httpMethod: 'GET',
      apiResource: resource,
      source: `${__dirname}/mock-handler.ts`
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: resourceName
    });
  });

  it('creates API construct and exercises all main methods', () => {
    // Arrange & Act - Exercise the main constructor and methods
    const api = new Api(stack, 'TestApi', { environmentName: 'integration' });

    // Test createRootResource
    const rootResource = api.createRootResource('v1');

    // Test createResource
    const endpoint = api.createResource({
      id: 'IntegrationEndpoint',
      httpMethod: 'POST',
      apiResource: rootResource,
      source: `${__dirname}/mock-handler.ts`
    });

    // Test createApiKey
    api.createApiKey('integration-test-key');

    // Assert - All methods should work without errors
    expect(endpoint).toBeDefined();
    expect(rootResource).toBeInstanceOf(apiGateway.Resource);

    const template = Template.fromStack(stack);

    // Should have all the expected resources
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
    template.resourceCountIs('AWS::ApiGateway::UsagePlan', 1);
    template.resourceCountIs('AWS::ApiGateway::ApiKey', 1);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.resourceCountIs('AWS::ApiGateway::Method', 1);
    template.resourceCountIs('AWS::ApiGateway::Resource', 1); // The v1 resource
  });

  it('creates exactly one usage plan per construct', () => {
    // Act
    const api = new Api(stack, 'TestApi', { environmentName: 'test' });
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    // Assert
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::ApiGateway::UsagePlan', 1);
  });

  it('integrates API key with usage plan correctly', () => {
    // Arrange
    const api = new Api(stack, 'TestApi', { environmentName: 'test' });
    const rootResource = api.createRootResource('api');

    // Add a simple mock method to make API valid
    rootResource.addMethod(
      'GET',
      new apiGateway.MockIntegration({
        requestTemplates: {
          'application/json': '{"statusCode": 200}'
        },
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }),
      {
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    );

    // Act
    api.createApiKey('integration-test-client');

    // Assert
    const template = Template.fromStack(stack);

    // Should have usage plan key that links API key to usage plan
    template.hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
      KeyType: 'API_KEY'
    });
  });

  it('handles different environment names correctly', () => {
    const environments = ['dev', 'staging', 'prod', 'test'];

    environments.forEach((env, index) => {
      // Arrange - create fresh app and stack for each environment
      const testApp = new cdk.App();
      const testStack = new cdk.Stack(testApp, `TestStack${index}`);

      // Act
      const api = new Api(testStack, 'TestApi', { environmentName: env });
      const rootResource = api.createRootResource('api');

      // Add a simple mock method to make API valid
      rootResource.addMethod(
        'GET',
        new apiGateway.MockIntegration({
          requestTemplates: {
            'application/json': '{"statusCode": 200}'
          },
          integrationResponses: [
            {
              statusCode: '200'
            }
          ]
        }),
        {
          methodResponses: [
            {
              statusCode: '200'
            }
          ]
        }
      );

      // Assert
      const template = Template.fromStack(testStack);

      template.hasResourceProperties('AWS::ApiGateway::RestApi', {
        Name: `HabitTrackingApi-${env}`,
        Description: `Habit Tracking API for ${env}`
      });

      template.hasResourceProperties('AWS::ApiGateway::Stage', {
        StageName: env
      });
    });
  });
});

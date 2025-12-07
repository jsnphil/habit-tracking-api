import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { beforeEach, describe, it, expect } from 'vitest';
import { HabitTrackingApiStack } from './habit-tracking-api-stack';

describe('HabitTrackingApiStack', () => {
  let app: cdk.App;

  beforeEach(() => {
    app = new cdk.App();
  });

  it('creates stack with correct environment name', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'HabitTrackingApi-test',
      Description: 'Habit Tracking API for test'
    });
  });

  it('creates stack with default environment name when not provided', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack');

    // Assert
    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'HabitTrackingApi-dev',
      Description: 'Habit Tracking API for dev'
    });
  });

  it('creates API key for habit-tracking-test-client', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'prod'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: 'habit-tracking-test-client',
      Description: 'API Key for habit-tracking-test-client'
    });
  });

  it('creates correct API resource hierarchy', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    // Should have the root resource 'habit-tracking'
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'habit-tracking'
    });
    
    // Should have the 'habits' resource under habit-tracking
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'habits'
    });
    
    // Should have the '{habitId}' resource under habits
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{habitId}'
    });
  });

  it('creates all five CRUD endpoints with correct HTTP methods', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    // Should have POST method for creating habits
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST'
    });
    
    // Should have GET methods for reading habits (2 endpoints)
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET'
    });
    
    // Should have DELETE method for deleting habits
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'DELETE'
    });
    
    // Should have PATCH method for updating habits
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'PATCH'
    });
    
    // Should have exactly 5 methods total (POST, 2xGET, DELETE, PATCH)
    template.resourceCountIs('AWS::ApiGateway::Method', 5);
  });

  it('creates Lambda functions for each endpoint', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    // Should have 5 Lambda functions (one for each endpoint)
    template.resourceCountIs('AWS::Lambda::Function', 5);
    
    // All Lambda functions should use Node.js 22.x runtime
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs22.x',
      Handler: 'index.handler'
    });
  });

  it('configures API key requirements correctly', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    // POST, DELETE, and PATCH methods should require API keys (3 methods)
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ApiKeyRequired: true
    });
    
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'DELETE',
      ApiKeyRequired: true
    });
    
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'PATCH',
      ApiKeyRequired: true
    });
  });

  it('creates usage plan with API key integration', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {
      Throttle: {
        RateLimit: 10,
        BurstLimit: 2
      }
    });
    
    // Should have usage plan key that links API key to usage plan
    template.hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
      KeyType: 'API_KEY'
    });
  });

  it('creates deployment with correct stage configuration', () => {
    // Arrange
    const environmentName = 'staging';
    
    // Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName
    });

    // Assert
    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: environmentName,
      MethodSettings: Match.arrayWith([
        Match.objectLike({
          LoggingLevel: 'INFO',
          DataTraceEnabled: true
        })
      ])
    });
  });

  it('creates exactly one REST API per stack', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
  });

  it('handles different environment names correctly', () => {
    const environments = ['dev', 'staging', 'prod', 'test'];
    
    environments.forEach((env, index) => {
      // Arrange - create fresh app and stack for each environment
      const testApp = new cdk.App();
      const testStack = new HabitTrackingApiStack(testApp, `TestStack${index}`, { 
        environmentName: env 
      });
      
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

  it('creates log groups for all Lambda functions', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    // Should have 5 log groups (one for each Lambda function)
    template.resourceCountIs('AWS::Logs::LogGroup', 5);
    
    // All log groups should have one week retention
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: 7
    });
  });

  it('creates Lambda integrations for all API Gateway methods', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    // Each method should be integrated with its corresponding Lambda function
    // This is implicit in CDK when using LambdaIntegration, but we can verify
    // that all Lambda functions have the proper permissions
    // Note: CDK may create multiple permissions per Lambda for different API Gateway stages
    template.resourceCountIs('AWS::Lambda::Permission', 10);
    
    // Each Lambda permission should be for API Gateway invoke
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'apigateway.amazonaws.com'
    });
  });

  it('configures Lambda functions with correct environment variables', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'prod'
    });

    // Assert
    const template = Template.fromStack(stack);
    
    // All Lambda functions should have PowerTools environment variables
    template.hasResourceProperties('AWS::Lambda::Function', 
      Match.objectLike({
        Environment: Match.objectLike({
          Variables: Match.objectLike({
            POWERTOOLS_LOG_LEVEL: 'DEBUG',
            AWS_RETRY_MODE: 'standard',
            AWS_MAX_ATTEMPTS: '5',
            POWERTOOLS_LOGGER_LOG_EVENT: 'true'
          })
        })
      })
    );
  });

  it('creates resource count validation for complete stack', () => {
    // Arrange & Act
    const stack = new HabitTrackingApiStack(app, 'TestStack', {
      environmentName: 'test'
    });

    // Assert - Verify the complete resource counts for the stack
    const template = Template.fromStack(stack);
    
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
    template.resourceCountIs('AWS::ApiGateway::Resource', 3); // habit-tracking, habits, {habitId}
    template.resourceCountIs('AWS::ApiGateway::Method', 5); // POST, GET, GET, DELETE, PATCH
    template.resourceCountIs('AWS::Lambda::Function', 5); // One for each endpoint
    template.resourceCountIs('AWS::ApiGateway::UsagePlan', 1);
    template.resourceCountIs('AWS::ApiGateway::ApiKey', 1);
    template.resourceCountIs('AWS::ApiGateway::UsagePlanKey', 1);
    template.resourceCountIs('AWS::Logs::LogGroup', 5); // One for each Lambda
    template.resourceCountIs('AWS::Lambda::Permission', 10); // CDK creates multiple permissions per Lambda
  });
});
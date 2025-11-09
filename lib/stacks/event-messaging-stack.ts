import path = require('path');

import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import type { Construct } from 'constructs';

import { ARCHITECTURE, lambdaEnvironment, NODE_RUNTIME } from '../CDKConstructs';


export interface EventMessagingStackProps extends cdk.StackProps {
  readonly environmentName: string;
}

export class EventMessagingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EventMessagingStackProps) {
    super(scope, id, props);

    const bus = new events.EventBus(this, 'habit-track-event-bus', {
      eventBusName: `HabitTrack-EventBus-${props.environmentName}-primary`,
    });

    bus.archive('habit-track-event-archive-primary', {
      archiveName: `HabitTrackEventArchive-${props.environmentName}-primary`,
      eventPattern: {
        account: [cdk.Stack.of(this).account],
      },
      retention: cdk.Duration.days(365), // TODO Shorten this
    });

    new events.Rule(this, 'habit-track-event-logger-rule-primary', {
      description: 'Log all events',
      eventPattern: {
        region: ['us-east-1'],
      },
      eventBus: bus,
    });

    /* Event outbox */
    const eventTable = new ddb.Table(this, `habit-event-outbox`, {
      tableName: `habit-events-outbox-${props.environmentName}`,
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'pk',
        type: ddb.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      sortKey: {
        name: 'sk',
        type: ddb.AttributeType.STRING,
      },
      stream: ddb.StreamViewType.NEW_IMAGE,
      deletionProtection: props.environmentName === 'prod' || false,
      timeToLiveAttribute: 'ttl',
    });

    const eventStream = eventTable.tableStreamArn;

    const eventPublisherLambda = new nodeLambda.NodejsFunction(this, 'PublishEvents', {
      runtime: NODE_RUNTIME,
      handler: 'handler',
      entry: path.join(__dirname, '../../src/infrastructure/', 'event-publisher.ts'),
      bundling: {
        minify: false,
        externalModules: ['aws-sdk'],
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        ...lambdaEnvironment,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 2048,
      architecture: ARCHITECTURE,
    });

    eventTable.grantStreamRead(eventPublisherLambda);

    eventPublisherLambda.addEventSourceMapping('EventOutboxStreamMapping', {
      eventSourceArn: eventStream,
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 100,
      enabled: true,
    });
  }
}

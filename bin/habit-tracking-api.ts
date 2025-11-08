#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HabitTrackingStage } from './habit-tracking-stage';

const app = new cdk.App();

const environment = app.node.tryGetContext('environment') || 'dev';

const account = '101639835597';
const region = 'us-east-1';

new HabitTrackingStage(app, 'Dev', {
  environmentName: environment,
  env: {
    account,
    region
  }
});

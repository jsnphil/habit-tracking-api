import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { HabitTrackingApiStack } from '../lib/stacks/habit-tracking-api-stack';

export interface HabitTrackingStageProps extends cdk.StageProps {
  readonly environmentName: string;
}

export class HabitTrackingStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: HabitTrackingStageProps) {
    super(scope, id, props);

    const apiStack = new HabitTrackingApiStack(
      this,
      'HabitTrackingApiStack',
      props
    );

    cdk.Tags.of(this).add('environment', props.environmentName);
    cdk.Tags.of(apiStack).add('system', 'api');
    // cdk.Tags.of(dataMigration).add('system', 'data-migration');
  }
}

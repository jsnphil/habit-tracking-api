import { Logger } from '@aws-lambda-powertools/logger';
import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import type { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';

const logger = new Logger({ serviceName: 'event-publisher' });

const _eventBridgeClient = new EventBridgeClient({
  region: process.env.AWS_REGION,
});

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  logger.logEventIfEnabled(event);

  for (const record of event.Records) {
    const image = record.dynamodb?.NewImage;

    if (image) {
      const _event = unmarshall(image as Record<string, AttributeValue>);

      // Publish the event to EventBridge
    }

    // // Handle new item inserted
    // const newItem = record.dynamodb?.NewImage;
    // // Handle item modified
    // const updatedItem = record.dynamodb?.NewImage;
    // // Handle item removed
    // const removedItem = record.dynamodb?.OldImage;
    // console.log('Item removed:', removedItem);
  }
};

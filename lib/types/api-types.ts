import type * as apiGateway from 'aws-cdk-lib/aws-apigateway';

export type LambdaApiEndpointProps = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  id: string;
  parentPath: apiGateway.Resource;
  resourcePath: string;
  apiKeyRequired?: boolean;
  lambdaProps: {
    source: string;
    environment?: { [key: string]: string };
    timeout?: number;
    memorySize?: number;
  };
};

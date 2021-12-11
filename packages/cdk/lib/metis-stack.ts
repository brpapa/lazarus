import * as s3 from '@aws-cdk/aws-s3'
import * as sns from '@aws-cdk/aws-sns'
import * as subs from '@aws-cdk/aws-sns-subscriptions'
import * as sqs from '@aws-cdk/aws-sqs'
import * as cdk from '@aws-cdk/core'

export class MetisStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      stackName: 'metis',
    })

    const bucket = new s3.Bucket(this, 'StaticContentBucket', {
      bucketName: 'metis-public-static-content',
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    })

    // const queue = new sqs.Queue(this, 'AwsCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300),
    // })

    // const topic = new sns.Topic(this, 'AwsCdkTopic')

    // topic.addSubscription(new subs.SqsSubscription(queue))
  }
}

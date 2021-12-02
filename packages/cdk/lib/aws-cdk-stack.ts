import * as s3 from '@aws-cdk/aws-s3'
import * as sns from '@aws-cdk/aws-sns'
import * as subs from '@aws-cdk/aws-sns-subscriptions'
import * as sqs from '@aws-cdk/aws-sqs'
import * as cdk from '@aws-cdk/core'

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      stackName: 'metis',
    })

    const bucket = new s3.Bucket(this, 'MediaAssetsBucket', {
      bucketName: 'metis-media-static-content',
    })

    // const queue = new sqs.Queue(this, 'AwsCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300),
    // })

    // const topic = new sns.Topic(this, 'AwsCdkTopic')

    // topic.addSubscription(new subs.SqsSubscription(queue))
  }
}

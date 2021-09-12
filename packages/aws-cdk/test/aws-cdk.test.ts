import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as AwsCdk from '../lib/aws-cdk-stack'

test('s3 bucket is created', () => {
  const app = new cdk.App()
  const stack = new AwsCdk.AwsCdkStack(app, 'MetisStack')
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'))
})

// test('SQS Queue Created', () => {
//     const app = new cdk.App();
//     // WHEN
//     const stack = new AwsCdk.AwsCdkStack(app, 'MyTestStack');
//     // THEN
//     expectCDK(stack).to(haveResource("AWS::SQS::Queue",{
//       VisibilityTimeout: 300
//     }));
// });

// test('SNS Topic Created', () => {
//   const app = new cdk.App();
//   // WHEN
//   const stack = new AwsCdk.AwsCdkStack(app, 'MyTestStack');
//   // THEN
//   expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
// });

import { SynthUtils } from '@aws-cdk/assert'

import * as cdk from '@aws-cdk/core'
import { CdkStack } from '../lib/cdk-stack'

test('Snapshot Test', () => {
  const account: string = '000000000000'
  const region: string = 'ap-northeast-1'
  const context: any = {
    description: 'description',
    iam: 'account-id',
    s3: [
      {
        bucketName: 'storybook.test.p-s3-storybook',
        name: 'p-s3-storybook_Bucket',
      },
    ],
  }
  const app: cdk.App = new cdk.App({
    context: { env: 'Test', Test: JSON.stringify(context) },
  })
  const stack = new CdkStack(app, 'TestStack', {
    env: { account, region },
  })
  const cfn: any = SynthUtils.toCloudFormation(stack)
  expect(cfn).toMatchSnapshot()
})

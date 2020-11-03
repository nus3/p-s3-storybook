#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { CdkStack } from '../lib/cdk-stack'

const app = new cdk.App()
const env: string = app.node.tryGetContext('env') || 'Dev'
const cdkName: string = 'P-Storybook-S3'
const stackName: string = `${env}-${cdkName}`

// eslint-disable-next-line no-new
new CdkStack(app, stackName, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})

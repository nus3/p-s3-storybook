import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as iam from '@aws-cdk/aws-iam'
import { Duration } from '@aws-cdk/core'

interface s3Config {
  bucketName: string
  name: string
}

interface StageContext {
  iam: string
  description: string
  s3: s3Config[]
}

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const env: string = this.node.tryGetContext('env') || 'Dev'
    const revision: string = this.node.tryGetContext('revision') || ''

    const context: StageContext =
      env === 'Test'
        ? JSON.parse(this.node.tryGetContext(env))
        : this.node.tryGetContext(env)

    this.validateEnvironment(env, revision, context)

    this.createS3Buckets(context)
  }

  private validateEnvironment(
    env: string,
    revision: string,
    context: StageContext
  ): void {
    if (!context.s3) {
      throw new Error(
        `error: invalid s3 context ${JSON.stringify({
          env,
          revision,
          context,
        })}`
      )
    }

    context.s3.forEach((config) => {
      if (!(config.name && config.bucketName)) {
        throw new Error(
          `error: invalid s3 context ${JSON.stringify({
            env,
            revision,
            context,
          })}`
        )
      }
    })
  }

  private createS3Buckets(context: StageContext): s3.Bucket[] {
    const buckets: s3.Bucket[] = []

    context.s3.forEach((config) => {
      const bucket: s3.Bucket = new s3.Bucket(this, config.name, {
        versioned: false,
        bucketName: config.bucketName,
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        lifecycleRules: [
          {
            expiration: Duration.days(14),
            prefix: 'branches/',
          },
        ],
        websiteIndexDocument: 'index.html',
      })

      const policyStatement: iam.PolicyStatement = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:ListBucket', 's3:PutObject', 's3:GetBucketAcl'],
        resources: [
          `arn:aws:s3:::${config.bucketName}`,
          `arn:aws:s3:::${config.bucketName}/*`,
        ],
        principals: [new iam.AccountPrincipal(context.iam)],
      })

      bucket.addToResourcePolicy(policyStatement)

      buckets.push(bucket)
    })

    return buckets
  }
}

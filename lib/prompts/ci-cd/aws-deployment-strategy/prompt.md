<prompt>
  <metadata>
    <id>aws-deployment-strategy</id>
    <name>AWS Deployment Strategy</name>
    <version>1.0.0</version>
    <description>Generate comprehensive AWS deployment strategies for serverless and containerized applications. Covers Lambda, ECS, CloudFormation/CDK, CI/CD pipelines, IAM security, and cost optimization.</description>
    <category>ci-cd</category>
    <author>codewizwit</author>
    <license>MIT</license>
    <tags>
      <tag>aws</tag>
      <tag>deployment</tag>
      <tag>serverless</tag>
      <tag>lambda</tag>
      <tag>cloudformation</tag>
      <tag>cdk</tag>
      <tag>ci-cd</tag>
      <tag>infrastructure</tag>
    </tags>
    <lastUpdated>2025-12-01</lastUpdated>
  </metadata>

  <variables>
    <variable name="application_type" required="true">Type of application (serverless API, containerized service, static site, full-stack)</variable>
    <variable name="tech_stack" required="true">Technologies used (Node.js, Python, .NET, containers, etc.)</variable>
    <variable name="deployment_tool" required="false" default="cdk">Infrastructure tool preference (CloudFormation, CDK, Terraform, SAM)</variable>
    <variable name="environments" required="false" default="dev,staging,prod">Target environments</variable>
    <variable name="requirements" required="false">Specific requirements (compliance, cost constraints, performance)</variable>
  </variables>

  <examples>
    <example>
      <title>Serverless API Deployment</title>
      <input>
Application type: Serverless REST API
Tech stack: Node.js 20, TypeScript, API Gateway, Lambda, DynamoDB
Deployment tool: AWS CDK
Environments: dev, staging, prod
Requirements: Low latency, cost-effective, HIPAA compliance considerations
      </input>
      <output>
# AWS Deployment Strategy: Serverless REST API

## Overview

This deployment strategy provides a production-ready serverless architecture for a Node.js REST API using AWS Lambda, API Gateway, and DynamoDB with AWS CDK for infrastructure as code.

## Architecture Diagram

```
                    ┌─────────────────┐
                    │   Route 53      │
                    │   (DNS)         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   CloudFront    │
                    │   (CDN/WAF)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │   (REST API)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐ ┌────▼────┐ ┌──────▼──────┐
     │ Lambda         │ │ Lambda  │ │ Lambda      │
     │ (Auth)         │ │ (CRUD)  │ │ (Reports)   │
     └────────┬───────┘ └────┬────┘ └──────┬──────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │   DynamoDB      │
                    │   (Database)    │
                    └─────────────────┘
```

## Infrastructure as Code (CDK)

### Project Structure

```
infrastructure/
├── bin/
│   └── app.ts                 # CDK app entry point
├── lib/
│   ├── stacks/
│   │   ├── api-stack.ts       # API Gateway + Lambda
│   │   ├── database-stack.ts  # DynamoDB tables
│   │   ├── monitoring-stack.ts # CloudWatch dashboards
│   │   └── pipeline-stack.ts  # CI/CD pipeline
│   ├── constructs/
│   │   ├── lambda-function.ts # Reusable Lambda construct
│   │   └── api-endpoint.ts    # API endpoint construct
│   └── config/
│       └── environments.ts    # Environment configs
├── cdk.json
└── package.json
```

### API Stack Implementation

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

/**
 * Configuration for the API stack
 */
interface ApiStackProps extends cdk.StackProps {
  environment: 'dev' | 'staging' | 'prod';
  tableName: string;
}

/**
 * API Stack - Lambda functions and API Gateway
 */
export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const isProd = props.environment === 'prod';

    /**
     * Lambda function with optimized settings
     */
    const apiHandler = new lambda.Function(this, 'ApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../dist/lambda'),
      memorySize: isProd ? 1024 : 512,
      timeout: cdk.Duration.seconds(29),
      environment: {
        NODE_ENV: props.environment,
        TABLE_NAME: props.tableName,
        LOG_LEVEL: isProd ? 'info' : 'debug',
      },
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_MONTH,
      reservedConcurrentExecutions: isProd ? 100 : 10,
    });

    /**
     * API Gateway with request validation
     */
    this.api = new apigateway.RestApi(this, 'Api', {
      restApiName: `api-${props.environment}`,
      description: `REST API for ${props.environment}`,
      deployOptions: {
        stageName: props.environment,
        throttlingRateLimit: isProd ? 1000 : 100,
        throttlingBurstLimit: isProd ? 2000 : 200,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: !isProd,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    /**
     * Lambda integration with proxy
     */
    const lambdaIntegration = new apigateway.LambdaIntegration(apiHandler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    const items = this.api.root.addResource('items');
    items.addMethod('GET', lambdaIntegration);
    items.addMethod('POST', lambdaIntegration);

    const item = items.addResource('{id}');
    item.addMethod('GET', lambdaIntegration);
    item.addMethod('PUT', lambdaIntegration);
    item.addMethod('DELETE', lambdaIntegration);
  }
}
```

### Database Stack

```typescript
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

/**
 * Database Stack - DynamoDB tables
 */
export class DatabaseStack extends cdk.Stack {
  public readonly table: dynamodb.Table;

  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps & { environment: string }
  ) {
    super(scope, id, props);

    const isProd = props.environment === 'prod';

    /**
     * Main DynamoDB table with on-demand billing
     */
    this.table = new dynamodb.Table(this, 'MainTable', {
      tableName: `app-${props.environment}`,
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: isProd,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: isProd
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
    });

    /**
     * Global Secondary Index for queries by type
     */
    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test -- --coverage

      - name: Run linting
        run: pnpm lint

      - name: Build application
        run: pnpm build

  deploy-dev:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: development
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN_DEV }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build Lambda
        run: pnpm build:lambda

      - name: Deploy CDK
        run: |
          cd infrastructure
          npx cdk deploy --all --require-approval never \
            -c environment=dev

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN_STAGING }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy to Staging
        run: |
          pnpm install --frozen-lockfile
          pnpm build:lambda
          cd infrastructure
          npx cdk deploy --all --require-approval never \
            -c environment=staging

  deploy-prod:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN_PROD }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy to Production
        run: |
          pnpm install --frozen-lockfile
          pnpm build:lambda
          cd infrastructure
          npx cdk deploy --all --require-approval never \
            -c environment=prod
```

## IAM Security

### Least Privilege Lambda Role

```typescript
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Create least-privilege IAM role for Lambda
 */
const lambdaRole = new iam.Role(this, 'LambdaRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  description: 'Role for API Lambda function',
});

/**
 * CloudWatch Logs permissions
 */
lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents',
    ],
    resources: [
      `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/*`,
    ],
  })
);

/**
 * DynamoDB permissions - scoped to specific table
 */
lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'dynamodb:GetItem',
      'dynamodb:PutItem',
      'dynamodb:UpdateItem',
      'dynamodb:DeleteItem',
      'dynamodb:Query',
      'dynamodb:Scan',
    ],
    resources: [table.tableArn, `${table.tableArn}/index/*`],
  })
);

/**
 * X-Ray tracing permissions
 */
lambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
    resources: ['*'],
  })
);
```

### GitHub Actions OIDC Role

```typescript
/**
 * OIDC provider for GitHub Actions
 */
const githubProvider = new iam.OpenIdConnectProvider(this, 'GithubProvider', {
  url: 'https://token.actions.githubusercontent.com',
  clientIds: ['sts.amazonaws.com'],
});

/**
 * Deployment role for GitHub Actions
 */
const deployRole = new iam.Role(this, 'GithubActionsRole', {
  assumedBy: new iam.WebIdentityPrincipal(
    githubProvider.openIdConnectProviderArn,
    {
      StringEquals: {
        'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
      },
      StringLike: {
        'token.actions.githubusercontent.com:sub': 'repo:org/repo:*',
      },
    }
  ),
  maxSessionDuration: cdk.Duration.hours(1),
});

/**
 * CDK deployment permissions
 */
deployRole.addManagedPolicy(
  iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess')
);
```

## Cost Optimization

### Lambda Optimization Settings

| Setting                 | Dev    | Staging | Prod    | Rationale                  |
| ----------------------- | ------ | ------- | ------- | -------------------------- |
| Memory                  | 512 MB | 512 MB  | 1024 MB | Higher memory = faster CPU |
| Timeout                 | 29s    | 29s     | 29s     | API Gateway limit          |
| Reserved Concurrency    | 10     | 50      | 100     | Prevent runaway costs      |
| Provisioned Concurrency | 0      | 0       | 5       | Cold start mitigation      |

### Cost Estimation

| Resource    | Dev (monthly) | Staging     | Prod         |
| ----------- | ------------- | ----------- | ------------ |
| Lambda      | $5-10         | $20-50      | $100-500     |
| API Gateway | $3-5          | $10-20      | $50-200      |
| DynamoDB    | $1-5          | $5-20       | $25-100      |
| CloudWatch  | $5-10         | $10-20      | $30-50       |
| **Total**   | **$15-30**    | **$45-110** | **$205-850** |

### Cost Reduction Tips

1. **Use ARM64 Lambda** - 20% cheaper, often faster
2. **Enable DynamoDB on-demand** - Pay per request, no over-provisioning
3. **Set up billing alerts** - Catch runaway costs early
4. **Review CloudWatch log retention** - 30 days is usually sufficient
5. **Use Lambda Powertools** - Efficient logging reduces costs

## Monitoring & Alerting

### CloudWatch Dashboard

```typescript
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

/**
 * Create operational dashboard
 */
const dashboard = new cloudwatch.Dashboard(this, 'Dashboard', {
  dashboardName: `api-${environment}`,
});

dashboard.addWidgets(
  new cloudwatch.GraphWidget({
    title: 'Lambda Invocations',
    left: [apiHandler.metricInvocations()],
  }),
  new cloudwatch.GraphWidget({
    title: 'Lambda Errors',
    left: [apiHandler.metricErrors()],
  }),
  new cloudwatch.GraphWidget({
    title: 'Lambda Duration',
    left: [apiHandler.metricDuration()],
  }),
  new cloudwatch.GraphWidget({
    title: 'API Gateway 4xx/5xx',
    left: [api.metricClientError(), api.metricServerError()],
  })
);
```

### Alarms

```typescript
/**
 * Error rate alarm
 */
new cloudwatch.Alarm(this, 'ErrorAlarm', {
  metric: apiHandler.metricErrors({
    period: cdk.Duration.minutes(5),
    statistic: 'Sum',
  }),
  threshold: 10,
  evaluationPeriods: 2,
  alarmDescription: 'Lambda error rate exceeded threshold',
  actionsEnabled: true,
});

/**
 * Duration alarm
 */
new cloudwatch.Alarm(this, 'DurationAlarm', {
  metric: apiHandler.metricDuration({
    period: cdk.Duration.minutes(5),
    statistic: 'p99',
  }),
  threshold: 5000,
  evaluationPeriods: 3,
  alarmDescription: 'Lambda p99 duration exceeded 5 seconds',
});
```

## HIPAA Compliance Considerations

| Requirement           | Implementation                        |
| --------------------- | ------------------------------------- |
| Encryption at rest    | DynamoDB AWS-managed encryption       |
| Encryption in transit | HTTPS only via API Gateway            |
| Access logging        | CloudTrail + API Gateway access logs  |
| Audit trail           | CloudWatch Logs with 1-year retention |
| Data backup           | DynamoDB Point-in-Time Recovery       |
| Access control        | IAM roles with least privilege        |
| BAA                   | Ensure AWS BAA is signed              |

      </output>
    </example>

    <example>
      <title>Containerized Microservice Deployment</title>
      <input>

Application type: Containerized microservice
Tech stack: NestJS, TypeScript, PostgreSQL, Redis
Deployment tool: AWS CDK
Environments: dev, prod
Requirements: Auto-scaling, blue-green deployments
</input>
<output>

# AWS Deployment Strategy: Containerized Microservice

## Overview

This deployment strategy provides a production-ready containerized architecture for a NestJS microservice using AWS ECS Fargate with RDS PostgreSQL and ElastiCache Redis.

## Architecture Diagram

```
                    ┌─────────────────┐
                    │   Route 53      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   ALB           │
                    │   (Load Balancer)│
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐          ┌────────▼────────┐
     │   ECS Fargate   │          │   ECS Fargate   │
     │   (Service A)   │          │   (Service B)   │
     └────────┬────────┘          └────────┬────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐ ┌────▼────┐ ┌──────▼──────┐
     │   RDS          │ │ ElastiCache│ │ Secrets   │
     │   (PostgreSQL) │ │ (Redis)    │ │ Manager   │
     └────────────────┘ └───────────┘ └────────────┘
```

## ECS Fargate Stack

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

/**
 * ECS Fargate Stack with ALB
 */
export class EcsStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps & {
      environment: string;
      vpc: ec2.IVpc;
      dbEndpoint: string;
      redisEndpoint: string;
    }
  ) {
    super(scope, id, props);

    const isProd = props.environment === 'prod';

    /**
     * ECS Cluster
     */
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: props.vpc,
      containerInsights: true,
    });

    /**
     * ECR Repository
     */
    const repository = new ecr.Repository(this, 'Repository', {
      repositoryName: `app-${props.environment}`,
      imageScanOnPush: true,
      lifecycleRules: [
        {
          maxImageCount: 10,
          description: 'Keep only 10 images',
        },
      ],
    });

    /**
     * Fargate Service with ALB
     */
    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'Service',
      {
        cluster,
        cpu: isProd ? 1024 : 512,
        memoryLimitMiB: isProd ? 2048 : 1024,
        desiredCount: isProd ? 2 : 1,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(repository),
          containerPort: 3000,
          environment: {
            NODE_ENV: props.environment,
            DB_HOST: props.dbEndpoint,
            REDIS_HOST: props.redisEndpoint,
          },
          secrets: {
            DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret),
          },
        },
        publicLoadBalancer: true,
        circuitBreaker: { rollback: true },
        deploymentController: {
          type: ecs.DeploymentControllerType.ECS,
        },
      }
    );

    /**
     * Auto-scaling configuration
     */
    const scaling = service.service.autoScaleTaskCount({
      minCapacity: isProd ? 2 : 1,
      maxCapacity: isProd ? 10 : 3,
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
    });

    /**
     * Health check configuration
     */
    service.targetGroup.configureHealthCheck({
      path: '/health',
      healthyHttpCodes: '200',
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
    });
  }
}
```

## Blue-Green Deployment

```typescript
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';

/**
 * Blue-Green deployment with CodeDeploy
 */
const deploymentGroup = new codedeploy.EcsDeploymentGroup(
  this,
  'DeploymentGroup',
  {
    service: service.service,
    blueGreenDeploymentConfig: {
      blueTargetGroup: service.targetGroup,
      greenTargetGroup: greenTargetGroup,
      listener: service.listener,
      testListener: testListener,
    },
    deploymentConfig:
      codedeploy.EcsDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTES,
    autoRollback: {
      failedDeployment: true,
      stoppedDeployment: true,
      deploymentInAlarm: true,
    },
    alarms: [errorAlarm, latencyAlarm],
  }
);
```

## Database Stack (RDS)

```typescript
import * as rds from 'aws-cdk-lib/aws-rds';

/**
 * RDS PostgreSQL with Multi-AZ for production
 */
const database = new rds.DatabaseInstance(this, 'Database', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_15,
  }),
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    isProd ? ec2.InstanceSize.MEDIUM : ec2.InstanceSize.MICRO
  ),
  vpc: props.vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  multiAz: isProd,
  allocatedStorage: 20,
  maxAllocatedStorage: 100,
  storageEncrypted: true,
  deletionProtection: isProd,
  backupRetention: cdk.Duration.days(isProd ? 30 : 7),
  credentials: rds.Credentials.fromGeneratedSecret('dbadmin'),
});
```

## Deployment Strategies Comparison

| Strategy    | Downtime | Rollback Speed | Cost   | Use Case     |
| ----------- | -------- | -------------- | ------ | ------------ |
| Rolling     | None     | Slow           | Low    | Dev/staging  |
| Blue-Green  | None     | Instant        | High   | Production   |
| Canary      | None     | Fast           | Medium | High-traffic |
| All-at-once | Brief    | Manual         | Low    | Testing      |

      </output>
    </example>

    <example>
      <title>Static Site with CDN</title>
      <input>

Application type: Static site (Angular SPA)
Tech stack: Angular 17, TypeScript
Deployment tool: AWS CDK
Environments: dev, prod
Requirements: Global CDN, custom domain, HTTPS
</input>
<output>

# AWS Deployment Strategy: Static Site with CDN

## Overview

This deployment strategy provides a globally distributed static site architecture using S3, CloudFront, and Route 53 for an Angular SPA.

## Architecture Diagram

```
                    ┌─────────────────┐
                    │   Route 53      │
                    │   (DNS)         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   CloudFront    │
                    │   (Global CDN)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   S3 Bucket     │
                    │   (Static Files)│
                    └─────────────────┘
```

## Static Site Stack

```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

/**
 * Static Site Stack with CloudFront CDN
 */
export class StaticSiteStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps & {
      domainName: string;
      environment: string;
    }
  ) {
    super(scope, id, props);

    const isProd = props.environment === 'prod';
    const siteDomain = isProd
      ? props.domainName
      : `${props.environment}.${props.domainName}`;

    /**
     * S3 bucket for static files (private, CloudFront access only)
     */
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${siteDomain}-site`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: isProd
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
    });

    /**
     * SSL Certificate (must be in us-east-1 for CloudFront)
     */
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: siteDomain,
      validation: acm.CertificateValidation.fromDns(),
    });

    /**
     * CloudFront Origin Access Identity
     */
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'OAI'
    );
    siteBucket.grantRead(originAccessIdentity);

    /**
     * CloudFront Distribution
     */
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket, { originAccessIdentity }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      domainNames: [siteDomain],
      certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: isProd
        ? cloudfront.PriceClass.PRICE_CLASS_ALL
        : cloudfront.PriceClass.PRICE_CLASS_100,
    });

    /**
     * Route 53 DNS record
     */
    const hostedZone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: props.domainName,
    });

    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    /**
     * Deploy site content
     */
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('../dist/browser')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
```

## GitHub Actions for Static Site

```yaml
name: Deploy Static Site

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install and Build
        run: |
          pnpm install --frozen-lockfile
          pnpm build --configuration production

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - name: Deploy to S3 and Invalidate CloudFront
        run: |
          aws s3 sync dist/browser s3://${{ vars.S3_BUCKET }} --delete
          aws cloudfront create-invalidation \
            --distribution-id ${{ vars.CF_DISTRIBUTION_ID }} \
            --paths "/*"
```

## Performance Optimization

| Optimization   | Implementation           | Impact                |
| -------------- | ------------------------ | --------------------- |
| Gzip/Brotli    | CloudFront compression   | 60-80% size reduction |
| Cache headers  | 1 year for hashed assets | Instant repeat loads  |
| Edge locations | PriceClass.ALL for prod  | <50ms global latency  |
| HTTP/2         | Enabled by default       | Multiplexed requests  |

      </output>
    </example>

  </examples>

  <context>
You are an AWS solutions architect specializing in serverless and containerized deployments. You understand:
- AWS services (Lambda, ECS, S3, CloudFront, API Gateway, DynamoDB, RDS)
- Infrastructure as Code (CDK, CloudFormation, Terraform, SAM)
- CI/CD pipelines with GitHub Actions and AWS CodePipeline
- IAM security and least-privilege principles
- Cost optimization strategies
- Compliance requirements (HIPAA, SOC2, PCI-DSS)
- Monitoring and observability (CloudWatch, X-Ray)
  </context>

  <instructions>
Generate comprehensive AWS deployment strategies following this structure:

## 1. Architecture Overview

- Clear description of the deployment architecture
- ASCII diagram showing component relationships
- Technology choices with rationale

## 2. Infrastructure as Code

- Complete CDK/CloudFormation code examples
- Project structure recommendations
- Environment-specific configurations
- Reusable constructs for common patterns

## 3. CI/CD Pipeline

- GitHub Actions workflow (or preferred CI tool)
- Environment promotion strategy
- Deployment gates and approvals
- Rollback procedures

## 4. Security Configuration

- IAM roles with least privilege
- Secrets management
- Network security (VPC, security groups)
- Encryption at rest and in transit

## 5. Cost Optimization

- Resource sizing recommendations by environment
- Cost estimation table
- Cost reduction strategies
- Billing alerts setup

## 6. Monitoring & Alerting

- CloudWatch dashboards
- Key metrics to track
- Alarm configurations
- Logging strategy

## 7. Compliance (if applicable)

- Compliance requirement mapping
- Implementation checklist
- Audit trail configuration
  </instructions>

  <constraints>

- Use TypeScript CDK examples (preferred over CloudFormation YAML)
- Include complete, working code examples
- Follow AWS Well-Architected Framework principles
- Use least-privilege IAM permissions
- Include cost estimates where possible
- Provide environment-specific configurations (dev/staging/prod)
- Use GitHub Actions OIDC for authentication (no long-lived credentials)
- Include health checks and monitoring
  </constraints>

  <output_format>

# AWS Deployment Strategy: [Application Type]

## Overview

[Description of the architecture and key decisions]

## Architecture Diagram

```
[ASCII diagram of architecture]
```

## Infrastructure as Code

### Project Structure

```
[Directory structure]
```

### [Stack Name]

```typescript
[Complete CDK code with TypeDoc comments]
```

## CI/CD Pipeline

```yaml
[GitHub Actions workflow]
```

## IAM Security

```typescript
[IAM role and policy definitions]
```

## Cost Optimization

| Resource   | Dev | Staging | Prod |
| ---------- | --- | ------- | ---- |
| [Resource] | $X  | $Y      | $Z   |

## Monitoring & Alerting

```typescript
[CloudWatch dashboard and alarm configuration]
```

## [Compliance Type] Compliance (if applicable)

| Requirement   | Implementation       |
| ------------- | -------------------- |
| [Requirement] | [How it's addressed] |

</output_format>
</prompt>

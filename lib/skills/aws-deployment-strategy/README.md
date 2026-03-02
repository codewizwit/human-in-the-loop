# AWS Deployment Strategy

Generates production-ready AWS deployment strategies covering architecture design, infrastructure as code (CDK/CloudFormation), CI/CD pipelines, IAM security, cost optimization, and monitoring. Supports serverless (Lambda, API Gateway, DynamoDB), containerized (ECS Fargate, RDS), and static site (S3, CloudFront) application patterns with complete, working code examples.

## What You'll Be Asked

- **Application type**: Serverless API, containerized service, static site, or full-stack
- **Tech stack**: Node.js, Python, .NET, or other
- **IaC tool**: CDK, CloudFormation, Terraform, or SAM
- **Environments**: Dev/Prod, Dev/Staging/Prod, or custom

## Usage Examples

### Serverless API Deployment

> "Deploy a Node.js REST API to AWS using Lambda, API Gateway, and DynamoDB"

Produces a complete CDK stack with API Gateway, Lambda functions, and DynamoDB tables; GitHub Actions workflow with multi-environment promotion; least-privilege IAM roles; and cost estimates.

### Containerized Microservice

> "Set up ECS Fargate deployment with PostgreSQL for our NestJS service"

Generates ECS Fargate configuration with ALB, auto-scaling, blue-green deployments; RDS PostgreSQL with Multi-AZ; ECR image pipeline; and monitoring dashboards.

### Static Site with Global CDN

> "Deploy our Angular SPA to S3 with CloudFront and a custom domain"

Creates S3 bucket with CloudFront distribution, Route 53 DNS, SSL certificate, cache invalidation workflow, and performance optimization recommendations.

## Key Features

- Complete CDK TypeScript code examples ready to use as starting points
- GitHub Actions CI/CD with OIDC authentication (no long-lived credentials)
- Environment-specific configurations for dev, staging, and production
- Cost estimation tables with optimization strategies
- CloudWatch dashboard and alarm configurations
- Compliance mapping for HIPAA, SOC2, and PCI-DSS

## Installation

```bash
hit install aws-deployment-strategy
```

## Related Resources

- [System Design Review](../system-design-review/) - For reviewing the overall architecture
- [Pipeline Optimization](../pipeline-optimization/) - For optimizing existing CI/CD pipelines
- [E2E Testing Strategy](../e2e-strategy/) - For testing deployed infrastructure

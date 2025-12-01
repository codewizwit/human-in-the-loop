# AWS Deployment Strategy

Generate comprehensive AWS deployment strategies for serverless and containerized applications. Covers Lambda, ECS, CloudFormation/CDK, CI/CD pipelines, IAM security, and cost optimization.

## What It Does

- **Generates** complete AWS deployment architectures
- **Includes** CDK infrastructure code with TypeDoc comments
- **Provides** CI/CD pipelines with GitHub Actions
- **Covers** security, cost optimization, and monitoring

## What You'll Be Asked

When using this prompt, you'll need to provide:

1. **Application Type** (required) - Serverless API, containerized service, static site, or full-stack
2. **Tech Stack** (required) - Languages and frameworks (Node.js, Python, NestJS, Angular, etc.)
3. **Deployment Tool** (optional) - CDK, CloudFormation, Terraform, or SAM (default: CDK)
4. **Environments** (optional) - Target environments (default: dev, staging, prod)
5. **Requirements** (optional) - Compliance, cost constraints, performance needs

## Architecture Types

| Type               | AWS Services                  | Use Case                             |
| ------------------ | ----------------------------- | ------------------------------------ |
| **Serverless API** | Lambda, API Gateway, DynamoDB | REST/GraphQL APIs, microservices     |
| **Containerized**  | ECS Fargate, ALB, RDS         | Complex services, legacy migrations  |
| **Static Site**    | S3, CloudFront, Route 53      | SPAs, marketing sites, documentation |
| **Full-Stack**     | Combination of above          | Complete applications                |

## Usage Examples

### Example 1: Serverless REST API

```
Application type: Serverless REST API
Tech stack: Node.js 20, TypeScript, API Gateway, Lambda, DynamoDB
Deployment tool: AWS CDK
Environments: dev, staging, prod
Requirements: Low latency, cost-effective, HIPAA compliance
```

**What You Get:**

- Architecture diagram with Lambda, API Gateway, DynamoDB
- Complete CDK stacks (API, Database, Monitoring)
- GitHub Actions workflow with OIDC authentication
- IAM roles with least-privilege permissions
- Cost estimation by environment
- CloudWatch dashboards and alarms
- HIPAA compliance checklist

### Example 2: Containerized Microservice

```
Application type: Containerized microservice
Tech stack: NestJS, TypeScript, PostgreSQL, Redis
Deployment tool: AWS CDK
Environments: dev, prod
Requirements: Auto-scaling, blue-green deployments
```

**What You Get:**

- ECS Fargate with Application Load Balancer
- RDS PostgreSQL with Multi-AZ for production
- ElastiCache Redis for caching
- Blue-green deployment with CodeDeploy
- Auto-scaling configuration
- Health checks and circuit breakers

### Example 3: Angular Static Site

```
Application type: Static site (Angular SPA)
Tech stack: Angular 17, TypeScript
Deployment tool: AWS CDK
Environments: dev, prod
Requirements: Global CDN, custom domain, HTTPS
```

**What You Get:**

- S3 bucket with CloudFront CDN
- ACM certificate for HTTPS
- Route 53 DNS configuration
- Cache invalidation on deploy
- SPA routing (404 → index.html)
- Performance optimization settings

## Deployment Strategies

| Strategy        | Downtime | Rollback | Cost   | Best For     |
| --------------- | -------- | -------- | ------ | ------------ |
| **Rolling**     | None     | Slow     | Low    | Dev/Staging  |
| **Blue-Green**  | None     | Instant  | High   | Production   |
| **Canary**      | None     | Fast     | Medium | High-traffic |
| **All-at-once** | Brief    | Manual   | Low    | Testing      |

## Security Best Practices

Every strategy includes:

- **OIDC Authentication** - No long-lived AWS credentials in CI/CD
- **Least Privilege IAM** - Scoped permissions per resource
- **Secrets Management** - AWS Secrets Manager for sensitive data
- **Encryption** - At rest and in transit
- **VPC Isolation** - Private subnets for databases

## Cost Optimization

| Tip                    | Savings  | Applies To       |
| ---------------------- | -------- | ---------------- |
| ARM64 Lambda           | 20%      | Serverless       |
| Spot Fargate           | 70%      | Containers (dev) |
| Reserved Capacity      | 30-60%   | Production DBs   |
| S3 Intelligent Tiering | Variable | Static assets    |
| Right-sizing           | 20-50%   | All resources    |

## Output Structure

Every deployment strategy includes:

1. **Architecture Diagram** - ASCII diagram of components
2. **CDK Stacks** - Complete TypeScript infrastructure code
3. **CI/CD Pipeline** - GitHub Actions workflow
4. **IAM Configuration** - Roles and policies
5. **Cost Estimation** - Monthly costs by environment
6. **Monitoring** - CloudWatch dashboards and alarms
7. **Compliance** (if applicable) - Requirement mapping

## Related Resources

- [Pipeline Optimization](../pipeline-optimization) - CI/CD pipeline improvements

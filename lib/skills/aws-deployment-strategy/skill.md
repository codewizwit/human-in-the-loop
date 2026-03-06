---
name: aws-deployment-strategy
description: >-
  Generates comprehensive AWS deployment strategies for serverless and
  containerized applications. Use when user asks to "deploy to AWS",
  "create deployment strategy", or mentions "AWS infrastructure".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion, EnterPlanMode
---

# AWS Deployment Strategy

Generates production-ready AWS deployment strategies covering architecture
design, infrastructure as code (CDK/CloudFormation), CI/CD pipelines, IAM
security, cost optimization, and monitoring. Supports serverless (Lambda, API
Gateway, DynamoDB), containerized (ECS Fargate, RDS), and static site
(S3, CloudFront) application patterns. Produces complete, working code examples
with environment-specific configurations.

## When to Activate

- User asks to deploy an application to AWS
- User mentions AWS infrastructure setup or cloud architecture
- User wants a CI/CD pipeline for AWS deployments
- User asks about serverless, ECS, Lambda, or CloudFormation strategy
- User needs cost optimization or security configuration for AWS

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What type of application are you deploying?</question>
<option value="serverless">Serverless API (Lambda, API Gateway, DynamoDB)</option>
<option value="container">Containerized service (ECS Fargate, RDS)</option>
<option value="static">Static site or SPA (S3, CloudFront)</option>
<option value="fullstack">Full-stack (combination of the above)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What is your tech stack?</question>
<option value="node">Node.js / TypeScript</option>
<option value="python">Python</option>
<option value="dotnet">.NET</option>
<option value="other">Other (please specify)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Which infrastructure as code tool do you prefer?</question>
<option value="cdk">AWS CDK (TypeScript)</option>
<option value="cloudformation">CloudFormation</option>
<option value="terraform">Terraform</option>
<option value="sam">AWS SAM</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Which environments do you need?</question>
<option value="dev-prod">Dev and Prod</option>
<option value="dev-staging-prod">Dev, Staging, and Prod</option>
<option value="custom">Custom environment setup</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For full-stack applications or multi-service architectures, enter plan mode:

<EnterPlanMode>
<summary>
Outline the deployment architecture, list AWS services to configure, identify
environment-specific requirements, and confirm security and compliance needs.
</summary>
</EnterPlanMode>

### Step 3: Discovery

1. Use Glob to find existing infrastructure files (CDK, Terraform, CloudFormation)
2. Read package.json, Dockerfile, or build configurations to understand the stack
3. Use Grep to identify existing AWS service references in the codebase
4. Check for existing CI/CD workflows (GitHub Actions, CodePipeline)
5. Identify compliance or security requirements from documentation

### Step 4: Strategy Generation

Generate the deployment strategy covering these areas:

**Architecture Overview**

- Clear description of the deployment architecture
- ASCII diagram showing component relationships
- Technology choices with rationale

**Infrastructure as Code**

- Complete CDK or CloudFormation code examples with TypeDoc comments
- Project structure recommendations
- Environment-specific configurations
- Reusable constructs for common patterns

**CI/CD Pipeline**

- GitHub Actions workflow with environment promotion
- Deployment gates and approval processes
- Rollback procedures and safety mechanisms

**Security Configuration**

- IAM roles with least-privilege permissions
- Secrets management strategy
- Network security (VPC, security groups)
- Encryption at rest and in transit
- OIDC authentication for CI/CD (no long-lived credentials)

**Cost Optimization**

- Resource sizing recommendations by environment
- Cost estimation table
- Cost reduction strategies and billing alerts

**Monitoring and Alerting**

- CloudWatch dashboards and key metrics
- Alarm configurations for error rates and latency
- Logging strategy and retention policies

**Compliance (if applicable)**

- Compliance requirement mapping (HIPAA, SOC2, PCI-DSS)
- Implementation checklist
- Audit trail configuration

### Step 5: Deliver Strategy

Write the complete deployment strategy to a markdown file in the workspace with
all code examples, diagrams, and configuration tables.

## Output Format

<output_format>
Write the AWS deployment strategy to a markdown file in the workspace. Structure
as follows:

**Overview**

Description of the architecture and key decisions.

**Architecture Diagram**

ASCII diagram showing component relationships and data flow.

**Infrastructure as Code**

Project structure followed by complete CDK/CloudFormation code with TypeDoc
comments for all exported constructs.

**CI/CD Pipeline**

Complete GitHub Actions workflow YAML with environment-specific jobs, OIDC
authentication, and deployment gates.

**IAM Security**

Least-privilege IAM role definitions with scoped permissions for each service.

**Cost Optimization**

Resource sizing table by environment with monthly cost estimates and reduction
strategies.

**Monitoring and Alerting**

CloudWatch dashboard and alarm configurations as CDK code.

**Compliance** (if applicable)

Requirement-to-implementation mapping table.
</output_format>

## Best Practices

- Use TypeScript CDK examples as the default infrastructure as code format
- Follow AWS Well-Architected Framework principles across all recommendations
- Apply least-privilege IAM permissions scoped to specific resources
- Use GitHub Actions OIDC for authentication instead of long-lived credentials
- Include environment-specific configurations for dev, staging, and production
- Provide complete, working code examples that can be used as starting points
- Include cost estimates and optimization strategies for each environment

## Anti-Patterns

- Do not use long-lived AWS access keys in CI/CD pipelines
- Do not grant overly broad IAM permissions (avoid wildcard resources in production)
- Do not skip staging environments for production deployments
- Do not deploy without health checks and rollback mechanisms
- Do not ignore cost monitoring and billing alerts
- Do not hardcode environment-specific values instead of using configuration

## Examples

### Example 1: Serverless API Deployment

**Input**: "Deploy a Node.js REST API to AWS using Lambda, API Gateway, and DynamoDB"

**Output**: Complete deployment strategy with CDK stacks for API Gateway, Lambda,
and DynamoDB; GitHub Actions workflow with dev/staging/prod promotion; IAM roles
with least-privilege DynamoDB and CloudWatch permissions; cost estimates by
environment; and CloudWatch dashboard with error and latency alarms.

### Example 2: Containerized Microservice

**Input**: "Set up ECS Fargate deployment with PostgreSQL for our NestJS service"

**Output**: ECS Fargate stack with ALB, auto-scaling, and blue-green deployment;
RDS PostgreSQL with Multi-AZ for production; GitHub Actions pipeline with ECR
image build; IAM roles scoped to ECS tasks; cost comparison of instance sizes;
and health check configurations.

### Example 3: Static Site with Global CDN

**Input**: "Deploy our Angular SPA to S3 with CloudFront and a custom domain"

**Output**: S3 bucket with CloudFront distribution stack; Route 53 DNS
configuration with SSL certificate; GitHub Actions workflow for build and
deploy with cache invalidation; performance optimization table; and cost
estimates for global CDN distribution.

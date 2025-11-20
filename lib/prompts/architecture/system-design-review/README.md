# System Design Review

Validates architectural decisions against best practices, scalability concerns, maintainability, and operational excellence. Provides comprehensive analysis of system design with trade-offs, alternatives, and actionable recommendations.

## Overview

This prompt conducts thorough architectural reviews across seven critical dimensions: Scalability & Performance, Reliability & Resilience, Security, Maintainability, Operational Excellence, Data Management, and Integration & Dependencies. It provides actionable feedback with prioritized recommendations, risk assessments, and alternative architectural approaches.

## When to Use This Prompt

Use this architectural review when:

- **Designing new systems** - Validate architecture before implementation
- **Scaling existing systems** - Identify bottlenecks and scaling strategies
- **Conducting architecture reviews** - Systematic evaluation against best practices
- **Making technology decisions** - Compare architectural alternatives with trade-offs
- **Preparing for growth** - Ensure system can handle increased load
- **Auditing technical debt** - Identify architectural weaknesses and improvements

## Usage

### Basic System Review

```yaml
system_description: |
  Real-time chat application for team collaboration with
  channels, direct messages, file sharing, and video calls.

requirements: |
  - Support 50,000 concurrent users
  - 99.99% uptime SLA
  - Sub-100ms message delivery
  - End-to-end encryption
  - Mobile and web clients

proposed_architecture: |
  Frontend: React Native (mobile) + React (web)
  Backend: Node.js with Socket.io for WebSocket connections
  Database: MongoDB for messages, Redis for presence/sessions
  File Storage: AWS S3
  Video: Twilio Video API
  Infrastructure: Kubernetes on AWS EKS
```

### System with Constraints

```yaml
system_description: |
  Healthcare patient portal for scheduling appointments,
  viewing medical records, and messaging providers.

requirements: |
  - HIPAA compliance required
  - Support 10,000 patients
  - 99.9% uptime
  - Audit logging for all data access
  - Mobile-first design

proposed_architecture: |
  Frontend: Next.js SSR application
  Backend: NestJS REST API
  Database: PostgreSQL with row-level security
  Cache: Redis for sessions
  Deployment: AWS with VPC isolation

constraints: |
  - Must be HIPAA compliant
  - Budget: $3,000/month
  - Team: 2 backend, 1 frontend developer
  - Timeline: 4 months to MVP
  - No cloud certifications (AWS training needed)

architecture_type: monolith
scale_requirements: 10,000 users, 500 appointments/day, US-only
```

### Microservices Architecture Review

```yaml
system_description: |
  Multi-tenant SaaS platform for project management with
  time tracking, invoicing, and team collaboration.

requirements: |
  - Support 1,000 organizations, 50,000 users
  - 99.95% uptime
  - Sub-2-second page loads
  - Multi-region deployment (US, EU)
  - SOC2 Type II compliance

proposed_architecture: |
  Microservices Architecture:
  - Auth Service (Node.js, PostgreSQL)
  - Projects Service (Node.js, MongoDB)
  - Time Tracking Service (Go, TimescaleDB)
  - Invoicing Service (Python, PostgreSQL)
  - Notifications Service (Node.js, RabbitMQ)

  API Gateway: Kong
  Service Mesh: Istio
  Deployment: Kubernetes multi-cluster (US-East, EU-West)
  Observability: Datadog, Jaeger

architecture_type: microservices
scale_requirements: 1,000 organizations, 50,000 users, 100K requests/min
```

## Examples

### Example 1: E-commerce Platform Review

**Before:**

```yaml
system_description: E-commerce platform for custom merchandise
requirements: 10,000 concurrent users, 99.9% uptime, sub-2s page loads
proposed_architecture: |
  React SPA on Vercel
  Node.js/Express monolith on AWS EC2
  Single PostgreSQL instance (t3.large)
  AWS S3 for images
  Stripe for payments
  No caching layer
```

**After (Key Findings):**

```markdown
## Executive Summary

**Assessment**: 🟡 Needs Improvement

The architecture provides a solid foundation but has critical scalability and reliability concerns.

**Top 3 Recommendations**:

1. 🔴 Add database replication (read replicas) to eliminate single point of failure
2. 🔴 Implement Redis caching layer for sessions and frequently accessed data
3. 🟡 Add CDN (CloudFront) for static assets

## Critical Issues

### Scalability & Performance

- 🔴 Single PostgreSQL instance cannot handle 10,000 concurrent users
- 🔴 No caching layer means every request hits database
- 🟡 Session state in PostgreSQL creates bottleneck

**Recommendations**:

- Deploy 2 PostgreSQL read replicas (+$200/month)
- Implement Redis caching for product catalog and sessions (+$50/month)
- Add CloudFront CDN for static assets (+$100/month)

### Reliability & Resilience

- 🔴 **Single Point of Failure**: PostgreSQL has no failover
- 🔴 Single EC2 instance creates availability risk

**Recommendations**:

- Enable RDS Multi-AZ deployment for automatic failover (+$150/month)
- Deploy minimum 2 EC2 instances across availability zones (+$200/month)
```

### Example 2: Real-time Chat Application

**Before:**

```yaml
system_description: Real-time team chat with channels and DMs
requirements: 50,000 concurrent users, <100ms latency, 99.99% uptime
proposed_architecture: |
  Node.js + Socket.io
  MongoDB for messages
  Redis for presence
  AWS EKS (Kubernetes)
```

**After (Key Findings):**

```markdown
## Executive Summary

**Assessment**: 🟢 Strong

Well-architected for real-time requirements with appropriate technology choices.

**Top 3 Recommendations**:

1. 💡 Implement message sharding by channel to distribute database load
2. 💡 Add Redis Cluster for horizontal scaling of presence data
3. 💡 Use Kafka for message persistence and audit trail

## Strengths

### Scalability & Performance

- ✅ WebSocket architecture appropriate for real-time messaging
- ✅ Redis excellent choice for presence and session management
- ✅ Kubernetes enables horizontal scaling

**Additional Optimizations**:

- Shard MongoDB by channel ID to distribute load
- Implement message pagination (load last 50 messages, lazy load history)
- Use connection pooling (sticky sessions for WebSocket)

### Reliability & Resilience

- ✅ Kubernetes provides automatic failover and self-healing
- ✅ Redis Sentinel can provide automatic failover

**Recommendations**:

- Deploy MongoDB as replica set (primary + 2 replicas)
- Use Redis Cluster instead of single instance for presence
- Implement circuit breakers for external services
```

### Example 3: Serverless Event-Driven System

**Before:**

```yaml
system_description: |
  Data processing pipeline for IoT sensor data
  Ingests 100K events/sec, processes, stores, and triggers alerts

proposed_architecture: |
  AWS Lambda for data processing
  Kinesis Data Streams for ingestion
  DynamoDB for storage
  SNS for alerting
  S3 for raw data archive
```

**After (Key Findings):**

```markdown
## Executive Summary

**Assessment**: 🟢 Strong

Excellent architecture for event-driven workload. Serverless approach matches requirements.

**Top 3 Recommendations**:

1. 💡 Add DynamoDB auto-scaling for burst traffic handling
2. 💡 Implement Lambda reserved concurrency to prevent throttling
3. 💡 Use Kinesis Data Firehose for automatic S3 archival

## Strengths

### Scalability & Performance

- ✅ Kinesis handles 100K events/sec with horizontal sharding
- ✅ Lambda auto-scales to match throughput
- ✅ DynamoDB can scale to millions of requests/sec

**Optimizations**:

- Configure Lambda reserved concurrency (prevent account-level throttling)
- Enable DynamoDB on-demand pricing for unpredictable traffic
- Use Kinesis Data Firehose instead of Lambda for S3 archival (reduce costs)

### Cost Optimization

**Current estimated cost**: ~$2,000/month

**Optimizations**:

- Replace Lambda→S3 archival with Kinesis Firehose: Save $500/month
- Use S3 Intelligent-Tiering for archive: Save $200/month
- DynamoDB on-demand pricing: Variable, save during low traffic

**Estimated savings**: $700/month (35% reduction)
```

## Review Framework

The prompt evaluates architectures across seven dimensions:

### 1. Scalability & Performance

- Horizontal and vertical scalability strategies
- Performance bottleneck identification
- Caching strategies (CDN, application, database)
- Load distribution and sharding
- Async processing for long-running tasks

### 2. Reliability & Resilience

- Single points of failure identification
- Fault tolerance mechanisms
- Disaster recovery planning
- Circuit breaker implementation
- Health checks and graceful degradation

### 3. Security

- Authentication and authorization strategies
- Data encryption (at rest and in transit)
- Network security and boundaries
- Secrets management
- Compliance requirements (GDPR, HIPAA, SOC2)

### 4. Maintainability & Developer Experience

- Code organization and modularity
- Service boundary definition
- Documentation quality
- Testing strategies
- Local development setup
- Debugging and tracing capabilities

### 5. Operational Excellence

- Monitoring and alerting setup
- Centralized logging
- Deployment strategies (CI/CD, blue-green, canary)
- Rollback capabilities
- Infrastructure as Code
- Cost optimization

### 6. Data Management

- Database technology selection
- Data consistency strategies
- Schema migrations
- Data retention and archival
- Database scalability
- Backup and recovery

### 7. Integration & Dependencies

- Third-party service risks
- API contract management
- Service communication patterns
- Dependency management
- Vendor lock-in assessment

## Output Structure

### Executive Summary

- Overall assessment (🟢 Strong / 🟡 Needs Improvement / 🔴 Critical Issues)
- Brief summary of strengths and concerns
- Top 3 prioritized recommendations

### Detailed Findings

For each of the seven dimensions:

- Assessment rating
- Specific strengths
- Concerns with impact level
- Actionable recommendations

### Trade-offs Analysis

Table comparing key architectural decisions:

- Benefits and drawbacks
- Alternative approaches considered
- Context for decision-making

### Alternative Architectures

1-2 alternative approaches with:

- Description
- When to use
- Trade-offs vs. proposed architecture

### Risk Assessment

Table of identified risks:

- Likelihood and impact ratings
- Mitigation strategies

### Action Items

Prioritized checklist:

- **High Priority**: Must address before implementation
- **Medium Priority**: Address during implementation
- **Low Priority**: Future improvements

### Architectural Principles Checklist

Validation against core principles:

- Separation of Concerns
- Loose Coupling
- High Cohesion
- Scalability
- Resilience
- Security
- Observability
- Simplicity
- Cost Efficiency
- Developer Productivity

## Best Practices

### For Effective Reviews

1. **Be Specific** - Provide detailed requirements and constraints
2. **Include Scale** - Specify expected users, requests/sec, data volume
3. **Document Constraints** - Budget, team size, timeline, compliance needs
4. **Describe Current State** - If reviewing existing system, include metrics
5. **Ask Questions** - Use review findings to inform architectural discussions

### For Acting on Recommendations

1. **Prioritize Ruthlessly** - Focus on high-priority items first
2. **Validate Assumptions** - Test recommendations with proof-of-concepts
3. **Consider Trade-offs** - Every decision has pros and cons
4. **Measure Impact** - Track metrics before and after changes
5. **Iterate** - Architecture evolves with requirements

### Common Architectural Anti-Patterns

The review identifies these common issues:

- **Premature Optimization** - Over-engineering for scale you don't need yet
- **Single Points of Failure** - No redundancy for critical components
- **Tight Coupling** - Services that can't be changed independently
- **Missing Observability** - Can't understand system behavior in production
- **Ignoring Security** - Security as afterthought instead of built-in
- **No Failover** - Can't handle component failures gracefully
- **Database as Bottleneck** - All traffic hitting single database
- **Vendor Lock-in** - Tightly coupled to proprietary services

## Architecture Decision Records (ADRs)

Use review findings to create ADRs documenting key decisions:

```markdown
# ADR 001: Add Redis Caching Layer

**Status**: Accepted
**Date**: 2025-01-18

## Context

System design review identified database bottleneck. All requests hit PostgreSQL,
causing high latency and limiting scalability.

## Decision

Implement Redis caching layer for:

- User sessions (TTL: 24 hours)
- Product catalog (TTL: 5 minutes)
- Shopping cart data (TTL: 7 days)

## Consequences

**Positive**:

- 80% reduction in database load
- Sub-10ms cache response times
- Improved scalability to 10,000+ concurrent users

**Negative**:

- Additional infrastructure cost ($50/month)
- Cache invalidation complexity
- Eventual consistency for cached data

## Alternatives Considered

- **Database read replicas**: Higher cost ($200/month), doesn't solve session bottleneck
- **In-memory caching (Node.js)**: Doesn't work with multiple instances
```

## Integration with Development Workflow

### Pre-Implementation Review

Run architectural review **before** starting development:

1. Create initial architecture design
2. Run system design review prompt
3. Address high-priority concerns
4. Document decisions in ADRs
5. Begin implementation

### Iterative Reviews

Schedule regular reviews as system evolves:

- **Monthly**: Quick review of new components
- **Quarterly**: Comprehensive system review
- **Before major changes**: Review impact of architectural shifts

### Scaling Checkpoints

Review architecture when crossing thresholds:

- 10x increase in users or traffic
- New geographic regions
- New compliance requirements
- Major feature additions
- Technology migrations

## Related Resources

- [API Design Patterns](../api-design/README.md) - REST/GraphQL API design
- [RESPONSIBLE-AI-PLAYBOOK.md](../../../../RESPONSIBLE-AI-PLAYBOOK.md) - Responsible AI usage

Coming soon:

- Microservices Pattern Prompt - Microservices guidance
- AWS Deployment Strategy - Cloud deployment
- Technical Debt Audit - Debt identification

## Contributing

To improve this architectural review prompt:

1. Share examples of architectures reviewed (anonymized)
2. Suggest additional evaluation dimensions
3. Provide industry-specific considerations (healthcare, fintech, gaming)
4. Report edge cases or missing patterns
5. Suggest improvements to trade-off analysis

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for guidelines.

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

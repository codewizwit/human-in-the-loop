---
name: system-design-review
description: >-
  Analyzes system architecture from codebase and documentation for scalability,
  reliability, security, and operational excellence. Use when user asks to
  "review architecture", "design system review", or mentions "architecture audit".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
  - EnterPlanMode
---

# System Design Review

Conducts a comprehensive architectural review of a system by examining codebase
structure, infrastructure definitions, documentation, and configuration files.
Evaluates the architecture across scalability, reliability, security,
maintainability, operational excellence, data management, and integration
dimensions. Produces a structured report with severity-rated findings, trade-off
analysis, risk assessment, and prioritized action items.

## When to Activate

- User asks to review system architecture or design
- User mentions architecture audit, scalability review, or reliability assessment
- User wants to evaluate trade-offs in their system design
- User asks to check infrastructure, deployment patterns, or operational readiness

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What is the scope of this architecture review?</question>
<option value="full">Full system architecture</option>
<option value="component">Specific component or service</option>
<option value="dimension">Focused dimension (scalability, security, etc.)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Which dimensions should I prioritize?</question>
<option value="balanced">Balanced review across all dimensions</option>
<option value="scalability">Scalability and performance</option>
<option value="security">Security and compliance</option>
<option value="reliability">Reliability and resilience</option>
<option value="operations">Operational excellence</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For large systems with multiple services or extensive infrastructure, enter plan
mode to align on scope:

<EnterPlanMode>
<summary>
Outline the architecture components to review, list services and infrastructure
to examine, and confirm priority dimensions with the user.
</summary>
</EnterPlanMode>

### Step 3: Discovery

1. Use Glob to find architecture documentation (docs/architecture/\*\*, README.md, ADRs)
2. Read package.json and configuration files to understand the tech stack
3. Find infrastructure-as-code files (Terraform, CloudFormation, docker-compose, CDK)
4. Locate service definitions, API contracts, and deployment configurations
5. Identify architecture patterns (microservices, monolith, event-driven, etc.)

### Step 4: Architecture Analysis

Use Read to examine system documentation and Grep to search for architectural
patterns. Evaluate each dimension:

**Scalability and Performance**

- Horizontal and vertical scalability capabilities
- Performance bottlenecks (database, network, compute)
- Caching strategy (CDN, application, database levels)
- Load distribution and async processing patterns

**Reliability and Resilience**

- Single points of failure identification
- Fault tolerance and disaster recovery strategy
- Circuit breakers, health checks, and graceful degradation

**Security**

- Authentication and authorization mechanisms
- Data encryption at rest and in transit
- Secrets management and network security
- Attack surface analysis and compliance posture

**Maintainability and Developer Experience**

- Code organization and service boundary clarity
- Documentation completeness and testing strategy
- Local development workflow and debugging capabilities

**Operational Excellence**

- Monitoring, alerting, and centralized logging
- Deployment strategy and rollback capability
- Infrastructure as code and cost optimization

**Data Management**

- Storage technology selection and data consistency
- Migration strategy, retention policies, and backup procedures

**Integration and Dependencies**

- Third-party service risks and API contract versioning
- Service communication patterns and vendor lock-in assessment

### Step 5: Deliver Report

Write the review report to a markdown file in the workspace with all findings
organized by dimension, severity, and priority.

## Output Format

<output_format>
Write the system design review to a markdown file in the workspace. Structure as follows:

**Executive Summary**

- Overall assessment: Strong / Needs Improvement / Critical Issues
- 2-3 sentence summary of strengths and key concerns
- Top 3 recommendations for improvement

**Detailed Findings**

For each dimension (Scalability, Reliability, Security, etc.):

- Assessment rating (Strong, Needs Improvement, Critical Issues)
- Strengths with specific references to code or documentation
- Concerns with potential impact (high/medium/low)
- Actionable recommendations with implementation guidance

**Trade-offs Analysis**

Table documenting key architectural decisions with benefits, drawbacks, and
alternatives considered.

**Risk Assessment**

Table with risk descriptions, likelihood, impact, and mitigation strategies.

**Action Items**

Prioritized list organized by urgency:

- High Priority: address before implementation
- Medium Priority: address during implementation
- Low Priority: future improvements

Each action item includes clear acceptance criteria.

**Architectural Principles Checklist**

Checkbox list covering separation of concerns, loose coupling, high cohesion,
scalability, resilience, security, observability, simplicity, cost efficiency,
and developer productivity.
</output_format>

## Best Practices

- Start with project discovery before analyzing individual components
- Prioritize critical findings (security, single points of failure) over style preferences
- Provide specific file paths and references for all findings
- Include concrete alternative approaches with trade-off explanations
- Reference established architectural frameworks (AWS Well-Architected, TOGAF) when relevant
- Maintain a constructive tone focused on improvement, not criticism

## Anti-Patterns

- Do not review generated code, vendored dependencies, or third-party configurations
- Do not suggest sweeping rewrites without migration guidance
- Do not provide generic advice without referencing specific code or infrastructure
- Do not skip the discovery phase and jump directly into critique
- Do not ignore existing architectural decisions without understanding the rationale
- Do not overlook documentation and ADRs that explain prior design choices

## Examples

### Example 1: Full System Architecture Review

**Input**: "Review the system architecture and provide recommendations"

**Output**: Comprehensive review covering all seven dimensions with an executive
summary, detailed findings per dimension with severity ratings, a trade-offs
table, risk assessment matrix, and prioritized action items referencing specific
infrastructure files and code patterns.

### Example 2: Scalability-Focused Review

**Input**: "Review architecture focusing on scalability and performance concerns"

**Output**: Deep-dive report on horizontal and vertical scaling capabilities,
performance bottleneck analysis, caching strategy evaluation, and load
distribution patterns with specific recommendations for improvement.

### Example 3: Security and Compliance Audit

**Input**: "Audit our architecture for security gaps and compliance readiness"

**Output**: Security-focused review covering authentication mechanisms,
encryption posture, secrets management, network boundaries, attack surface
analysis, and compliance requirement mapping with prioritized remediation steps.

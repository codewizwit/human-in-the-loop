# System Design Review

Conducts a comprehensive architectural review of a system by examining codebase structure, infrastructure definitions, documentation, and configuration files. Evaluates architecture across scalability, reliability, security, maintainability, operational excellence, data management, and integration dimensions. Produces a structured report with severity-rated findings, trade-off analysis, risk assessment, and prioritized action items.

## What You'll Be Asked

- **Scope**: Whether to review the full system, a specific component, or a focused dimension
- **Priority focus**: Balanced review, scalability, security, reliability, or operational excellence

## Usage Examples

### Full Architecture Review

> "Review the system architecture and provide recommendations"

Produces a comprehensive review covering all seven architectural dimensions with an executive summary, detailed findings, trade-offs table, risk assessment, and prioritized action items.

### Scalability Deep-Dive

> "Review architecture focusing on scalability and performance concerns"

Focuses on horizontal and vertical scaling, performance bottlenecks, caching strategies, load distribution, and async processing patterns with specific improvement recommendations.

### Security and Compliance Audit

> "Audit our architecture for security gaps and compliance readiness"

Prioritizes security findings including authentication, encryption, secrets management, network boundaries, and compliance requirement mapping with remediation steps.

## Key Features

- Seven-dimension architectural evaluation framework
- Trade-off analysis with alternatives considered
- Risk assessment matrix with mitigation strategies
- Prioritized action items with acceptance criteria
- Architectural principles checklist for quick validation

## Installation

```bash
hit install system-design-review
```

## Related Resources

- [Code Review TypeScript](../code-review-ts/) - Complements architecture review with code-level analysis
- [AWS Deployment Strategy](../aws-deployment-strategy/) - For reviewing AWS-specific deployment patterns
- [Pipeline Optimization](../pipeline-optimization/) - For CI/CD pipeline architecture review

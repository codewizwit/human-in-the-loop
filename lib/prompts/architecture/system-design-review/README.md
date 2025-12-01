# System Design Review

Comprehensive architecture analysis validating scalability, reliability, security, and operational excellence.

## What You'll Be Asked

- **Review focus** - Scalability, security, reliability, or comprehensive review
- **System context** (optional) - Current pain points, growth projections
- **Architecture docs** (optional) - Existing documentation location

## Usage Examples

### Example 1: Scalability Assessment

Review microservices architecture for horizontal scaling capabilities and performance bottlenecks.

**Expected Output:**

```markdown
### Executive Summary

Overall assessment: 🟡 Needs Improvement

### Scalability & Performance

**Strengths:**

- Services can scale horizontally with load balancer
- Database read replicas configured

**Concerns:**

- 🔴 Single database write instance (bottleneck)
- 🟡 No caching layer for frequent queries
```

### Example 2: Full Architecture Review

Analyze distributed system across all dimensions with risk assessment and recommendations.

**Expected Output:**

```markdown
### Risk Assessment

| Risk             | Likelihood | Impact | Mitigation           |
| ---------------- | ---------- | ------ | -------------------- |
| Database failure | Medium     | High   | Add failover replica |

### Action Items

**High Priority:**

- [ ] Implement database replication
- [ ] Add circuit breakers for external APIs
```

## Related Resources

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) - Cloud architecture best practices
- [System Design Primer](https://github.com/donnemartin/system-design-primer) - Comprehensive guide
- [API Design](../api-design) - API architecture patterns
- [Security Review](../governance/security-review) - Security validation

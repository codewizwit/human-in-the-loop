# Pipeline Optimization

Analyzes CI/CD pipelines for speed, cost, and reliability with actionable optimization recommendations.

## What You'll Be Asked

- **Optimization goals** - Speed, cost reduction, reliability, or developer experience
- **Current metrics** (optional) - Average duration, monthly cost, success rate
- **Constraints** (optional) - Budget limits, deployment requirements

## Usage Examples

### Example 1: Reduce GitHub Actions Duration

Pipeline takes 12 minutes with npm install bottleneck. Analyze and optimize.

**Expected Output:**

```markdown
## Executive Summary

**Projected Improvements:**

- ⚡ Duration: 12 min → 4 min (67% faster)
- 💰 Cost: $50/month → $25/month (50% savings)

**Top 3 Quick Wins:**

1. Add dependency caching (saves 3-4 min per run)
2. Parallelize test jobs (saves 3 min)
```

### Example 2: Cost Optimization Focus

Optimize matrix builds and runner usage to reduce monthly costs.

**Expected Output:**

```markdown
## Cost Optimization

- Reduce matrix builds from 12 to 6 configurations
- Use self-hosted runners for long-running jobs
- Schedule nightly runs instead of per-commit

**Annual Savings:** $600/year 💰
```

## Related Resources

- [GitHub Actions Best Practices](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions) - Official documentation
- [E2E Strategy](../../testing/e2e-strategy) - Test optimization

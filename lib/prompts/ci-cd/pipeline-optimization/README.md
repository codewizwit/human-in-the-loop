# Pipeline Optimization

Analyzes and optimizes CI/CD pipelines for speed, cost efficiency, and reliability. Identifies bottlenecks, suggests parallelization strategies, caching improvements, and provides estimated time and cost savings for GitHub Actions, GitLab CI, CircleCI, and Jenkins.

## Overview

This prompt conducts comprehensive pipeline analysis across six dimensions: Execution Speed, Caching Strategy, Cost Optimization, Reliability & Stability, Developer Experience, and Security & Compliance. It provides actionable recommendations with before/after comparisons, estimated savings, and complete optimized configurations.

## When to Use This Prompt

Use this pipeline optimization when:

- **Slow CI/CD pipelines** - Reduce build times and improve developer productivity
- **High infrastructure costs** - Identify opportunities for cost reduction
- **Low success rates** - Improve pipeline reliability and stability
- **New pipeline setup** - Validate best practices before implementation
- **Regular optimization** - Quarterly pipeline health checks
- **Platform migration** - Optimize when moving to new CI/CD platform

## Usage

### Basic GitHub Actions Optimization

```yaml
pipeline_config: |
  name: CI
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm install
        - run: npm test

pipeline_platform: github-actions
```

### With Current Metrics

```yaml
pipeline_config: |
  [Your pipeline YAML here]

pipeline_platform: github-actions

current_metrics: |
  Average duration: 15 minutes
  Monthly cost: $200 (5000 runs/month)
  Success rate: 80%
  Main bottlenecks:
    - npm install: 5 minutes
    - Test suite: 8 minutes
    - No caching configured

optimization_goals: Reduce cost by 50%, improve speed by 60%
```

### With Constraints

```yaml
pipeline_config: |
  [Your pipeline YAML]

pipeline_platform: gitlab-ci

current_metrics: |
  Duration: 20 min
  Cost: $500/month

constraints: |
  - Must use GitLab shared runners (no self-hosted)
  - Budget limit: $300/month
  - Must maintain 95% success rate
  - SOC2 compliance required

optimization_goals: Cost reduction while maintaining quality
```

## Examples

### Example 1: GitHub Actions - Basic Node.js Pipeline

**Before:**

```yaml
pipeline_config: |
  name: CI
  on:
    push:
      branches: [ main, develop ]
    pull_request:
      branches: [ main ]

  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: '18'
        - run: npm install
        - run: npm test
        - run: npm run lint
        - run: npm run typecheck

    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm install
        - run: npm run build

current_metrics: |
  Duration: 12 minutes
  Cost: $50/month
  Success rate: 85%
  npm install runs 3 times (9-12 min total)
```

**After (Key Optimizations):**

````markdown
## Projected Improvements

- ⚡ Duration: 12 min → 4.5 min (62% faster)
- 💰 Cost: $50/month → $18/month (64% savings, $384/year)
- 📈 Success rate: 85% → 92%

## Top 3 Quick Wins

1. Add dependency caching → Save 8-9 min per run
2. Combine test/lint/typecheck → Save 50% runner cost
3. Add concurrency cancellation → Prevent wasted runs

## Optimized Configuration

```yaml
name: CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'src/**'
      - 'package.json'
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      # Caching saves 8-9 min
      - uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run typecheck
```
````

## Before/After Comparison

| Metric              | Before  | After   | Improvement        |
| ------------------- | ------- | ------- | ------------------ |
| Duration (PR)       | 12 min  | 4.5 min | 62% faster ⚡      |
| Monthly Cost        | $50     | $18     | $32 saved 💰       |
| Cache Hit Rate      | 0%      | 85-90%  | Huge improvement   |
| Success Rate        | 85%     | 92%     | +7% reliability 🎯 |
| npm install time    | 9-12min | 10-15s  | 98% faster         |
| **Annual Savings**: | -       | -       | **$384/year** 💰   |

````

### Example 2: Multi-Job Pipeline with Docker

**Before:**

```yaml
pipeline_config: |
  jobs:
    backend-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Build Docker image
          run: docker build -t backend:test .
        - name: Run tests
          run: docker run backend:test npm test

    frontend-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Build Docker image
          run: docker build -t frontend:test ./frontend
        - name: Run tests
          run: docker run frontend:test npm test

    integration-test:
      needs: [backend-test, frontend-test]
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Build backend
          run: docker build -t backend:test .
        - name: Build frontend
          run: docker build -t frontend:test ./frontend
        - name: Run integration tests
          run: docker-compose up --abort-on-container-exit

current_metrics: |
  Duration: 25 minutes
  Cost: $150/month
  Docker builds: 6 total (15 min)
  Success rate: 78%
````

**After (Key Findings):**

````markdown
## Critical Issues

- 🔴 Docker images built 6 times (15 min wasted)
- 🔴 No Docker layer caching (3-4 min per build)
- 🔴 78% success rate too low (likely flaky tests)

## Optimizations

### 1. Docker Layer Caching

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v2

- name: Build and cache
  uses: docker/build-push-action@v4
  with:
    context: .
    cache-from: type=gha
    cache-to: type=gha,mode=max
```
````

**Savings**: 12-15 min per run (80% faster Docker builds)

### 2. Share Docker Images Between Jobs

```yaml
backend-test:
  steps:
    - name: Build and push to cache
      uses: docker/build-push-action@v4
      with:
        tags: backend:${{ github.sha }}
        outputs: type=docker,dest=/tmp/backend.tar

    - name: Upload image
      uses: actions/upload-artifact@v3
      with:
        name: backend-image
        path: /tmp/backend.tar

integration-test:
  needs: [backend-test, frontend-test]
  steps:
    - name: Download backend image
      uses: actions/download-artifact@v3
      with:
        name: backend-image
        path: /tmp

    - name: Load image
      run: docker load --input /tmp/backend.tar
```

**Savings**: 10 min (avoid rebuilding)

## Results

- ⚡ Duration: 25 min → 8 min (68% faster)
- 💰 Cost: $150/month → $45/month (70% savings)
- 🎯 Success rate: 78% → 95% (with retries)

````

### Example 3: Monorepo with Nx

**Before:**

```yaml
pipeline_config: |
  jobs:
    build-all:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - run: npm install
        - run: npx nx run-many --target=build --all
        - run: npx nx run-many --target=test --all
        - run: npx nx run-many --target=lint --all

current_metrics: |
  Duration: 45 minutes
  Cost: $300/month
  Builds all 50 projects even when only 2 changed
  No caching or affected detection
````

**After (Key Findings):**

````markdown
## Critical Issues

- 🔴 Builds ALL projects regardless of changes (43 min wasted on average)
- 🔴 No Nx computation caching (30 min wasted)
- 🔴 No affected project detection

## Optimizations

### 1. Nx Affected Commands

```yaml
- name: Get affected projects
  run: npx nx affected:build --base=origin/main

- name: Test affected
  run: npx nx affected:test --base=origin/main

- name: Lint affected
  run: npx nx affected:lint --base=origin/main
```
````

**Savings**: 40-43 min (only build what changed)

### 2. Nx Cloud Distributed Caching

```yaml
- name: Setup Nx Cloud
  run: npx nx-cloud start-ci-run

- run: npx nx affected:build --base=origin/main
```

**Savings**: Additional 20-30 min (cache reuse across machines)

### 3. Parallel Execution

```yaml
- run: npx nx affected:build --parallel=3
- run: npx nx affected:test --parallel=3
```

## Results

- ⚡ Duration: 45 min → 3-5 min average (93% faster)
- 💰 Cost: $300/month → $30/month (90% savings)
- 🚀 Only builds 2-5 projects instead of 50

**ROI**: Saves 40+ min per developer per day

````

## Optimization Framework

The prompt analyzes pipelines across six dimensions:

### 1. Execution Speed

- Job parallelization opportunities
- Step reordering for faster feedback
- Redundant operations elimination
- Conditional execution strategies
- Appropriate runner selection

### 2. Caching Strategy

- Dependency caching (npm, pip, maven, gradle)
- Build artifact caching between jobs
- Docker layer caching
- Cache key optimization
- Cache invalidation strategies

### 3. Cost Optimization

- Runner minutes analysis
- Matrix build optimization
- Scheduled job frequency
- Fail-fast strategies
- Self-hosted runner opportunities
- Concurrent job limits

### 4. Reliability & Stability

- Flaky test handling
- Timeout configuration
- Error handling improvements
- Dependency version pinning
- Artifact preservation
- Notification strategies

### 5. Developer Experience

- Time to feedback optimization
- Log clarity improvements
- PR check optimization (<5 min goal)
- Local reproducibility
- Documentation quality
- Debugging capabilities

### 6. Security & Compliance

- Secrets management
- Least privilege access
- Dependency scanning
- Audit logging
- Branch protection rules
- Code signing requirements

## Output Structure

### Executive Summary

- Overall assessment (🟢/🟡/🔴)
- Current state metrics
- Projected improvements with percentages
- Top 3 quick wins

### Detailed Findings

For each dimension:

- Assessment rating
- Current issues with line numbers
- Actionable recommendations
- Code examples (before/after)
- Expected improvements

### Optimization Opportunities Table

Prioritized by impact:

- High Impact (implement first)
- Medium Impact
- Low Impact (nice to have)

Each with time saved, cost saved, effort, and priority.

### Optimized Configuration

Complete rewritten pipeline with:

- Inline comments explaining changes
- All optimizations applied
- Platform-specific best practices

### Before/After Comparison

Table showing:

- Total duration
- Monthly cost
- Jobs in parallel
- Cache hit rate
- Success rate

### Implementation Roadmap

Phased approach:

- **Phase 1**: Quick wins (Day 1)
- **Phase 2**: Medium effort (Week 1)
- **Phase 3**: Long-term (Month 2+)

### Monitoring & Validation

- Metrics to track
- Validation checklist
- Platform insights to monitor

## Platform-Specific Guidance

### GitHub Actions

**Best Practices**:

- Use `actions/cache@v3` for dependency caching
- Leverage `concurrency` for automatic cancellation
- Use `if` conditions to skip unnecessary jobs
- Pin action versions for stability
- Consider self-hosted runners for cost savings

**Cost Optimization**:

- Free tier: 2,000 min/month for private repos
- Ubuntu runners: $0.008/min
- Larger runners: 2x-64x cost but 2x-12x speed

### GitLab CI

**Best Practices**:

- Use `cache` and `artifacts` strategically
- Leverage `needs` for job dependencies (DAG)
- Use `rules` for conditional execution
- Consider GitLab Runner autoscaling
- Use `interruptible` for cancellable jobs

**Cost Optimization**:

- Free tier: 400 min/month
- Shared runners: $10/user/month unlimited
- Self-hosted runners: Free

### CircleCI

**Best Practices**:

- Use `save_cache` and `restore_cache`
- Leverage workflows for parallelization
- Use resource classes appropriately
- Consider CircleCI orbs for common tasks
- Use `when` for conditional steps

**Cost Optimization**:

- Free tier: 6,000 min/month
- Medium resource class: $15/user/month
- Large resource class: 2x cost, ~1.5x speed

### Jenkins

**Best Practices**:

- Use declarative pipeline syntax
- Leverage parallel stages
- Use stash/unstash for artifacts
- Consider Jenkins agents for distributed builds
- Use shared libraries for reusable code

**Cost Optimization**:

- Self-hosted: Infrastructure cost only
- Use agent pools efficiently
- Implement build triggers wisely

## Common Pipeline Anti-Patterns

The optimization identifies these issues:

**Speed Anti-Patterns**:

- ❌ No caching (reinstalling dependencies every run)
- ❌ Sequential jobs that could run in parallel
- ❌ Rebuilding same artifacts multiple times
- ❌ Running all tests for every change (monorepos)

**Cost Anti-Patterns**:

- ❌ No concurrency limits (old runs continue)
- ❌ Over-provisioned runners
- ❌ Unnecessary scheduled runs
- ❌ Matrix builds for every PR

**Reliability Anti-Patterns**:

- ❌ No timeout configuration (jobs hang)
- ❌ Unpinned action/plugin versions
- ❌ No retry mechanism for flaky tests
- ❌ Critical artifacts not saved

**Developer Experience Anti-Patterns**:

- ❌ Slow PR feedback (>10 min)
- ❌ Unclear failure messages
- ❌ Can't reproduce failures locally
- ❌ No status checks configured

## Best Practices

### For Effective Optimization

1. **Start with Metrics** - Know your current state (duration, cost, success rate)
2. **Prioritize Quick Wins** - Focus on high-impact, low-effort optimizations first
3. **Test Changes** - Validate optimizations on feature branch before main
4. **Monitor Results** - Track metrics after changes to validate improvements
5. **Iterate** - Pipelines need ongoing optimization as code evolves

### For Maintaining Fast Pipelines

1. **Regular Reviews** - Quarterly pipeline health checks
2. **Monitor Trends** - Watch for gradual slowdowns
3. **Update Dependencies** - Keep actions/plugins current
4. **Prune Caches** - Clear outdated caches periodically
5. **Review Matrix Builds** - Ensure still necessary

### Common Caching Patterns

**Node.js/npm**:

```yaml
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
````

**Python/pip**:

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
```

**Docker**:

```yaml
- uses: docker/build-push-action@v4
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

**Nx Monorepo**:

```yaml
- uses: actions/cache@v3
  with:
    path: node_modules/.cache/nx
    key: nx-${{ hashFiles('**/package-lock.json') }}
```

## ROI Calculation

### Time Savings Value

**Formula**: `(Minutes saved per run × Runs per day × Developers × Hourly rate) / 60`

**Example**:

- Minutes saved: 8 min
- Runs per day: 10 (per developer)
- Developers: 10
- Hourly rate: $100

**Value**: `(8 × 10 × 10 × $100) / 60 = $1,333/day = $347K/year`

### Infrastructure Cost Savings

**Example GitHub Actions**:

- Before: $200/month (12 min avg × 5000 runs × $0.008/min)
- After: $72/month (4.5 min avg × 5000 runs × $0.008/min)
- Savings: $128/month = $1,536/year

### Total ROI

Developer time savings + Infrastructure savings = **Total annual value**

For the example: $347K + $1.5K ≈ **$349K/year**

## Related Resources

- [System Design Review](../../architecture/system-design-review/README.md) - Architecture validation
- [E2E Strategy Generator](../../testing/e2e-strategy/README.md) - E2E testing optimization
- [ACCOUNTABILITY.md](../../../../ACCOUNTABILITY.md) - Responsible AI usage

Coming soon:

- AWS Deployment Strategy - Cloud deployment patterns

## Contributing

To improve this pipeline optimization prompt:

1. Share examples of optimized pipelines (anonymized)
2. Suggest platform-specific optimizations
3. Provide industry-specific patterns (mobile, ML, data pipelines)
4. Report edge cases or missing optimization opportunities
5. Contribute cost calculation formulas

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for guidelines.

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

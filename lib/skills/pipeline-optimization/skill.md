---
name: pipeline-optimization
description: >-
  Analyzes CI/CD pipelines for speed, cost, and reliability.
  Use when user asks to "optimize my pipeline", "speed up CI",
  "reduce build times", or mentions "GitHub Actions optimization".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
  - EnterPlanMode
---

# Pipeline Optimization

Analyzes CI/CD pipelines in your workspace for speed, cost, and reliability. Uses Read and Glob to find pipeline configs (GitHub Actions, GitLab CI, CircleCI, Jenkins). Identifies bottlenecks, suggests parallelization, caching, and provides estimated savings.

## When to Activate

- User asks to optimize, speed up, or reduce costs of CI/CD pipelines
- User mentions GitHub Actions, GitLab CI, CircleCI, or Jenkins optimization
- User wants to improve build times, caching, or pipeline reliability
- User asks about developer experience with CI feedback loops
- User mentions pipeline cost reduction or runner optimization

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>Which CI/CD platform are you using?</question>
<options>

  <option value="github-actions">GitHub Actions</option>
  <option value="gitlab-ci">GitLab CI</option>
  <option value="circleci">CircleCI</option>
  <option value="jenkins">Jenkins</option>
  <option value="auto-detect">Auto-detect from workspace</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>What are your primary optimization goals? (select all that apply)</question>
<options>

  <option value="speed">Speed - reduce pipeline duration</option>
  <option value="cost">Cost - reduce runner minutes and expenses</option>
  <option value="reliability">Reliability - reduce flaky failures</option>
  <option value="dx">Developer Experience - faster feedback loops</option>
  <option value="all">All of the above</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>Do you know your current pipeline metrics? If so, share average duration, monthly cost, and success rate. Otherwise, type "unknown".</question>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Discovery Phase

1. Use Glob to find CI/CD pipeline configuration files:
   - GitHub Actions: `.github/workflows/*.yml`, `.github/workflows/*.yaml`
   - GitLab CI: `.gitlab-ci.yml`
   - CircleCI: `.circleci/config.yml`
   - Jenkins: `Jenkinsfile`
   - Other: `azure-pipelines.yml`, `.travis.yml`
2. Identify which CI/CD platform(s) are in use
3. Map out the pipeline structure (jobs, stages, dependencies)

### Step 3: Pipeline Analysis Phase

Use Read to examine each pipeline configuration file in detail. Analyze across these critical dimensions:

#### 1. Execution Speed

- **Job Parallelization**: Are independent jobs running in parallel?
- **Step Dependencies**: Can steps within jobs be reordered or parallelized?
- **Redundant Steps**: Are there duplicate or unnecessary operations?
- **Job Triggering**: Are jobs triggered only when needed (path filters, change detection)?
- **Conditional Execution**: Are expensive steps skipped when not needed?
- **Runner Selection**: Are appropriate runner sizes/types being used?

#### 2. Caching Strategy

- **Dependency Caching**: Are dependencies (npm, pip, maven, etc.) cached effectively?
- **Build Artifact Caching**: Are build outputs cached between jobs?
- **Docker Layer Caching**: Are Docker images using layer caching?
- **Cache Key Strategy**: Are cache keys specific enough but stable?
- **Cache Invalidation**: When should caches be cleared?
- **Cache Size**: Are caches appropriately sized?

#### 3. Cost Optimization

- **Runner Minutes**: Can self-hosted runners reduce costs?
- **Matrix Strategy**: Are matrix builds necessary or can they be reduced?
- **Scheduled Jobs**: Can frequency be reduced without impacting quality?
- **Failure Fast**: Are failing jobs terminated quickly?
- **Resource Allocation**: Are runners over-provisioned?
- **Concurrent Job Limits**: Are there unnecessary waiting times?

#### 4. Reliability and Stability

- **Flaky Tests**: Are there retry mechanisms for flaky steps?
- **Timeout Configuration**: Are appropriate timeouts set?
- **Error Handling**: Are failures handled gracefully?
- **Dependency Pinning**: Are action/plugin versions pinned?
- **Artifact Upload**: Are critical artifacts always saved?
- **Notification Strategy**: Are failures reported promptly?

#### 5. Developer Experience

- **Feedback Loop**: How quickly do developers get results?
- **Log Clarity**: Are logs clear and actionable?
- **PR Checks**: Are essential checks fast (<5 min for critical feedback)?
- **Local Reproducibility**: Can pipeline be run locally?
- **Documentation**: Is pipeline well-documented?
- **Debugging**: Can failures be easily debugged?

#### 6. Security and Compliance

- **Secrets Management**: Are secrets properly managed?
- **Least Privilege**: Do jobs have minimal permissions?
- **Dependency Scanning**: Are vulnerabilities checked?
- **Audit Logging**: Are pipeline executions logged?
- **Branch Protection**: Are appropriate branch rules enforced?
- **Code Signing**: Are artifacts signed where needed?

### Step 4: Plan (if complex)

For pipelines with many workflows, enter plan mode to organize the optimization into phases:

- Phase 1: Quick wins (caching, parallelization)
- Phase 2: Medium effort (runner optimization, matrix refinement)
- Phase 3: Long-term (self-hosted runners, custom actions)

### Step 5: Generate Comprehensive Report

Provide executive summary with overall assessment and projected improvements, detail findings for each dimension, include code examples showing before/after optimizations, prioritize by impact and effort, and provide implementation roadmap.

## Output Format

<output_format>
Write your pipeline optimization analysis to a markdown file in the workspace. Follow this structure:

### Executive Summary

**Overall Assessment**: Optimized / Needs Improvement / Critical Issues

**Current State**:

- Average duration: [X minutes]
- Monthly cost: $[X] (if known)
- Success rate: [X%] (if known)
- Main bottleneck: [description]

**Projected Improvements**:

- Duration: [X minutes] -> [Y minutes] ([Z%] faster)
- Cost: $[X]/month -> $[Y]/month ([Z%] savings)
- Success rate: [X%] -> [Y%]

**Top 3 Quick Wins**:

1. [Optimization with biggest impact/effort ratio]
2. [Second priority optimization]
3. [Third priority optimization]

---

### Detailed Findings

For each dimension:

#### [Dimension Name]

**Assessment**: Optimized / Needs Improvement / Critical Issues

**Current Issues**:

- [Issue description with specific file path and line numbers]
- Impact: [time/cost/reliability impact]

**Recommendations**:

1. **[Optimization name]**:

   ```yaml
   # Before
   [current code with file path]

   # After (optimized)
   [optimized code]
   ```

   - Expected savings: [X min / $Y / Z% improvement]
   - Effort required: [Low/Medium/High]
   - Priority: [P0/P1/P2]

---

### Optimization Opportunities

#### High Impact (Implement First)

| Optimization | Time Saved | Cost Saved | Effort | Priority |
| ------------ | ---------- | ---------- | ------ | -------- |
| [Name]       | X min      | $Y/month   | Low    | P0       |

#### Medium Impact

| Optimization | Time Saved | Cost Saved | Effort | Priority |
| ------------ | ---------- | ---------- | ------ | -------- |
| [Name]       | X min      | $Y/month   | Medium | P1       |

---

### Optimized Pipeline Configuration

```yaml
[Full optimized configuration with inline comments]
```

---

### Before/After Comparison

| Metric              | Before | After | Improvement |
| ------------------- | ------ | ----- | ----------- |
| Total Duration (PR) | X min  | Y min | Z% faster   |
| Monthly Cost        | $X     | $Y    | $Z saved    |
| Cache Hit Rate      | X%     | Y%    | +Z%         |
| Success Rate        | X%     | Y%    | +Z%         |

---

### Implementation Roadmap

#### Phase 1: Quick Wins (Day 1 - 30 minutes)

- [Optimization 1] -> Expected: X min saved per run
- [Optimization 2] -> Expected: $Y/month saved

#### Phase 2: Medium Effort (Week 1 - 1 hour)

- [Optimization 3]
- [Optimization 4]

#### Phase 3: Long-term (Month 1+)

- [Optimization 5]

---

### Monitoring and Validation

**Metrics to Track**:

- Pipeline duration (p50, p95, p99)
- Success/failure rate over time
- Cost per pipeline run
- Cache hit rate
- Time to feedback for developers

**Validation Checklist**:

- [ ] Pipeline runs successfully on main branch
- [ ] All tests pass with optimizations enabled
- [ ] Duration reduced to target
- [ ] Cache hit rate >80%
- [ ] No regressions in test coverage
      </output_format>

## Best Practices

- Use Glob to discover pipeline configuration files in the workspace
- Provide specific file paths and line references for all findings
- Include concrete code examples for all recommendations
- Estimate time and cost savings for each optimization
- Prioritize quick wins (high impact, low effort) first
- Use platform-specific best practices
- Include before/after comparison with measurable improvements
- Provide implementation roadmap broken into phases

## Anti-Patterns

- Optimizing without measuring current baseline metrics
- Adding caching without proper cache key strategies
- Over-parallelizing when shared state creates race conditions
- Ignoring security scanning to save time
- Using `latest` tags for actions or Docker images
- Skipping timeout configuration

## Examples

**Optimize GitHub Actions for speed and cost:**

> Analyze our CI/CD pipeline and suggest optimizations to reduce duration and cost

**Focus on developer experience:**

> Review the pipeline configuration with focus on developer experience - we need faster feedback loops

**Full analysis with metrics:**

> Our pipeline takes 12 minutes on average, costs $50/month for 1000 runs, and has 85% success rate. The main bottleneck is npm install taking 3-4 minutes each run. Please analyze and optimize.

---

**Human-in-the-Loop by codewizwit**

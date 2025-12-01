# Test Coverage Analysis

Analyze test coverage reports to identify gaps, prioritize testing efforts, and generate actionable recommendations for improving test quality.

## What It Does

- **Analyzes** coverage reports (Istanbul/NYC, lcov)
- **Identifies** high-risk uncovered code paths
- **Prioritizes** testing efforts by business impact
- **Generates** specific test recommendations with examples

## Coverage Metrics Analyzed

| Metric         | What It Measures                    |
| -------------- | ----------------------------------- |
| **Statements** | Individual code statements executed |
| **Branches**   | Conditional paths (if/else, switch) |
| **Functions**  | Function/method invocations         |
| **Lines**      | Source code lines executed          |

## Usage Examples

### Example 1: Angular Component Library

```
Coverage Report Summary:
- Statements: 67.3%
- Branches: 52.1%
- Functions: 71.2%
- Lines: 68.5%

Uncovered Files:
- data-table.component.ts (23% coverage)
- auth.service.ts (38% coverage)

Goal: Achieve 80% coverage before release.
```

**What You Get:**

- Executive summary with gap analysis
- Risk assessment by file (P0, P1, P2)
- Specific test cases to add with TypeScript examples
- Phased action plan with effort estimates
- Coverage improvement roadmap

### Example 2: NestJS API Service

```
Coverage Report:
- Statements: 78.2%
- Branches: 61.4%

Low Coverage Files:
- payments.service.ts (42%)
- roles.guard.ts (34%)

Focus: Payment processing is business-critical.
```

**What You Get:**

- Business risk assessment
- Security-focused recommendations for guards
- Payment flow test scenarios
- Prioritized improvement plan

## Output Structure

Every analysis includes:

1. **Executive Summary** - Coverage metrics vs targets
2. **Risk Assessment** - Files ranked by business impact
3. **Critical Gaps** - Detailed analysis with test examples
4. **Action Plan** - Phased improvements with estimates
5. **Quality Recommendations** - Beyond coverage metrics

## Risk Levels

| Level       | Coverage | Action                   |
| ----------- | -------- | ------------------------ |
| 🔴 Critical | < 40%    | Immediate attention      |
| 🟠 High     | 40-60%   | Priority this sprint     |
| 🟡 Medium   | 60-80%   | Schedule for next sprint |
| 🟢 Low      | > 80%    | Maintain and monitor     |

## Branch Coverage Focus

Branch coverage often reveals more gaps than line coverage:

| Pattern            | Risk                       |
| ------------------ | -------------------------- |
| Error catch blocks | Untested error handling    |
| Null checks        | Edge cases missed          |
| Feature flags      | Alternative paths untested |
| Switch statements  | Missing case coverage      |

## Best Practices Applied

- Risk-based prioritization over coverage percentages
- Focus on meaningful coverage, not vanity metrics
- Test maintainability considerations
- Framework-specific patterns (Angular TestBed, NestJS mocking)
- Realistic effort estimates

## Related Resources

- [Unit Test Generator](../unit-test-generator) - Generate tests for gaps
- [E2E Strategy](../e2e-strategy) - Integration test planning
- [BDD Scenarios](../bdd-scenarios) - Behavior-driven test cases

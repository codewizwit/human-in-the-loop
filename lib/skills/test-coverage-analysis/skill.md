---
name: test-coverage-analysis
description: >-
  Analyzes test coverage reports and codebase to identify gaps and prioritize
  testing efforts. Use when user asks to "analyze test coverage", "find coverage
  gaps", "improve test quality", or mentions "Istanbul coverage report".
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

# Test Coverage Analysis

Analyzes test coverage reports and codebase to identify gaps, assess risk by business impact, prioritize testing efforts, and generate actionable recommendations with specific test cases and effort estimates. Supports Istanbul/NYC, lcov, and Jest coverage formats for TypeScript, Angular, and NestJS applications.

## When to Activate

- User asks to analyze or review test coverage reports
- User wants to identify gaps in test coverage
- User mentions Istanbul, NYC, lcov, or Jest coverage reports
- User asks how to improve test quality or reach coverage targets
- User wants a prioritized plan for writing missing tests

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>Provide your coverage report data (Istanbul/NYC JSON, lcov summary, or Jest output). You can paste it directly or provide a file path.</question>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>What is your target coverage percentage?</question>
<options>

  <option value="70">70% - Minimum viable coverage</option>
  <option value="80">80% - Standard target</option>
  <option value="90">90% - High coverage target</option>
  <option value="custom">Custom target</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>Are there specific areas you want to prioritize? (e.g., authentication, payments, core business logic). Type "none" for general analysis.</question>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>Describe the codebase structure and any critical paths that should have higher coverage. Type "auto-detect" to let the analysis determine this.</question>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Discovery Phase

1. Use Glob to find coverage report files in the workspace (coverage/, .nyc_output/, lcov.info)
2. Use Read to parse coverage data and identify files below target thresholds
3. Use Grep to find test files and understand existing test patterns

### Step 3: Plan (if complex)

For large codebases with many files below target, enter plan mode to scope the analysis:

<EnterPlanMode>
<summary>
Outline the analysis scope, identify the highest-risk modules,
and confirm priority areas with the user before generating the full report.
</summary>
</EnterPlanMode>

### Step 4: Analysis

Perform analysis across these dimensions:

1. **Parse Coverage Data** - Extract statement, branch, function, and line coverage. Identify files below target thresholds. Calculate coverage gaps.

2. **Risk Assessment** - Evaluate business impact of each uncovered area. Consider security implications. Identify critical user journeys that lack coverage.

3. **Gap Analysis** - Detail specific uncovered code paths. Identify patterns in missing coverage. Highlight branch coverage weaknesses (often the most neglected metric).

4. **Generate Recommendations** - Provide specific test cases to add with code examples. Estimate effort for each improvement. Prioritize based on risk and business impact.

### Step 5: Deliver Report

Write the complete analysis following the output format below, including a phased action plan with realistic effort estimates.

## Output Format

<output_format>
**Coverage Analysis Report**

**Executive Summary**

| Metric     | Current | Target | Gap | Status                             |
| ---------- | ------- | ------ | --- | ---------------------------------- |
| Statements | X%      | Y%     | Z%  | [Below Target / Near Target / Met] |
| Branches   | X%      | Y%     | Z%  | [Status]                           |
| Functions  | X%      | Y%     | Z%  | [Status]                           |
| Lines      | X%      | Y%     | Z%  | [Status]                           |

**Overall Assessment**: [Summary of coverage health and main findings]

---

**Risk Assessment by File**

| File        | Coverage | Risk Level                     | Business Impact      | Priority       |
| ----------- | -------- | ------------------------------ | -------------------- | -------------- |
| [file path] | X%       | [Critical / High / Low / None] | [Impact description] | [P0 / P1 / P2] |

---

**Critical Gaps Analysis**

For each high-priority gap:

**[N]. [File/Module Name] ([X%] Coverage) - [Priority]**

**Uncovered Areas:**

- [List of untested code paths]

**Recommended Tests:**

```typescript
[Specific test cases with describe/it blocks]
```

**Estimated Effort:** [X hours]
**Coverage Impact:** [+Y% on file]

---

**Prioritized Action Plan**

**Phase 1: [Description] (Week 1)**

| Task   | File   | Target Coverage | Effort |
| ------ | ------ | --------------- | ------ |
| [Task] | [File] | X% to Y%        | Xh     |

**Phase 1 Impact:** Overall coverage X% to Y%

**Phase 2: [Description] (Week 2)**

[Same table format]

---

**Coverage Improvement Roadmap**

[Visual representation of coverage trajectory across phases]
</output_format>

## Best Practices

- Focus on meaningful coverage, not just hitting numbers
- Prioritize based on business risk, not just low percentages
- Consider test maintainability in recommendations
- Provide specific test case examples with describe/it blocks
- Include realistic effort estimates for each phase
- Track expected coverage improvements at each phase
- Highlight branch coverage gaps separately (often the most neglected)

## Anti-Patterns

- Do not recommend tests for trivial code (simple getters/setters)
- Do not recommend 100% coverage as a goal (diminishing returns past 90%)
- Do not ignore framework-specific testing patterns
- Do not prioritize solely by coverage percentage without considering business impact
- Do not suggest tests that are expensive to maintain for low-risk code
- Do not skip the risk assessment step

## Examples

### Example 1: Angular Component Library

**Input**: "Coverage at 67% statements, 52% branches. Data table component at 23%, auth service at 38%. Target is 80% before release."

**Output**: Executive summary showing critical branch coverage gap. Risk assessment prioritizing auth service (P0, security) and data table (P0, core UI). Phase 1 plan targeting 74% in Week 1, Phase 2 reaching 81% in Week 2 with specific test cases for sorting, pagination, token refresh, and RBAC.

### Example 2: NestJS API Service

**Input**: "Coverage at 78% statements, 61% branches. Payments service at 42%, roles guard at 34%. Payments is business-critical."

**Output**: Analysis showing function coverage meets target but branch coverage needs work. P0 focus on payments service (retry logic, refunds, webhooks) and roles guard (RBAC checks). 23-hour action plan over 2 weeks to reach 85%+ coverage.

---

**Human-in-the-Loop by codewizwit**

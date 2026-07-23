---
name: e2e-strategy
description: >-
  Generates comprehensive E2E testing strategies for web applications. Use when
  user asks to "create E2E tests", "generate a testing strategy", or mentions
  "end-to-end testing".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion, EnterPlanMode
---

# E2E Testing Strategy Generator

Analyzes your application to generate a comprehensive end-to-end testing
strategy. Detects or recommends a test framework, identifies critical user flows,
designs Page Object Models, and creates a full test plan with CI/CD integration.
Produces a strategy document with prioritized test scenarios, example code, and
reliability guidance.

## When to Activate

- User asks to create or plan E2E tests for their application
- User mentions end-to-end testing strategy or test automation planning
- User wants to set up Playwright or Cypress testing infrastructure
- User asks about test organization, flaky test prevention, or CI integration

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>Which E2E framework do you want to use?</question>
<option value="playwright">Playwright</option>
<option value="cypress">Cypress</option>
<option value="detect">Auto-detect from project</option>
<option value="recommend">Recommend one for my project</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What is the scope of this testing strategy?</question>
<option value="full">Full application coverage</option>
<option value="flows">Specific user flows (auth, checkout, etc.)</option>
<option value="smoke">Smoke test suite only</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For full application strategies, enter plan mode to outline the approach:

<EnterPlanMode>
<summary>
List the identified user flows, proposed test organization, framework
recommendation rationale, and estimated number of test scenarios.
Confirm priority levels and CI/CD integration approach.
</summary>
</EnterPlanMode>

### Step 3: Discovery

1. Use Glob to find application code, routes, and components
2. Use Read to examine `package.json` for existing E2E framework detection
3. Use Glob to find existing E2E tests (`e2e/`, `tests/`, `cypress/`, `playwright/`)
4. Identify application type (SPA, SSR, PWA) from build configuration
5. Use Read to examine routing files and map critical user journeys

### Step 4: Flow Analysis

1. Analyze authentication implementation
2. Identify API endpoints and integrations
3. Map critical user journeys from code structure
4. Determine priority levels for each flow

### Step 5: Strategy Creation

Generate the strategy covering:

- Test organization and directory structure
- Page Object Model designs
- Test data management approach
- Selector strategy for the tech stack
- Wait strategies and flakiness prevention
- Parallel execution and performance targets
- CI/CD pipeline configuration
- Visual regression testing guidance
- Cross-browser and device coverage

### Step 6: Deliver Strategy

Write the complete strategy to a markdown file with example test code.

## Output Format

<output_format>
Write the E2E testing strategy to a markdown file. Structure as follows:

**Test Scope and Prioritization**

- P0 (Smoke): Critical path tests for every PR
- P1 (Regression): Full suite for main branch
- P2 (Extended): Nightly edge case and error scenarios

**Recommended Directory Structure**

- Specific folder organization for this project

**Page Object Models**

- Key POMs needed with TypeScript example code

**Critical Test Scenarios**

- Step-by-step test cases for each critical flow

**Selector Strategy**

- Specific approach for this tech stack (data-testid, ARIA, semantic)

**Data Management Approach**

- Fixtures, dynamic data, cleanup strategies

**CI/CD Pipeline**

- GitHub Actions workflow configuration

**Performance Optimizations**

- Auth state reuse, parallel execution, selective testing, external service mocking

**Anti-Patterns to Avoid**

- Common mistakes with code examples

**Success Metrics**

- Coverage, pass rate, flaky rate, execution time targets
  </output_format>

## Best Practices

- Prioritize test reliability over extensive coverage
- Use Page Object Model pattern for maintainable tests
- Prefer `data-testid` attributes for stable selectors
- Design tests to be independent and isolated
- Reuse authentication state across tests for speed
- Mock external services to prevent flakiness
- Include CI/CD integration from the start

## Anti-Patterns

- Do not use hardcoded `waitForTimeout` calls instead of proper wait conditions
- Do not share test data between tests creating coupling
- Do not test implementation details (internal state, CSS classes)
- Do not run unit-level validation tests as E2E scenarios
- Do not create overly specific selectors that break on minor UI changes
- Do not skip test data cleanup leading to test pollution

## Examples

### Example 1: Full Application Strategy

**Input**: "Analyze the application and create a comprehensive E2E testing strategy"

**Output**: Complete strategy document with prioritized test scenarios across all
user flows, Playwright configuration, Page Object Models, CI/CD pipeline, and
success metrics.

### Example 2: Authentication Flow Tests

**Input**: "Create E2E tests for all authentication and authorization flows"

**Output**: Focused strategy covering login, registration, OAuth, password reset,
session management, and role-based access with Page Object Models and test code.

### Example 3: Smoke Test Suite

**Input**: "Set up a smoke test suite that runs on every PR"

**Output**: Minimal critical-path test suite covering login, core feature usage,
and basic navigation with sub-5-minute execution time target.

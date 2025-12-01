# E2E Testing Strategy Generator

Generates comprehensive end-to-end testing strategy with test plans, page objects, and CI/CD integration.

## What You'll Be Asked

- **Application type** - SPA, SSR, PWA (detected from codebase)
- **Testing framework** - Playwright or Cypress (detected or recommended)
- **Critical user flows** (optional) - Authentication, checkout, core features
- **Coverage goals** (optional) - Smoke tests vs. full regression

## Usage Examples

### Example 1: Authentication Flow Strategy

Create E2E tests for user registration, login, password reset, and OAuth flows.

**Expected Output:**

```markdown
**Test Scope & Prioritization:**
P0 (Smoke - every PR):

- Login with email/password
- Create project (happy path)

P1 (Regression - main branch):

- User registration flow
- Google OAuth login
```

### Example 2: Full Application Coverage

Analyze codebase routes to generate comprehensive test plan with page objects and CI pipeline.

**Expected Output:**

```markdown
**Recommended Directory Structure:**
e2e/
├── pages/ # Page Object Models
├── tests/smoke/ # Critical path tests
├── tests/regression/
└── playwright.config.ts

**Performance Targets:**

- Smoke suite: < 5 minutes
```

## Related Resources

- [Playwright Docs](https://playwright.dev) - Framework documentation
- [Cypress Docs](https://docs.cypress.io) - Alternative framework
- [Unit Test Generator](../unit-test-generator) - Complementary testing
- [CI/CD Pipeline Optimization](../../ci-cd/pipeline-optimization) - Test execution speed

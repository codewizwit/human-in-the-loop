# E2E Testing Strategy Generator

Analyzes your application to generate a comprehensive end-to-end testing strategy. Detects or recommends a test framework, identifies critical user flows, designs Page Object Models, and creates a full test plan with CI/CD integration.

## What You'll Be Asked

- **Framework**: Playwright, Cypress, auto-detect, or get a recommendation
- **Scope**: Full application coverage, specific user flows, or smoke test suite only

## Usage Examples

### Full Application Strategy

> "Analyze the application and create a comprehensive E2E testing strategy"

Generates a complete strategy document covering prioritized test scenarios, Playwright/Cypress configuration, Page Object Models, CI/CD pipeline, and success metrics.

### Authentication Flow Tests

> "Create E2E tests for all authentication and authorization flows"

Produces a focused strategy for login, registration, OAuth, password reset, and session management with Page Object Models and test code.

### Smoke Test Suite

> "Set up a smoke test suite that runs on every PR"

Creates a minimal critical-path test suite targeting sub-5-minute execution time with the most important user flows.

## Related Resources

- [Unit Test Generator](../unit-test-generator/) - For unit-level test generation
- [TypeScript Code Review](../code-review-ts/) - Review code quality alongside test strategy

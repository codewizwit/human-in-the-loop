# E2E Testing Strategy Generator

Generates comprehensive end-to-end testing strategies using Playwright or Cypress, covering test organization, page object models, data management, and CI/CD integration.

## Overview

This prompt helps you design a complete E2E testing strategy for your web application. It provides specific recommendations for test structure, selectors, data management, performance optimization, and CI/CD integration based on your tech stack and critical user flows.

## Use Cases

- Planning E2E test automation for a new project
- Improving existing test suite reliability and speed
- Migrating from one E2E framework to another
- Reducing test flakiness and maintenance burden
- Setting up CI/CD pipelines for E2E tests

## Variables

| Variable         | Required | Description                                                 |
| ---------------- | -------- | ----------------------------------------------------------- |
| `framework`      | Yes      | E2E testing framework (Playwright, Cypress, or other)       |
| `app_type`       | Yes      | Type of application (Web app, SPA, SSR, Mobile web, PWA)    |
| `critical_flows` | Yes      | List of critical user flows that must be tested             |
| `tech_stack`     | No       | Technology stack and frameworks (React, Angular, Vue, etc.) |
| `existing_tests` | No       | Existing test setup to review or improve                    |

## Usage

### Basic Usage

```yaml
framework: Playwright
app_type: SPA (React)
critical_flows: |
  1. User login
  2. Create project
  3. Invite team member
  4. Upgrade subscription
```

### With Tech Stack

```yaml
framework: Cypress
app_type: Server-side rendered (Next.js)
critical_flows: |
  1. Browse product catalog
  2. Add items to cart
  3. Checkout and payment
  4. Order confirmation
tech_stack: |
  - Next.js 14 with App Router
  - TypeScript
  - Prisma ORM
  - Stripe for payments
```

### Reviewing Existing Tests

```yaml
framework: Playwright
app_type: SPA (Vue)
critical_flows: |
  1. User authentication
  2. Dashboard navigation
  3. Data export
existing_tests: |
  Current setup:
  - Tests are slow (45 minutes for full suite)
  - Many flaky tests (20% failure rate)
  - Using CSS class selectors
  - No page object models
  - Running sequentially
```

## Output

The prompt generates a comprehensive strategy including:

1. **Test Scope & Prioritization** - P0/P1/P2 classification
2. **Directory Structure** - Recommended folder organization
3. **Page Object Models** - Example POMs with best practices
4. **Critical Test Scenarios** - Step-by-step test implementations
5. **Selector Strategy** - data-testid and semantic approaches
6. **Data Management** - Fixtures, test data generation, cleanup
7. **CI/CD Pipeline** - GitHub Actions workflow example
8. **Performance Optimizations** - Parallel execution, auth reuse
9. **Example Test Code** - Complete working examples
10. **Anti-Patterns** - Common mistakes to avoid
11. **Success Metrics** - KPIs to track test effectiveness

## Example Output

```typescript
// Recommended Page Object Model
export class LoginPage {
  constructor(private page: Page) {}

  readonly emailInput = '[data-testid="email-input"]';
  readonly passwordInput = '[data-testid="password-input"]';
  readonly submitButton = '[data-testid="login-submit"]';

  async login(email: string, password: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitButton);
    await this.page.waitForURL('/dashboard');
  }
}

// Example Test
test('User can login and create project', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password');

  await expect(page).toHaveURL(/.*dashboard/);
});
```

## Best Practices Covered

- **Test Organization** - Smoke vs regression, test tagging, isolation
- **Reliability** - Proper waits, retry strategies, flaky test prevention
- **Performance** - Parallel execution, auth state reuse, selective testing
- **Maintainability** - Page Object Models, DRY principles, clear naming
- **CI/CD Integration** - GitHub Actions workflows, sharding, reporting
- **Cross-browser Testing** - Multi-browser strategy, device coverage
- **Visual Testing** - Screenshot comparison, baseline management

## Integration with Other Tools

This prompt works well with:

- Unit Test Generator - For component-level tests (coming soon)
- [API Design](../../architecture/api-design/README.md) - For API testing strategy
- Pipeline Optimization - For CI/CD improvements (coming soon)
- AWS Deployment Strategy - For infrastructure deployment (coming soon)

## Framework-Specific Tips

### Playwright

- Excellent auto-waiting and retry mechanisms
- Built-in support for multiple browsers
- Powerful network interception
- Great debugging tools (trace viewer)

### Cypress

- Real-time test runner
- Time-travel debugging
- Excellent documentation
- Strong community and plugins

## Common Issues Addressed

- **Flaky Tests** - Proper wait strategies, isolation techniques
- **Slow Test Suite** - Parallelization, auth reuse, selective running
- **Maintenance Burden** - Page Object Models, good selectors
- **CI/CD Failures** - Proper setup, sharding, retry strategies
- **Cross-browser Issues** - Browser-specific handling, compatibility

## Tags

`testing`, `e2e`, `playwright`, `cypress`, `automation`, `quality-assurance`

## Version

1.0.0

## License

MIT

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

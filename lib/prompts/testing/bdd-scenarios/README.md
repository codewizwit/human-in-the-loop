# BDD Scenario Generator

Generate behavior-driven development scenarios from user stories or feature descriptions. Creates Gherkin syntax scenarios for Cucumber, Jest-Cucumber, or Cypress-Cucumber.

## What It Does

- **Converts** user stories to Gherkin scenarios
- **Generates** Given/When/Then step definitions
- **Covers** happy paths, edge cases, and error scenarios
- **Tags** scenarios for filtering and organization

## Scenario Types Generated

| Type               | Tag            | Purpose                            |
| ------------------ | -------------- | ---------------------------------- |
| **Happy Path**     | `@happy-path`  | Normal successful flows            |
| **Edge Cases**     | `@edge-case`   | Boundary conditions                |
| **Error Handling** | `@error`       | Validation and failures            |
| **Security**       | `@security`    | Auth, permissions, data protection |
| **Performance**    | `@performance` | Load and response time             |

## Usage Examples

### Example 1: Shopping Cart Feature

```
Feature: Shopping cart management for an Angular e-commerce application.
Users should be able to add items, update quantities, remove items, and see real-time totals.
```

**What You Get:**

- Feature file with 10+ scenarios
- Background setup for common preconditions
- Data tables for multi-item scenarios
- Step definition TypeScript examples
- Tags for test filtering

### Example 2: Authentication Flow

```
Feature: User authentication for an Angular application with NestJS backend.
Users can login with email/password, use OAuth (Google), reset password, and logout.
```

**What You Get:**

- Login, logout, password reset scenarios
- Session management behaviors
- Security scenarios (lockout, expiry)
- OAuth integration tests

### Example 3: CRUD Operations

```
Feature: CRUD operations for project management in an Nx monorepo.
Angular frontend with NestJS API.
```

**What You Get:**

- Create, Read, Update, Delete scenarios
- Validation and duplicate handling
- Optimistic update with rollback
- API error handling scenarios

## Output Structure

Every BDD scenario set includes:

1. **Feature File** - Complete Gherkin `.feature` file
2. **Step Definitions** - TypeScript examples for Jest-Cucumber
3. **Tags Summary** - All tags used with counts
4. **Coverage Matrix** - Scenario type breakdown

## Gherkin Syntax Reference

```gherkin
Feature: Feature name
  As a [role]
  I want [capability]
  So that [benefit]

  Background:
    Given common preconditions

  @tag1 @tag2
  Scenario: Scenario name
    Given [precondition]
    When [action]
    Then [expected result]
    And [additional assertion]

  Scenario Outline: Parameterized scenario
    Given <input>
    Then <output>

    Examples:
      | input | output |
      | a     | b      |
```

## Framework Support

| Framework            | Use Case                       |
| -------------------- | ------------------------------ |
| **Cucumber**         | Standard BDD, Java/JS backends |
| **Jest-Cucumber**    | Angular unit/integration tests |
| **Cypress-Cucumber** | Angular E2E tests              |

## Best Practices Applied

- Declarative language (what, not how)
- Atomic, reusable steps
- Domain language over technical jargon
- Single behavior per scenario
- Comprehensive tagging strategy

## Related Resources

- [E2E Strategy](../e2e-strategy) - Cypress/Playwright test strategy
- [Unit Test Generator](../unit-test-generator) - Jest unit test generation

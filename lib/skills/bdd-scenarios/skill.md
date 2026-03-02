---
name: bdd-scenarios
description: >-
  Generates behavior-driven development scenarios in Gherkin syntax from user
  stories or feature descriptions. Use when user asks to "generate BDD scenarios",
  "write Gherkin tests", "create feature files", or mentions "Cucumber testing".
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

# BDD Scenario Generator

Generates comprehensive behavior-driven development scenarios from user stories, requirements, or feature descriptions. Creates Gherkin syntax scenarios organized by type (happy path, edge cases, error handling, security) with step definitions and tag strategies for Cucumber, Jest-Cucumber, or Cypress-Cucumber integration.

## When to Activate

- User asks to generate BDD scenarios or Gherkin feature files
- User wants to convert user stories or requirements into test scenarios
- User mentions Cucumber, Jest-Cucumber, or Cypress-Cucumber testing
- User needs acceptance test scenarios for a feature
- User asks for behavior-driven test coverage of a feature

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>Describe the feature or user story you want BDD scenarios for.</question>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>Which BDD framework are you using?</question>
<options>

  <option value="cucumber">Cucumber</option>
  <option value="jest-cucumber">Jest-Cucumber</option>
  <option value="cypress-cucumber">Cypress-Cucumber</option>
  <option value="other">Other</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>What level of scenario detail do you need?</question>
<options>

  <option value="minimal">Minimal - happy path scenarios only</option>
  <option value="standard">Standard - happy path, edge cases, and error handling</option>
  <option value="comprehensive">Comprehensive - all scenario types including security and performance</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>Provide any additional context about the system, existing step definitions, or constraints. Type "none" if not applicable.</question>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Plan (if complex)

For features with multiple user flows or cross-cutting concerns, enter plan mode:

<EnterPlanMode>
<summary>
Outline the feature scope, identify distinct user flows to cover,
and confirm scenario categories with the user before generating.
</summary>
</EnterPlanMode>

### Step 3: Discovery

1. Use Glob and Read to examine existing feature files and step definitions
2. Identify existing step patterns that can be reused
3. Understand the domain language used in the project

### Step 4: Generate Scenarios

Generate scenarios following these guidelines:

1. **Feature Structure** - Start with "As a... I want... So that..." format. Include Background section for common preconditions.

2. **Scenario Types** - Generate scenarios for each applicable type:

   - **Happy Path** (`@happy-path`) - Normal successful flows
   - **Edge Cases** (`@edge-case`) - Boundary conditions and special cases
   - **Error Scenarios** (`@error`) - Error handling and validation
   - **Security** (`@security`) - Security-related behaviors
   - **Performance** (`@performance`) - Performance-related scenarios

3. **Gherkin Best Practices** - Use declarative language (what, not how). Keep steps atomic and reusable. Use data tables for multiple inputs. Tag scenarios for filtering and organization.

4. **Step Writing** - Given (preconditions), When (actions), Then (assertions), And/But (chaining).

### Step 5: Deliver Results

Write the complete feature file, step definition structure, tags summary, and coverage matrix.

## Output Format

<output_format>
**Feature File**

```gherkin
[Complete .feature file with Gherkin scenarios organized by type]
```

**Step Definitions Structure**

```typescript
[TypeScript step definition examples for key scenarios]
```

**Tags Summary**

| Tag  | Purpose     | Count |
| ---- | ----------- | ----- |
| @tag | Description | N     |

**Test Coverage Matrix**

| Scenario Type  | Count |
| -------------- | ----- |
| Happy Path     | N     |
| Edge Cases     | N     |
| Error Handling | N     |
| Security       | N     |

</output_format>

## Best Practices

- Use declarative language that describes behavior, not implementation
- Keep steps atomic and reusable across scenarios
- Use data tables for scenarios with multiple inputs or expected outputs
- Use scenario outlines for parameterized tests
- Tag all scenarios for filtering and selective execution
- Include Background section for shared preconditions
- Consider component state and async operations for Angular applications
- Account for UI states (loading, error, empty) in scenarios

## Anti-Patterns

- Do not include implementation details in Gherkin steps
- Do not use technical jargon instead of domain language
- Do not write overly long scenarios that test multiple behaviors
- Do not skip negative test cases and error scenarios
- Do not create scenarios that cannot be automated
- Do not use vague assertions like "should work correctly"

## Examples

### Example 1: E-commerce Shopping Cart

**Input**: "Shopping cart management for an Angular e-commerce application. Users should be able to add items, update quantities, remove items, and see real-time totals."

**Output**: Complete feature file with 10 scenarios covering happy path (add, update quantity, remove), edge cases (duplicate item, zero quantity, persistence), and error scenarios (out of stock, max quantity, network failure). Includes Jest-Cucumber step definitions and tag summary.

### Example 2: User Authentication Flow

**Input**: "User authentication for an Angular application with NestJS backend. Login with email/password, OAuth, password reset, and session management."

**Output**: Feature file with 7 scenarios covering login, OAuth, failed attempts, account lockout, password reset, session expiry, and logout. Tagged by type (happy-path, error, security, session).

### Example 3: CRUD API Operations

**Input**: "CRUD operations for project management in an Nx monorepo with Angular frontend and NestJS API."

**Output**: Feature file with 8 scenarios covering create, read, update, delete operations plus validation errors, optimistic updates with rollback, loading states, and API error handling.

---

**Human-in-the-Loop by codewizwit**

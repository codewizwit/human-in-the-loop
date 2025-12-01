<prompt>
  <metadata>
    <id>bdd-scenarios</id>
    <name>BDD Scenario Generator</name>
    <version>1.0.0</version>
    <description>Generate behavior-driven development scenarios from user stories, requirements, or feature descriptions. Creates Gherkin syntax scenarios for Cucumber, Jest-Cucumber, or Cypress-Cucumber integration.</description>
    <category>testing</category>
    <author>codewizwit</author>
    <license>MIT</license>
    <tags>
      <tag>testing</tag>
      <tag>bdd</tag>
      <tag>gherkin</tag>
      <tag>cucumber</tag>
      <tag>jest-cucumber</tag>
      <tag>cypress</tag>
      <tag>acceptance-testing</tag>
      <tag>angular</tag>
    </tags>
    <lastUpdated>2025-12-01</lastUpdated>
  </metadata>

  <variables>
    <variable name="feature_description" required="true">User story, requirement, or feature to convert to BDD scenarios</variable>
    <variable name="context" required="false">Additional context about the system, existing steps, or constraints</variable>
    <variable name="framework" required="false" default="cucumber">Target BDD framework (cucumber, jest-cucumber, cypress-cucumber)</variable>
    <variable name="detail_level" required="false" default="standard">Level of scenario detail (minimal, standard, comprehensive)</variable>
  </variables>

  <examples>
    <example>
      <title>E-commerce Shopping Cart</title>
      <input>
Feature: Shopping cart management for an Angular e-commerce application.
Users should be able to add items, update quantities, remove items, and see real-time totals.
The cart persists across sessions and syncs with the backend.
      </input>
      <output>
## Feature File

```gherkin
Feature: Shopping Cart Management
  As a customer
  I want to manage items in my shopping cart
  So that I can purchase the products I need

  Background:
    Given I am a logged-in customer
    And I am on the product catalog page

  # Happy Path Scenarios
  @happy-path @cart
  Scenario: Add item to empty cart
    Given my shopping cart is empty
    When I click "Add to Cart" on product "Angular Best Practices Book"
    Then the cart badge should show "1" item
    And the cart should contain "Angular Best Practices Book"
    And the cart total should be "$49.99"

  @happy-path @cart
  Scenario: Add multiple items to cart
    Given my shopping cart contains:
      | product                      | quantity | price  |
      | Angular Best Practices Book  | 1        | $49.99 |
    When I click "Add to Cart" on product "RxJS Deep Dive Course"
    Then the cart badge should show "2" items
    And the cart total should be "$149.98"

  @happy-path @cart
  Scenario: Update item quantity
    Given my shopping cart contains:
      | product                      | quantity | price  |
      | Angular Best Practices Book  | 1        | $49.99 |
    When I change the quantity to "3" for "Angular Best Practices Book"
    Then the line item total should be "$149.97"
    And the cart total should be "$149.97"

  @happy-path @cart
  Scenario: Remove item from cart
    Given my shopping cart contains:
      | product                      | quantity | price  |
      | Angular Best Practices Book  | 1        | $49.99 |
      | RxJS Deep Dive Course        | 1        | $99.99 |
    When I click "Remove" on "Angular Best Practices Book"
    Then the cart should not contain "Angular Best Practices Book"
    And the cart badge should show "1" item
    And the cart total should be "$99.99"

  # Edge Cases
  @edge-case @cart
  Scenario: Add item that is already in cart
    Given my shopping cart contains:
      | product                      | quantity | price  |
      | Angular Best Practices Book  | 1        | $49.99 |
    When I click "Add to Cart" on product "Angular Best Practices Book"
    Then the quantity for "Angular Best Practices Book" should be "2"
    And the cart badge should show "2" items

  @edge-case @cart
  Scenario: Set quantity to zero removes item
    Given my shopping cart contains:
      | product                      | quantity | price  |
      | Angular Best Practices Book  | 2        | $49.99 |
    When I change the quantity to "0" for "Angular Best Practices Book"
    Then the cart should not contain "Angular Best Practices Book"
    And the cart should be empty

  @edge-case @cart
  Scenario: Cart persists after page refresh
    Given my shopping cart contains:
      | product                      | quantity | price  |
      | Angular Best Practices Book  | 1        | $49.99 |
    When I refresh the page
    Then my shopping cart should contain:
      | product                      | quantity | price  |
      | Angular Best Practices Book  | 1        | $49.99 |

  # Error Scenarios
  @error @cart
  Scenario: Add out-of-stock item
    Given product "Limited Edition Book" is out of stock
    When I try to add "Limited Edition Book" to cart
    Then I should see error message "This item is currently out of stock"
    And the cart should not contain "Limited Edition Book"

  @error @cart
  Scenario: Exceed maximum quantity
    Given my shopping cart contains:
      | product                      | quantity | price  |
      | Angular Best Practices Book  | 10       | $49.99 |
    And the maximum quantity per item is 10
    When I try to change the quantity to "11" for "Angular Best Practices Book"
    Then I should see error message "Maximum quantity is 10"
    And the quantity should remain "10"

  @error @cart @network
  Scenario: Handle network failure during add to cart
    Given the backend service is unavailable
    When I click "Add to Cart" on product "Angular Best Practices Book"
    Then I should see error message "Unable to update cart. Please try again."
    And the cart should remain unchanged
```

## Step Definitions Structure

```typescript
import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent } from '@testing-library/angular';

const feature = loadFeature('./features/shopping-cart.feature');

defineFeature(feature, (test) => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = TestBed.inject(CartService);
  });

  test('Add item to empty cart', ({ given, when, then, and }) => {
    given('my shopping cart is empty', () => {
      cartService.clear();
    });

    when(/^I click "Add to Cart" on product "(.+)"$/, (productName: string) => {
      const addButton = screen.getByTestId(`add-to-cart-${productName}`);
      fireEvent.click(addButton);
    });

    then(/^the cart badge should show "(\d+)" item$/, (count: string) => {
      expect(screen.getByTestId('cart-badge')).toHaveTextContent(count);
    });

    and(/^the cart should contain "(.+)"$/, (productName: string) => {
      expect(cartService.items()).toContainEqual(
        expect.objectContaining({ name: productName })
      );
    });
  });
});
```

## Tags Summary

| Tag         | Purpose                  | Count |
| ----------- | ------------------------ | ----- |
| @happy-path | Normal successful flows  | 4     |
| @edge-case  | Boundary conditions      | 3     |
| @error      | Error handling scenarios | 3     |
| @cart       | Shopping cart related    | 10    |
| @network    | Network-related tests    | 1     |

## Test Coverage Matrix

| Scenario Type  | Count |
| -------------- | ----- |
| Happy Path     | 4     |
| Edge Cases     | 3     |
| Error Handling | 3     |

      </output>
    </example>

    <example>
      <title>User Authentication Flow</title>
      <input>

Feature: User authentication for an Angular application with NestJS backend.
Users can login with email/password, use OAuth (Google), reset password, and logout.
Sessions expire after 30 minutes of inactivity.
</input>
<output>

## Feature File

```gherkin
Feature: User Authentication
  As a user
  I want to securely authenticate to the application
  So that I can access my personalized content and data

  Background:
    Given I am on the login page
    And I am not currently logged in

  @happy-path @auth @login
  Scenario: Successful login with email and password
    Given a user exists with email "developer@example.com"
    When I enter email "developer@example.com"
    And I enter password "SecurePass123!"
    And I click the "Sign In" button
    Then I should be redirected to the dashboard
    And I should see welcome message "Welcome back, Developer"
    And my session should be active

  @happy-path @auth @oauth
  Scenario: Successful login with Google OAuth
    When I click "Sign in with Google"
    And I complete Google authentication for "developer@gmail.com"
    Then I should be redirected to the dashboard
    And my account should be linked to Google

  @error @auth @login
  Scenario: Login with incorrect password
    Given a user exists with email "developer@example.com"
    When I enter email "developer@example.com"
    And I enter password "WrongPassword"
    And I click the "Sign In" button
    Then I should see error "Invalid email or password"
    And I should remain on the login page

  @security @auth @login
  Scenario: Account lockout after failed attempts
    Given a user exists with email "developer@example.com"
    And I have failed login 4 times
    When I enter incorrect password for the 5th time
    Then I should see error "Account locked. Please try again in 15 minutes."
    And security alert email should be sent

  @happy-path @auth @password-reset
  Scenario: Request password reset
    Given a user exists with email "developer@example.com"
    When I click "Forgot Password"
    And I enter email "developer@example.com"
    And I click "Send Reset Link"
    Then I should see message "Check your email for reset instructions"

  @session @auth
  Scenario: Session expires after inactivity
    Given I am logged in
    And my session has been inactive for 30 minutes
    When I try to access a protected page
    Then I should be redirected to the login page
    And I should see message "Your session has expired. Please log in again."

  @happy-path @auth @logout
  Scenario: Successful logout
    Given I am logged in
    When I click "Sign Out"
    Then I should be redirected to the login page
    And my session should be terminated
```

## Tags Summary

| Tag         | Purpose                | Count |
| ----------- | ---------------------- | ----- |
| @happy-path | Successful flows       | 4     |
| @error      | Error scenarios        | 1     |
| @security   | Security behaviors     | 1     |
| @session    | Session management     | 1     |
| @auth       | Authentication related | 7     |

      </output>
    </example>

    <example>
      <title>API Data Management (Angular + NestJS)</title>
      <input>

Feature: CRUD operations for project management in an Nx monorepo.
Angular frontend with NestJS API. Users can create, read, update, and delete projects.
</input>
<output>

## Feature File

```gherkin
Feature: Project Management CRUD Operations
  As a project manager
  I want to manage projects through the application
  So that I can organize and track team work

  Background:
    Given I am logged in as a project manager
    And I am on the projects page

  @crud @create @happy-path
  Scenario: Create a new project
    When I click "New Project"
    And I fill in the project form:
      | field       | value                         |
      | name        | Angular Migration Project     |
      | description | Migrate legacy app to Angular |
      | status      | Planning                      |
    And I click "Create Project"
    Then I should see success message "Project created successfully"
    And "Angular Migration Project" should appear in the project list

  @crud @create @validation
  Scenario: Validation errors on project creation
    When I click "New Project"
    And I leave the name field empty
    And I click "Create Project"
    Then I should see validation error "Project name is required"

  @crud @read @happy-path
  Scenario: View project list
    Given the following projects exist:
      | name          | status      |
      | Project Alpha | In Progress |
      | Project Beta  | Planning    |
    When I view the projects page
    Then I should see 2 projects listed

  @crud @update @happy-path
  Scenario: Update project details
    Given a project exists with name "Angular Migration Project"
    When I open "Angular Migration Project"
    And I click "Edit"
    And I change the status to "In Progress"
    And I click "Save Changes"
    Then I should see success message "Project updated successfully"

  @crud @update @optimistic
  Scenario: Optimistic update with rollback on failure
    Given a project exists with status "Planning"
    And the API will fail on update
    When I change the status to "In Progress"
    Then I should see status change to "In Progress" immediately
    And when the API fails
    Then the status should rollback to "Planning"
    And I should see error "Failed to update project. Please try again."

  @crud @delete @happy-path
  Scenario: Delete a project
    Given a project exists with name "Old Project"
    When I open "Old Project"
    And I click "Delete Project"
    And I confirm deletion in the dialog
    Then I should see success message "Project deleted successfully"

  @api @loading
  Scenario: Display loading state during API calls
    When I navigate to the projects page
    Then I should see a loading indicator
    And when the API responds
    Then projects should be displayed

  @api @error
  Scenario: Handle API error gracefully
    Given the API returns an error
    When I try to load projects
    Then I should see error message "Unable to load projects"
    And I should see a "Retry" button
```

## Tags Summary

| Tag         | Purpose            | Count |
| ----------- | ------------------ | ----- |
| @crud       | CRUD operations    | 6     |
| @happy-path | Successful flows   | 4     |
| @validation | Input validation   | 1     |
| @optimistic | Optimistic updates | 1     |
| @api        | API integration    | 2     |

      </output>
    </example>

  </examples>

  <context>
You are a BDD testing expert specializing in Angular applications. You understand:
- Gherkin syntax and best practices
- Angular testing patterns with Jest and Cypress
- NestJS API testing strategies
- Behavior-driven development principles
- Test organization and tagging strategies
  </context>

  <instructions>
Generate comprehensive BDD scenarios following these guidelines:

## 1. Feature Structure

- Start with a clear Feature description using "As a... I want... So that..." format
- Include Background section for common preconditions
- Group related scenarios logically

## 2. Scenario Types

Generate scenarios for each type as applicable:

- **Happy Path** (`@happy-path`): Normal successful flows
- **Edge Cases** (`@edge-case`): Boundary conditions and special cases
- **Error Scenarios** (`@error`): Error handling and validation
- **Security** (`@security`): Security-related behaviors
- **Performance** (`@performance`): Performance-related scenarios

## 3. Gherkin Best Practices

- Use declarative language (what, not how)
- Keep steps atomic and reusable
- Use data tables for multiple inputs
- Use scenario outlines for parameterized tests
- Tag scenarios for filtering and organization

## 4. Step Writing

- **Given**: Set up preconditions and context
- **When**: Describe the action being tested
- **Then**: Assert the expected outcome
- **And/But**: Chain additional steps of the same type

## 5. Angular-Specific Considerations

- Consider component state and lifecycle
- Account for async operations and observables
- Include UI state scenarios (loading, error, empty)
- Test NgRx/signal state changes where relevant
  </instructions>

  <constraints>

- Use Gherkin syntax (Given/When/Then)
- Keep scenarios focused on single behaviors
- Avoid implementation details in steps
- Use domain language, not technical jargon
- Include both positive and negative test cases
- Tag all scenarios appropriately
- Limit scenarios to testable behaviors
  </constraints>

  <output_format>

## Feature File

```gherkin
[Complete .feature file with Gherkin scenarios]
```

## Step Definitions Structure

```typescript
[TypeScript step definition examples for key scenarios]
```

## Tags Summary

| Tag  | Purpose     | Count |
| ---- | ----------- | ----- |
| @tag | Description | N     |

## Test Coverage Matrix

| Scenario Type  | Count |
| -------------- | ----- |
| Happy Path     | N     |
| Edge Cases     | N     |
| Error Handling | N     |
| Security       | N     |

</output_format>
</prompt>

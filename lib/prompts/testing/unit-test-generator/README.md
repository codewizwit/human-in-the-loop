# Unit Test Generator

Generates comprehensive unit tests for TypeScript/JavaScript code with coverage for happy paths, edge cases, and error scenarios using Jest or Jasmine frameworks.

## Overview

This prompt automates the creation of well-structured unit tests following industry best practices including the AAA pattern (Arrange, Act, Assert), comprehensive coverage strategies, and proper mocking techniques. All generated tests are clearly marked for human review.

## When to Use This Prompt

Use this test generator when:

- **Starting new features** - Generate initial test scaffolding
- **Improving coverage** - Add tests for untested code
- **Learning testing patterns** - See examples of good test structure
- **Refactoring legacy code** - Create safety net before changes
- **Onboarding new developers** - Demonstrate testing standards

## Usage

### Basic Function Testing

```yaml
code: |
  export function calculateTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }

framework: jest
```

### Class with Dependencies

```yaml
code: |
  export class PaymentService {
    constructor(private apiClient: ApiClient) {}

    async processPayment(amount: number): Promise<Receipt> {
      const response = await this.apiClient.post('/payments', { amount });
      return response.data;
    }
  }

framework: jest
test_type: class
dependencies: ApiClient (HTTP client for payment processing)
coverage_focus: Mocking API calls and error handling
```

### React Component

```yaml
code: |
  export const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
    return (
      <div className="profile">
        <h2>{user.name}</h2>
        <button onClick={() => onEdit(user.id)}>Edit</button>
      </div>
    );
  }

framework: jest
test_type: React component
dependencies: React Testing Library
coverage_focus: User interactions and prop handling
```

## Examples

### Example 1: Pure Function with Edge Cases

**Before:**

```typescript
export function calculateDiscount(
  price: number,
  discountPercent: number
): number {
  if (price < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid input');
  }
  return price * (1 - discountPercent / 100);
}
```

**After (Generated Tests):**

```typescript
// AI-generated test - Review and modify before committing

import { describe, it, expect } from '@jest/globals';
import { calculateDiscount } from './discount';

describe('calculateDiscount', () => {
  describe('happy path', () => {
    it('should calculate discount correctly for valid inputs', () => {
      const result = calculateDiscount(100, 20);
      expect(result).toBe(80);
    });

    it('should handle 0% discount', () => {
      expect(calculateDiscount(50, 0)).toBe(50);
    });

    it('should handle 100% discount', () => {
      expect(calculateDiscount(75, 100)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle zero price', () => {
      expect(calculateDiscount(0, 10)).toBe(0);
    });

    it('should handle very small prices', () => {
      const result = calculateDiscount(0.01, 50);
      expect(result).toBeCloseTo(0.005, 3);
    });

    it('should handle fractional discount percentages', () => {
      expect(calculateDiscount(100, 12.5)).toBe(87.5);
    });
  });

  describe('error handling', () => {
    it('should throw error for negative price', () => {
      expect(() => calculateDiscount(-10, 20)).toThrow('Invalid input');
    });

    it('should throw error for negative discount', () => {
      expect(() => calculateDiscount(100, -5)).toThrow('Invalid input');
    });

    it('should throw error for discount over 100%', () => {
      expect(() => calculateDiscount(100, 101)).toThrow('Invalid input');
    });
  });
});
```

### Example 2: Async Service with API Mocking

**Before:**

```typescript
export class UserService {
  constructor(private apiClient: ApiClient) {}

  async getUserById(id: string): Promise<User> {
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }

    try {
      const response = await this.apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`User not found: ${id}`);
      }
      throw new Error('Failed to fetch user');
    }
  }
}
```

**After (Generated Tests):**

```typescript
// AI-generated test - Review and modify before committing

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UserService } from './user-service';
import { ApiClient } from './api-client';

describe('UserService', () => {
  let userService: UserService;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
    } as jest.Mocked<ApiClient>;

    userService = new UserService(mockApiClient);
  });

  describe('getUserById', () => {
    describe('happy path', () => {
      it('should fetch user by ID successfully', async () => {
        // Arrange
        const mockUser = { id: 'user-123', name: 'John Doe' };
        mockApiClient.get.mockResolvedValue({ data: mockUser });

        // Act
        const result = await userService.getUserById('user-123');

        // Assert
        expect(result).toEqual(mockUser);
        expect(mockApiClient.get).toHaveBeenCalledWith('/users/user-123');
      });
    });

    describe('error handling', () => {
      it('should throw error for empty user ID', async () => {
        await expect(userService.getUserById('')).rejects.toThrow(
          'User ID is required'
        );
        expect(mockApiClient.get).not.toHaveBeenCalled();
      });

      it('should throw specific error when user not found', async () => {
        mockApiClient.get.mockRejectedValue({ status: 404 });
        await expect(userService.getUserById('nonexistent')).rejects.toThrow(
          'User not found: nonexistent'
        );
      });

      it('should throw generic error for other API failures', async () => {
        mockApiClient.get.mockRejectedValue({ status: 500 });
        await expect(userService.getUserById('user-123')).rejects.toThrow(
          'Failed to fetch user'
        );
      });
    });
  });
});
```

### Example 3: State Management

**Before:**

```typescript
export class Counter {
  private count = 0;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    this.count--;
  }

  getValue(): number {
    return this.count;
  }

  reset(): void {
    this.count = 0;
  }
}
```

**After (Generated Tests):**

```typescript
// AI-generated test - Review and modify before committing

import { describe, it, expect, beforeEach } from '@jest/globals';
import { Counter } from './counter';

describe('Counter', () => {
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter();
  });

  describe('initial state', () => {
    it('should start at zero', () => {
      expect(counter.getValue()).toBe(0);
    });
  });

  describe('increment', () => {
    it('should increase count by 1', () => {
      counter.increment();
      expect(counter.getValue()).toBe(1);
    });

    it('should handle multiple increments', () => {
      counter.increment();
      counter.increment();
      counter.increment();
      expect(counter.getValue()).toBe(3);
    });
  });

  describe('decrement', () => {
    it('should decrease count by 1', () => {
      counter.increment();
      counter.decrement();
      expect(counter.getValue()).toBe(0);
    });

    it('should handle negative numbers', () => {
      counter.decrement();
      expect(counter.getValue()).toBe(-1);
    });
  });

  describe('reset', () => {
    it('should reset to zero from positive count', () => {
      counter.increment();
      counter.increment();
      counter.reset();
      expect(counter.getValue()).toBe(0);
    });

    it('should reset to zero from negative count', () => {
      counter.decrement();
      counter.reset();
      expect(counter.getValue()).toBe(0);
    });
  });
});
```

## Test Generation Guidelines

The generator follows these principles:

### 1. AAA Pattern

- **Arrange**: Set up test data, mocks, and preconditions
- **Act**: Execute the code under test
- **Assert**: Verify the expected outcomes

### 2. Comprehensive Coverage

- Happy path scenarios (normal usage)
- Edge cases (boundaries, empty inputs, large datasets)
- Error scenarios (invalid inputs, exceptions)
- State management (initial state, transitions)

### 3. Proper Test Structure

- Descriptive test names explaining what's being tested
- Nested `describe` blocks for organization
- One assertion focus per test
- Setup/teardown for shared state

### 4. Mocking Best Practices

- Mock external dependencies (APIs, databases, etc.)
- Use spies to verify function calls
- Stub return values for predictability
- Never mock the code under test

### 5. Quality Standards

- Tests are isolated and independent
- Deterministic (no randomness or time dependencies)
- Meaningful test data reflecting real usage
- Clear comments for complex setups
- AI-generated markers for human review

## Output Markers

All generated tests include:

- `// AI-generated test` - Top of file marker
- `// TODO: Review and expand` - Areas needing attention
- `// Edge case: [scenario]` - Edge case documentation
- AAA pattern comments in test body

## Best Practices

### For Using Generated Tests

1. **Always Review** - Treat as starting point, not finished product
2. **Expand Coverage** - Add domain-specific edge cases
3. **Verify Mocks** - Ensure mocks match real dependency behavior
4. **Add Context** - Include business logic comments where helpful
5. **Run Tests** - Verify they pass before committing

### For Improving Test Quality

1. **Add Real-World Scenarios** - Include cases from actual usage
2. **Test Integration Points** - Consider how components interact
3. **Performance Tests** - Add for computationally expensive code
4. **Security Tests** - Test input validation and sanitization
5. **Accessibility Tests** - For UI components

### Common Pitfalls to Avoid

- **Don't blindly accept** - Generated tests may miss domain-specific edge cases
- **Don't over-mock** - Mock only external dependencies
- **Don't test implementation** - Focus on behavior, not internal structure
- **Don't skip error paths** - Error handling is critical
- **Don't create brittle tests** - Avoid tight coupling to implementation details

## Integration with Test Suites

### Adding to Existing Test Suite

Generated tests should integrate seamlessly:

```typescript
// Existing manual tests
describe('PaymentService (manual tests)', () => {
  // Your hand-written tests
});

// AI-generated test - Review and modify before committing
describe('PaymentService (generated tests)', () => {
  // Generated tests
});
```

### Separating AI-Generated Tests

Use file naming convention:

- `payment-service.spec.ts` - Manual tests
- `payment-service.ai.spec.ts` - AI-generated tests (for easy identification)

## Framework Support

### Jest

```yaml
framework: jest
```

Generates tests using:

- `@jest/globals` imports
- `jest.fn()` for mocks
- `jest.spyOn()` for spies
- `mockResolvedValue()` / `mockRejectedValue()` for async

### Jasmine

```yaml
framework: jasmine
```

Generates tests using:

- Jasmine's global functions
- `jasmine.createSpy()` for mocks
- `spyOn()` for spies
- Promise-based async handling

## Related Resources

- [E2E Strategy Generator](../e2e-strategy/README.md) - End-to-end test planning
- [ACCOUNTABILITY.md](../../../../ACCOUNTABILITY.md) - Responsible AI usage guidelines

## Contributing

To improve this test generator:

1. Share examples of well-generated vs. poorly-generated tests
2. Suggest additional edge cases to check automatically
3. Report framework-specific issues or missing patterns
4. Provide domain-specific test templates (e.g., React hooks, Angular services)

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for guidelines.

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

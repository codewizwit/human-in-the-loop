# Unit Test Generator

Generates comprehensive unit tests covering happy paths, edge cases, and error scenarios using Jest/Jasmine/Vitest.

## What You'll Be Asked

- **Files to test** - Specific files or entire untested codebase
- **Testing framework** - Jest, Jasmine, or Vitest (auto-detected from package.json)
- **Coverage focus** (optional) - Error handling, edge cases, mocking strategy

## Usage Examples

### Example 1: Generate Tests for Untested Utility Functions

Create comprehensive tests for data processing functions with edge cases.

**Expected Output:**

```typescript
// AI-generated test - Review and modify before committing

describe('calculateDiscount', () => {
  describe('happy path', () => {
    it('should calculate discount correctly for valid inputs', () => {
      expect(calculateDiscount(100, 20)).toBe(80);
    });
  });

  describe('error handling', () => {
    it('should throw error for negative price', () => {
      expect(() => calculateDiscount(-10, 20)).toThrow('Invalid input');
    });
  });
});
```

### Example 2: Service Class with API Mocking

Generate tests for UserService with proper dependency mocking and error scenarios.

**Expected Output:**

```typescript
describe('UserService', () => {
  let userService: UserService;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    mockApiClient = { get: jest.fn() } as jest.Mocked<ApiClient>;
    userService = new UserService(mockApiClient);
  });

  // Tests with mocked API calls...
});
```

## Related Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started) - Testing framework guide
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices) - Comprehensive testing guide
- [E2E Strategy](../e2e-strategy) - Integration and E2E testing

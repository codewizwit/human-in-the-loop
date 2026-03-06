---
name: unit-test-generator
description: >-
  Generates comprehensive unit tests for workspace code with coverage for happy
  paths, edge cases, and error scenarios. Use when user asks to "generate tests",
  "write unit tests", or mentions "test coverage".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion
---

# Unit Test Generator

Analyzes source files in your workspace, detects the testing framework, and
generates comprehensive unit tests following the AAA pattern (Arrange-Act-Assert).
Covers happy paths, edge cases, and error scenarios with proper mocking for
dependencies. Writes test files directly to the workspace with AI-generated
markers for human review.

## When to Activate

- User asks to generate or write unit tests for their code
- User mentions test coverage gaps or untested files
- User wants tests for specific files, functions, or modules
- User asks about mocking strategies or test patterns

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What files or modules need unit tests?</question>
<option value="untested">Find all files without tests</option>
<option value="specific">Specific files or directories</option>
<option value="recent">Recently changed files</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Which testing framework should I use?</question>
<option value="detect">Auto-detect from project configuration</option>
<option value="jest">Jest</option>
<option value="vitest">Vitest</option>
<option value="jasmine">Jasmine</option>
</AskUserQuestion>

### Step 2: Discovery

1. Use Glob to find source files and existing test files
2. Use Read to examine `package.json` for testing framework detection
3. Identify files without corresponding test files
4. Map project structure and existing testing patterns

### Step 3: Code Analysis

1. Use Read to examine source files needing tests
2. Identify functions, classes, and components to test
3. Analyze dependencies that need mocking
4. Determine test coverage gaps

### Step 4: Test Generation

Generate tests following these guidelines:

**AAA Pattern**

- Arrange: Set up test data, mocks, and preconditions
- Act: Execute the code under test
- Assert: Verify the expected outcomes

**Comprehensive Coverage**

- Happy path: Normal, expected usage scenarios
- Edge cases: Boundary conditions, empty inputs, large datasets
- Error scenarios: Invalid inputs, exceptions, failure modes
- State management: Initial state, state transitions, side effects

**Test Structure**

- Use descriptive test names that explain what is being tested
- Group related tests with `describe` blocks
- One assertion focus per test
- Include setup and teardown where appropriate

**Mocking Strategy**

- Mock external dependencies (APIs, databases, file systems)
- Use spies to verify function calls and arguments
- Stub return values for predictable test behavior
- Never mock the code under test itself

### Step 5: Write Test Files

Use Write to create test files alongside source files. Use Edit to update
existing test files with additional scenarios.

**File Naming**

- Jest/Vitest: `<source-file>.spec.ts` or `<source-file>.test.ts`
- Match the existing project convention

**AI-Generated Markers**

- Add `AI-generated test - Review and modify before committing` at file top
- Add `TODO: Review and expand` for areas needing human attention
- Add `Edge case: [scenario]` comments for edge case tests

## Output Format

<output_format>
Write complete test files to the workspace. Each file includes:

1. **Imports** - All necessary testing utilities and modules under test
2. **Mocks** - Mock declarations at file level
3. **Test Suite** - Organized `describe` blocks by function or feature
4. **Setup/Teardown** - `beforeEach`, `afterEach` if needed
5. **Test Cases** - Individual `it` or `test` blocks following AAA pattern
6. **Helper Functions** - Any test utilities needed

Example structure:

```typescript
/** AI-generated test - Review and modify before committing */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { functionUnderTest } from './module';

describe('functionUnderTest', () => {
  describe('happy path', () => {
    it('should handle valid input correctly', () => {
      const input = 'valid';
      const result = functionUnderTest(input);
      expect(result).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      expect(functionUnderTest('')).toBe(defaultValue);
    });
  });

  describe('error handling', () => {
    it('should throw on invalid input', () => {
      expect(() => functionUnderTest(null)).toThrow();
    });
  });
});
```

</output_format>

## Best Practices

- Keep tests isolated and independent of each other
- Make tests deterministic with no random values or time dependencies
- Use meaningful test data that reflects real usage scenarios
- Generate only valid, runnable test code matching the detected framework
- Follow existing project test conventions for file naming and structure
- Mock all external dependencies to prevent side effects

## Anti-Patterns

- Do not generate tests that depend on execution order
- Do not use random or time-based values that make tests non-deterministic
- Do not mock the module under test itself
- Do not create tests that test implementation details rather than behavior
- Do not skip edge cases and error scenarios in favor of only happy paths
- Do not generate tests without proper AI-generated markers for review

## Examples

### Example 1: Generate Tests for Untested Files

**Input**: "Find files without tests and generate comprehensive unit tests"

**Output**: Identifies untested source files, generates test files with full
coverage including happy paths, edge cases, and error handling following
project conventions.

### Example 2: Tests for Specific File

**Input**: "Generate unit tests for the helpers file in src/utils/helpers.ts"

**Output**: Comprehensive test file covering all exported functions with
AAA pattern, mocked dependencies, and edge case coverage.

### Example 3: Error Handling Focus

**Input**: "Generate tests for services focusing on error handling and edge cases"

**Output**: Test files emphasizing error scenarios, boundary conditions,
invalid inputs, and exception handling for all service methods.

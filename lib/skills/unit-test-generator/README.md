# Unit Test Generator

Analyzes source files in your workspace, detects the testing framework, and generates comprehensive unit tests following the AAA pattern (Arrange-Act-Assert). Covers happy paths, edge cases, and error scenarios with proper mocking for dependencies. Writes test files directly to the workspace.

## What You'll Be Asked

- **Target files**: Find all untested files, specific files/directories, or recently changed files
- **Testing framework**: Auto-detect, Jest, Vitest, or Jasmine

## Usage Examples

### Generate Tests for Untested Files

> "Find files without tests and generate comprehensive unit tests"

Identifies all source files without corresponding test files and generates complete test suites following project conventions.

### Tests for Specific File

> "Generate unit tests for the helpers file in src/utils/helpers.ts"

Creates a focused test file covering all exported functions with happy paths, edge cases, and error handling.

### Error Handling Focus

> "Generate tests for services focusing on error handling and edge cases"

Produces test files emphasizing error scenarios, boundary conditions, invalid inputs, and exception handling.

## Related Resources

- [E2E Testing Strategy](../e2e-strategy/) - For end-to-end test planning
- [TypeScript Code Review](../code-review-ts/) - Review code quality alongside test generation

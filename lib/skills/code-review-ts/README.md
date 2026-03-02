# TypeScript Code Review

Performs a comprehensive TypeScript code review across your workspace, analyzing type safety, code quality, best practices, performance, and security. Produces a structured report with severity-rated findings, actionable recommendations, and code examples showing improvements.

## What You'll Be Asked

- **Scope**: Whether to review all files, a specific directory, or recently changed files
- **Priority focus**: Balanced review, type safety, security, or performance

## Usage Examples

### Full Workspace Review

> "Please review all TypeScript code in this project"

Produces a comprehensive review report covering all TypeScript files with findings organized by category and severity.

### Targeted Component Review

> "Review the React components for type safety and performance issues"

Focuses on component files, checking prop types, generic patterns, re-render optimization, and memoization.

### Security Audit

> "Review API routes focusing on security and error handling"

Prioritizes security findings including input validation, injection prevention, authentication checks, and error response patterns.

## Related Resources

- [E2E Testing Strategy](../e2e-strategy/) - Complements code review with test coverage strategy
- [Unit Test Generator](../unit-test-generator/) - Generate tests for code identified during review
- [Responsible AI Audit](../responsible-ai-audit/) - For reviewing AI-specific code and systems

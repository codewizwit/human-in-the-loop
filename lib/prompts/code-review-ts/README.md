# TypeScript Code Review

Automated TypeScript code review analyzing type safety, best practices, performance, and security.

## What You'll Be Asked

- **Scope** - Full workspace review or specific files/directories
- **Focus areas** (optional) - Type safety, performance, security, or code quality
- **Project context** (optional) - Framework (React, Node.js, NestJS)

## Usage Examples

### Example 1: Full Workspace Review

Run comprehensive review across entire TypeScript codebase to identify type safety issues, performance bottlenecks, and security vulnerabilities.

**Expected Output:**

```markdown
## Type Safety

- 🔴 Critical: 15 uses of `any` type in src/services/
- 🟡 Medium: Missing return types in utils/helpers.ts

## Performance

- 🟠 High: Unnecessary re-renders in UserProfile component
- 🟡 Medium: Inefficient array operations in data processing
```

### Example 2: Component Security Review

Focus on React components analyzing security vulnerabilities, input validation, and XSS prevention.

**Expected Output:**

```markdown
## Security

- 🔴 Critical: Unescaped user input in UserComment.tsx:42
- 🟠 High: Missing CSRF protection on form submission
- 🟡 Medium: API keys exposed in client-side code
```

## Related Resources

- [TypeScript Strict Mode Guide](https://www.typescriptlang.org/tsconfig#strict) - Type safety configuration
- [Code Review Empathy](../culture/code-review-empathy) - Provide feedback constructively
- [Security Review](../governance/security-review) - Deep security analysis

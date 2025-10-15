# TypeScript Code Review

**Comprehensive code review for TypeScript with best practices, type safety, and performance**

Version: 1.2.0
Category: Code Review
Tags: `typescript` `code-review` `best-practices` `type-safety`

---

## Overview

The TypeScript Code Review prompt provides comprehensive technical feedback on TypeScript code, covering type safety, code quality, best practices, performance, and security. It's designed to catch common issues and suggest improvements that align with modern TypeScript development standards.

### What It Does

- **Analyzes type safety** - Identifies improper use of `any`, missing types, and generic opportunities
- **Reviews code quality** - Evaluates readability, maintainability, naming conventions, and structure
- **Checks best practices** - Ensures error handling, immutability, and TypeScript patterns
- **Flags performance issues** - Spots unnecessary re-renders, computations, and memory leaks
- **Identifies security concerns** - Reviews input validation and potential vulnerabilities

### When to Use It

- Reviewing pull requests with TypeScript code
- Self-reviewing code before submitting PRs
- Learning TypeScript best practices
- Establishing code quality standards for your team
- Onboarding new developers to TypeScript patterns

---

## Installation

```bash
hitl install prompt/code-review-ts
```

Or use directly via CLI:

```bash
hitl use prompt/code-review-ts
```

---

## Usage

### Basic Usage

```bash
hitl use code-review-ts \
  --code "Your TypeScript code here" \
  --context "Optional context about the code"
```

### Input Variables

| Variable  | Required | Description                                                                                    |
| --------- | -------- | ---------------------------------------------------------------------------------------------- |
| `code`    | ✅ Yes   | The TypeScript code to review                                                                  |
| `context` | ⬜ No    | Additional context about the code (e.g., "Processing user input data", "API endpoint handler") |

### Output Structure

The prompt returns structured feedback organized by category:

1. **Type Safety** - Type definitions, `any` usage, generics
2. **Code Quality** - Readability, maintainability, naming, structure
3. **Best Practices** - Error handling, immutability, TypeScript patterns
4. **Performance** - Unnecessary operations, re-renders, memory leaks
5. **Security** - Input validation, vulnerabilities

Each section provides:

- Specific issues found
- Code examples showing improvements
- Actionable recommendations

---

## Examples

### Example 1: Type Safety Issues

#### Input

```typescript
function processData(data: any) {
  return data.map((item) => item.value * 2);
}
```

**Context:** "Processing user input data"

#### Output

````
**Type Safety Issues:**
- Using `any` type loses type safety. Define proper interfaces:
```typescript
interface DataItem {
  value: number;
}

function processData(data: DataItem[]): number[] {
  return data.map((item) => item.value * 2);
}
````

**Additional Improvements:**

- Add input validation for data array
- Consider using readonly for immutability
- Add TypeDoc comment explaining the function's purpose

````

---

### Example 2: Error Handling

#### Input
```typescript
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
````

**Context:** "API client method"

#### Output (Expected)

````
**Best Practices Issues:**
- Missing error handling for failed requests
- No type safety on return value

**Suggested Improvements:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json() as Promise<User>;
}
````

**Additional Recommendations:**

- Consider using a type guard to validate the response structure
- Add retry logic for transient failures
- Include request timeout handling

````

---

### Example 3: Performance Optimization

#### Input
```typescript
function filterAndMap(items: Item[]) {
  const filtered = items.filter(item => item.active);
  const mapped = filtered.map(item => item.name);
  return mapped;
}
````

**Context:** "Processing large datasets"

#### Output (Expected)

````
**Performance Improvements:**
- Multiple array iterations can be combined for better performance:

```typescript
function filterAndMap(items: Item[]): string[] {
  return items
    .filter(item => item.active)
    .map(item => item.name);
}
````

Or use a single reduce for maximum efficiency:

```typescript
function filterAndMap(items: Item[]): string[] {
  return items.reduce<string[]>((acc, item) => {
    if (item.active) {
      acc.push(item.name);
    }
    return acc;
  }, []);
}
```

**Code Quality:**

- Removed unnecessary intermediate variables
- Added return type annotation
- Chained operations for better readability

````

---

## Review Checklist

The prompt systematically reviews code against these criteria:

### Type Safety ✅
- [ ] All variables have explicit types
- [ ] No unnecessary use of `any`
- [ ] Proper use of generics where applicable
- [ ] Return types are defined
- [ ] Type guards used for runtime validation

### Code Quality ✅
- [ ] Clear, descriptive variable and function names
- [ ] Functions are focused and single-purpose
- [ ] Code is readable and maintainable
- [ ] Proper code organization and structure
- [ ] Comments explain "why" not "what"

### Best Practices ✅
- [ ] Error handling is comprehensive
- [ ] Immutability preferred where appropriate
- [ ] Async operations handled correctly
- [ ] No code duplication
- [ ] Follows TypeScript idioms

### Performance ✅
- [ ] No unnecessary computations
- [ ] Efficient data structures used
- [ ] No memory leaks
- [ ] Async operations optimized
- [ ] Avoid unnecessary re-renders (React)

### Security ✅
- [ ] User input is validated
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Sensitive data is protected
- [ ] Dependencies are secure

---

## Integration Options

### CLI Usage
```bash
# Interactive mode
hitl use code-review-ts

# Non-interactive with code from file
hitl use code-review-ts --code "$(cat src/myfile.ts)"

# With context
hitl use code-review-ts \
  --code "$(cat src/api.ts)" \
  --context "Express API endpoint handler"
````

### IDE Integration

**VS Code:**
Configure as a task or use Claude Code extension

**JetBrains IDEs:**
Add as an external tool for quick access

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
name: Code Review
on: pull_request

jobs:
  typescript-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Review TypeScript Files
        run: |
          for file in $(git diff --name-only origin/main | grep '\.ts$'); do
            hitl use code-review-ts --code "$(cat $file)" --context "PR #${{ github.event.pull_request.number }}"
          done
```

### Git Hooks

Use as a pre-commit hook:

```bash
#!/bin/bash
# .git/hooks/pre-commit

for file in $(git diff --cached --name-only | grep '\.ts$'); do
  hitl use code-review-ts --code "$(cat $file)"
done
```

---

## Best Practices

### Do's ✅

- Provide context when reviewing code to get more relevant feedback
- Use for both self-review and peer review
- Combine with automated linters (ESLint, Prettier)
- Review the output carefully - AI suggestions should be evaluated, not blindly applied
- Share common patterns with your team

### Don'ts ❌

- Don't skip manual review - use this as a supplement, not replacement
- Don't apply all suggestions without understanding them
- Don't ignore your project's specific conventions
- Don't review code without providing context for complex logic

---

## Technical Details

**Template Engine:** Handlebars
**Input Format:** YAML variables
**Output Format:** Markdown with code blocks
**AI Model:** Works with any LLM (Claude, GPT-4, etc.)
**Review Categories:** 5 (Type Safety, Quality, Best Practices, Performance, Security)

---

## Related Prompts

- `prompt/code-review-empathy` - Transform harsh feedback into empathetic communication
- `prompt/code-review-security` - Security-focused code review (coming soon)
- `context-pack/typescript` - TypeScript framework context (coming soon)

---

## Contributing

Found a TypeScript pattern we should review for? Submit an example:

```bash
hitl contribute prompt lib/prompts/code-review-ts
```

See [Contributing Guidelines](../../../docs/contributing-guidelines.md) for details.

---

## License

MIT License - see [LICENSE](../../../LICENSE) for details

---

## Metadata

- **Author:** codewizwit
- **Version:** 1.2.0
- **Last Updated:** 2025-01-15
- **Category:** Code Review
- **Type:** Prompt Template

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

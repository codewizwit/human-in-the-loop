---
name: code-review-ts
description: >-
  Automated TypeScript code review for your workspace. Use when user asks to
  "review my TypeScript code", "check code quality", or mentions "code review".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion, EnterPlanMode
---

# TypeScript Code Review

Performs a comprehensive TypeScript code review across your workspace, analyzing
type safety, code quality, best practices, performance, and security. Produces a
structured report with severity-rated findings, actionable recommendations, and
code examples showing improvements.

## When to Activate

- User asks to review TypeScript code in their project
- User mentions code review, code quality, or best practices
- User wants a type safety or security audit of TypeScript files
- User asks to check for anti-patterns or performance issues

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What is the scope of this code review?</question>
<option value="all">All TypeScript files in the project</option>
<option value="directory">A specific directory or module</option>
<option value="recent">Recently changed files only</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Which areas should I prioritize?</question>
<option value="balanced">Balanced review across all areas</option>
<option value="types">Type safety and strict mode compliance</option>
<option value="security">Security vulnerabilities and input validation</option>
<option value="performance">Performance bottlenecks and optimization</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For large codebases with many files, enter plan mode to align on approach:

<EnterPlanMode>
<summary>
Outline the file groups to review, estimated scope, and proposed priority
order. Confirm focus areas and any directories to exclude.
</summary>
</EnterPlanMode>

### Step 3: Discovery

1. Use Glob to find TypeScript files (`*.ts`, `*.tsx`) in the workspace
2. Identify the project structure (React, Node.js, NestJS, Angular, etc.)
3. Use Read to examine configuration files (`tsconfig.json`, `package.json`)
4. Prioritize recently changed files and core application logic

### Step 4: Code Review

Use Read to examine TypeScript files and Grep to search for common anti-patterns.
Analyze each file across these dimensions:

**Type Safety**

- Evaluate type definitions and usage
- Identify inappropriate use of `any` type
- Assess generic type effectiveness
- Check for type narrowing and guards

**Code Quality**

- Assess readability and maintainability
- Evaluate naming conventions (camelCase, descriptive names)
- Review code organization and structure
- Check for proper code documentation (TypeDoc comments)

**Best Practices**

- Verify adherence to TypeScript conventions
- Evaluate error handling approaches
- Check for immutability patterns where appropriate
- Assess use of async/await vs. Promises

**Performance**

- Identify potential performance bottlenecks
- Check for unnecessary re-computations
- Look for memory leak risks
- Evaluate algorithm complexity

**Security**

- Verify input validation
- Identify potential injection vulnerabilities
- Check for exposed sensitive data
- Assess authentication/authorization logic

### Step 5: Deliver Report

Write the review report to a markdown file in the workspace with all findings
organized by category and severity.

## Output Format

<output_format>
Write your code review to a markdown file in the workspace. Structure as follows:

**Type Safety**

- [Specific findings with file paths, line references, and code examples]

**Code Quality**

- [Specific findings with code examples]

**Best Practices**

- [Specific findings with code examples]

**Performance**

- [Specific findings with code examples]

**Security**

- [Specific findings with code examples]

For each issue:

- Clearly explain the problem
- Provide a specific, actionable recommendation
- Include a code example showing the improvement
- Note the severity (Critical, High, Medium, Low)
  </output_format>

## Best Practices

- Start with project discovery before diving into individual files
- Prioritize critical issues (security, type safety) over style preferences
- Provide specific file paths and line references for all feedback
- Include code examples for recommended changes
- Assume TypeScript strict mode is enabled
- Maintain a constructive and educational tone

## Anti-Patterns

- Do not review generated code, node_modules, or third-party libraries
- Do not focus on formatting issues that a linter would catch
- Do not suggest changes that break existing APIs without migration guidance
- Do not provide generic advice without referencing specific code locations
- Do not skip the discovery phase and jump into file-by-file review

## Examples

### Example 1: Full Workspace Review

**Input**: "Please review all TypeScript code in this project"

**Output**: Comprehensive review report covering type safety, code quality,
best practices, performance, and security across all TypeScript files,
with severity-rated findings and code improvement examples.

### Example 2: Focused Component Review

**Input**: "Review the React components for type safety and performance issues"

**Output**: Targeted review of component files focusing on prop type definitions,
generic component patterns, unnecessary re-renders, and memoization opportunities.

### Example 3: Security-Focused Review

**Input**: "Review API routes focusing on security and error handling"

**Output**: Security audit of API route handlers covering input validation,
injection prevention, authentication checks, and error response patterns.

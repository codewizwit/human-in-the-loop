---
name: context-pack-builder
description: >-
  Generates comprehensive context packs for frameworks, technologies, or domains
  with patterns, best practices, code examples, and anti-patterns. Use when user
  asks to "create a context pack", "build a knowledge base", "generate patterns
  guide", or mentions "context pack" or "best practices reference".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion, EnterPlanMode
---

# Context Pack Builder

Generates comprehensive context packs for frameworks, technologies, or domains. Creates structured knowledge bases with patterns, best practices, complete code examples, anti-patterns, and reference tables that can be used to guide AI assistants and serve as team documentation.

## When to Activate

- User asks to create a context pack or knowledge base
- User wants to generate a patterns and best practices guide for a technology
- User mentions building reusable reference material for a framework or domain
- User asks to document team patterns, coding standards, or architectural decisions
- User wants to create AI-consumable documentation for a technology stack

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What technology or domain should this context pack cover?</question>
<option value="framework">Frontend framework (Angular, React, Vue)</option>
<option value="backend">Backend framework (NestJS, Express, Fastify)</option>
<option value="library">Library (RxJS, NgRx, Apollo)</option>
<option value="domain">Domain (authentication, testing, deployment)</option>
<option value="custom">Other technology or domain</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What scope should the context pack cover?</question>
<option value="minimal">Minimal (core patterns only)</option>
<option value="standard">Standard (patterns, anti-patterns, reference tables)</option>
<option value="comprehensive">Comprehensive (full guide with examples, testing, security)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Are there specific focus areas to emphasize?</question>
<option value="general">General best practices</option>
<option value="testing">Testing strategies</option>
<option value="performance">Performance optimization</option>
<option value="security">Security patterns</option>
<option value="custom">Custom focus areas</option>
</AskUserQuestion>

### Step 2: Research Phase

If the user has an existing codebase:

1. Use Glob to find files related to the target technology
2. Use Read to examine existing patterns and implementations
3. Use Grep to identify current conventions, common patterns, and recurring issues
4. Catalog the team's existing coding standards and architectural decisions

### Step 3: Plan

For comprehensive context packs, enter plan mode to organize the knowledge base:

<EnterPlanMode>
<summary>
Outline the context pack structure with proposed sections. List the
key patterns and anti-patterns to document. Identify code examples
needed and their complexity level. Confirm the target audience skill
level and any technology-specific focus areas with the user.
</summary>
</EnterPlanMode>

### Step 4: Generate Context Pack

Build the context pack with these components:

**Overview Section**

- Clear description of what the context pack covers
- Bullet list of included topics
- Installation instructions using `hit install context/[name]`

**Key Patterns**
For each pattern:

- TypeDoc-style comments explaining the pattern's purpose
- Complete, working code examples
- When to use this pattern and common variations
- Edge cases and considerations

**Anti-Patterns**
For each anti-pattern:

- Bad example with clear label and explanation of the problem
- Good example with correct approach and explanation of why it is better
- Real-world consequences of the anti-pattern

**Reference Tables**

- Decision trees for choosing between approaches
- Quick reference for common operations
- Configuration options and their effects
- Operator or API selection guides

**Related Resources**

- Links to related context packs in the toolkit
- Links to related prompts and skills

### Step 5: Deliver Results

Write the context pack to a markdown file in the workspace.

## Output Format

<output_format>
**Title and Description**
Context pack name and overview paragraph describing its purpose and scope.

**What's Included**
Bullet list of topics covered with brief descriptions.

**Installation**
CLI installation command using `hit install context/[name]`.

**Key Patterns**
Named pattern sections with TypeDoc-commented code examples, usage
guidance, and common variations.

**Anti-Patterns**
Paired bad/good examples with labels and explanations for each
anti-pattern.

**Reference Tables**
Decision tables, operator guides, or configuration references as
markdown tables.

**Related Resources**
Links to related context packs and skills in the toolkit.
</output_format>

## Best Practices

- Use TypeDoc comments above code examples rather than inline comments
- Ensure all code examples are complete and working, not snippets
- Show modern patterns for the target framework (e.g., Angular 16+ signals, standalone components)
- Include both happy path and error handling patterns in examples
- Provide practical, real-world examples rather than trivial demonstrations
- Keep examples concise but complete enough to be copy-pasted
- Follow the project's naming conventions in all code examples

## Anti-Patterns

- Do not use inline comments in code examples; use TypeDoc-style comments above the code
- Do not provide incomplete code snippets that cannot be understood in isolation
- Do not include external URLs that may break over time
- Do not mix patterns from different framework versions without clearly labeling each
- Do not create context packs that are too broad to be actionable
- Do not skip the anti-patterns section; showing what not to do is as valuable as showing correct patterns

## Examples

### Example 1: RxJS Context Pack

**Input**: "Create a comprehensive context pack for RxJS in Angular applications, focusing on error handling, memory management, and testing"

**Output**: Full context pack covering subscription management with takeUntilDestroyed and AsyncPipe, error handling strategies with catchError and retry, caching patterns with shareReplay, stream combination operators, marble testing examples, and an operator decision tree reference table.

### Example 2: GraphQL Context Pack

**Input**: "Build a context pack for GraphQL with Apollo Client in Angular, standard scope, focusing on caching and code generation"

**Output**: Standard context pack covering Apollo module setup with error handling, type-safe queries with GraphQL Codegen, optimistic UI updates for mutations, component-level error handling, cache strategy reference table, and anti-patterns for untyped query usage.

### Example 3: Authentication Context Pack

**Input**: "Generate a comprehensive context pack for JWT authentication with Angular and NestJS, focusing on security and token management"

**Output**: Full context pack covering Angular auth service with token refresh, HTTP interceptor for automatic token injection, functional route guards with role-based access, NestJS JWT strategy and roles guard, security best practices table, and anti-patterns for insecure token storage.

---

**Human-in-the-Loop by codewizwit**

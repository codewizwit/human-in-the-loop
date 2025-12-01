# Context Pack Builder

Generate comprehensive context packs for frameworks, technologies, or domains. Creates structured knowledge bases with patterns, best practices, and code examples.

## What It Does

- **Generates** structured context packs for any technology
- **Includes** patterns, anti-patterns, and code examples
- **Provides** decision trees and quick reference tables
- **Follows** TypeDoc comment standards

## What You'll Be Asked

When using this prompt, you'll need to provide:

1. **Technology** (required) - The framework, library, or domain (e.g., "RxJS", "GraphQL", "JWT Authentication")
2. **Scope** (optional) - Level of detail: minimal, standard, or comprehensive
3. **Target Audience** (optional) - Skill level: beginner, intermediate, or advanced
4. **Focus Areas** (optional) - Specific topics to emphasize (e.g., "testing", "security")

## Context Pack Structure

Every generated context pack includes:

| Section               | Purpose                           |
| --------------------- | --------------------------------- |
| **Overview**          | What the pack covers and why      |
| **What's Included**   | List of topics with descriptions  |
| **Installation**      | How to install with `hit` CLI     |
| **Key Patterns**      | Best practices with code examples |
| **Anti-Patterns**     | Common mistakes and corrections   |
| **Reference Tables**  | Quick lookup for decisions        |
| **Related Resources** | Links to related packs/prompts    |

## Usage Examples

### Example 1: RxJS Context Pack

```
Technology: RxJS for Angular applications
Focus areas: error handling, memory management, testing
```

**What You Get:**

- Subscription management patterns (takeUntilDestroyed, AsyncPipe)
- Error handling strategies (catchError, retry with backoff)
- Caching patterns (shareReplay, BehaviorSubject)
- Stream combining (combineLatest, forkJoin, withLatestFrom)
- Testing with marbles and fakeAsync
- Anti-patterns (nested subscriptions, memory leaks)
- Operator decision tree

### Example 2: GraphQL Context Pack

```
Technology: GraphQL with Apollo Client in Angular
Focus areas: caching, error handling, code generation
```

**What You Get:**

- Apollo module setup with error handling
- Type-safe queries with GraphQL Codegen
- Optimistic updates for mutations
- Cache strategies (cache-first, network-only)
- Error handling patterns

### Example 3: Authentication Context Pack

```
Technology: JWT Authentication with Angular and NestJS
Focus areas: security, token management, guards
```

**What You Get:**

- Full AuthService with token refresh
- HTTP interceptor for automatic token injection
- Angular guards (auth guard, role guard)
- NestJS JWT strategy and guards
- Security best practices table

## Code Style in Context Packs

Context packs follow these standards:

```typescript
/**
 * TypeDoc comment explaining the pattern
 * @param user - The user to authenticate
 * @returns Observable of authentication result
 */
authenticate(user: User): Observable<AuthResult> {
  // Implementation
}
```

**NOT:**

```typescript
// This is a bad comment style
authenticate(user: User) { // inline comments not allowed
```

## Anti-Pattern Format

```typescript
/**
 * ❌ BAD: Subscribe inside subscribe creates nested subscriptions
 */
this.users$.subscribe((users) => {
  this.orders$.subscribe((orders) => {
    /* nested */
  });
});

/**
 * ✅ GOOD: Use switchMap to flatten streams
 */
this.users$.pipe(switchMap((users) => this.orders$)).subscribe((orders) => {
  /* flat */
});
```

## Scope Levels

| Scope             | Description            | Sections Included               |
| ----------------- | ---------------------- | ------------------------------- |
| **minimal**       | Quick reference        | Overview, Key Patterns          |
| **standard**      | Working guide          | + Anti-Patterns, Reference      |
| **comprehensive** | Complete documentation | + Testing, Security, Edge Cases |

## Target Audiences

| Audience         | Focus                                 |
| ---------------- | ------------------------------------- |
| **beginner**     | Basic patterns, more explanation      |
| **intermediate** | Standard patterns, some advanced      |
| **advanced**     | Edge cases, performance, architecture |

## Related Resources

- [Prompt Optimization](../prompt-optimization) - Optimize prompts in context packs

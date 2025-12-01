# Code Review Empathy Guide

Transforms harsh code review feedback into empathetic, constructive comments that balance critique with appreciation.

## What You'll Be Asked

- **Original feedback** - The harsh or unclear comment to rewrite
- **Code context** (optional) - The code snippet being reviewed
- **Reviewer intent** (optional) - What you're trying to communicate

## Usage Examples

### Example 1: Reframe Type Safety Critique

Transform "This is terrible. You're using any types everywhere" into educational feedback.

**Expected Output:**

```markdown
Thanks for getting this function working! I noticed we're using `any`
types here, which will make it harder to catch bugs at compile time.
Would you be open to defining interfaces?

**Key Changes Made:**

- Started with appreciation for working logic
- Removed judgmental language
- Used "we" instead of "you"
```

### Example 2: Performance Feedback

Rewrite "Why would you do it this way?" to be collaborative and solution-focused.

**Expected Output:**

```markdown
Nice work calculating the average! I wanted to share an alternative
approach that might be more readable...

Both approaches work - curious if you have a preference?

**Severity Level:** Suggestion
```

## Related Resources

- [Code Review TypeScript](../../code-review-ts) - Technical review guidance
- [1-on-1 Prep](../1-on-1-prep) - Communication best practices

# Code Review Empathy Guide

**Transform harsh code review feedback into empathetic, constructive communication**

Version: 1.0.0
Category: Culture
Tags: `culture` `code-review` `communication` `empathy` `feedback` `team-dynamics`

---

## Overview

The Code Review Empathy Guide helps reviewers provide feedback that is both technically accurate and emotionally intelligent. It transforms harsh, dismissive, or unclear comments into constructive feedback that balances critique with appreciation while maintaining team morale and psychological safety.

### What It Does

- **Rewrites harsh feedback** using evidence-based empathy principles
- **Balances critique with appreciation** by finding positives first
- **Provides specific, actionable suggestions** with code examples
- **Explains the "why"** behind technical recommendations
- **Categorizes severity** (Blocking, Important, Suggestion, Nitpick)

### When to Use It

- Before posting PR review comments
- When giving architectural feedback
- During pair programming sessions
- When mentoring junior developers
- Anytime you want to improve team communication

---

## Installation

```bash
hitl install prompt/code-review-empathy
```

Or use directly via CLI:

```bash
hitl use prompt/code-review-empathy
```

---

## Usage

### Basic Usage

```bash
hitl use code-review-empathy \
  --feedback "Your original review comment" \
  --code_context "Optional code snippet" \
  --reviewer_intent "What you're trying to communicate"
```

### Input Variables

| Variable          | Required | Description                                                                       |
| ----------------- | -------- | --------------------------------------------------------------------------------- |
| `feedback`        | ✅ Yes   | The original code review comment to rewrite                                       |
| `code_context`    | ⬜ No    | The code snippet being reviewed (helps AI provide better suggestions)             |
| `reviewer_intent` | ⬜ No    | What you're trying to communicate (e.g., "performance concern", "security issue") |

### Output Structure

The prompt returns structured feedback:

1. **Rewritten Feedback** - The empathetic version ready to post
2. **Key Changes Made** - What improved (meta-learning for reviewers)
3. **Severity Level** - Blocking | Important | Suggestion | Nitpick
4. **Why This Matters** - Technical/team impact explanation

---

## Before/After Examples

### Example 1: Type Safety Issues

#### Before (Harsh)

```
This is terrible. You're using any types everywhere.
Did you even read the TypeScript docs?
```

#### After (Empathetic)

````
Thanks for getting this function working! I can see the logic flow is solid.
I noticed we're using `any` types here, which will make it harder to catch
bugs at compile time. Would you be open to defining interfaces for the
data structures?

Here's what I'm thinking:
```typescript
interface DataItem {
  value: number;
}

function processData(data: DataItem[]): number[] {
  return data.map((item) => item.value);
}
````

This way TypeScript can help us catch issues if the data shape changes.
What do you think?

```

**Key Improvements:**
- Started with appreciation for working logic
- Removed judgmental language
- Used "we" instead of "you"
- Provided concrete code example
- Invited discussion

**Severity:** Important
**Why:** Type safety prevents runtime errors and makes refactoring safer

---

### Example 2: Code Style Preferences

#### Before (Dismissive)
```

Why would you do it this way? Just use the built-in method.

```

#### After (Collaborative)
```

Nice work calculating the average! I see you're using `reduce` here,
which definitely works.

I wanted to share an alternative approach that might be slightly more
readable - we could separate the sum and division:

```typescript
const sum = arr.reduce((acc, val) => acc + val, 0);
const average = sum / arr.length;
```

Or if we want to be more explicit about handling empty arrays:

```typescript
const average =
  arr.length > 0 ? arr.reduce((acc, val) => acc + val, 0) / arr.length : 0;
```

Both approaches work - curious if you have a preference or if there's
a reason you went with the single-line version?

```

**Key Improvements:**
- Acknowledged current solution works
- Presented alternatives as options, not corrections
- Added edge case consideration
- Invited discussion about trade-offs

**Severity:** Suggestion
**Why:** Readability helps maintainability; edge cases prevent errors

---

### Example 3: Performance Concerns

#### Before (Absolute)
```

This will never scale. Completely wrong approach.

```

#### After (Context-Aware)
```

Great job getting the user updates working! I want to flag a potential
performance concern for when this code runs with larger datasets.

Right now we're updating users sequentially (one at a time), which works
fine for small batches but could become slow as we scale. Each `await`
waits for the previous update to finish before starting the next one.

Would you be open to batching these updates? Here's one approach:

```typescript
await Promise.all(users.map((user) => db.updateUser(user.id, user.data)));
```

This runs all updates in parallel, which should be much faster for large
datasets. The trade-off is we lose fine-grained error handling - we might
want to add a try/catch or use `Promise.allSettled` if we need to handle
partial failures.

Happy to pair on this if you'd like to discuss the trade-offs!

````

**Key Improvements:**
- Recognized the code works currently
- Specified when the issue matters (at scale)
- Explained performance impact clearly
- Provided concrete solution
- Acknowledged trade-offs honestly
- Offered collaboration

**Severity:** Important
**Why:** Sequential operations create bottlenecks at scale

---

## The 5 Empathy Principles

This prompt applies research-backed communication strategies:

### 1. Start with Appreciation
- Acknowledge what's working well
- Recognize effort and intent
- Find positives even in code that needs changes

### 2. Be Specific and Actionable
- Point to exact lines or patterns
- Explain *why* something matters
- Provide concrete examples

### 3. Use Collaborative Language
- Replace "you" with "we" or "this code"
- Frame as questions or suggestions
- Assume good intent and competence

### 4. Balance Critique with Context
- Distinguish blocking issues from suggestions
- Explain trade-offs and reasoning
- Invite discussion, don't dictate

### 5. Maintain Professional Respect
- Avoid sarcasm or dismissive language
- Focus on code, not the person
- Use encouraging, growth-oriented tone

---

## Integration Options

### CLI Usage
```bash
# Interactive mode
hitl use code-review-empathy

# Non-interactive with variables
hitl use code-review-empathy \
  --feedback "This code is inefficient" \
  --code_context "$(cat snippet.ts)"
````

### IDE Integration

Configure as a custom command in VS Code, JetBrains, or your editor of choice.

### CI/CD Hooks

Add as a pre-comment hook to automatically check review tone before posting:

```yaml
# .github/workflows/review-assistant.yml
name: Review Assistant
on: pull_request_review_comment

jobs:
  empathy-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: hitl use code-review-empathy --feedback "${{ github.event.comment.body }}"
```

### Git Hooks

Use as a commit-msg or prepare-commit-msg hook for review comments.

---

## Best Practices

### Do's ✅

- Use this prompt before posting critical feedback
- Provide code context when available for better suggestions
- Specify reviewer intent to help AI understand your goals
- Review the "Key Changes Made" section to learn better communication patterns
- Share this tool with your team to establish empathy norms

### Don'ts ❌

- Don't use as a replacement for learning empathetic communication
- Don't skip context - it helps the AI provide specific improvements
- Don't ignore the severity levels - they help prioritize feedback
- Don't forget that tone matters as much as technical accuracy

---

## Technical Details

**Template Engine:** Handlebars
**Input Format:** YAML variables
**Output Format:** Markdown with code blocks
**AI Model:** Works with any LLM (Claude, GPT-4, etc.)

---

## Related Prompts

- `prompt/code-review-ts` - TypeScript code review with best practices
- `prompt/code-review-security` - Security-focused code review
- `context-pack/culture` - Team culture and communication patterns

---

## Contributing

Found a harsh feedback pattern we should handle better? Submit an example:

```bash
hitl contribute prompt toolkit/prompts/culture/code-review-empathy
```

See [Contributing Guidelines](../../../../docs/contributing-guidelines.md) for details.

---

## License

MIT License - see [LICENSE](../../../../LICENSE) for details

---

## Metadata

- **Author:** codewizwit
- **Version:** 1.0.0
- **Last Updated:** 2025-10-15
- **Category:** Culture
- **Type:** Prompt Template

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

# Code Review Empathy Guide

Transforms harsh or unclear code review feedback into empathetic, constructive comments that maintain positive team dynamics while delivering important technical feedback. Applies an empathy framework covering appreciation, collaborative language, concrete examples, reasoning, and discussion prompts. Produces rewritten feedback with analysis of changes made and educational context.

## What You'll Be Asked

- **Task type**: Rewrite existing feedback, draft new feedback, or get general guidance
- **Context**: The original feedback comment, the code being reviewed, or both

## Usage Examples

### Rewrite Harsh Type Safety Feedback

> "Rewrite this review comment: 'This is terrible. You're using any types everywhere.'"

Produces an empathetic rewrite that acknowledges working logic, explains type safety benefits, includes a concrete interface example, and invites discussion.

### Draft Performance Concern

> "Help me write feedback about sequential database calls that won't scale"

Generates constructive feedback explaining when the pattern becomes a bottleneck, providing a Promise.all alternative, discussing trade-offs, and offering to pair.

### Transform Dismissive Tone

> "Make this nicer: 'Why would you do it this way? Just use the built-in method.'"

Creates a rewrite that presents alternatives as options, adds edge case considerations, and asks about the author's reasoning rather than dismissing their approach.

## Key Features

- Empathy framework: appreciation, collaboration, examples, reasoning, discussion
- Severity classification (Critical, Important, Suggestion, Nitpick)
- Concrete code examples alongside every transformed comment
- Educational "Why This Matters" context for recipient learning
- Analysis of key changes explaining what was adjusted and why

## Installation

```bash
hit install code-review-empathy
```

## Related Resources

- [Code Review TypeScript](../code-review-ts/) - For conducting TypeScript code reviews
- [1-on-1 Pre-Read](../1-on-1-prep/) - For preparing constructive 1-on-1 communication
- [Team Retrospective](../team-retrospective/) - For facilitating team improvement discussions

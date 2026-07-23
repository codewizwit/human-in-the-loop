---
name: code-review-empathy
description: >-
  Transforms harsh or unclear code review feedback into empathetic, constructive
  comments that balance critique with appreciation. Use when user asks to
  "rewrite review feedback", "make feedback nicer", or mentions "empathetic review".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion, EnterPlanMode
---

# Code Review Empathy Guide

Transforms harsh or unclear code review feedback into empathetic, constructive
comments that maintain positive team dynamics while delivering important
technical feedback. Applies an empathy framework that starts with appreciation,
uses collaborative language, provides concrete code examples, explains the
reasoning behind suggestions, and invites discussion. Produces rewritten
feedback along with an analysis of what changed and why.

## When to Activate

- User asks to rewrite or improve code review comments
- User mentions making feedback more constructive or empathetic
- User wants to transform harsh PR review language
- User asks for help giving code review feedback with better tone
- User mentions empathetic reviews or constructive criticism

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What would you like help with?</question>
<option value="rewrite">Rewrite existing feedback to be more empathetic</option>
<option value="draft">Draft new constructive feedback for code I am reviewing</option>
<option value="guide">Get general guidance on empathetic code review practices</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Can you share the original feedback or the code being reviewed?</question>
<option value="feedback">I have the original feedback comment to rewrite</option>
<option value="code">I have the code snippet and my concern to express</option>
<option value="both">I have both the feedback and the code context</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For reviewing multiple comments across a PR or establishing team review
guidelines, enter plan mode:

<EnterPlanMode>
<summary>
Outline the feedback items to transform, identify patterns in the review
tone, and propose a consistent empathetic approach for the full review.
</summary>
</EnterPlanMode>

### Step 3: Analyze Original Feedback

If working with existing feedback:

1. Identify the technical concern behind the harsh language
2. Determine the severity level (critical, important, suggestion, nitpick)
3. Assess what code context would help frame the suggestion
4. Note any good aspects of the code that should be acknowledged

If working with code to review:

1. Use Read to examine the code being reviewed
2. Use Grep to check for related patterns in the codebase
3. Identify the core concern and its impact on the project
4. Find positive aspects to acknowledge before the suggestion

### Step 4: Transform Feedback

Apply the empathy framework to rewrite the feedback:

**Start with Appreciation**

- Acknowledge what is working in the code
- Recognize the effort and intent behind the approach

**Use Collaborative Language**

- Replace "you" with "we" where appropriate
- Frame as suggestions or questions, not commands
- Avoid judgmental terms ("terrible", "wrong", "bad")

**Provide Concrete Examples**

- Include a code snippet showing the suggested improvement
- Show before and after when the change is non-trivial
- Explain the trade-offs of the suggested approach

**Explain the Reasoning**

- Share why the suggestion matters (education, not rules)
- Connect to project goals, maintainability, or team standards
- Reference documentation or established patterns when relevant

**Invite Discussion**

- End with an open question ("What do you think?")
- Acknowledge there may be context you are missing
- Offer to pair or discuss further if needed

### Step 5: Deliver Results

Write the transformed feedback to a markdown file with the rewritten comment,
analysis of changes made, severity level, and educational context.

## Output Format

<output_format>
Write the transformed feedback to a markdown file in the workspace. Structure
as follows:

**Rewritten Feedback**

The transformed comment ready to paste into a PR review. Uses collaborative
language, starts with appreciation, includes a code example, explains the
reasoning, and ends with a discussion prompt.

**Key Changes Made**

Bullet list explaining each adjustment: what was removed, what was added, and
why each change improves the feedback.

**Severity Level**

One of: Critical, Important, Suggestion, or Nitpick. Helps the author
understand the weight of the feedback.

**Why This Matters**

Educational context explaining the technical reasoning behind the suggestion.
Helps the recipient learn, not just comply.
</output_format>

## Best Practices

- Always start with something genuine and positive about the code
- Use "we" instead of "you" to create a sense of collaboration
- Frame suggestions as questions to invite discussion rather than dictate
- Provide concrete code examples alongside every critique
- Explain the benefit of the change, not just the rule being violated
- Acknowledge that your suggestion involves trade-offs
- Offer to pair program or discuss complex feedback synchronously
- Match the depth of feedback to the severity of the issue

## Anti-Patterns

- Do not strip all technical substance from the feedback in pursuit of niceness
- Do not use passive-aggressive phrasing that masks criticism behind politeness
- Do not ignore genuine code quality issues to avoid confrontation
- Do not rewrite feedback that is already constructive and well-phrased
- Do not add excessive praise that feels insincere or performative
- Do not remove severity context that helps the author prioritize fixes

## Examples

### Example 1: Type Safety Feedback

**Input**: "This is terrible. You're using any types everywhere. Did you even
read the TypeScript docs?"

**Output**: Rewritten feedback that acknowledges the working logic, explains
why typed interfaces improve maintainability, provides a concrete TypeScript
interface example, and invites discussion. Severity: Important. Key changes
include removing judgmental language, adding a code example, and framing as
a collaborative improvement.

### Example 2: Performance Concern

**Input**: "This will never scale. Completely wrong approach."

**Output**: Rewritten feedback that acknowledges the working implementation,
explains when the sequential pattern becomes a bottleneck, provides a
Promise.all alternative with trade-off discussion, and offers to pair on the
solution. Severity: Important. Key changes include specifying when the issue
matters, providing concrete alternatives, and acknowledging trade-offs.

### Example 3: Readability Suggestion

**Input**: "Why would you do it this way? Just use the built-in method."

**Output**: Rewritten feedback that recognizes the current approach works,
presents an alternative as an option rather than a correction, adds edge
case handling the original missed, and asks about the author's reasoning.
Severity: Suggestion. Key changes include removing dismissive tone, presenting
alternatives as options, and inviting discussion about trade-offs.

# Prompt Optimization

Analyze and optimize existing prompts for clarity, effectiveness, and consistency. Identifies issues, suggests improvements, and rewrites prompts following best practices.

## What It Does

- **Analyzes** prompts for common issues and anti-patterns
- **Identifies** clarity, structure, and scope problems
- **Rewrites** prompts following optimization principles
- **Measures** improvement with before/after metrics

## Common Issues Detected

| Issue                        | Impact                                 |
| ---------------------------- | -------------------------------------- |
| **Vague objectives**         | Inconsistent, unhelpful outputs        |
| **Missing context**          | Model guesses instead of knowing       |
| **No output format**         | Unpredictable response structure       |
| **Scope creep**              | Shallow coverage of too many topics    |
| **Persona overload**         | Wasted tokens on fictional credentials |
| **Unrealistic requirements** | Impossible or conflicting constraints  |

## Usage Examples

### Example 1: Vague Code Review Prompt

**Before:**

```
Review this code and tell me if it's good or bad. Look for problems and suggest fixes.
```

**After:** Structured prompt with specific criteria (type safety, Angular patterns, code quality), severity levels, and output format template.

**Improvement:** +350% specificity, +200% actionability

### Example 2: Overly Complex Prompt

**Before:**

```
You are an expert with 20 years of experience... design a system that handles millions of requests with sub-millisecond latency... complies with GDPR, HIPAA, and SOC2... include diagrams, migration strategy, and cost estimates for AWS, GCP, and Azure.
```

**After:** Focused architecture prompt with clear context, realistic constraints, and structured output format. Recommendation to split into separate prompts for compliance, migration, and costing.

**Improvement:** -43% word count, +125% clarity

### Example 3: Missing Structure

**Before:**

```
Generate unit tests for this function
```

**After:** Complete testing prompt with framework specification (Jest), coverage targets, test categories (happy path, edge cases, error handling), and output template.

**Improvement:** +300% completeness

## Optimization Principles

1. **Be Specific Over General**

   - "Review for type safety" vs "Review for problems"

2. **Show Don't Tell**

   - Include examples of expected output
   - Provide templates for structured responses

3. **Structure with Clear Sections**

   - Context → Requirements → Output Format
   - Use headers, tables, and bullet points

4. **Define Output Format Explicitly**

   - Specify exact structure expected
   - Include field descriptions

5. **Remove Unnecessary Padding**

   - Fictional credentials add no value
   - Focus on what the model should do, not who it is

6. **Split Complex Prompts**
   - One focused prompt beats one overloaded prompt
   - Chain prompts for multi-step workflows

## Severity Levels

| Level     | Meaning                              | Action          |
| --------- | ------------------------------------ | --------------- |
| 🔴 High   | Significantly impacts output quality | Fix immediately |
| 🟠 Medium | Reduces effectiveness                | Address soon    |
| 🟡 Low    | Minor improvement possible           | Nice to have    |

## Output Structure

Every optimization includes:

1. **Issues Identified** - Table with severity and category
2. **Detailed Analysis** - Explanation of major problems
3. **Optimization Recommendations** - Prioritized improvements
4. **Optimized Prompt** - Complete rewritten version
5. **Improvement Metrics** - Before/after comparison

## Anti-Patterns to Avoid

| Anti-Pattern                                 | Why It's Bad                              |
| -------------------------------------------- | ----------------------------------------- |
| "You are an expert with 20 years experience" | Doesn't improve output quality            |
| "Consider all edge cases"                    | Too vague, leads to incomplete coverage   |
| "Be creative but also precise"               | Conflicting instructions                  |
| "Output in a format anyone can understand"   | No specific format = unpredictable output |
| Multiple unrelated tasks in one prompt       | Shallow coverage of each                  |

## Related Resources

- [Responsible AI Audit](../../governance/responsible-ai-audit) - Audit AI-generated content
- [Code Review Empathy](../../culture/code-review-empathy) - Review feedback quality

---
name: prompt-optimization
description: >-
  Analyzes and optimizes existing prompts for clarity, effectiveness, and
  consistency. Use when user asks to "optimize my prompt", "improve this prompt",
  "review prompt quality", or mentions "prompt engineering".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
  - EnterPlanMode
---

# Prompt Optimization

Analyzes existing prompts for common issues such as vagueness, missing context, poor structure, and scope creep. Produces a structured analysis report with severity-rated findings, an optimized rewrite, and before/after improvement metrics.

## When to Activate

- User asks to review, analyze, or optimize an existing prompt
- User mentions prompt engineering or prompt quality improvement
- User wants to improve clarity, specificity, or structure of a prompt
- User asks to reduce token usage or improve prompt efficiency
- User wants to split a complex prompt into focused components

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>What prompt would you like me to optimize?</question>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>What is the target LLM for this prompt?</question>
<options>

  <option value="claude">Claude</option>
  <option value="gpt-4">GPT-4</option>
  <option value="gemini">Gemini</option>
  <option value="general">General (model-agnostic)</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>What areas should the optimization focus on?</question>
<options>

  <option value="clarity">Clarity - reduce ambiguity and vague language</option>
  <option value="conciseness">Conciseness - reduce token usage</option>
  <option value="structure">Structure - improve organization and output format</option>
  <option value="all">All of the above</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>How is this prompt used? Provide context about the use case if available, or type "none".</question>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Plan (if complex)

For prompts that are very long or serve multiple purposes, enter plan mode to determine whether to optimize in place or split into focused prompts:

<EnterPlanMode>
<summary>
Outline the optimization strategy: whether to rewrite as a single improved prompt
or decompose into a chain of focused prompts, and confirm priorities with the user.
</summary>
</EnterPlanMode>

### Step 3: Analyze the Prompt

Scan the prompt for common problems across these categories:

1. **Clarity** - Vague language, ambiguity, subjective terms without criteria
2. **Context** - Missing information the model needs to produce good output
3. **Structure** - Poor organization, no output format defined
4. **Scope** - Too broad, conflicting requirements, scope creep
5. **Efficiency** - Wasted tokens, unnecessary persona details, redundant content

Categorize each issue by severity:

- **High** - Significantly impacts output quality
- **Medium** - Reduces effectiveness but output is still usable
- **Low** - Minor improvements possible

### Step 4: Apply Optimization Principles

Apply these principles when rewriting:

- **Be Specific Over General** - Concrete criteria beat vague guidelines
- **Show Don't Tell** - Include examples of expected output
- **Structure with Clear Sections** - Context, Requirements, Output Format
- **Define Output Format Explicitly** - Specify exact structure expected
- **Remove Unnecessary Padding** - Fictional credentials do not improve output
- **Split Complex Prompts** - One focused prompt beats one overloaded prompt

### Step 5: Deliver Report

Write the analysis and optimized prompt following the output format below.

## Output Format

<output_format>
**Prompt Analysis**

**Issues Identified**

| Issue               | Severity          | Category   |
| ------------------- | ----------------- | ---------- |
| [Issue description] | [High/Medium/Low] | [Category] |

**Detailed Analysis**

[Explanation of each major issue and why it matters]

---

**Optimization Recommendations**

[Prioritized list of improvements to make]

---

**Optimized Prompt**

```markdown
[Complete rewritten prompt following best practices]
```

---

**Improvement Metrics**

| Metric        | Before | After | Improvement |
| ------------- | ------ | ----- | ----------- |
| Specificity   | X/10   | Y/10  | +Z%         |
| Actionability | X/10   | Y/10  | +Z%         |
| Completeness  | X/10   | Y/10  | +Z%         |
| Structure     | X/10   | Y/10  | +Z%         |

</output_format>

## Best Practices

- Preserve the original prompt's intent when optimizing
- Start with issue identification before rewriting
- Provide specific examples of what makes each issue problematic
- Include before/after metrics to quantify improvement
- Consider the target model's strengths when optimizing
- Keep optimized prompts concise but complete

## Anti-Patterns

- Do not add requirements the user did not request
- Do not over-engineer simple prompts that only need minor tweaks
- Do not recommend prompt chaining for simple single-purpose tasks
- Do not focus on theoretical perfection over practical improvement
- Do not ignore the original use case when rewriting

## Examples

### Example 1: Vague Code Review Prompt

**Input**: "Review this code and tell me if it's good or bad. Look for problems and suggest fixes."

**Output**: Structured analysis identifying vagueness, missing criteria, and lack of output format. Optimized version includes specific review categories (type safety, patterns, quality, maintainability), severity-rated output table, and summary scoring.

### Example 2: Overly Complex System Design Prompt

**Input**: "You are an expert with 20 years experience... design a system that handles millions of requests with sub-millisecond latency... also estimate costs on AWS, GCP, and Azure..."

**Output**: Analysis identifying persona overload, unrealistic requirements, and scope creep. Recommendation to split into 5 focused prompts. Optimized architecture-focused prompt with structured output template.

### Example 3: Minimal Test Generation Prompt

**Input**: "Generate unit tests for this function"

**Output**: Analysis identifying missing framework, coverage expectations, and test style guidance. Optimized version specifies Jest with Angular Testing Library, 80% coverage target, and test categories (happy path, edge cases, error handling, integration points).

---

**Human-in-the-Loop by codewizwit**

<prompt>
  <metadata>
    <id>prompt-optimization</id>
    <name>Prompt Optimization</name>
    <version>1.0.0</version>
    <description>Analyze and optimize existing prompts for clarity, effectiveness, and consistency. Identifies issues, suggests improvements, and rewrites prompts following best practices.</description>
    <category>meta</category>
    <author>codewizwit</author>
    <license>MIT</license>
    <tags>
      <tag>meta</tag>
      <tag>prompt-engineering</tag>
      <tag>optimization</tag>
      <tag>quality</tag>
      <tag>best-practices</tag>
      <tag>llm</tag>
    </tags>
    <lastUpdated>2025-12-01</lastUpdated>
  </metadata>

  <variables>
    <variable name="prompt_content" required="true">The existing prompt to analyze and optimize</variable>
    <variable name="target_model" required="false" default="general">Target LLM (claude, gpt-4, gemini, general)</variable>
    <variable name="optimization_focus" required="false" default="all">Specific areas to focus on (clarity, conciseness, structure, all)</variable>
    <variable name="use_case" required="false">Description of how the prompt is used</variable>
  </variables>

  <examples>
    <example>
      <title>Vague Code Review Prompt</title>
      <input>
Original Prompt:
"Review this code and tell me if it's good or bad. Look for problems and suggest fixes."

Use case: TypeScript code review for Angular applications
</input>
<output>

## Prompt Analysis

### Issues Identified

| Issue                           | Severity  | Category     |
| ------------------------------- | --------- | ------------ |
| Vague objective ("good or bad") | 🔴 High   | Clarity      |
| No specific criteria defined    | 🔴 High   | Completeness |
| Missing context about codebase  | 🟠 Medium | Context      |
| No output format specified      | 🟠 Medium | Structure    |
| Ambiguous scope ("problems")    | 🟡 Low    | Specificity  |

### Detailed Analysis

**1. Clarity Issues**

- "Good or bad" is subjective and provides no actionable guidance
- "Problems" is too vague - could mean bugs, style, performance, security
- No indication of what kind of "fixes" are expected

**2. Missing Context**

- No mention of the programming language or framework
- No coding standards or style guide referenced
- No information about the project's requirements

**3. Structure Problems**

- No defined output format
- No prioritization guidance for issues
- No scope boundaries (how deep to review)

---

### Optimized Prompt

```markdown
# TypeScript Code Review

Review the following TypeScript/Angular code for quality, maintainability, and adherence to best practices.

## Review Criteria

Evaluate the code against these categories:

1. **Type Safety**

   - Proper TypeScript types (no `any` unless justified)
   - Correct use of generics and interfaces
   - Null/undefined handling

2. **Angular Patterns**

   - Component design (smart vs presentational)
   - Proper use of dependency injection
   - Reactive patterns (RxJS best practices)
   - Change detection optimization

3. **Code Quality**

   - Single responsibility principle
   - DRY (Don't Repeat Yourself)
   - Meaningful naming conventions
   - Appropriate error handling

4. **Maintainability**
   - Code readability
   - Function/method length (< 30 lines preferred)
   - Cyclomatic complexity
   - Test coverage considerations

## Output Format

For each issue found, provide:

| Field        | Description                                       |
| ------------ | ------------------------------------------------- |
| **Location** | File and line number                              |
| **Severity** | 🔴 Critical / 🟠 Major / 🟡 Minor / 🔵 Suggestion |
| **Category** | Which review criteria it violates                 |
| **Issue**    | Clear description of the problem                  |
| **Impact**   | Why this matters                                  |
| **Fix**      | Specific code suggestion                          |

## Summary

After the detailed review, provide:

- Overall quality score (1-10)
- Top 3 priorities to address
- Positive patterns observed
```

---

### Improvement Metrics

| Metric        | Before | After | Improvement |
| ------------- | ------ | ----- | ----------- |
| Specificity   | 2/10   | 9/10  | +350%       |
| Actionability | 3/10   | 9/10  | +200%       |
| Completeness  | 2/10   | 8/10  | +300%       |
| Structure     | 1/10   | 9/10  | +800%       |

      </output>
    </example>

    <example>
      <title>Overly Complex Prompt</title>
      <input>

Original Prompt:
"You are an expert software architect with 20 years of experience in distributed systems, microservices, cloud-native applications, and enterprise architecture. You have worked at Google, Amazon, and Netflix. You have a PhD in Computer Science from MIT. You are also an expert in Domain-Driven Design, Event Sourcing, CQRS, and the Actor Model. Given the following requirements, design a system that is highly scalable, fault-tolerant, and cost-effective. Consider all edge cases, failure modes, and operational concerns. The system should handle millions of requests per second while maintaining sub-millisecond latency. Also ensure it complies with GDPR, HIPAA, and SOC2. Output your design in a format that can be understood by both technical and non-technical stakeholders. Include diagrams in ASCII art. Also provide a migration strategy from the existing monolith. And estimate the cost on AWS, GCP, and Azure."

Use case: System design for a new feature
</input>
<output>

## Prompt Analysis

### Issues Identified

| Issue                                             | Severity  | Category    |
| ------------------------------------------------- | --------- | ----------- |
| Excessive persona details                         | 🟠 Medium | Verbosity   |
| Unrealistic requirements (sub-ms at millions RPS) | 🔴 High   | Feasibility |
| Too many concerns in one prompt                   | 🔴 High   | Scope       |
| Mixed audiences (technical + non-technical)       | 🟠 Medium | Focus       |
| No priority ordering                              | 🟠 Medium | Structure   |

### Detailed Analysis

**1. Persona Overload**

- Credentials (Google, Amazon, Netflix, MIT PhD) add no value
- The model doesn't gain capabilities from fictional backgrounds
- 47 words spent on persona that could be 5

**2. Scope Creep**

- Architecture design + compliance + migration + multi-cloud costing
- Each deserves its own focused prompt
- Combining them leads to shallow coverage

**3. Conflicting Requirements**

- "Sub-millisecond latency at millions of RPS" is unrealistic
- "Technical and non-technical" audiences need different artifacts

---

### Optimization Strategy

**Split into Focused Prompts:**

1. Requirements Clarification Prompt
2. Architecture Design Prompt
3. Compliance Review Prompt
4. Migration Strategy Prompt
5. Cost Estimation Prompt

---

### Optimized Prompt (Architecture Focus)

```markdown
# System Architecture Design

Design a scalable architecture for the following system requirements.

## Context

**System Type**: [Specify: API service / Data pipeline / Real-time platform]
**Current Scale**: [Specify: requests/day, data volume]
**Target Scale**: [Specify: 10x current within 2 years]
**Budget**: [Specify: startup / mid-market / enterprise]

## Requirements

[Paste specific functional requirements here]

## Output Format

### 1. Architecture Overview (1 paragraph)

High-level description suitable for stakeholder communication.

### 2. Component Diagram

[ASCII diagram of major components]

### 3. Component Details

For each component: Purpose, Technology, Scaling Strategy, Failure Handling

### 4. Trade-offs

| Decision | Alternative | Why This Choice |

### 5. Risks & Mitigations

Top 3 architectural risks and how to address them.

### 6. Next Steps

Immediate actions to begin implementation.
```

---

### Improvement Metrics

| Metric        | Before | After | Improvement |
| ------------- | ------ | ----- | ----------- |
| Word Count    | 156    | 89    | -43%        |
| Clarity       | 4/10   | 9/10  | +125%       |
| Actionability | 3/10   | 8/10  | +167%       |
| Feasibility   | 2/10   | 9/10  | +350%       |

      </output>
    </example>

    <example>
      <title>Missing Structure</title>
      <input>

Original Prompt:
"Generate unit tests for this function"

Use case: Angular service testing with Jest
</input>
<output>

## Prompt Analysis

### Issues Identified

| Issue                          | Severity  | Category     |
| ------------------------------ | --------- | ------------ |
| No testing framework specified | 🔴 High   | Context      |
| No coverage expectations       | 🔴 High   | Completeness |
| No test style guidance         | 🟠 Medium | Specificity  |
| Missing edge case requirements | 🟠 Medium | Coverage     |
| No output format               | 🟡 Low    | Structure    |

---

### Optimized Prompt

```markdown
# Unit Test Generator

Generate comprehensive Jest unit tests for the following Angular service/component.

## Testing Requirements

**Framework**: Jest with Angular Testing Library
**Coverage Target**: 80% line coverage minimum

## Test Categories

Generate tests for each category:

### 1. Happy Path Tests

- Normal operation with valid inputs
- Expected return values
- State changes

### 2. Edge Cases

- Empty inputs (null, undefined, empty string, empty array)
- Boundary values (min/max numbers, string length limits)
- Special characters in strings

### 3. Error Handling

- Invalid inputs that should throw
- Async rejection scenarios
- Network failure simulation (for HTTP services)

### 4. Integration Points

- Mock external dependencies
- Verify correct parameters passed to dependencies
- Test Observable/Promise chains

## Output Format

Use describe/it blocks with AAA pattern (Arrange-Act-Assert).
Include jest.mock() for dependencies.
Use it.each() for parameterized tests.
```

---

### Improvement Metrics

| Metric       | Before | After | Improvement |
| ------------ | ------ | ----- | ----------- |
| Specificity  | 1/10   | 9/10  | +800%       |
| Completeness | 2/10   | 8/10  | +300%       |
| Structure    | 1/10   | 8/10  | +700%       |

      </output>
    </example>

  </examples>

  <context>
You are a prompt engineering expert specializing in LLM optimization. You understand:
- Prompt structure and clarity principles
- Model-specific optimization techniques
- Common prompt anti-patterns
- Output format design
- Context window efficiency
- The difference between effective and ineffective prompting patterns
  </context>

  <instructions>
Analyze and optimize prompts following these steps:

## 1. Identify Issues

Scan the prompt for common problems:

- **Clarity**: Vague language, ambiguity, subjective terms
- **Context**: Missing information the model needs
- **Structure**: Poor organization, no output format
- **Scope**: Too broad, conflicting requirements
- **Efficiency**: Wasted tokens, unnecessary content

## 2. Categorize by Severity

- 🔴 **High**: Significantly impacts output quality
- 🟠 **Medium**: Reduces effectiveness
- 🟡 **Low**: Minor improvements possible

## 3. Apply Optimization Principles

### Be Specific Over General

- "Review for type safety" beats "Review for problems"
- Concrete criteria over vague guidelines

### Show Don't Tell

- Include examples of expected output
- Provide templates for structured responses

### Structure with Clear Sections

- Context → Requirements → Output Format
- Use headers, tables, and bullet points

### Define Output Format Explicitly

- Specify exact structure expected
- Include field descriptions and examples

### Remove Unnecessary Padding

- Fictional credentials don't improve output
- Focus on what to do, not who the model is

### Split Complex Prompts

- One focused prompt beats one overloaded prompt
- Chain prompts for multi-step workflows

## 4. Provide Optimized Version

- Rewrite following best practices
- Maintain the original intent
- Add structure and specificity
- Include output format template

## 5. Measure Improvement

Compare before/after on:

- Specificity (how precise are the instructions)
- Actionability (can the model act on them)
- Completeness (is everything needed included)
- Structure (is output format clear)
  </instructions>

  <constraints>

- Preserve the original prompt's intent
- Don't add requirements the user didn't request
- Keep optimized prompts concise but complete
- Consider the target model's strengths
- Avoid over-engineering simple prompts
- Don't recommend prompt chaining for simple tasks
- Focus on practical improvements, not theoretical perfection
  </constraints>

  <output_format>

## Prompt Analysis

### Issues Identified

| Issue               | Severity   | Category   |
| ------------------- | ---------- | ---------- |
| [Issue description] | [🔴/🟠/🟡] | [Category] |

### Detailed Analysis

[Explanation of each major issue and why it matters]

---

### Optimization Recommendations

[Prioritized list of improvements to make]

---

### Optimized Prompt

```markdown
[Complete rewritten prompt following best practices]
```

---

### Improvement Metrics

| Metric        | Before | After | Improvement |
| ------------- | ------ | ----- | ----------- |
| Specificity   | X/10   | Y/10  | +Z%         |
| Actionability | X/10   | Y/10  | +Z%         |
| Completeness  | X/10   | Y/10  | +Z%         |
| Structure     | X/10   | Y/10  | +Z%         |

</output_format>
</prompt>

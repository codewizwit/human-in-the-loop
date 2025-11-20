# XML Template Migration Guide

Guide for migrating prompt templates to XML structure following Claude prompt engineering best practices.

## Why XML Structure?

XML tags in prompt templates provide several key benefits:

1. **Clear Section Boundaries** - Claude better understands where instructions end and user input begins
2. **Injection Protection** - User input wrapped in XML tags prevents prompt injection attacks
3. **Consistent Structure** - Standard tags create predictable patterns across all prompts
4. **Better Parsing** - Claude is trained to recognize and respect XML structure
5. **Improved Responses** - Structured prompts lead to more accurate, consistent outputs

## Recommended XML Tag Structure

### Core Tags

**`<context>`** - Role definition and background

```xml
<context>
You are an expert TypeScript code reviewer with deep knowledge of type systems,
modern ECMAScript features, and security best practices. Your role is to provide
constructive, actionable feedback that helps developers improve code quality.
</context>
```

**`<instructions>`** - Specific task directives

```xml
<instructions>
Review the provided TypeScript code and analyze:

1. **Type Safety**
   - Evaluate type definitions and usage
   - Identify inappropriate use of `any` type
   - Assess generic type effectiveness

2. **Code Quality**
   - Assess readability and maintainability
   - Evaluate naming conventions
   - Review code organization

3. **Security**
   - Verify input validation
   - Identify potential vulnerabilities
</instructions>
```

**`<input>` or specific input tags** - User-provided content

```xml
<code_to_review>
{{code}}
</code_to_review>

<!-- Conditional inputs -->
{{#if context}}
<additional_context>
{{context}}
</additional_context>
{{/if}}
```

**`<constraints>`** - Limitations and rules

```xml
<constraints>
- Focus only on the provided code
- Assume TypeScript strict mode is enabled
- Provide specific line references when pointing out issues
- Include code examples for recommended changes
- Prioritize critical issues over style preferences
</constraints>
```

**`<output_format>`** - Expected response structure

```xml
<output_format>
Structure your review as follows:

**Type Safety**
- [Specific findings with code examples]

**Code Quality**
- [Specific findings with code examples]

**Security**
- [Specific findings with code examples]

For each issue:
- Clearly explain the problem
- Provide a specific, actionable recommendation
- Include a code example showing the improvement
- Note the severity (Critical, High, Medium, Low)
</output_format>
```

### Optional Tags

**`<examples>`** - Input/output examples for Claude

````xml
<examples>
  <example>
    <input_case>
    function processData(data: any) {
      return data.value;
    }
    </input_case>
    <expected_output>
    **Type Safety Issues:**
    - Line 1: Avoid using `any` type. Define a proper interface:
    ```typescript
    interface DataInput {
      value: unknown;
    }
    function processData(data: DataInput) {
      return data.value;
    }
    ```
    </expected_output>
  </example>
</examples>
````

**`<thinking>`** - For chain-of-thought reasoning

```xml
<thinking>
Before providing your final analysis, think through:
1. What are the most critical issues?
2. What patterns indicate deeper architectural concerns?
3. What improvements would have the highest impact?
</thinking>
```

## Variable Substitution

Keep Handlebars syntax for variable substitution:

```xml
<!-- Simple variable -->
<code_to_review>
{{code}}
</code_to_review>

<!-- Conditional variable -->
{{#if context}}
<additional_context>
{{context}}
</additional_context>
{{/if}}

<!-- Default values -->
{{language}} <!-- defaults to value from variables section -->
```

## Migration Examples

### Example 1: Code Review Prompt

**BEFORE (Plain Text):**

```yaml
template: |
  Review the following TypeScript code:

  {{code}}

  Provide a comprehensive code review covering:
  1. Type Safety
  2. Code Quality
  3. Best Practices

  Provide specific, actionable feedback.
```

**AFTER (XML Structure):**

```yaml
template: |
  <context>
  You are an expert TypeScript code reviewer with deep knowledge of type systems,
  modern ECMAScript features, and security best practices.
  </context>

  <instructions>
  Review the provided TypeScript code and analyze:

  1. **Type Safety**
     - Evaluate type definitions and usage
     - Identify inappropriate use of `any` type

  2. **Code Quality**
     - Assess readability and maintainability
     - Evaluate naming conventions

  3. **Best Practices**
     - Verify adherence to TypeScript conventions
     - Evaluate error handling approaches
  </instructions>

  <code_to_review>
  {{code}}
  </code_to_review>

  <constraints>
  - Focus only on the provided code
  - Assume TypeScript strict mode is enabled
  - Provide specific line references
  - Include code examples for changes
  </constraints>

  <output_format>
  Structure your review as:

  **Type Safety**
  - [Findings with examples]

  **Code Quality**
  - [Findings with examples]

  **Best Practices**
  - [Findings with examples]
  </output_format>
```

### Example 2: Test Generation Prompt

**BEFORE:**

```yaml
template: |
  Generate unit tests for the following code:

  {{code}}

  {{#if framework}}
  Use {{framework}} for testing.
  {{/if}}

  Include edge cases and error scenarios.
```

**AFTER:**

```yaml
template: |
  <context>
  You are an expert test engineer who writes comprehensive, maintainable unit tests
  following testing best practices and the Arrange-Act-Assert pattern.
  </context>

  <instructions>
  Generate unit tests for the provided code that cover:

  1. **Happy Path** - Normal, expected usage
  2. **Edge Cases** - Boundary conditions and unusual inputs
  3. **Error Scenarios** - Invalid inputs and error handling
  4. **Integration Points** - Mocked dependencies and external calls
  </instructions>

  <code_to_test>
  {{code}}
  </code_to_test>

  {{#if framework}}
  <testing_framework>
  {{framework}}
  </testing_framework>
  {{/if}}

  <constraints>
  - Follow Arrange-Act-Assert pattern
  - Use descriptive test names
  - Include setup and teardown when needed
  - Mock external dependencies
  - Aim for 80%+ code coverage
  </constraints>

  <output_format>
  Provide complete test file with:
  - Import statements
  - Test suite setup
  - Individual test cases with clear descriptions
  - Cleanup/teardown logic
  </output_format>
```

## Best Practices

### 1. Always Include Context

Define Claude's role and expertise:

```xml
<context>
You are an expert [role] with deep knowledge of [domain].
Your goal is to [objective].
</context>
```

### 2. Use Numbered Instructions

Make directives clear and scannable:

```xml
<instructions>
Analyze the provided input for:

1. **Category 1**
   - Specific aspect A
   - Specific aspect B

2. **Category 2**
   - Specific aspect C
</instructions>
```

### 3. Isolate User Input

Always wrap user-provided content in XML tags:

```xml
<user_input>
{{variable_name}}
</user_input>
```

This prevents prompt injection where user input could include instructions like "Ignore previous instructions..."

### 4. Specify Output Format

Be explicit about expected response structure:

```xml
<output_format>
Provide response in this format:

## Section 1
[Content]

## Section 2
[Content]

Use markdown formatting with code blocks where appropriate.
</output_format>
```

### 5. Define Constraints

Set boundaries for Claude's responses:

```xml
<constraints>
- Do not suggest external libraries unless necessary
- Focus only on the provided code
- Assume strict mode is enabled
- Limit response to 500 words
</constraints>
```

## Common Patterns

### Pattern 1: Code Analysis Prompts

```xml
<context>Expert role definition</context>
<instructions>Specific analysis tasks</instructions>
<code_to_analyze>{{code}}</code_to_analyze>
<constraints>Analysis boundaries</constraints>
<output_format>Response structure</output_format>
```

### Pattern 2: Generation Prompts

```xml
<context>Generator role definition</context>
<instructions>What to generate and requirements</instructions>
<input_data>{{data}}</input_data>
<examples>Sample outputs</examples>
<output_format>Expected format</output_format>
```

### Pattern 3: Review Prompts

```xml
<context>Reviewer expertise</context>
<instructions>Review criteria and focus areas</instructions>
<content_to_review>{{content}}</content_to_review>
<constraints>Review scope and limitations</constraints>
<output_format>Review structure with severity ratings</output_format>
```

### Pattern 4: Planning Prompts

```xml
<context>Planner role and expertise</context>
<instructions>Planning objectives and deliverables</instructions>
<requirements>{{requirements}}</requirements>
<thinking>Step-by-step reasoning process</thinking>
<output_format>Plan structure and format</output_format>
```

## Migration Checklist

When converting a prompt to XML structure:

- [ ] Wrap role definition in `<context>` tags
- [ ] Structure task directives in `<instructions>` with numbered lists
- [ ] Wrap all user input variables in descriptive XML tags
- [ ] Add `<constraints>` section with clear boundaries
- [ ] Define `<output_format>` with specific structure
- [ ] Test variable substitution still works
- [ ] Verify XML tags are balanced (opening and closing tags match)
- [ ] Use descriptive tag names (e.g., `<code_to_review>` not `<input>`)
- [ ] Include conditional sections with Handlebars syntax when needed
- [ ] Add examples if pattern is complex or novel

## Validation

The CLI will validate XML structure in prompts:

**Automatic Checks:**

- Balanced XML tags (every opening tag has matching closing tag)
- Recommended tags present (context, instructions, output_format)
- No malformed XML syntax

**Manual Checks:**

- Context defines role and expertise clearly
- Instructions are specific and actionable
- User input is properly isolated in XML tags
- Output format is explicit and detailed
- Constraints set appropriate boundaries

## FAQ

**Q: Do I need to escape special characters in XML?**
A: Yes, use standard XML entities:

- `&lt;` for `<`
- `&gt;` for `>`
- `&amp;` for `&`
- `&quot;` for `"`
- `&apos;` for `'`

YAML multiline strings handle this automatically in most cases.

**Q: Can I nest XML tags?**
A: Yes, nesting is allowed and encouraged for organization:

```xml
<instructions>
  <primary_analysis>
    <type_safety>Check types</type_safety>
    <code_quality>Review quality</code_quality>
  </primary_analysis>
  <secondary_analysis>
    <performance>Assess performance</performance>
  </secondary_analysis>
</instructions>
```

**Q: What if my prompt doesn't fit this structure?**
A: The tags are flexible. Use what makes sense for your prompt. The key principles are:

1. Define context/role
2. Clear instructions
3. Isolate user input
4. Specify output format

**Q: Will this break existing prompts?**
A: No! Plain text templates still work. XML is recommended for new prompts and migrations.

**Q: How do I test my XML template?**
A: Use the CLI validation:

```bash
hit contribute prompt /path/to/prompt
```

This checks XML structure and warns about missing recommended tags.

## Resources

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [XML Best Practices](https://www.w3.org/TR/xml/)
- [Contributing Guidelines](../CONTRIBUTING.md)

---

**Human-in-the-Loop by codewizwit**

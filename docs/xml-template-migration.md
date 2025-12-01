# Pure XML Template Format

Guide for creating prompt templates using pure XML structure following Anthropic Claude best practices.

> **Note**: As of v2.0.0, all prompts use pure XML format (no YAML frontmatter). Human-readable metadata is provided in separate README files.

## Why XML Structure?

XML tags in prompt templates provide several key benefits:

1. **Clear Section Boundaries** - Claude better understands where instructions end and user input begins
2. **Injection Protection** - User input wrapped in XML tags prevents prompt injection attacks
3. **Consistent Structure** - Standard tags create predictable patterns across all prompts
4. **Better Parsing** - Claude is trained to recognize and respect XML structure
5. **Improved Responses** - Structured prompts lead to more accurate, consistent outputs

## Pure XML File Structure

All prompt files must start with a root `<prompt>` element containing metadata and prompt sections:

```xml
<prompt>
  <metadata>
    <!-- Metadata section - stripped by CLI before sending to Claude -->
  </metadata>

  <examples>
    <!-- Example usage - stripped by CLI before sending to Claude -->
  </examples>

  <context>
    <!-- Role definition - sent to Claude -->
  </context>

  <instructions>
    <!-- Task directives - sent to Claude -->
  </instructions>

  <constraints>
    <!-- Limitations and rules - sent to Claude -->
  </constraints>

  <output_format>
    <!-- Expected response structure - sent to Claude -->
  </output_format>
</prompt>
```

**Important**: The CLI automatically strips `<metadata>` and `<examples>` sections before creating Claude Code slash commands. Only `<context>`, `<instructions>`, `<constraints>`, and `<output_format>` are sent to Claude.

## Required Sections

### Metadata Section (Stripped by CLI)

**`<metadata>`** - File metadata for documentation and tooling

```xml
<metadata>
  <id>code-review-ts</id>
  <name>TypeScript Code Review</name>
  <version>2.0.0</version>
  <description>Automated TypeScript code review for your workspace</description>
  <category>code-review</category>
  <author>codewizwit</author>
  <license>MIT</license>
  <tags>
    <tag>typescript</tag>
    <tag>code-review</tag>
    <tag>best-practices</tag>
  </tags>
  <lastUpdated>2025-01-15</lastUpdated>

  <!-- Optional: Variable definitions -->
  <variables>
    <variable>
      <name>code</name>
      <description>The code to review</description>
      <required>true</required>
    </variable>
  </variables>
</metadata>
```

### Examples Section (Stripped by CLI)

**`<examples>`** - Usage examples for documentation

```xml
<examples>
  <example>
    <description>Full workspace TypeScript review</description>
    <input>
      <user_message>Please review all TypeScript code in this project</user_message>
    </input>
  </example>
  <example>
    <description>Review specific file</description>
    <input>
      <user_message>Review src/auth/login.ts for security issues</user_message>
    </input>
  </example>
</examples>
```

## Core Prompt Tags (Sent to Claude)

### Context Tag

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

**Note**: Variable substitution (e.g., `{{code}}`) is no longer used in v2.0.0. Prompts now use Claude Code's built-in capabilities to access workspace files directly via tools like Read, Grep, and Glob.

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
Write your code review to a markdown file in the workspace. Use proper markdown syntax with clear headings and code blocks. Structure your review as follows:

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

**Important**: Always specify that outputs should be written to a markdown file in the workspace, not just displayed in the terminal. This allows users to reference and iterate on the output file.

### Optional Tags

**`<thinking>`** - For chain-of-thought reasoning (sent to Claude)

```xml
<thinking>
Before providing your final analysis, think through:
1. What are the most critical issues?
2. What patterns indicate deeper architectural concerns?
3. What improvements would have the highest impact?
</thinking>
```

## Complete Example: TypeScript Code Review Prompt

```xml
<prompt>
  <metadata>
    <id>code-review-ts</id>
    <name>TypeScript Code Review</name>
    <version>2.0.0</version>
    <description>Automated TypeScript code review for your workspace using Read, Grep, and Glob tools</description>
    <category>code-review</category>
    <author>codewizwit</author>
    <license>MIT</license>
    <tags>
      <tag>typescript</tag>
      <tag>code-review</tag>
      <tag>best-practices</tag>
    </tags>
    <lastUpdated>2025-01-15</lastUpdated>
  </metadata>

  <examples>
    <example>
      <description>Full workspace TypeScript review</description>
      <input>
        <user_message>Please review all TypeScript code in this project</user_message>
      </input>
    </example>
  </examples>

  <context>
You are an expert TypeScript code reviewer with deep knowledge of type systems, modern ECMAScript features, and security best practices. Your role is to provide constructive, actionable feedback that helps developers improve code quality.
  </context>

  <instructions>
Review the TypeScript code in the current workspace and analyze:

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

  <constraints>
- Use Read, Grep, and Glob tools to analyze TypeScript files
- Assume TypeScript strict mode is enabled
- Provide specific line references when pointing out issues
- Include code examples for recommended changes
- Prioritize critical issues over style preferences
  </constraints>

  <output_format>
Write your code review to a markdown file in the workspace. Use proper markdown syntax with clear headings and code blocks. Structure your review as follows:

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
</prompt>
```

## README Files

Each prompt must include a concise README.md file in the same directory. The README provides human-readable metadata and usage examples.

**README Structure** (185-233 words):

```markdown
# [Prompt Name]

[One-sentence description]

## What You'll Be Asked

- [Input 1] - [Description]
- [Input 2 (optional)] - [Description]

## Usage Examples

### Example 1: [Scenario Name]

[Brief description of the use case]

**Expected Output:**

\```markdown
[Realistic output snippet showing what the prompt generates]
\```

### Example 2: [Another Scenario]

[Brief description]

**Expected Output:**

\```markdown
[Another output snippet]
\```

## Related Resources

- [Internal Link](../category/other-prompt) - Description
- [External Documentation](https://example.com) - Description
- [Tool/Framework Guide](https://example.com) - Description
```

**Example README** (lib/prompts/code-review-ts/README.md):

```markdown
# TypeScript Code Review

Automated TypeScript code review for your workspace using Read, Grep, and Glob tools.

## What You'll Be Asked

- The prompt automatically analyzes all TypeScript files in your workspace (no input required)
- Optionally: Specific focus areas (e.g., "focus on authentication logic")

## Usage Examples

### Example 1: Full Workspace Review

Analyze an entire TypeScript project for type safety issues, code quality problems, and security vulnerabilities.

**Expected Output:**

\```markdown
**Type Safety**
- src/auth/login.ts:45 - Using `any` type defeats TypeScript's benefits
  Recommendation: Define proper interface for user object
\```

## Related Resources

- [Code Review Empathy](../culture/code-review-empathy) - Transform harsh feedback
- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering) - XML best practices
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

### 3. Use Claude Code Tools for File Access

In v2.0.0, prompts no longer use variable substitution. Instead, instruct Claude to use built-in tools:

```xml
<instructions>
Review the TypeScript code in the current workspace and analyze:
1. Use the Glob tool to find all *.ts files
2. Use the Read tool to examine each file
3. Use the Grep tool to search for specific patterns
</instructions>

<constraints>
- Use Read, Grep, and Glob tools to analyze TypeScript files
- Do not make assumptions about file locations
</constraints>
```

This approach is more flexible and prevents prompt injection vulnerabilities.

### 4. Write Outputs to Markdown Files

Always instruct Claude to write outputs to markdown files in the workspace:

```xml
<output_format>
Write your analysis to a markdown file in the workspace. Use proper markdown syntax with clear headings and code blocks. Structure your output as follows:

## Section 1
[Content]

## Section 2
[Content]

Include code examples using fenced code blocks with language identifiers.
</output_format>
```

This allows users to reference and iterate on the output file rather than scrolling through terminal output.

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
<prompt>
  <metadata>[...]</metadata>
  <examples>[...]</examples>

  <context>Expert role definition</context>

  <instructions>
  Specific analysis tasks:
  1. Use Glob tool to find relevant files
  2. Use Read tool to examine code
  3. Analyze for [specific criteria]
  </instructions>

  <constraints>
  - Use Read, Grep, and Glob tools
  - Analysis boundaries
  </constraints>

  <output_format>
  Write your analysis to a markdown file in the workspace.
  Structure: [specific format]
  </output_format>
</prompt>
```

### Pattern 2: Review Prompts

```xml
<prompt>
  <metadata>[...]</metadata>
  <examples>[...]</examples>

  <context>Reviewer expertise</context>

  <instructions>
  Review criteria and focus areas:
  1. Use appropriate tools to access workspace
  2. Analyze according to [criteria]
  </instructions>

  <constraints>
  - Review scope and limitations
  - Tool usage guidelines
  </constraints>

  <output_format>
  Write your review to a markdown file with severity ratings.
  </output_format>
</prompt>
```

### Pattern 3: Planning Prompts

```xml
<prompt>
  <metadata>[...]</metadata>
  <examples>[...]</examples>

  <context>Planner role and expertise</context>

  <instructions>
  Planning objectives and deliverables
  </instructions>

  <thinking>
  Step-by-step reasoning process
  </thinking>

  <output_format>
  Write your plan to a markdown file in the workspace.
  Structure: [plan format]
  </output_format>
</prompt>
```

## Creation Checklist

When creating a new pure XML prompt:

- [ ] Start with `<prompt>` root element
- [ ] Add complete `<metadata>` section with all required fields:
  - [ ] id, name, version, description, category
  - [ ] author, license, tags, lastUpdated
- [ ] Add `<examples>` section with 2+ usage examples
- [ ] Wrap role definition in `<context>` tags
- [ ] Structure task directives in `<instructions>` with numbered lists
- [ ] Add `<constraints>` section specifying tool usage and boundaries
- [ ] Define `<output_format>` instructing to write to markdown file
- [ ] Verify XML tags are balanced (opening and closing tags match)
- [ ] Create concise README.md (185-233 words) with:
  - [ ] One-sentence description
  - [ ] "What You'll Be Asked" section
  - [ ] 2 usage examples with expected output snippets
  - [ ] Related resources (3 links)
- [ ] Test with CLI: `hit contribute prompt /path/to/prompt.md`

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

**Q: Does the CLI support legacy formats?**
A: Yes! The CLI maintains backward compatibility:
- Pure XML format (v2.0.0+) - Recommended
- Markdown with YAML frontmatter (v1.x) - Supported
- Pure YAML (legacy) - Supported

New prompts should use pure XML format.

**Q: How do I test my XML template?**
A: Use the CLI:

```bash
# Test prompt creation
hit contribute prompt /path/to/prompt.md

# Verify the slash command was created
ls ~/.claude/commands/

# Test the command in Claude Code
# (Use the slash command in Claude Code CLI)
```

This validates XML structure and creates the Claude Code slash command.

**Q: Why are metadata and examples stripped from the slash command?**
A: To keep the prompt clean and focused. Anthropic best practices recommend sending only the essential prompt content to Claude. Metadata and examples are for human documentation and tooling, not for Claude's execution context.

## Resources

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [XML Best Practices](https://www.w3.org/TR/xml/)
- [Contributing Guidelines](../CONTRIBUTING.md)

---

**Human-in-the-Loop by codewizwit**

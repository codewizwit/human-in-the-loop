# Unified Skill Template Reference

This document defines the canonical format for all skills in the Human-in-the-Loop AI Hub. Every skill **must** follow this structure to pass validation and ensure consistency across the registry.

## Format Overview

A unified skill is a single Markdown file (`skill.md`) with YAML frontmatter, placed inside a skill directory alongside `metadata.json` and `README.md`.

```
lib/skills/<skill-id>/
  skill.md           # The unified skill definition (this format)
  metadata.json      # Registry metadata for CLI and search
  README.md          # Usage documentation for humans
```

---

## YAML Frontmatter (Required)

Every `skill.md` must begin with YAML frontmatter containing these fields:

```yaml
---
name: example-skill
description: >-
  One-line description of what this skill does. Use when user asks to
  "trigger phrase 1", "trigger phrase 2", or mentions "keyword".
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
```

### Field Requirements

| Field           | Type     | Required | Format                                 |
| --------------- | -------- | -------- | -------------------------------------- |
| `name`          | string   | Yes      | kebab-case (e.g., `code-review-ts`)    |
| `description`   | string   | Yes      | Must include trigger phrases in quotes |
| `version`       | string   | Yes      | Semantic versioning (e.g., `3.0.0`)    |
| `allowed-tools` | string[] | Yes      | Minimum 1 tool from the available set  |

### Available Tools

```
Read, Glob, Grep, Write, Edit, AskUserQuestion, EnterPlanMode
```

---

## Required Markdown Sections

After the frontmatter, every skill must include these sections in order:

### 1. Title and Description

```markdown
# Skill Display Name

One paragraph describing the skill's purpose, what it produces, and who benefits from it.
```

### 2. When to Activate

```markdown
## When to Activate

- Trigger condition 1
- Trigger condition 2
- Trigger condition 3
```

### 3. Interactive Flow

This section defines the step-by-step methodology. It must include `AskUserQuestion` usage for gathering context and optionally `EnterPlanMode` for complex requests.

```markdown
## Interactive Flow

### Step 1: Gather Context

Use AskUserQuestion to collect missing information from the user:

<AskUserQuestion>
<question>What is the scope of this task?</question>
<option value="full">Full project</option>
<option value="directory">Specific directory</option>
<option value="file">Single file</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For large or ambiguous requests, enter plan mode to align on approach:

<EnterPlanMode>
<summary>Summarize the proposed approach and list deliverables</summary>
</EnterPlanMode>

### Step 3: Execute

[Detailed execution methodology with numbered steps]

### Step 4: Deliver Results

[How outputs are structured and delivered]
```

### 4. Output Format

```markdown
## Output Format

<output_format>
Describe the structure of the skill's output here.
Use XML tags to define sections when the output is structured.

**Section 1: Title**
[Content description]

**Section 2: Title**
[Content description]
</output_format>
```

### 5. Best Practices

```markdown
## Best Practices

- Always gather context before executing
- Provide specific file paths and line references
- Include actionable recommendations with examples
- Use severity levels for prioritization
```

### 6. Anti-Patterns

```markdown
## Anti-Patterns

- Do not skip the discovery phase
- Do not provide generic advice without code references
- Do not make changes without user confirmation
- Do not ignore existing project conventions
```

### 7. Examples

```markdown
## Examples

### Example 1: [Scenario Name]

**Input**: "User's natural language request"

**Output**: Brief description of what the skill produces in this scenario.

### Example 2: [Scenario Name]

**Input**: "Another user request"

**Output**: Brief description of the output.
```

---

## Complete Working Example

Below is a fully working skill definition that demonstrates all required sections:

```markdown
---
name: api-endpoint-review
description: >-
  Reviews REST API endpoints for consistency, security, and best practices.
  Use when user asks to "review my API", "check endpoints", or mentions
  "API audit".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
  - EnterPlanMode
---

# API Endpoint Review

Analyzes REST API endpoints in your codebase for consistency, security
vulnerabilities, error handling, and adherence to RESTful conventions.
Produces a structured audit report with severity-rated findings.

## When to Activate

- User asks to review API routes or endpoints
- User mentions API audit or REST best practices
- User wants to check API security or error handling

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What is the scope of this API review?</question>
<option value="all">All API endpoints</option>
<option value="module">Specific module or feature</option>
<option value="recent">Recently changed endpoints only</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Which framework does your API use?</question>
<option value="express">Express.js</option>
<option value="nestjs">NestJS</option>
<option value="fastify">Fastify</option>
<option value="other">Other</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For large APIs with many endpoints, enter plan mode:

<EnterPlanMode>
<summary>
Outline the review scope, list endpoint groups to analyze,
and confirm priority areas with the user.
</summary>
</EnterPlanMode>

### Step 3: Discovery

1. Use Glob to find route/controller files
2. Use Read to examine endpoint definitions
3. Use Grep to search for common anti-patterns

### Step 4: Analysis

Evaluate each endpoint against:

- RESTful naming conventions
- HTTP method correctness
- Input validation and sanitization
- Error handling and status codes
- Authentication and authorization
- Rate limiting and security headers

### Step 5: Deliver Report

Write findings to a markdown file organized by severity.

## Output Format

<output_format>
**Endpoint Inventory**
[Table of all discovered endpoints with method, path, and handler]

**Critical Findings**
[Issues requiring immediate attention]

**Recommendations**
[Improvements organized by category]

**Summary Score**
[Overall API health rating with breakdown]
</output_format>

## Best Practices

- Start with project discovery before diving into code
- Prioritize security findings over style issues
- Include specific file paths and line numbers for all findings
- Provide code examples for recommended fixes

## Anti-Patterns

- Do not review generated or third-party code
- Do not suggest breaking changes without migration guidance
- Do not ignore existing project conventions for personal preference
- Do not skip authentication and authorization checks

## Examples

### Example 1: Full API Audit

**Input**: "Review all API endpoints in this NestJS application"

**Output**: Comprehensive audit report covering 15 endpoints across 4
modules, with 3 critical security findings, 5 medium improvements,
and an overall health score.

### Example 2: Security-Focused Review

**Input**: "Check my Express API routes for security issues"

**Output**: Security-focused report highlighting input validation gaps,
missing rate limiting, and authentication bypass risks with fix examples.
```

---

## Validation Rules

The following rules are enforced by the Zod schema and CI validation:

1. `name` must be kebab-case (lowercase letters, numbers, hyphens)
2. `description` must include at least one quoted trigger phrase
3. `version` must follow semantic versioning (`major.minor.patch`)
4. `allowed-tools` must contain at least one valid tool name
5. All seven markdown sections must be present: title, When to Activate, Interactive Flow, Output Format, Best Practices, Anti-Patterns, Examples

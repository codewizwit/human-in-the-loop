---
name: codebase-explainer
description: >-
  Analyzes and explains a codebase's architecture, structure, patterns, and
  conventions. Use when user asks to "explain this codebase", "document the
  architecture", or mentions "codebase overview".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
  - EnterPlanMode
---

# Codebase Explainer

Analyzes a codebase to generate comprehensive documentation explaining its
architecture, directory structure, key patterns, conventions, entry points,
dependencies, and getting-started guidance. Produces documentation that helps
developers understand unfamiliar repositories quickly with ASCII architecture
diagrams and structured breakdowns.

## When to Activate

- User asks to explain or document a codebase they are unfamiliar with
- User mentions architecture overview or project structure documentation
- User wants onboarding documentation for new developers
- User asks about how a project is organized or what technologies it uses

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>Which directory or project should I analyze?</question>
<option value="current">Current working directory</option>
<option value="specify">Let me specify a path</option>
</AskUserQuestion>

<AskUserQuestion>
<question>How much detail do you need?</question>
<option value="quick">Quick - Summary, structure, and quick start only</option>
<option value="standard">Standard - All sections with moderate detail</option>
<option value="comprehensive">Comprehensive - Deep dive with diagrams and examples</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Is there a specific area you want me to focus on?</question>
<option value="architecture">Architecture and design decisions</option>
<option value="testing">Testing strategy and patterns</option>
<option value="deployment">Deployment and CI/CD pipeline</option>
<option value="none">No focus, cover everything</option>
</AskUserQuestion>

### Step 2: Plan (if comprehensive)

For comprehensive analysis of large codebases, enter plan mode:

<EnterPlanMode>
<summary>
List the major directories and components identified, propose the
documentation structure, and confirm which areas to prioritize.
</summary>
</EnterPlanMode>

### Step 3: Discovery

1. Use Glob to map the directory tree and file structure
2. Use Read to examine key configuration files (`package.json`, `tsconfig.json`, build configs)
3. Identify the tech stack from dependencies and configuration
4. Detect the project type (monorepo, SPA, API, library, etc.)

### Step 4: Deep Analysis

1. Use Read to examine entry points (`main.ts`, `index.ts`, `app.module.ts`)
2. Use Grep to identify patterns, conventions, and recurring structures
3. Map dependency relationships and data flow between modules
4. Identify CI/CD configuration and deployment patterns

### Step 5: Documentation Generation

Generate documentation based on the requested depth level:

**Quick**: Summary + Structure + Quick Start only
**Standard**: All sections with moderate detail
**Comprehensive**: All sections with extensive detail, ASCII diagrams, and examples

Sections to generate:

1. Quick Summary (2-3 sentences)
2. Architecture Overview with ASCII diagram
3. Directory Structure Breakdown with tables
4. Key Patterns and Conventions
5. Entry Points and how to run/build
6. Dependencies and Their Roles
7. Getting Started for new developers
8. Key Files to Read First (prioritized table)
9. Common Tasks table

### Step 6: Deliver Documentation

Write the complete documentation to a markdown file in the workspace.

## Output Format

<output_format>
Write the codebase documentation to a markdown file. Structure as follows:

# Codebase Explainer: [Project Name]

## Quick Summary

[2-3 sentence overview of project type, purpose, and key technologies]

## Architecture Overview

```
[ASCII diagram showing major components and relationships]
```

[Brief architecture explanation]

## Directory Structure Breakdown

### [Section Name]

| Directory | Purpose     |
| --------- | ----------- |
| `path/`   | Description |

## Key Patterns and Conventions

### 1. [Pattern Name]

[Explanation with examples]

## Entry Points

```typescript
[Key entry point code or explanation]
```

## Dependencies and Their Roles

| Dependency | Role    |
| ---------- | ------- |
| `name`     | Purpose |

## Getting Started

### For New Developers

1. [Step-by-step instructions]

## Key Files to Read First

| Priority | File   | Why    |
| -------- | ------ | ------ |
| 1        | `file` | Reason |

## Common Tasks

| Task   | Command   |
| ------ | --------- |
| Action | `command` |

</output_format>

## Best Practices

- Base analysis only on actual files and directories found in the codebase
- Use tables for structured information to improve readability
- Include ASCII diagrams for architecture visualization
- Focus on helping new developers get productive quickly
- Adjust depth and detail based on user preference
- Note areas where information is missing or would be helpful

## Anti-Patterns

- Do not assume files, features, or technologies that are not present in the codebase
- Do not generate boilerplate documentation unrelated to the actual project
- Do not skip the discovery phase and make assumptions about project structure
- Do not ignore configuration files that reveal project conventions
- Do not provide overly verbose explanations for simple projects (respect depth setting)

## Examples

### Example 1: Quick Overview

**Input**: "Give me a quick overview of this project"

**Output**: Summary with project type, tech stack, directory structure table,
and quick start commands.

### Example 2: Comprehensive Monorepo Documentation

**Input**: "Create comprehensive documentation for this Nx monorepo"

**Output**: Full documentation with ASCII architecture diagram, detailed
directory breakdowns, dependency analysis, CI/CD pipeline explanation,
getting-started guide, and prioritized reading list.

### Example 3: Architecture-Focused Analysis

**Input**: "Explain the architecture of this NestJS backend"

**Output**: Architecture-focused documentation with module dependency diagram,
request pipeline flow, database layer explanation, and design pattern analysis.

---
name: skill-builder
description: >-
  Build a new Claude Code custom skill following official best
  practices. Use when someone asks to "create a skill", "build
  a skill", "write a SKILL.md", "make a custom skill", or
  "scaffold a new skill".
version: 3.0.0
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - EnterPlanMode
---

# Skill Builder

Build production-quality Claude Code custom skills following the official specification and best practices. Guides the user through skill design, writes the SKILL.md file, and validates the result.

## When to Activate

- User asks to create, build, or scaffold a new Claude Code skill
- User wants help writing a SKILL.md file
- User has an idea for automating a workflow with a custom skill
- User wants to convert an existing script or process into a skill

## Interactive Flow

### Step 1: Understand the Skill Purpose

Use AskUserQuestion to gather requirements:

```
What kind of skill do you want to build?
Options:
  - "Workflow task" — Multi-step process with side effects (deploy, release, scaffold files)
  - "Code generation" — Generate boilerplate files from patterns (components, tests, configs)
  - "Analysis / review" — Read-only analysis that produces a report (code review, audit, coverage)
  - "Knowledge / conventions" — Background context about project patterns and standards
```

Then ask:

```
Where should this skill live?
Options:
  - "Personal" — ~/.claude/skills/ (available in all your projects)
  - "Project" — .claude/skills/ (shared with the team via git)
  - "This toolkit" — lib/skills/ (for the human-in-the-loop library)
```

### Step 2: Gather Skill Details

Ask follow-up questions based on the skill type:

- **What should the skill be called?** (lowercase, letters/numbers/hyphens, max 64 chars)
- **What does it do in one sentence?** (becomes the description)
- **What trigger phrases should activate it?** (natural language patterns users would say)
- **Does it need arguments?** (e.g., `[filename]`, `[issue-number]`)
- **What tools does it need?** (Read, Write, Edit, Glob, Grep, Bash, Agent, etc.)
- **Should Claude auto-activate it, or manual-only?** (model-invocable vs disable-model-invocation)

### Step 3: Plan the Skill (for complex skills)

For skills with more than 3 steps, use EnterPlanMode to design the skill structure before writing it. The plan should cover:

- The step-by-step workflow the skill will follow
- What tools are needed at each step
- What the output looks like
- Edge cases and error handling

### Step 4: Write the SKILL.md

Generate the skill file following the official Claude Code specification below.

## Official Claude Code Skill Format Reference

### File Structure

Every skill requires a `SKILL.md` file with YAML frontmatter and markdown instructions:

```
my-skill/
├── SKILL.md           # Main instructions (required)
├── reference.md       # Optional supporting files for detailed reference
└── examples/          # Optional example outputs
```

### Frontmatter Fields

| Field                      | Required    | Type        | Description                                                                                                              |
| -------------------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `name`                     | No          | string      | Display name. Lowercase, letters/numbers/hyphens, max 64 chars. Defaults to directory name. Becomes the `/slash-command` |
| `description`              | Recommended | string      | What the skill does and when to use it. Claude uses this for auto-activation. Include trigger phrases in quotes          |
| `argument-hint`            | No          | string      | Hint shown during autocomplete. Example: `[issue-number]`                                                                |
| `disable-model-invocation` | No          | boolean     | Set `true` to prevent auto-activation. Use for workflows with side effects                                               |
| `user-invocable`           | No          | boolean     | Set `false` to hide from `/` menu. Use for background knowledge                                                          |
| `allowed-tools`            | No          | string list | Tools granted without per-use approval. Use `Bash(cmd *)` for scoped shell access                                        |
| `model`                    | No          | string      | Specific model to use when skill is active                                                                               |
| `context`                  | No          | string      | Set to `fork` to run in isolated subagent context                                                                        |
| `agent`                    | No          | string      | Subagent type when `context: fork`. Options: `Explore`, `Plan`, `general-purpose`                                        |
| `hooks`                    | No          | object      | Lifecycle hooks scoped to this skill                                                                                     |

### String Substitutions

| Variable               | Description                                  |
| ---------------------- | -------------------------------------------- |
| `$ARGUMENTS`           | All arguments passed when invoking the skill |
| `$0`, `$1`, `$2`       | Access specific arguments by index           |
| `${CLAUDE_SESSION_ID}` | Current session ID                           |

### Dynamic Context Injection

Use `` !`command` `` syntax in skill content to run shell commands before sending to Claude. The command output replaces the placeholder:

```markdown
Current branch: !`git branch --show-current`
PR diff: !`gh pr diff`
Changed files: !`gh pr diff --name-only`
```

### Skill Scope and Precedence

| Location | Path                                | Scope                        |
| -------- | ----------------------------------- | ---------------------------- |
| Personal | `~/.claude/skills/<name>/SKILL.md`  | All your projects            |
| Project  | `.claude/skills/<name>/SKILL.md`    | This project only            |
| Nested   | `.claude/skills/` in subdirectories | Auto-discovered in monorepos |

Precedence: Enterprise > Personal > Project.

## Design Principles

### 1. Choose the Right Invocation Model

| Skill Type                               | `disable-model-invocation` | `user-invocable` | Why                                               |
| ---------------------------------------- | -------------------------- | ---------------- | ------------------------------------------------- |
| Workflow task (deploy, commit, scaffold) | `true`                     | `true` (default) | Side effects require explicit user intent         |
| Analysis / review                        | `false` (default)          | `true` (default) | Safe to auto-activate when relevant               |
| Background knowledge                     | `false` (default)          | `false`          | Claude should know this but users don't invoke it |

### 2. Write Effective Descriptions

The description is the most important field. Claude uses it to decide when to auto-load the skill.

**Good descriptions include:**

- What the skill does in plain language
- Trigger phrases in quotes that match natural user requests
- Keywords that help Claude match intent

**Example:**

```yaml
description: >-
  Generate unit tests for TypeScript files using Jest. Use when
  someone asks to "write tests", "generate test coverage",
  "add unit tests", or mentions "Jest testing".
```

### 3. Scope Tool Access

Only grant tools the skill actually needs. Use scoped Bash access when possible:

```yaml
# Too broad
allowed-tools: Bash

# Better — scoped to specific commands
allowed-tools: Read, Grep, Bash(npm test *), Bash(git log *)
```

### 4. Keep Skills Focused

- Main SKILL.md should be under 500 lines
- Move detailed reference material to separate files and link from SKILL.md
- One skill = one clear purpose
- If a skill does too many things, split it into multiple skills

### 5. Structure for Clarity

A well-structured skill includes:

1. **Title and purpose** — One paragraph explaining what it does
2. **Steps** — Numbered, clear instructions Claude follows
3. **Output format** — What the result looks like
4. **Edge cases** — How to handle errors or ambiguous inputs

### 6. Use Extended Thinking

Include the word "ultrathink" in skill content to enable extended thinking for complex analysis tasks.

## Output Format

<output_format>

<section name="skill-file">
Write the complete SKILL.md file to the chosen destination path.

The file should include:

- Complete YAML frontmatter with all relevant fields
- Clear markdown instructions
- Numbered steps for the workflow
- Output format specification
- Edge case handling where needed
</section>

<section name="supporting-files">
If the skill needs reference material longer than 200 lines,
create separate supporting files (reference.md, examples.md)
and link to them from SKILL.md.
</section>

<section name="validation">
After writing, verify:
- YAML frontmatter parses correctly
- Name is lowercase, letters/numbers/hyphens only
- Description includes trigger phrases
- allowed-tools lists only what's needed
- Skill can be invoked with /name
</section>

<section name="install-instructions">
Tell the user how to use the skill:

For personal skills:
mkdir -p ~/.claude/skills/[name]
cp SKILL.md ~/.claude/skills/[name]/

For project skills:
mkdir -p .claude/skills/[name]
cp SKILL.md .claude/skills/[name]/
git add .claude/skills/[name]

Then invoke with /[name] or let Claude auto-activate it.

</section>
</output_format>

## Best Practices

- Always read existing skills in the project before creating new ones to avoid overlap
- Test the skill by invoking it with `/skill-name` after installation
- Start with a minimal skill and iterate based on real usage
- Use `disable-model-invocation: true` for anything that writes files or runs commands with side effects
- Include concrete examples in the skill instructions so Claude understands the expected output
- For skills that reference external APIs or tools, include fallback behavior when those are unavailable

## Anti-Patterns

- Creating skills that are too generic ("do code review" with no specific methodology)
- Granting `Bash` access without scoping to specific commands
- Writing skills longer than 500 lines without splitting into supporting files
- Using `model-invocable` for skills that modify files or run destructive commands
- Hardcoding project-specific paths in skills meant to be reusable
- Duplicating functionality already provided by Claude Code's built-in skills (`/simplify`, `/batch`, `/debug`)

## Examples

### Example 1: Workflow Skill

**Input**: "Create a skill that runs our deploy process"

**Output**: SKILL.md with `disable-model-invocation: true`, scoped Bash access (`Bash(./scripts/deploy.sh *)`), numbered deploy steps, rollback instructions.

### Example 2: Analysis Skill

**Input**: "Create a skill that reviews our API endpoints for consistency"

**Output**: SKILL.md with model-invocation enabled, Read/Glob/Grep tools, structured analysis methodology, report output format.

### Example 3: Knowledge Skill

**Input**: "Create a skill that captures our team's coding conventions"

**Output**: SKILL.md with `user-invocable: false`, no special tools needed, conventions documented as reference material that Claude loads when relevant.

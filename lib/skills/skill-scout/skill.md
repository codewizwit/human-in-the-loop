---
name: skill-scout
description: >-
  Analyze a codebase and session workflow for repetitive patterns,
  then generate concrete Claude Code skill recommendations with
  draft SKILL.md files. Use when someone asks to "find skill
  opportunities", "what skills should I create", "analyze my
  workflow for automation", or "scout for skills".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Write
  - Agent
  - AskUserQuestion
---

# Skill Scout

Analyze the current codebase and session history for repetitive patterns that could be automated with Claude Code skills. Produce a prioritized list of skill recommendations with evidence and ready-to-use SKILL.md drafts.

## When to Activate

- User asks to find skill opportunities or automation candidates
- User wants to know what custom skills to create for their project
- User asks to analyze their workflow for repetitive patterns
- Session has been long and active (context compaction has occurred)

## Interactive Flow

### Step 1: Scope the Analysis

Use AskUserQuestion to understand what the user cares about:

```
What kind of skills are you looking for?
Options:
  - "Workflow automation" — Repetitive multi-step tasks (deploy, release, scaffold)
  - "Code generation" — Boilerplate files that follow patterns (components, tests, migrations)
  - "Knowledge capture" — Project conventions, style guides, domain rules
  - "All of the above" — Full analysis
```

### Step 2: Gather Context

If the user provided an argument, use it as the output path. Otherwise default to `skills-suggestions.md` in the project root.

## Analysis Methodology

### Phase 1: Session Pattern Mining

Before scanning the codebase, analyze the current session:

- Review conversation history for repeated multi-step tasks — sequences of tool calls that followed the same pattern more than once
- Identify recurring request patterns — similar instructions the user gave multiple times
- Note manual coordination steps — places where the user repeated context, linked the same files, or re-explained instructions
- Check for repeated Bash command sequences that always run together

### Phase 2: Codebase Structure Mapping

Use Glob to catalog:

- Directory structure, file types, naming conventions
- Co-located file groups (e.g., component + test + style + story files)
- Generator configs, template directories, or scaffolding scripts already in place
- Existing `.claude/skills/` or `.claude/commands/` directories (acknowledge what's already covered)

### Phase 3: Repetitive Pattern Detection

**Boilerplate file groups** — Use Glob to find clusters of files that follow naming patterns (e.g., `*.controller.ts` always paired with `*.service.ts` and `*.module.ts`). Flag directories where 3+ files share a base name with different extensions.

**Repeated code structures** — Use Grep to find repeated import blocks, class signatures, or config patterns appearing in 5+ files. Look for copy-paste indicators: identical multi-line blocks across different files.

**Git history patterns** — Use Bash (read-only) to run:

- `git log --oneline -50` for recurring commit message types
- `git log --diff-filter=A --name-only --pretty=format: -50 | sort | head -30` for recently added file patterns
- `git log --all --oneline | head -100` for broader workflow patterns

**Manual process indicators** — Use Grep to search for TODO/FIXME comments referencing manual steps. Look for shell scripts, Makefiles, or package.json scripts that chain multiple commands.

### Phase 4: Evaluate and Prioritize

Score each finding on:

| Criterion    | Weight | Description                                                       |
| ------------ | ------ | ----------------------------------------------------------------- |
| Frequency    | High   | How often does this pattern repeat? Daily > weekly > occasionally |
| Effort saved | High   | How many manual steps or files does it involve each time?         |
| Error risk   | Medium | Is this something people get wrong manually?                      |
| Reusability  | Medium | One project or reusable across repos?                             |

### Phase 5: Generate Draft Skills

For each recommendation, generate a complete SKILL.md following the official Claude Code skill format:

```yaml
---
name: skill-name
description: >-
  What the skill does. Include trigger phrases in quotes so
  Claude knows when to activate it automatically.
disable-model-invocation: true # for workflow tasks with side effects
allowed-tools: Read, Glob, Grep # only what's needed
---
```

**Official frontmatter fields reference** (use only what's relevant):

| Field                      | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| `name`                     | Lowercase, letters/numbers/hyphens, max 64 chars. Becomes `/slash-command`  |
| `description`              | What it does + when to use it. Claude uses this for auto-activation         |
| `argument-hint`            | Shown during autocomplete, e.g. `[issue-number]`                            |
| `disable-model-invocation` | Set `true` for tasks with side effects (deploy, commit)                     |
| `user-invocable`           | Set `false` for background knowledge skills                                 |
| `allowed-tools`            | Tools granted without per-use approval. Use `Bash(cmd *)` for scoped access |
| `context`                  | Set to `fork` to run in isolated subagent                                   |
| `agent`                    | Subagent type when `context: fork` is set                                   |

**Key design rules for draft skills:**

- Reference content (conventions, patterns) = inline, model-invocable
- Task content (deploy, scaffold, commit) = `disable-model-invocation: true`
- Keep SKILL.md under 500 lines; move reference material to separate files
- Use `$ARGUMENTS` or `$0`, `$1` for argument substitution
- Use `!`command`` syntax for dynamic context injection

## Output Format

Write results to the output path. The file must follow this structure:

<output_format>

<section name="header">
# Skill Suggestions

> Generated by `/skill-scout` on [date]. Based on analysis of [repo name].

</section>

<section name="summary">
## Summary

2-3 sentence overview of findings and top recommendations.

</section>

<section name="recommendations">
## Recommendations

### 1. [Skill Name]

**What it automates**: One sentence description
**Evidence**: File paths, pattern counts, git log entries that prove the need
**Invocation**: `user-invocable` / `model-invocable` / `both`
**Impact**: High / Medium / Low with justification

<details>
<summary>Draft SKILL.md</summary>

Complete, functional SKILL.md that can be copied to `~/.claude/skills/` or `.claude/skills/` and used immediately with minor edits.

</details>

Repeat for each recommendation, numbered by priority.

</section>

<section name="analysis-summary">
## Patterns Analyzed

| Category                  | Scanned | Findings  |
| ------------------------- | ------- | --------- |
| Session workflow patterns | [count] | [summary] |
| Co-located file groups    | [count] | [summary] |
| Repeated code structures  | [count] | [summary] |
| Git history patterns      | [count] | [summary] |
| Manual process indicators | [count] | [summary] |

</section>
</output_format>

## Best Practices

- Generate 3-7 recommendations ordered by impact. Do not pad with low-value suggestions
- Every recommendation must cite specific evidence from the codebase
- Draft SKILL.md files must be functional starting points, not placeholders
- If the codebase already has skills, acknowledge coverage and focus on gaps
- If the codebase has minimal repetition, say so honestly
- Use Bash only for read-only git commands. Do not modify the repository
- Consider whether each skill should be personal (`~/.claude/skills/`) or project-level (`.claude/skills/`)

## Anti-Patterns

- Inventing problems where there is no real repetition
- Generating generic skills that don't reference actual codebase patterns
- Suggesting skills for one-off tasks that won't recur
- Making draft skills too vague to be useful without major rewriting
- Ignoring existing automation already in place

# Skill Scout

Analyze a codebase and session workflow for repetitive patterns, then generate concrete Claude Code skill recommendations with ready-to-use SKILL.md drafts.

## What It Does

Skill Scout examines your codebase structure, git history, and current session patterns to identify automation opportunities. It produces a prioritized list of skill recommendations backed by evidence from your actual code.

## Analysis Categories

- **Session workflow patterns** — Repeated multi-step tasks from conversation history
- **Co-located file groups** — Files that always appear together (component + test + style)
- **Repeated code structures** — Identical import blocks, class signatures, configs
- **Git history patterns** — Recurring commit types and file creation patterns
- **Manual process indicators** — TODOs, shell scripts, checklists describing manual steps

## Installation

```bash
hit install skill-scout
```

## Usage

The skill activates when you ask to find skill opportunities, analyze workflows for automation, or scout for skills. You can also invoke it directly.

## Output

Generates a `skills-suggestions.md` file (or custom path) with 3-7 prioritized recommendations. Each recommendation includes evidence, impact assessment, and a complete draft SKILL.md that can be used immediately.

# Init CLAUDE.md

Analyze a project's tech stack, conventions, and patterns, then generate a tailored project-level CLAUDE.md that captures real conventions based on evidence from the codebase.

## Overview

Init CLAUDE.md provides a smarter alternative to `claude init`. Instead of producing generic defaults, it reads the actual codebase first: examining config files, source code patterns, test conventions, git history, and CI/CD pipelines. It then generates a CLAUDE.md that contains only project-specific, actionable rules backed by evidence.

The skill also checks for a user-level `~/.claude/CLAUDE.md` to avoid duplicating rules already defined at the personal level, and respects existing project CLAUDE.md files by offering to enhance rather than replace them.

## Installation

```bash
hit install init-claude-md
```

## Usage

The skill activates when you ask to generate, create, or set up a CLAUDE.md file, or when you mention project configuration for Claude. You can also invoke it directly with `/init-claude-md`.

## What It Does

1. **Gathers preferences** -- Asks where to write the file and whether to enhance an existing CLAUDE.md or start fresh
2. **Detects the tech stack** -- Identifies languages, frameworks, package managers, test runners, linters, and build tools from config files
3. **Discovers conventions** -- Reads source files, test files, git history, and CI config to identify real patterns in use
4. **Checks user-level config** -- Reads `~/.claude/CLAUDE.md` to avoid duplicating personal rules
5. **Generates the CLAUDE.md** -- Writes a focused, 30-100 line file with only project-specific rules, commands, and patterns
6. **Presents findings** -- Summarizes what was included, why, and what was intentionally omitted

## Key Features

- **Evidence-based rules** -- Every convention included traces back to something found in the codebase
- **User-level deduplication** -- Skips rules already covered by `~/.claude/CLAUDE.md`
- **Linter-aware** -- Does not restate rules already enforced by ESLint, Prettier, or other linters
- **30-100 line target** -- Stays within the recommended size range; suggests extracting verbose sections into skills if the file grows too long
- **Enhance mode** -- Can improve an existing CLAUDE.md without replacing it, adding missing sections and flagging contradictions
- **Multi-language support** -- Works with JavaScript/TypeScript, Python, Rust, Go, Ruby, Java, PHP, and other ecosystems

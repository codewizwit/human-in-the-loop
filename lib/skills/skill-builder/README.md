# Skill Builder

Build production-quality Claude Code custom skills following the official specification and best practices.

## What It Does

Skill Builder guides you through designing and writing a Claude Code custom skill. It includes the complete official SKILL.md format reference, design principles for choosing the right invocation model, and generates validated skill files ready for installation.

## Key Features

- **Official format reference** — Complete YAML frontmatter fields, string substitutions, dynamic context injection
- **Interactive design flow** — AskUserQuestion prompts to gather requirements
- **Invocation model guidance** — Helps choose between auto-activation, manual-only, and background knowledge
- **Tool scoping** — Recommends minimal tool access following least-privilege principle
- **Validation** — Verifies generated skills parse correctly and follow conventions

## Installation

```bash
hit install skill-builder
```

## Usage

The skill activates when you ask to create, build, or scaffold a new Claude Code skill, or when you want help writing a SKILL.md file.

## Official Docs Reference

This skill embeds the complete Claude Code skill specification including:

- Frontmatter fields (name, description, argument-hint, disable-model-invocation, allowed-tools, context, agent)
- String substitutions ($ARGUMENTS, $0, $1, ${CLAUDE_SESSION_ID})
- Dynamic context injection (`` !`command` `` syntax)
- Scope and precedence rules (personal > project)
- Design principles from the official documentation

# Repo Skills Analyzer

Analyze a repository's git history, PR patterns, and review comments to surface repetitive operations that could be automated as Claude Code skills.

## Overview

Repo Skills examines how a team has been working over time by mining git history, branch patterns, PR structures, review feedback, and CI/CD configurations. It identifies repetitive multi-step processes and generates prioritized skill recommendations backed by evidence from the repository's own data.

This skill complements `/skill-scout`, which focuses on the current session and codebase structure. Repo Skills focuses on historical workflow patterns.

## Usage

The skill activates when you ask to analyze repo patterns, find automation opportunities from history, or mention repo workflow analysis. You can also invoke it directly.

At the start, it asks two questions:

1. **Analysis scope** — Full analysis, git history only, PR and review focus, or CI/CD gaps
2. **Output path** — Default (`repo-skills-suggestions.md`) or a custom path

## What It Does

The analysis covers six areas:

- **Commit history patterns** — Recurring commit message shapes, grouped commits, repeated prefixes
- **Branch and merge patterns** — Naming conventions, merge types, workflow indicators
- **PR and review patterns** — PR structure, recurring review feedback, formulaic PRs (requires `gh` CLI)
- **File change co-occurrence** — Files that always change together, predictable config changes
- **CI/CD and automation gaps** — Manual steps in pipelines, unchained scripts, gaps between CI and actual workflow
- **Scoring and prioritization** — Each finding scored on frequency, team impact, effort saved, error risk, and existing automation

## Output

Generates a markdown file with 3-7 prioritized recommendations. Each recommendation includes:

- What it automates and why
- Specific evidence from git history (commit counts, PR titles, review quotes)
- Trigger model (user-invocable, model-invocable, or both)
- Impact assessment
- A complete draft SKILL.md ready to copy into `.claude/skills/`

## Installation

```bash
hit install repo-skills
```

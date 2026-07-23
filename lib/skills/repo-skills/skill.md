---
name: repo-skills
description: >-
  Analyze a repository's git history, PR patterns, and review comments
  to surface repetitive operations that could be automated as skills.
  Use when user asks to "analyze repo patterns", "find automation
  opportunities", "what skills should I create from history", or
  mentions "repo workflow analysis".
version: 3.0.0
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion
---

# Repo Skills

Analyze this repository's history — commits, PRs, review comments, and branching patterns — to find repetitive operations that could be automated with Claude Code skills. Output a prioritized list of recommendations with evidence from the repo's own history.

This skill is complementary to `/skill-scout`. While skill-scout looks at the current session and codebase structure, repo-skills looks at how the team has been working over time.

## When to Activate

- User asks to analyze repo patterns or find automation opportunities
- User wants to know what skills to create based on their git history
- User asks what repetitive workflows exist in the repository
- User mentions repo workflow analysis or history-based skill discovery

## Interactive Flow

### Step 1: Gather User Preferences

Use AskUserQuestion to understand what the user wants:

```
What kind of analysis are you looking for?
Options:
  - "Full analysis" — Commits, branches, PRs, file co-occurrence, CI/CD gaps
  - "Git history only" — Focus on commit and branch patterns (no GitHub API needed)
  - "PR and review focus" — Emphasize PR structure and review comment patterns
  - "CI/CD gaps" — Focus on automation gaps and manual process indicators
```

Then ask:

```
Where should I write the results?
Options:
  - "Default" — repo-skills-suggestions.md in the project root
  - "Custom path" — I'll specify a path
```

### Step 2: Validate Environment

Before starting analysis, check:

- Confirm the directory is a git repository
- Check if `gh` CLI is available for PR/review analysis
- Note the available data scope and any limitations upfront

## Analysis Methodology

### Phase 1: Commit History Patterns

Use `Bash` (read-only) to analyze commit patterns:

- `git log --oneline -200` — scan recent commit messages for recurring task types
- `git log --format="%s" -200 | sed 's/[0-9]*//g' | sort | uniq -c | sort -rn | head -20` — find the most common commit message shapes after stripping numbers (reveals patterns like "add migration for X", "update schema for Y")
- `git log --format="%an|%s" -200` — check if certain authors always do certain types of work (specialization = automation opportunity)
- `git shortlog -sn --since="3 months ago"` — active contributors to understand team patterns

Look for:

- Commits that always come in groups (e.g., migration + schema update + seed data always land together)
- Repeated prefixes or patterns (e.g., "fix lint", "update deps", "bump version")
- Commit sequences that follow the same order — a sign of a manual multi-step process

### Phase 2: Branch and Merge Patterns

- `git branch -r --sort=-committerdate | head -30` — recent branch names for naming patterns
- `git log --merges --oneline -50` — merge commit messages for recurring merge types
- Look for branch naming conventions that suggest repeated workflows (e.g., `feature/`, `hotfix/`, `release/`, `deps/`)

### Phase 3: PR and Review Patterns

If this is a GitHub repo, use `Bash` (read-only) with the `gh` CLI:

- `gh pr list --state merged --limit 30 --json title,labels,additions,deletions,changedFiles` — recent merged PRs for size and type patterns
- `gh pr list --state merged --limit 30 --json title | jq -r '.[].title'` — PR titles for recurring patterns (same logic as commit messages)
- `gh pr list --state merged --limit 10 --json number --jq '.[].number' | head -5 | xargs -I{} gh pr view {} --json reviews,comments --jq '.reviews[].body, .comments[].body'` — review comments for recurring feedback themes

If `gh` is not available or this is not a GitHub repo, skip this phase and note it in the output.

Look for:

- PRs that always follow the same structure (e.g., "Add endpoint for X" always changes the same set of file types)
- Review comments that repeat the same feedback — a sign of a missing linter rule, skill, or convention
- PRs that are always small and formulaic — prime candidates for scaffolding skills
- Labels or categories that cluster around automatable work

### Phase 4: File Change Co-occurrence

- `git log --name-only --pretty=format: -100 | sort | uniq -c | sort -rn | head -30` — most frequently changed files
- Identify files that always change together by looking at commit diffs — if `routes.ts`, `controller.ts`, and `test.ts` always appear in the same commits, that is a co-located group that could be scaffolded
- Look for config files that change on a predictable cadence (version bumps, changelog updates, lock files)

### Phase 5: CI/CD and Automation Gaps

- Check for `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, or similar CI configs
- Use `Grep` to scan CI configs for manual steps, TODOs, or commented-out stages
- Look for scripts in `package.json`, `Makefile`, or `scripts/` that chain multiple commands — these are often automation candidates
- Identify gaps between what CI automates and what the commit history shows people doing manually

### Phase 6: Evaluate and Prioritize

Score each finding on:

| Criterion           | Weight | Description                                                                        |
| ------------------- | ------ | ---------------------------------------------------------------------------------- |
| Frequency           | High   | How often does this pattern appear in the history? Weekly > monthly > occasionally |
| Team impact         | High   | Does this affect one person or the whole team?                                     |
| Effort saved        | Medium | How many manual steps or files does it involve each time?                          |
| Error risk          | Medium | Do review comments suggest people get this wrong regularly?                        |
| Existing automation | Low    | Is there partial automation that could be completed?                               |

### Phase 7: Generate Output

Write the results to the output path determined in the Interactive Flow. Default: `repo-skills-suggestions.md` in the project root.

## Output Format

<output_format>

<section name="header">
# Repo Skills Suggestions

> Generated by `/repo-skills` on [date]. Based on analysis of [repo name] ([commit count] commits, [PR count] PRs analyzed).

</section>

<section name="summary">
## Summary

2-3 sentence overview of what was found and the top recommendations.

</section>

<section name="recommendations">
## Recommendations

### 1. [Skill Name]

**What it automates**: One sentence description
**Evidence**: Specific data from git history — commit counts, PR patterns, review comment themes
**Trigger**: `user-invocable` / `model-invocable` / `both`
**Estimated impact**: High / Medium / Low with brief justification

<details>
<summary>Draft SKILL.md</summary>

```yaml
---
name: [skill-name]
description: [description with trigger phrases]
disable-model-invocation: [true/false]
allowed-tools: [relevant tools]
---
```

Draft skill instructions covering the key steps the skill should perform (5-15 lines).

</details>

Repeat for each recommendation, numbered and ordered by priority.

</section>

<section name="analysis-summary">
## Patterns Analyzed

| Category                | Data Points | Findings  |
| ----------------------- | ----------- | --------- |
| Commit message patterns | [count]     | [summary] |
| Branch/merge patterns   | [count]     | [summary] |
| PR structure patterns   | [count]     | [summary] |
| Review comment themes   | [count]     | [summary] |
| File co-occurrence      | [count]     | [summary] |
| CI/CD gaps              | [count]     | [summary] |

</section>
</output_format>

## Best Practices

- Generate 3-7 recommendations ordered by impact. Do not pad with low-value suggestions
- Every recommendation must cite specific evidence from the repo history (commit counts, PR titles, review quotes)
- Draft SKILL.md skeletons should be functional starting points — someone should be able to copy one into `.claude/skills/` and start using it with minor edits
- If `gh` CLI is unavailable, note it and work with git history alone — still valuable
- If the repo is young or has minimal history, say so honestly. Do not invent patterns from small sample sizes
- Use `Bash` only for read-only commands. Do not modify the repository
- Respect rate limits if using `gh` — do not make more than 10 API calls
- Consider whether each suggested skill should be personal (`~/.claude/skills/`) or project-level (`.claude/skills/`)

## Anti-Patterns

- Inventing patterns from insufficient data (fewer than 5 occurrences)
- Generating generic skills that do not reference actual repo history
- Suggesting skills for one-off tasks that will not recur
- Making draft skills too vague to be useful without major rewriting
- Ignoring existing automation already in place (CI workflows, scripts, existing skills)
- Running destructive or write operations against the repository during analysis
- Making excessive GitHub API calls that could hit rate limits

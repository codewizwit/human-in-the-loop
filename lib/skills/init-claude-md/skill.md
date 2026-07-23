---
name: init-claude-md
description: >-
  Analyze a project and generate a tailored CLAUDE.md configuration file.
  Use when user asks to "generate a CLAUDE.md", "initialize claude",
  "set up CLAUDE.md", or mentions "project configuration for Claude".
version: 3.0.0
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion
---

# Init CLAUDE.md

Analyze a project's tech stack, conventions, and patterns, then generate a tailored project-level CLAUDE.md that captures the real conventions, patterns, and standards already in use. Unlike `claude init`, this skill reads the codebase first and writes rules based on evidence, not generic defaults.

## When to Activate

- User asks to generate, create, or initialize a CLAUDE.md file
- User wants to set up project configuration for Claude Code
- User mentions improving or enhancing an existing CLAUDE.md
- User asks for a smarter alternative to `claude init`

## Interactive Flow

### Step 1: Gather User Preferences

<AskUserQuestion>
<question>Where should I write the CLAUDE.md file?</question>
<option value="root">Project root (./CLAUDE.md)</option>
<option value="custom">Let me specify a custom path</option>
</AskUserQuestion>

<AskUserQuestion>
<question>An existing CLAUDE.md was detected. How should I proceed?</question>
<option value="enhance">Enhance the existing file (preserve current content, add missing sections)</option>
<option value="fresh">Generate a fresh CLAUDE.md (replace existing content)</option>
<option value="review">Show me what would change before writing anything</option>
</AskUserQuestion>

Only ask the second question if an existing CLAUDE.md is found at the target path. If no existing file is detected, proceed directly to analysis.

### Step 2: Detect the Tech Stack

Use Glob to identify languages and frameworks from file extensions, config files, and lock files.

Check for:

- `package.json`, `tsconfig.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `pom.xml`, `build.gradle`, `composer.json`, `requirements.txt`, and similar manifest files

Read the primary config file to extract:

- Framework (React, Angular, Vue, Django, Rails, NestJS, etc.)
- Test runner (Jest, Vitest, Pytest, etc.)
- Linter and formatter
- Build tool
- Package manager (npm, yarn, pnpm, bun, pip, poetry, cargo, etc.)

### Step 3: Discover Project Conventions

**Code Style**

- Check for linter configs (`.eslintrc`, `.prettierrc`, `ruff.toml`, `.rubocop.yml`, `golangci-lint`, etc.) and note which linter is in use. Do not restate linter rules in the CLAUDE.md since the linter enforces them already.
- Read 3-5 source files to identify patterns: naming conventions, import ordering, module structure, export style.

**Test Patterns**

- Use Glob to find test files and identify the convention: co-located tests (`*.test.ts` next to source), separate test directory (`tests/`, `__tests__/`, `spec/`), or both.
- Read 1-2 test files to identify: test framework, assertion style, fixture patterns, setup/teardown conventions.
- Check for: test coverage config, E2E test setup, integration test directories.

**Project Structure**

- Map the top-level directory structure and identify the architectural pattern: monorepo, module-per-feature, layered (controllers/services/repositories), flat, etc.
- Check for workspace configs (`nx.json`, `turbo.json`, `lerna.json`, `pnpm-workspace.yaml`).
- Identify where new files should go. If there is a clear pattern, capture it.

**Git Conventions**

- Use Bash (read-only) to check:
  - `git log --oneline -20` for commit message style (conventional commits, prefixed, freeform).
  - `git branch -r --sort=-committerdate | head -10` for branch naming patterns.
  - Whether `.github/` or CI config enforces commit or PR conventions.

**CI/CD**

- Check for `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `Dockerfile`, `docker-compose.yml`.
- Note what the CI pipeline runs (tests, linting, type checking, builds) so the CLAUDE.md can reference the right commands.

**Existing Documentation**

- Check for an existing `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, `docs/` directory.
- If a CLAUDE.md already exists and the user chose "enhance", read it and identify what is already covered.
- Extract relevant conventions from `CONTRIBUTING.md` if present.

### Step 4: Check for User-Level CLAUDE.md

- Read `~/.claude/CLAUDE.md` if it exists.
- Identify what is already covered at the user level (workflow preferences, security rules, general principles).
- The project CLAUDE.md must NOT duplicate user-level rules. Only add project-specific conventions.

### Step 5: Generate the CLAUDE.md

Write a project-level CLAUDE.md that includes only what is specific to this project. Target 30-100 lines. If the generated content exceeds 100 lines, review it for content that would work better as a skill. Multi-step processes, detailed patterns, or complex checklists should be extracted into `.claude/skills/` and referenced from the CLAUDE.md with a one-liner like "Run `/skill-name` for [task]." Present these as suggestions to the user: which sections to keep inline and which to extract into skills.

### Step 6: Present to the User

After writing the file, provide:

1. A summary of what was found and what was included.
2. The reasoning behind each section, including what evidence supports it.
3. Ask if the user wants to walk through it together and adjust anything before finalizing.

## Output Format

<output_format>

<section name="claude-md-file">
Write the CLAUDE.md to the chosen output path. Structure it as:

```markdown
# [Project Name]

[One-line description of what this project is.]

## Tech Stack

[Language, framework, key libraries, package manager, test runner as a short list.]

## Project Structure

[Brief description of the directory layout and where things go. Only include if there is a clear pattern worth documenting.]

## Conventions

[Specific, actionable rules derived from the codebase analysis. Each rule should be something Claude can follow without ambiguity.]

## Commands

[Common commands for building, testing, linting. Only include commands that exist in the project.]

## Patterns

[Recurring patterns specific to this project: how to add a new endpoint, how tests are structured, how components are organized. Only include patterns that are genuinely consistent across the codebase.]
```

</section>

<section name="summary-report">
After writing the file, present:

- What analysis was performed and key findings
- Which sections were included and why (with evidence)
- What was intentionally omitted (already in user-level CLAUDE.md, enforced by linter, etc.)
- Suggestions for extracting verbose sections into skills if the file exceeds 100 lines
</section>

</output_format>

## Best Practices

- Be specific, not generic. "Use TypeScript strict mode" is useless if `tsconfig.json` already enforces it. "New API routes go in `src/routes/` with a co-located `*.test.ts` file" is useful.
- Do not duplicate linter rules. If ESLint or Prettier handles it, reference the linter instead of restating its config.
- Do not duplicate user-level rules. If `~/.claude/CLAUDE.md` already covers it, do not repeat it in the project CLAUDE.md.
- Aim for 30-100 lines. Beyond 200 lines content gets truncated. Extract verbose sections into skills.
- Evidence over assumption. Every rule should be traceable to something found in the codebase. If guessing, leave it out.
- Commands must be real. Only include commands that actually exist in `package.json` scripts, `Makefile`, or equivalent. Verify before including.
- If a CLAUDE.md already exists and the user chose to enhance, preserve existing content and add missing sections rather than replacing it. Flag contradictions.
- Use Bash only for read-only commands. Do not modify the repository except writing the CLAUDE.md output.

## Anti-Patterns

- Generating generic, boilerplate CLAUDE.md files that could apply to any project
- Restating rules already enforced by linters, formatters, or CI pipelines
- Duplicating conventions from the user-level `~/.claude/CLAUDE.md`
- Including commands that do not actually exist in the project
- Writing CLAUDE.md files longer than 200 lines without extracting verbose content into skills
- Replacing an existing CLAUDE.md without asking the user first
- Making assumptions about project conventions without reading actual source files
- Including framework-generic advice instead of project-specific observations

## Examples

### Example 1: Node.js/TypeScript Project

**Input**: "Generate a CLAUDE.md for this project"

**Output**: CLAUDE.md with detected tech stack (TypeScript, NestJS, Jest, pnpm), project structure (module-per-feature), conventions (conventional commits, co-located tests, barrel exports), commands from `package.json` scripts, and patterns for adding new modules.

### Example 2: Enhancing an Existing CLAUDE.md

**Input**: "Improve my existing CLAUDE.md"

**Output**: Enhanced CLAUDE.md that preserves the existing content, fills in missing sections (e.g., adds a Commands section that was absent), updates outdated commands, and flags any contradictions between documented rules and actual codebase conventions.

### Example 3: Python Project with User-Level CLAUDE.md

**Input**: "Set up CLAUDE.md for my Django project"

**Output**: CLAUDE.md that omits workflow preferences already in `~/.claude/CLAUDE.md`, focuses on Django-specific conventions (URL patterns, model structure, test organization), includes only project-level commands (`python manage.py test`, `ruff check`), and stays under 60 lines.

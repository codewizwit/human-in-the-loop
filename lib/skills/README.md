# Skills

Framework-specific expertise modules that provide AI agents with deep technical knowledge for particular programming languages, frameworks, and patterns.

## What Are Skills?

Skills are comprehensive knowledge bases that teach AI models the best practices, patterns, and anti-patterns for specific frameworks or technologies. Each skill follows a unified format and includes:

- **Framework-specific best practices** - Patterns recommended by the framework maintainers
- **Modern vs. legacy approaches** - Clear guidance on what's current vs. deprecated
- **Code examples** - Real-world patterns with TypeScript/TypeDoc comments
- **Testing strategies** - How to test effectively within the framework
- **Common anti-patterns** - What to avoid and why
- **Interactive flows** - Step-by-step methodology with user prompts for gathering context

## How Skills Differ from Context Packs

| Aspect          | Skills                                   | Context Packs                       |
| --------------- | ---------------------------------------- | ----------------------------------- |
| **Purpose**     | AI model instruction & knowledge         | Additional reference material       |
| **Format**      | Unified `skill.md` with YAML frontmatter | Documentation & guides              |
| **Integration** | Automatic activation via Claude Code     | Manual loading when needed          |
| **Content**     | Do's/don'ts, patterns, interactive flows | In-depth guides, API docs, examples |
| **Use Case**    | Real-time coding assistance              | Research & learning                 |

## File Structure

Each skill directory contains three files:

```
skills/
├── angular-modern/              # Angular 16+ with signals, standalone
│   ├── skill.md                 # Primary skill definition (YAML frontmatter + body)
│   ├── metadata.json            # Registry metadata for CLI and search
│   └── README.md                # Usage documentation for humans
├── angular-legacy/              # Pre-Angular 16 (old format, pending migration)
│   ├── claude-skill.md
│   ├── copilot-instructions.md
│   ├── metadata.json
│   └── README.md
├── nestjs-backend/
│   ├── skill.md
│   ├── metadata.json
│   └── README.md
├── nx-monorepo/                 # Old format, pending migration
│   ├── claude-skill.md
│   ├── copilot-instructions.md
│   └── README.md
├── code-review-ts/
│   ├── skill.md
│   ├── metadata.json
│   └── README.md
├── e2e-strategy/
│   ├── skill.md
│   ├── metadata.json
│   └── README.md
├── responsible-ai-audit/
│   ├── skill.md
│   ├── metadata.json
│   └── README.md
├── unit-test-generator/
│   ├── skill.md
│   ├── metadata.json
│   └── README.md
├── codebase-explainer/
│   ├── skill.md
│   ├── metadata.json
│   └── README.md
├── api-design/
│   ├── skill.md
│   ├── metadata.json
│   └── README.md
├── pipeline-optimization/
│   ├── skill.md
│   ├── metadata.json
│   └── README.md
└── user-story-breakdown/
    ├── skill.md
    ├── metadata.json
    └── README.md
```

### skill.md

The primary skill definition file. Contains YAML frontmatter and a structured markdown body.

**YAML Frontmatter** (required fields):

```yaml
---
name: code-review-ts
description: >-
  Automated TypeScript code review for your workspace. Use when user asks to
  "review my TypeScript code", "check code quality", or mentions "code review".
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

| Field           | Type     | Required | Format                                 |
| --------------- | -------- | -------- | -------------------------------------- |
| `name`          | string   | Yes      | kebab-case (e.g., `code-review-ts`)    |
| `description`   | string   | Yes      | Must include trigger phrases in quotes |
| `version`       | string   | Yes      | Semantic versioning (e.g., `3.0.0`)    |
| `allowed-tools` | string[] | Yes      | Minimum 1 tool from the available set  |

**Required body sections** (in order):

1. When to Activate
2. Interactive Flow (with `AskUserQuestion` / `EnterPlanMode`)
3. Output Format
4. Best Practices
5. Anti-Patterns
6. Examples

See the canonical template at [`docs/skill-template.md`](../../docs/skill-template.md).

### metadata.json

Structured metadata for CLI operations and search. Required fields:

```json
{
  "id": "code-review-ts",
  "name": "TypeScript Code Review",
  "version": "3.0.0",
  "type": "skill",
  "description": "Automated TypeScript code review for your workspace.",
  "category": "code-review",
  "tags": ["typescript", "code-review", "best-practices", "type-safety"],
  "platforms": ["claude-code"],
  "metadata": {
    "author": "Human-in-the-Loop",
    "license": "MIT"
  }
}
```

### README.md

Human-readable documentation for the skill, including overview, installation instructions, key patterns, and usage examples.

## Installation

Install a skill using the bare skill ID:

```bash
hit install code-review-ts
```

### Install Destinations

| Destination       | Path                  | Description                           |
| ----------------- | --------------------- | ------------------------------------- |
| `global-skill`    | `~/.claude/skills/`   | Available across all projects         |
| `project-skill`   | `.claude/skills/`     | Scoped to the current project         |
| `global-command`  | `~/.claude/commands/` | Available as a global slash command   |
| `project-command` | `.claude/commands/`   | Available as a project-scoped command |
| `custom`          | User-specified path   | Install to any directory              |

```bash
hit install code-review-ts --dest global-skill
hit install code-review-ts --dest project-skill
hit install code-review-ts --dest global-command
hit install code-review-ts --dest project-command
hit install code-review-ts --dest custom --path ./my-skills/
```

## Available Skills

### angular-modern

**Version**: 1.0.0 | **Category**: framework

Modern Angular 16+ development with signals, computed values, effects, and standalone components. Covers signal-based inputs/outputs, Resource API, control flow syntax, and component testing patterns.

```bash
hit install angular-modern
```

### angular-legacy

**Version**: 1.0.0 | **Category**: framework | **Status**: Old format (pending migration)

Pre-Angular 16 development with NgModules, lifecycle hooks, decorators, and RxJS observables.

```bash
hit install angular-legacy
```

### nestjs-backend

**Version**: 3.0.0 | **Category**: framework

NestJS backend development patterns including modules, controllers, services, guards, pipes, and interceptors.

```bash
hit install nestjs-backend
```

### nx-monorepo

**Category**: tool | **Status**: Old format (pending migration)

Nx monorepo best practices for workspace configuration, library boundaries, and build optimization.

```bash
hit install nx-monorepo
```

### code-review-ts

**Version**: 3.0.0 | **Category**: code-review

Automated TypeScript code review analyzing type safety, code quality, best practices, performance, and security. Produces structured reports with severity-rated findings.

```bash
hit install code-review-ts
```

### e2e-strategy

**Version**: 3.0.0 | **Category**: testing

End-to-end test strategy generation for web applications. Produces test plans, scenario definitions, and framework-specific implementation guidance.

```bash
hit install e2e-strategy
```

### responsible-ai-audit

**Version**: 3.0.0 | **Category**: governance

Responsible AI audit for prompts, agent configurations, and AI-integrated codebases. Evaluates bias, safety, transparency, and compliance.

```bash
hit install responsible-ai-audit
```

### unit-test-generator

**Version**: 3.0.0 | **Category**: testing

Generates comprehensive unit test suites for TypeScript codebases with proper mocking, assertion patterns, and coverage targets.

```bash
hit install unit-test-generator
```

### codebase-explainer

**Version**: 3.0.0 | **Category**: documentation

Analyzes and explains codebase architecture, module relationships, and key patterns. Produces structured walkthroughs for onboarding or documentation.

```bash
hit install codebase-explainer
```

### api-design

**Version**: 3.0.0 | **Category**: design

REST API design review and generation. Covers endpoint conventions, request/response schemas, error handling, and OpenAPI spec alignment.

```bash
hit install api-design
```

### pipeline-optimization

**Version**: 3.0.0 | **Category**: devops

CI/CD pipeline analysis and optimization for GitHub Actions, Azure DevOps, and similar platforms. Identifies bottlenecks and recommends improvements.

```bash
hit install pipeline-optimization
```

### user-story-breakdown

**Version**: 3.0.0 | **Category**: planning

Breaks down epics and features into well-structured user stories with acceptance criteria, story points, and dependency mapping.

```bash
hit install user-story-breakdown
```

## How to Create a New Skill

### Step 1: Plan the Skill

Identify the framework or methodology, target audience, version range, 5-10 essential patterns, and common anti-patterns.

### Step 2: Create Directory Structure

```bash
mkdir -p lib/skills/my-skill
```

Create three files: `skill.md`, `metadata.json`, and `README.md`.

### Step 3: Write skill.md

Follow the unified format defined in [`docs/skill-template.md`](../../docs/skill-template.md). The file must include YAML frontmatter with `name`, `description` (with trigger phrases in quotes), `version`, and `allowed-tools`, followed by all required body sections.

```yaml
---
name: my-skill
description: >-
  Expert guidance for My Framework. Use when user asks to
  "build with My Framework", "scaffold a project", or mentions "My Framework".
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

Required body sections:

1. **When to Activate** - Trigger conditions
2. **Interactive Flow** - Step-by-step methodology using `AskUserQuestion` and `EnterPlanMode`
3. **Output Format** - Structure of the skill's output
4. **Best Practices** - Guidelines for effective use
5. **Anti-Patterns** - What to avoid
6. **Examples** - Input/output scenarios

### Step 4: Write metadata.json

```json
{
  "id": "my-skill",
  "name": "My Skill",
  "version": "3.0.0",
  "type": "skill",
  "description": "Expert guidance for My Framework.",
  "category": "framework",
  "tags": ["framework", "typescript"],
  "platforms": ["claude-code"],
  "metadata": {
    "author": "Human-in-the-Loop",
    "license": "MIT"
  }
}
```

### Step 5: Write README.md

Include an overview, installation instructions, key patterns with code examples, when to use, and prerequisites.

### Step 6: Validate

Validation is handled by `src/governance/checks/validate-skills.ts` and the Zod schema at `src/cli/src/utils/skill-schema.ts`. Run validation before submitting:

```bash
pnpm validate:skills
```

### Step 7: Submit Pull Request

Include:

- New skill directory with all 3 files (`skill.md`, `metadata.json`, `README.md`)
- Update to this README with the new skill entry
- Description of when to use the skill

## Skill Discovery

```bash
hit search "angular"
hit search "code-review"
hit list skills
hit show code-review-ts
```

## Validation

Skills are validated in CI by two checks:

- **`src/governance/checks/validate-skills.ts`** - Validates skill directory structure and required files
- **`src/cli/src/utils/skill-schema.ts`** - Zod schema enforcing frontmatter field types and required body sections

Validation rules:

1. `name` must be kebab-case
2. `description` must include at least one quoted trigger phrase
3. `version` must follow semantic versioning
4. `allowed-tools` must contain at least one valid tool name
5. All six required body sections must be present

## Contributing

1. Follow the structure and guidelines in this README
2. Include all three required files per skill
3. Validate with `pnpm validate:skills`
4. Submit a pull request with a detailed description

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

## Support

- Open an issue: [GitHub Issues](https://github.com/codewizwit/human-in-the-loop/issues)
- Visit docs: [Human-in-the-Loop Documentation](https://github.com/codewizwit/human-in-the-loop)

---

**Human-in-the-Loop by codewizwit**
Framework expertise for better AI coding assistance

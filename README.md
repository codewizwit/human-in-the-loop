# Human in the Loop

[![npm version](https://img.shields.io/npm/v/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **[View the AI Summit NY Presentation](https://codewizwit.github.io/human-in-the-loop/)** - Responsible AI Engineering in Practice

**AI-assisted development with humans in control.**

A curated skill library for Claude Code. Every skill enhances your judgment — not replaces it. Built on responsible AI principles: transparency, accountability, and human oversight.

---

## Quick Start

```bash
npm install -g @human-in-the-loop/cli

hit install code-review-ts          # Install a skill
hit install                          # Browse all skills interactively
hit search "testing"                 # Search by keyword
```

---

## 27 Unified Skills

All skills use a standardized `skill.md` format with YAML frontmatter. Install any skill with `hit install <id>`.

### Code Quality & Architecture

| ID                     | Description                                   |
| ---------------------- | --------------------------------------------- |
| `code-review-ts`       | TypeScript review with constructive feedback  |
| `security-review`      | OWASP Top 10, auth flaws, injection detection |
| `api-design`           | REST/GraphQL best practices                   |
| `system-design-review` | Architecture and scalability analysis         |

### Testing

| ID                       | Description                                |
| ------------------------ | ------------------------------------------ |
| `unit-test-generator`    | Generate Jest/Vitest tests with edge cases |
| `e2e-strategy`           | Playwright/Cypress test planning           |
| `bdd-scenarios`          | Gherkin scenarios from user stories        |
| `test-coverage-analysis` | Coverage gap analysis and risk assessment  |

### CI/CD & Deployment

| ID                        | Description                                |
| ------------------------- | ------------------------------------------ |
| `pipeline-optimization`   | GitHub Actions cost and speed optimization |
| `aws-deployment-strategy` | Lambda, ECS, CDK infrastructure patterns   |

### Documentation

| ID                   | Description                                  |
| -------------------- | -------------------------------------------- |
| `api-documentation`  | Generate API docs from code                  |
| `codebase-explainer` | Analyze and document repository architecture |

### Planning & Culture

| ID                     | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `user-story-breakdown` | Epic to INVEST stories with acceptance criteria |
| `1-on-1-prep`          | Structured pre-reads for better meetings        |
| `code-review-empathy`  | Transform harsh feedback into helpful coaching  |
| `team-retrospective`   | Facilitate effective team retros                |
| `learning-path`        | Personalized learning roadmaps                  |

### Governance

| ID                     | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `responsible-ai-audit` | Audit AI outputs for accuracy, fairness, transparency |
| `bias-detection`       | Identify bias in AI-generated content                 |

### Framework Skills

| ID               | Description                                     |
| ---------------- | ----------------------------------------------- |
| `angular-modern` | Signals, standalone, control flow (Angular 16+) |
| `angular-legacy` | NgModules, RxJS, lifecycle hooks (pre-16)       |
| `nestjs-backend` | NestJS patterns and best practices              |
| `nx-monorepo`    | Nx workspace management and configuration       |

### Meta

| ID                     | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `prompt-optimization`  | Analyze and improve existing prompts                                          |
| `context-pack-builder` | Generate framework context packs                                              |
| `skill-scout`          | Analyze a codebase for repetitive patterns and generate skill recommendations |
| `skill-builder`        | Build custom Claude Code skills following the official specification          |

---

## How It Works

```bash
hit install <skill-id>
```

1. **Copies `skill.md`** to your chosen destination:
   - `global-skill` — `~/.claude/skills/` (all projects)
   - `project-skill` — `.claude/skills/` (current project)
   - `global-command` — `~/.claude/commands/` (slash command, all projects)
   - `project-command` — `.claude/commands/` (slash command, current project)
   - `custom` — any path
2. **Registers** in `~/.hit/registry.json` for version tracking

Use `--destination` flag for scripting: `hit install code-review-ts --destination global-skill`

---

## CLI Commands

```bash
hit search [query]              # Find skills by keyword
hit install [skill-id]          # Install a skill (interactive browser if no id)
hit list                        # Show installed skills
hit update                      # Update CLI to latest version
hit doctor                      # Validate setup
hit contribute <type> <path>    # Submit new skills
hit stats                       # Installation info
```

---

## Repository Structure

```
human-in-the-loop/
├── lib/
│   ├── skills/                    # 27 unified skills (skill.md format)
│   │   ├── 1-on-1-prep/
│   │   ├── angular-legacy/
│   │   ├── angular-modern/
│   │   ├── api-design/
│   │   ├── api-documentation/
│   │   ├── aws-deployment-strategy/
│   │   ├── bdd-scenarios/
│   │   ├── bias-detection/
│   │   ├── code-review-empathy/
│   │   ├── code-review-ts/
│   │   ├── codebase-explainer/
│   │   ├── context-pack-builder/
│   │   ├── e2e-strategy/
│   │   ├── learning-path/
│   │   ├── nestjs-backend/
│   │   ├── nx-monorepo/
│   │   ├── pipeline-optimization/
│   │   ├── prompt-optimization/
│   │   ├── responsible-ai-audit/
│   │   ├── security-review/
│   │   ├── skill-builder/
│   │   ├── skill-scout/
│   │   ├── system-design-review/
│   │   ├── team-retrospective/
│   │   ├── test-coverage-analysis/
│   │   ├── unit-test-generator/
│   │   └── user-story-breakdown/
│   └── prompts/                   # Legacy XML prompts (deprecated)
├── src/
│   ├── cli/                       # CLI source (Commander.js)
│   └── governance/checks/         # Validation scripts
├── docs/                          # Documentation
├── scripts/                       # Build and release scripts
└── planning/                      # Roadmap and scaffolding
```

---

## Tech Stack

**Nx monorepo** · **TypeScript** (strict) · **pnpm** · **Commander.js** · **Jest**

---

## Documentation

- [Getting Started](./docs/getting-started.md)
- [CLI Reference](./docs/cli-reference.md)
- [Architecture](./docs/architecture.md)
- [Skill Template](./docs/skill-template.md)
- [Contributing](./CONTRIBUTING.md)
- [Responsible AI Playbook](./RESPONSIBLE-AI-PLAYBOOK.md)

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT - see [LICENSE](./LICENSE)

---

**Human-in-the-Loop** by [codewizwit](https://github.com/codewizwit) · _Build with care. Ship with purpose._

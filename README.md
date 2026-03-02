# 🪄 Human in the Loop

[![npm version](https://img.shields.io/npm/v/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![npm downloads](https://img.shields.io/npm/dm/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🎤 **[View the AI Summit NY Presentation](https://codewizwit.github.io/human-in-the-loop/)** - Responsible AI Engineering in Practice

**AI-assisted development with humans in control.**

A curated prompt library that keeps developers in the loop. Every prompt is designed to enhance your judgment—not replace it. Built on responsible AI principles: transparency, accountability, and human oversight at every step.

- **You stay in control** - Prompts guide AI analysis, you make the decisions
- **Transparent outputs** - Clear reasoning, no black-box recommendations
- **Quality gates built-in** - Security reviews, quality checks
- **Learn as you go** - Prompts explain the "why," not just the "what"

---

## ⚡ Quick Start

```bash
# Install globally
npm install -g @human-in-the-loop/cli

# Or use npx (no install needed)
npx @human-in-the-loop/cli search "security review"
```

### 🚀 Try it now

```bash
# Find what you need
hit search "code review"

# Install a skill (copies to Claude Code skills directory)
hit install security-review

# Use in Claude Code
/security-review
```

---

## 🧰 What's Inside

### 📚 21 Prompts

**Code Quality & Architecture**

- 🔍 `code-review-ts` - TypeScript review with constructive feedback
- 🔒 `security-review` - OWASP Top 10, auth flaws, injection detection
- 🏗️ `api-design` - REST/GraphQL best practices
- 🎯 `system-design-review` - Architecture & scalability analysis

**Testing**

- 🧪 `unit-test-generator` - Generate Jest/Vitest tests with edge cases
- 🎬 `e2e-strategy` - Playwright/Cypress test planning
- 🥒 `bdd-scenarios` - Gherkin scenarios from user stories
- 📊 `test-coverage-analysis` - Coverage gap analysis and risk assessment

**CI/CD & Deployment**

- ⚡ `pipeline-optimization` - GitHub Actions cost & speed optimization
- ☁️ `aws-deployment-strategy` - Lambda, ECS, CDK infrastructure patterns

**Documentation**

- 📖 `api-documentation` - Generate API docs from code
- 🗺️ `codebase-explainer` - Analyze and document repository architecture

**Planning & Culture**

- 📋 `user-story-breakdown` - Epic → INVEST stories with acceptance criteria
- 💬 `1-on-1-prep` - Structured pre-reads for better meetings
- 💙 `code-review-empathy` - Transform harsh feedback into helpful coaching
- 🔄 `team-retrospective` - Facilitate effective team retros
- 🎓 `learning-path` - Personalized learning roadmaps

**Governance**

- 🛡️ `responsible-ai-audit` - Audit AI outputs for accuracy, fairness, transparency
- ⚖️ `bias-detection` - Identify bias in AI-generated content

**Meta**

- ✨ `prompt-optimization` - Analyze and improve existing prompts
- 📦 `context-pack-builder` - Generate framework context packs

### 🎓 Skills (10+ Unified Skills)

Skills are persistent context files that give Claude deep expertise across frameworks, workflows, and best practices. Install them with `hit install` and they are copied directly to your `.claude/skills/` directory.

- 🔍 **Code Review TS** - TypeScript review with constructive feedback
- 🔒 **Security Review** - OWASP Top 10, auth flaws, injection detection
- 🏗️ **API Design** - REST/GraphQL best practices
- 🧪 **Unit Test Generator** - Generate Jest/Vitest tests with edge cases
- 🎬 **E2E Strategy** - Playwright/Cypress test planning
- ⚡ **Pipeline Optimization** - GitHub Actions cost & speed optimization
- 🗺️ **Codebase Explainer** - Analyze and document repository architecture
- 🛡️ **Responsible AI Audit** - Audit AI outputs for accuracy, fairness, transparency
- 📋 **User Story Breakdown** - Epic to INVEST stories with acceptance criteria
- ⚡ **Angular Modern** - Signals, standalone, control flow (16+)
- 🏛️ **Angular Legacy** - NgModules, RxJS, lifecycle hooks (pre-16)
- 🏗️ **NestJS Backend** - NestJS patterns and best practices
- 📦 **Nx Monorepo** - Nx workspace management and configuration

### 🔜 Coming Soon

- 🤖 **Agent Registry** - Reusable autonomous agents
- 🎯 **Context Packs** - Domain knowledge bundles
- ✅ **Evaluators** - Output quality validation
- 🛡️ **Guardrails** - Safety & compliance enforcement

---

## 💡 How It Works

### What `hit install` does

1. **Copies the skill file** (`skill.md`) to one of 5 destination types:
   - `global-skill` - `~/.claude/skills/` (available in all projects)
   - `project-skill` - `.claude/skills/` (scoped to current project)
   - `global-command` - `~/.claude/commands/` (slash command, all projects)
   - `project-command` - `.claude/commands/` (slash command, current project)
   - `custom` - any path you specify
2. **Registers it** in `~/.hit/registry.json` for version tracking

Now Claude Code can access the skill automatically in your sessions.

---

## 🎨 CLI Commands

```bash
hit search [query]              # Find tools
hit install [skill-id]          # Install a skill (interactive browser if no id)
hit list                        # Show installed tools
hit update                      # Update CLI to latest version
hit doctor                      # Validate setup
hit contribute <type> <path>    # Submit new tools
hit stats                       # Installation info
```

**Pro tip:** Use `--destination` to choose where the skill is installed (e.g., `--destination project-skill`).

---

## 🛡️ Keeping Humans in the Loop

Every prompt is designed to **augment your expertise, not replace it**. Here are a few examples:

### 🗺️ Understand an Unfamiliar Codebase

```bash
hit install codebase-explainer

# Get architecture diagrams, directory breakdowns,
# and a getting-started guide—you decide what to explore next
```

### 💙 Give Better Code Review Feedback

```bash
hit install code-review-empathy

# Transform "This is wrong" into "Consider this approach because..."
# Keep the technical substance, improve the delivery
```

### 🛡️ Audit AI-Generated Code

```bash
hit install responsible-ai-audit

# Before shipping AI output: check accuracy, bias, security, transparency
# You validate, you decide, you ship
```

See our [Responsible AI Playbook](./RESPONSIBLE-AI-PLAYBOOK.md) for the full framework.

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding prompts, reporting issues, and submitting PRs.

---

## 📚 Documentation

- 🚀 [Getting Started](./docs/getting-started.md) - Installation & first prompt
- 🛡️ [Responsible AI Playbook](./RESPONSIBLE-AI-PLAYBOOK.md) - Developer-first AI principles
- 🎨 [CLI Reference](./docs/cli-reference.md) - Complete command guide
- 🏗️ [Architecture](./docs/architecture.md) - System design overview
- 🤝 [Contributing](./CONTRIBUTING.md) - Detailed contribution workflow

---

## 🏗️ Tech Stack

- **Build**: Nx monorepo
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **CLI**: Commander.js
- **Testing**: Jest

---

## 📦 Repository Structure

<!-- docs:start TREE -->

```
human-in-the-loop
├── docs
│   ├── assets
│   │   ├── HITL-DEMO.gif
│   │   ├── codewizwit-logo.jpg
│   │   └── hitl-summit-demo.gif
│   ├── README.md
│   ├── ai-best-practices.md
│   ├── architecture.md
│   ├── cli-reference.md
│   ├── contributing-guidelines.md
│   ├── getting-started.md
│   ├── governance-model.md
│   ├── index.html
│   ├── publishing.md
│   ├── skill-template.md
│   ├── toolkit-usage.md
│   └── xml-template-migration.md
├── lib
│   ├── agents
│   │   └── README.md
│   ├── context-packs
│   │   ├── ci-cd
│   │   └── README.md
│   ├── evaluators
│   │   └── README.md
│   ├── guardrails
│   │   ├── pii-filtering
│   │   └── README.md
│   ├── prompts
│   │   ├── architecture
│   │   ├── ci-cd
│   │   ├── code-review-ts
│   │   ├── culture
│   │   ├── documentation
│   │   ├── governance
│   │   ├── mentorship
│   │   ├── meta
│   │   ├── planning
│   │   ├── refactoring
│   │   ├── testing
│   │   └── README.md
│   ├── skills
│   │   ├── angular-legacy
│   │   ├── angular-modern
│   │   ├── api-design
│   │   ├── code-review-ts
│   │   ├── codebase-explainer
│   │   ├── e2e-strategy
│   │   ├── nestjs-backend
│   │   ├── nx-monorepo
│   │   ├── pipeline-optimization
│   │   ├── responsible-ai-audit
│   │   ├── unit-test-generator
│   │   ├── user-story-breakdown
│   │   └── README.md
│   └── README.md
├── planning
│   ├── README.md
│   ├── roadmap.md
│   ├── scaffold-high-priority.sh
│   └── scaffold-remaining.sh
├── scripts
│   ├── build
│   │   └── add-shebang.sh
│   ├── publish
│   │   └── prepare-release.sh
│   ├── release
│   │   └── README.md
│   ├── setup
│   │   ├── create-labels.sh
│   │   └── import-issues.sh
│   ├── migrate-to-markdown.js
│   └── test-cli-regression.sh
├── src
│   ├── cli
│   │   ├── __mocks__
│   │   ├── src
│   │   ├── README.md
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── project.json
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.spec.json
│   ├── governance
│   │   ├── checks
│   │   └── README.md
│   └── README.md
├── CHANGELOG.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── LICENSE
├── PLANNING.md
├── README.md
├── RESPONSIBLE-AI-PLAYBOOK.md
├── jest.preset.js
├── markdown.config.js
├── nx.json
├── package.json
├── pnpm-lock.yaml
└── tsconfig.base.json
```

<!-- docs:end -->

---

## 🎉 What's New

**v4.0.0** - Unified Skill Refactor

- 🎓 10+ unified skills with standardized `skill.md` format
- 🎯 5 destination types: global-skill, project-skill, global-command, project-command, custom
- 🔍 Interactive skill browser when running `hit install` with no arguments
- 📦 Bare skill-id syntax: `hit install security-review`

**v3.0.0** - Pure XML Prompts & Claude Code Integration

- 🔌 Automatic slash command creation on install
- 🤖 Tool-based workspace analysis (Read/Grep/Glob)
- ✨ Pure XML prompt format for better structure

See [CHANGELOG.md](./CHANGELOG.md) for full history.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 💙 Built with Care

**Human-in-the-Loop** by [codewizwit](https://github.com/codewizwit)

_Build with care. Ship with purpose._

🐛 Found a bug? [Open an issue](https://github.com/codewizwit/human-in-the-loop/issues)
💡 Have an idea? [Open an issue](https://github.com/codewizwit/human-in-the-loop/issues)
⭐ Like what you see? Star the repo!

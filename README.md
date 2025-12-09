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

# Install a prompt (creates slash command automatically)
hit install prompt/security-review

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

### 🎓 Skills

Skills are persistent context files (not slash commands) that give Claude framework expertise. Copy them to your `.claude/` directory.

- ⚡ **Angular Modern** - Signals, standalone, control flow (16+)
- 🏛️ **Angular Legacy** - NgModules, RxJS, lifecycle hooks (pre-16)

### 🔜 Coming Soon

- 🤖 **Agent Registry** - Reusable autonomous agents
- 🎯 **Context Packs** - Domain knowledge bundles
- ✅ **Evaluators** - Output quality validation
- 🛡️ **Guardrails** - Safety & compliance enforcement

---

## 💡 How It Works

### What `hit install` does

1. **Copies files** to `~/.claude/tools/` (prompt.md + README)
2. **Creates a slash command** at `~/.claude/commands/{id}.md`
3. **Registers it** in `~/.hit/registry.json` for version tracking

Now you can use `/security-review` directly in Claude Code.

---

## 🎨 CLI Commands

```bash
hit search [query]              # Find tools
hit install <tool>              # Install + create slash command
hit list                        # Show installed tools
hit update                      # Update CLI to latest version
hit doctor                      # Validate setup
hit contribute <type> <path>    # Submit new tools
hit stats                       # Installation info
```

**Pro tip:** Use `--no-claude-command` to skip slash command creation if you want manual setup.

---

## 🛡️ Keeping Humans in the Loop

Every prompt is designed to **augment your expertise, not replace it**. Here are a few examples:

### 🗺️ Understand an Unfamiliar Codebase

```bash
hit install prompt/codebase-explainer
/codebase-explainer

# Get architecture diagrams, directory breakdowns,
# and a getting-started guide—you decide what to explore next
```

### 💙 Give Better Code Review Feedback

```bash
hit install prompt/code-review-empathy
/code-review-empathy

# Transform "This is wrong" into "Consider this approach because..."
# Keep the technical substance, improve the delivery
```

### 🛡️ Audit AI-Generated Code

```bash
hit install prompt/responsible-ai-audit
/responsible-ai-audit

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
│   │   ├── nestjs-backend
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

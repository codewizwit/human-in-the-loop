# 🌭 Human in the Loop

[![npm version](https://img.shields.io/npm/v/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![npm downloads](https://img.shields.io/npm/dm/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Open sourced repository with governance layer and CLI for responsible AI tools**

A developer-friendly toolkit for exploring governance of AI prompts, agents, context packs, and evaluators with standardization, quality control, and visibility.

---

## Why This Exists

AI productivity tools are transforming how we build software, but without centralized governance, we risk inconsistency, duplication, and quality drift. Human in the Loop solves this by creating a single source of truth for all AI tooling.

**The problem:**

- Prompts and agents scattered across repos, Slack threads, and local files
- No standardization means teams reinvent the wheel with different patterns
- Zero visibility into what works, what's adopted, or what needs improvement
- Quality concerns with no review process for AI tools

**The solution:**

- Single repository where all AI productivity tools are discoverable, versioned, and governed
- Standardized contribution workflow that ensures quality and consistency
- Clear metrics on tool adoption and effectiveness
- Developer-friendly CLI that makes it easy to find, install, and use AI tools

---

## Developer-First AI

AI tools should **enhance** developers, not replace them. Every tool in this repository is evaluated through our [Developer-First AI Accountability Framework](./ACCOUNTABILITY.md) to ensure we're building technology that makes everyone better off - developers, teams, and organizations.

### Core Principles

We believe AI productivity tools should:

- **✨ Enhance** developer happiness and creativity, not replace judgment
- **📚 Support** learning and growth, not create dependency
- **🤝 Strengthen** collaboration and trust, not erode human connection
- **🔍 Maintain** transparency and control, not obscure decision-making

Every prompt, agent, and workflow is designed with these principles in mind. When you use tools from this library, you're not just getting automation - you're getting carefully considered solutions that preserve what makes software development fulfilling while removing tedious friction.

**Read the full framework:** [ACCOUNTABILITY.md](./ACCOUNTABILITY.md)

---

## Quick Start

Install the CLI:

```bash
npm install -g @human-in-the-loop/cli
```

Or use npx:

```bash
npx hit --version
```

Search for tools:

```bash
hit search "code review"
```

Output:

```
🔍 Searching for: "code review"

Found 2 tools:

1. prompt/code-review-ts
   TypeScript code review with best practices
   Version: 1.2.0
   Tags: typescript, code-review

2. prompt/code-review-security
   Security-focused code review
   Version: 2.0.0
   Tags: security, code-review

💡 Tip: Use hit install <type>/<id> to install a tool
```

Install a prompt:

```bash
hit install prompt/code-review-ts
```

The CLI prompts for installation location (or use `--path` for non-interactive):

```
📦 Installing prompt/code-review-ts...

  → Looking up tool...
  → Copying tool files...
  → Registering installation...

✓ Successfully installed Code Review TypeScript (v1.2.0)
  → Installed to: ~/.claude/tools/prompt/code-review-ts
```

---

## What's Inside

### 📚 Prompt Library (`/lib/prompts`)

Production-ready prompts organized by use case, versioned and quality-assured. Each prompt includes metadata, usage examples, and expected outputs.

### 🤖 Agent Registry (`/lib/agents`)

Catalog of AI agents with their configurations, capabilities, and integration guides. _(Coming soon - framework in place)_

### 🎯 Context Packs (`/lib/context-packs`)

Framework-specific knowledge bases that provide agents with deep technical context:

- **Angular**: Component patterns, routing, state management, testing ✅
- **NestJS**: Module structure, dependency injection, middleware _(coming soon)_
- **CI/CD**: Pipeline patterns, deployment strategies _(coming soon)_

### ✅ Evaluators (`/lib/evaluators`)

Quality assurance tools that validate AI outputs against defined criteria. _(Coming soon - framework in place)_

### 🛡️ Guardrails (`/lib/guardrails`)

Safety mechanisms that enforce responsible AI usage. _(Coming soon - framework in place)_

### ⚡ CLI Tool (`/src/cli`)

Developer-friendly command-line interface for discovering, installing, and managing AI tools.

### 🛡️ Governance (`/src/governance`)

Contribution validation and quality assurance tooling that ensures all contributions meet project standards.

### 🤝 Accountability Framework (`/ACCOUNTABILITY.md`)

Developer-first principles and practices that guide how we build, evaluate, and deploy AI tools responsibly - ensuring they enhance developers instead of replacing them.

---

## Repository Structure

```
human-in-the-loop/
├── src/
│   ├── cli/                     # TypeScript CLI tool
│   └── governance/              # Quality validation and checks
│       └── checks/              # Validation scripts
├── lib/
│   ├── prompts/                 # Shared prompt library
│   ├── agents/                  # Agent definitions and configs
│   ├── evaluators/              # Quality evaluation tools
│   ├── guardrails/              # Safety and governance rules
│   └── context-packs/           # Framework-specific context
│       ├── angular/             # Angular-specific context
│       ├── nestjs/              # NestJS-specific context (coming soon)
│       └── ci-cd/               # CI/CD patterns (coming soon)
├── scripts/
│   ├── build/                   # Build-time automation
│   └── setup/                   # One-time setup scripts
├── planning/                    # Project planning and roadmap
└── docs/
    ├── getting-started.md       # Installation and first steps
    ├── ai-best-practices.md     # Responsible AI usage guidelines
    ├── toolkit-usage.md         # Using prompts, agents, evaluators
    ├── contributing-guidelines.md # Detailed contribution workflow
    ├── governance-model.md      # Quality and review process
    └── architecture.md          # System design overview
```

---

## CLI Commands

```bash
# Search for tools (prompts, agents, etc.)
hit search [query]

# Install a tool (interactive or with --path)
hit install <tool> [--path <path>]

# List all installed tools
hit list

# Validate local setup
hit doctor

# Validate and submit a new tool (creates GitHub issue)
hit contribute <type> <path>

# View usage analytics
hit stats
```

**New in v1.0.11:** The `contribute` command now automatically validates your contribution and creates a GitHub issue with detailed feedback!

For complete CLI documentation, see [CLI Reference](./docs/cli-reference.md).

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Submitting new prompts and agents
- Quality standards and review process
- Testing requirements
- Documentation expectations

All code must include TypeDoc comments above functions (no inline comments) and follow our TypeScript strict mode standards.

---

## Documentation

- [Getting Started](./docs/getting-started.md) - Installation, setup, and your first prompt
- [Accountability Framework](./ACCOUNTABILITY.md) - Developer-first AI principles and responsible usage
- [AI Best Practices](./docs/ai-best-practices.md) - Responsible AI usage and prompt engineering
- [Toolkit Usage](./docs/toolkit-usage.md) - Using prompts, agents, evaluators, and guardrails
- [Contributing Guidelines](./docs/contributing-guidelines.md) - Detailed contribution workflow
- [Governance Model](./docs/governance-model.md) - Quality review and release process
- [Architecture](./docs/architecture.md) - System design and technical overview

---

## Technology Stack

- **Build System**: Nx monorepo
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **CLI Framework**: Commander.js
- **Prompts**: Inquirer.js
- **Styling**: Chalk
- **YAML Parsing**: yaml
- **Testing**: Jest

---

## License

MIT License - see [LICENSE](./LICENSE) for details

---

## About

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

For issues and feature requests, please use [GitHub Issues](https://github.com/codewizwit/human-in-the-loop/issues).

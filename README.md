# 🌭 Human in the Loop

**Centralized repository and governance system for AI productivity tools**

A developer-first toolkit for managing Claude prompts, agents, context packs, and evaluators with standardization, quality control, and visibility.

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

## Quick Start

Install the CLI:

```bash
npm install -g @human-in-the-loop/cli
```

Or use npx:

```bash
npx hitl --version
```

Search for tools:

```bash
hitl search "code review"
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

💡 Tip: Use hitl install <type>/<id> to install a tool
```

Install a prompt:

```bash
hitl install prompt/code-review-ts
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

### 📚 Prompt Library (`/toolkit/prompts`)

Production-ready prompts organized by use case, versioned and quality-assured. Each prompt includes metadata, usage examples, and expected outputs.

### 🤖 Agent Registry (`/toolkit/agents`)

Catalog of AI agents with their configurations, capabilities, and integration guides. Includes performance benchmarks and cost estimates.

### 🎯 Context Packs (`/toolkit/context-packs`)

Framework-specific knowledge bases that provide agents with deep technical context:

- **Angular**: Component patterns, routing, state management, testing
- **NestJS**: Module structure, dependency injection, middleware, guards
- **CI/CD**: Pipeline patterns, deployment strategies, environment configs

### ✅ Evaluators (`/toolkit/evaluators`)

Quality assurance tools that validate AI outputs against defined criteria like code quality, documentation completeness, security, and performance.

### 🛡️ Guardrails (`/toolkit/guardrails`)

Safety mechanisms that enforce responsible AI usage, including input validation, output filtering, rate limiting, and audit logging.

### ⚡ CLI Tool (`/src/cli`)

Developer-friendly command-line interface for discovering, installing, and managing AI tools.

### 🛡️ Governance (`/src/governance`)

Contribution validation and quality assurance tooling that ensures all contributions meet project standards.

---

## Repository Structure

```
human-in-the-loop/
├── src/
│   ├── cli/                     # TypeScript CLI tool
│   └── governance/              # Contribution validation tooling
├── toolkit/
│   ├── prompts/                 # Shared prompt library
│   ├── agents/                  # Agent definitions and configs
│   ├── evaluators/              # Quality evaluation tools
│   ├── guardrails/              # Safety and governance rules
│   └── context-packs/           # Framework-specific context
│       ├── angular/             # Angular-specific context
│       ├── nestjs/              # NestJS-specific context
│       └── ci-cd/               # CI/CD patterns and configs
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
hitl search [query]

# Install a tool (interactive or with --path)
hitl install <tool> [--path <path>]

# List all installed tools
hitl list

# Validate local setup
hitl doctor

# Submit a new tool
hitl contribute <type> <path>

# View usage analytics
hitl stats
```

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
- **Validation**: Zod
- **Testing**: Vitest

---

## License

MIT License - see [LICENSE](./LICENSE) for details

---

## About

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

For issues and feature requests, please use [GitHub Issues](https://github.com/codewizwit/human-in-the-loop/issues).

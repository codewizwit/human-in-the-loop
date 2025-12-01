# 🪄 Human in the Loop

[![npm version](https://img.shields.io/npm/v/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![npm downloads](https://img.shields.io/npm/dm/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A curated prompt library for Claude Code. Install versioned, CI-validated prompts as slash commands. Prompts analyze your workspace automatically using Claude's tools—no copy-pasting code.

---

## ⚡ Quick Start

```bash
# Install globally
npm install -g @human-in-the-loop/cli

# Or use npx (no install needed)
npx hit search "security review"
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

### 📚 12 Prompts

**Code Quality**

- 🔍 `code-review-ts` - TypeScript review with constructive feedback
- 🔒 `security-review` - OWASP Top 10, auth flaws, injection detection
- 🏗️ `api-design` - REST/GraphQL best practices
- 🎯 `system-design-review` - Architecture & scalability analysis

**Testing & CI/CD**

- 🧪 `unit-test-generator` - Generate Jest/Vitest tests with edge cases
- 🎬 `e2e-strategy` - Playwright/Cypress test planning
- ⚡ `pipeline-optimization` - GitHub Actions cost & speed optimization

**Planning & Culture**

- 📋 `user-story-breakdown` - Epic → INVEST stories with acceptance criteria
- 💬 `1-on-1-prep` - Structured pre-reads for better meetings
- 💙 `code-review-empathy` - Transform harsh feedback into helpful coaching

**Governance**

- 🛡️ `responsible-ai-audit` - Audit AI outputs for accuracy, fairness, transparency
- ⚖️ `bias-detection` - Identify bias in AI-generated content

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

## 🌟 Featured Workflows

### 🔒 Security Audit Your Codebase

```bash
hit install prompt/security-review
# Creates /security-review

# In Claude Code:
/security-review

# Claude asks: "What should I focus on?"
# You say: "Authentication and SQL injection"
# Claude analyzes your workspace with those priorities
```

### ⚡ Optimize Your CI/CD Pipeline

```bash
hit install prompt/pipeline-optimization

# In Claude Code:
/pipeline-optimization

# Claude:
# - Finds your .github/workflows/*.yml
# - Analyzes parallelization, caching, costs
# - Provides before/after comparison with savings
```

### 🧪 Generate Unit Tests

```bash
hit install prompt/unit-test-generator

# In Claude Code:
/unit-test-generator

# Claude:
# - Finds files without tests
# - Detects framework (Jest/Vitest)
# - Generates tests with edge cases & mocking
```

---

## 🛡️ Responsible AI

This project includes a [Responsible AI Playbook](./RESPONSIBLE-AI-PLAYBOOK.md) that guides prompt design:

- Prompts should enhance developer judgment, not replace it
- Outputs should be transparent and explainable
- Tools should support learning, not create dependency

The `responsible-ai-audit` and `bias-detection` prompts help you apply these principles to your own AI workflows.

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

```
human-in-the-loop/
├── lib/
│   ├── prompts/           # 12 prompts (code review, security, testing, etc.)
│   ├── skills/            # Framework expertise (Angular)
│   ├── agents/            # Coming soon
│   ├── context-packs/     # Coming soon
│   ├── evaluators/        # Coming soon
│   └── guardrails/        # Coming soon
├── src/
│   ├── cli/               # CLI source code
│   └── governance/        # CI validation scripts
└── docs/                  # Documentation
```

---

## 🎉 What's New

**v2.0.0** - Pure XML Prompts & Claude Code Integration

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

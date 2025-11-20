# 🪄 Human in the Loop

[![npm version](https://img.shields.io/npm/v/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![npm downloads](https://img.shields.io/npm/dm/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Your AI toolkit for building better software, faster—without losing your humanity** ✨

Stop copy-pasting prompts from Slack. Stop reinventing the wheel. Get production-ready AI tools with built-in quality gates, Claude Code integration, and developer-first accountability.

---

## ⚡ Quick Start

```bash
# Install globally
npm install -g @human-in-the-loop/cli

# Or use npx (no install needed)
npx hit search "security review"
```

**That's it.** 🎉 Now you have access to 12+ production-tested prompts.

### 🚀 Try it now

```bash
# Find what you need
hit search "code review"

# Install with automatic Claude Code integration
hit install prompt/security-review

# Use in Claude Code
/security-review
```

Claude will automatically analyze your workspace—no copy-pasting code required.

---

## 🎯 Why This Exists

**The problem:** AI prompts are scattered everywhere—Slack threads, Notion docs, random .txt files. Every team reinvents the same patterns. Quality is all over the place.

**The solution:** One npm package. Versioned tools. Quality gates. Claude Code integration. Done.

### 🪄 What makes this different

- **🔌 Claude Code native** - Auto-creates `/slash-commands` when you install
- **🤖 Tool-based analysis** - Prompts use Read/Grep/Glob, not copy-paste
- **✅ Quality gates** - Every tool passes governance checks before merge
- **📦 One install** - Everything you need: `npm i -g @human-in-the-loop/cli`
- **🎓 Developer-first** - Built by devs, for devs, with empathy baked in

---

## 🧰 What's Inside

### 📚 12 Production-Ready Prompts

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

- 🛡️ `responsible-ai-audit` - Developer-first AI accountability checks
- ⚖️ `bias-detection` - Identify bias in AI outputs

### 🎓 Skills for Claude Code

**Framework Expertise**

- ⚡ **Angular Modern** - Signals, standalone, control flow (16+)
- 🏛️ **Angular Legacy** - NgModules, RxJS, lifecycle hooks (pre-16)

### 🔜 Coming Soon

- 🤖 **Agent Registry** - Reusable autonomous agents
- 🎯 **Context Packs** - Domain knowledge bundles
- ✅ **Evaluators** - Output quality validation
- 🛡️ **Guardrails** - Safety & compliance enforcement

---

## 💡 How It Works

### Old way (copy-paste hell)

```
1. Find a prompt somewhere
2. Copy code from your IDE
3. Paste into ChatGPT
4. Copy response back
5. Repeat for every file
```

### New way (automated workspace analysis)

```bash
hit install prompt/security-review
# Creates /security-review in Claude Code

# In Claude:
/security-review
```

Claude uses **Read**, **Grep**, and **Glob** to analyze your workspace automatically. No copy-paste. Just natural conversation.

---

## 🎨 CLI Commands

```bash
hit search [query]              # Find tools (fuzzy search)
hit install <tool>              # Install with Claude Code integration
hit list                        # Show installed tools
hit update --all                # Update everything
hit doctor                      # Validate setup
hit contribute <type> <path>    # Submit new tools
hit stats                       # Usage analytics
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

## 🛡️ Developer-First AI

**We believe AI should enhance developers, not replace them.**

Every tool is evaluated through our [Responsible AI Playbook](./RESPONSIBLE-AI-PLAYBOOK.md):

- ✨ **Enhance** happiness & creativity, not replace judgment
- 📚 **Support** learning & growth, not create dependency
- 🤝 **Strengthen** collaboration, not erode connection
- 🔍 **Maintain** transparency, not obscure decisions

No black boxes. No "trust the AI." Just thoughtful tools that make you better at your job.

[Read the full playbook →](./RESPONSIBLE-AI-PLAYBOOK.md)

---

## 🤝 Contributing

We'd love your help! Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick workflow

```bash
# 1. Create your feature
git checkout -b feature/my-awesome-prompt

# 2. Follow the standards
pnpm format && pnpm lint && pnpm typecheck

# 3. Commit with conventional commits
git commit -m "feat: add my awesome prompt"

# 4. Push and create PR
git push origin feature/my-awesome-prompt
gh pr create
```

**Standards:**

- ✅ TypeDoc comments above functions (no inline `//` comments)
- ✅ TypeScript strict mode
- ✅ All tests passing
- ✅ Conventional commits (`feat:`, `fix:`, `docs:`)

---

## 📚 Documentation

- 🚀 [Getting Started](./docs/getting-started.md) - Installation & first prompt
- 🛡️ [Responsible AI Playbook](./RESPONSIBLE-AI-PLAYBOOK.md) - Developer-first AI principles
- 🎨 [CLI Reference](./docs/cli-reference.md) - Complete command guide
- 🏗️ [Architecture](./docs/architecture.md) - System design overview
- 🤝 [Contributing](./CONTRIBUTING.md) - Detailed contribution workflow

---

## 🏗️ Tech Stack

Built with the good stuff:

- **Build**: Nx monorepo
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **CLI**: Commander.js
- **Prompts**: Inquirer.js
- **Testing**: Jest

---

## 📦 Repository Structure

```
human-in-the-loop/
├── lib/                         # 🧰 Reusable AI tools
│   ├── prompts/                 # 📚 12 production-ready prompts
│   │   ├── architecture/        # 🏗️ System & API design
│   │   ├── ci-cd/               # ⚡ Pipeline optimization
│   │   ├── governance/          # 🛡️ Security, bias, audits
│   │   ├── testing/             # 🧪 E2E, unit test generation
│   │   └── culture/             # 💬 Team & communication
│   ├── skills/                  # 🎓 Framework expertise
│   │   ├── angular-modern/      # ⚡ Angular 16+ (signals)
│   │   └── angular-legacy/      # 🏛️ Pre-16 (NgModules)
│   ├── agents/                  # 🤖 Coming soon
│   ├── context-packs/           # 🎯 Coming soon
│   ├── evaluators/              # ✅ Coming soon
│   └── guardrails/              # 🛡️ Coming soon
├── src/
│   ├── cli/                     # 🎨 CLI tool
│   └── governance/              # ✅ Quality validation
└── docs/                        # 📚 Documentation
```

---

## 🎉 What's New

**v2.0.0** - XML Template Migration & Claude Code Integration

- 🔌 Automatic `/slash-command` creation in Claude Code
- 🤖 Tool-based workspace analysis (no more copy-paste!)
- 📝 Markdown format with YAML frontmatter
- ✨ Pure XML structure for prompts

**v1.2.0** - Update Command

- ⬆️ `hit update --all` batch updates
- 🔄 Semantic versioning with automatic backups
- 📊 Version change summaries

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 💙 Built with Care

**Human-in-the-Loop** by [codewizwit](https://github.com/codewizwit)

_Build with care. Ship with purpose._

🐛 Found a bug? [Open an issue](https://github.com/codewizwit/human-in-the-loop/issues)
💡 Have an idea? [Start a discussion](https://github.com/codewizwit/human-in-the-loop/discussions)
⭐ Like what you see? Star the repo!

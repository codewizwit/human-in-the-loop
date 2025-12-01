# @human-in-the-loop/cli

> Command-line tool for managing AI prompts, agents, and productivity tools with built-in governance and quality standards.

[![npm version](https://badge.fury.io/js/@human-in-the-loop%2Fcli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![npm downloads](https://img.shields.io/npm/dm/@human-in-the-loop/cli.svg)](https://www.npmjs.com/package/@human-in-the-loop/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

### Installation

```bash
# Install globally
npm install -g @human-in-the-loop/cli

# Or use with npx
npx @human-in-the-loop/cli --version
```

### Usage

```bash
# Search for tools
hit search "code review"

# Install a prompt
hit install prompt/code-review-ts

# List installed tools
hit list

# Update CLI to latest version
hit update

# Validate environment
hit doctor
```

## What is Human in the Loop?

Human in the Loop is a centralized repository and governance system for AI productivity tools. It provides:

- **Prompt Library**: Production-ready prompts for code review, documentation, testing, and more
- **Agent Registry**: Autonomous AI agents with defined capabilities and constraints
- **Context Packs**: Framework-specific knowledge bases (Angular, NestJS, CI/CD)
- **Evaluators**: Quality assurance tools for validating AI outputs
- **Guardrails**: Safety mechanisms enforcing responsible AI usage
- **Governance**: Contribution validation and quality control

## Commands

### `hit search [query]`

Search for prompts, agents, and other tools by keyword.

```bash
# Show all tools
hit search

# Search by keyword
hit search "testing"
hit search "angular"

# Search by category
hit search "security"
```

### `hit install <tool>`

Install a tool from the library to your local system.

**What does installing mean?**

Installing copies a prompt, agent, or tool from the library to a location where your AI tools can access it. When you install:

1. **Files are copied** - All prompt/agent files (prompt.md, READMEs, etc.) are copied to your chosen location
2. **Registration** - The installation is tracked in `~/.hit/registry.json` for easy management
3. **Ready to use** - AI tools like Claude Code can now access and use the prompt

**Common install locations:**

- `~/.claude/prompts/` - For Claude Code slash commands
- `~/.claude/tools/` - For general AI tool integration
- Custom paths for your specific workflow

```bash
# Interactive install (prompts for path)
hit install prompt/code-review-ts

# Non-interactive with custom path
hit install prompt/code-review-ts --path ~/.claude/tools/prompts
```

**Options:**

- `--path, -p <path>` - Installation path (skips interactive prompt)

### `hit list`

List all installed tools from your registry.

```bash
hit list
```

### `hit update`

Update the CLI to the latest version from npm. This updates the entire CLI package, including all bundled tools (prompts, agents, skills, etc.).

```bash
# Update CLI to latest version
hit update
```

**What it does:**

1. Checks npm registry for the latest version of `@human-in-the-loop/cli`
2. Compares with your currently installed version
3. If a newer version exists, installs it globally via npm
4. All bundled tools are automatically updated with the CLI

### `hit doctor`

Validate your environment and diagnose issues.

```bash
hit doctor
```

Checks for:

- Node.js version (20+)
- Required dependencies
- Configuration files
- Directory structure

### `hit contribute <type> <path>`

Submit a new tool for review and inclusion in the library.

```bash
# Contribute a prompt
hit contribute prompt lib/prompts/my-prompt/prompt.md

# Contribute an agent
hit contribute agent lib/agents/my-agent/agent.yaml
```

**Types:** `prompt`, `agent`, `evaluator`, `guardrail`, `context-pack`, `skill`

### `hit stats`

View usage analytics and metrics.

```bash
# Global stats
hit stats

# Tool-specific stats
hit stats --tool prompt/code-review-ts
```

## Configuration

Create a `.hitrc.json` file in your project root or home directory:

```json
{
  "defaultContextPacks": ["angular", "nestjs"],
  "defaultInstallPath": "~/.claude/tools",
  "autoUpdate": false,
  "telemetry": true
}
```

**Options:**

- `defaultContextPacks` - Auto-load these context packs with prompts
- `defaultInstallPath` - Default installation directory
- `autoUpdate` - Automatically check for updates
- `telemetry` - Send anonymous usage data (opt-out available)

## Features

### Developer-First AI

Every tool is evaluated through our [Developer-First Responsible AI Playbook](https://github.com/codewizwit/human-in-the-loop/blob/main/RESPONSIBLE-AI-PLAYBOOK.md):

- ✨ **Enhance** developer happiness and creativity
- 📚 **Support** learning and growth
- 🤝 **Strengthen** collaboration and trust
- 🔍 **Maintain** transparency and control

### Quality Standards

- All prompts and agents are versioned and reviewed
- Comprehensive test coverage requirements
- Documentation standards enforced
- Security scanning and validation
- Performance benchmarks tracked

### Registry System

The CLI maintains a local registry at `~/.hit/registry.json` to track:

- Installed tools and versions
- Installation paths
- Last update timestamps
- Usage statistics (if telemetry enabled)

## Examples

### Code Review Workflow

```bash
# Install TypeScript code review prompt
hit install prompt/code-review-ts

# Install empathy guide for feedback
hit install prompt/code-review-empathy

# List installed tools
hit list
```

### Using with Claude Code

After installing a prompt, it automatically creates a Claude Code slash command:

```bash
# Install the prompt
hit install prompt/security-review

# In Claude Code, use the slash command:
# /security-review
```

## Requirements

- **Node.js**: 20.0.0 or higher
- **npm/pnpm**: Latest version recommended
- **Git**: For contribution workflow

## Documentation

- [Main Repository](https://github.com/codewizwit/human-in-the-loop)
- [Full Documentation](https://github.com/codewizwit/human-in-the-loop/tree/main/docs)
- [Contributing Guidelines](https://github.com/codewizwit/human-in-the-loop/blob/main/CONTRIBUTING.md)
- [CLI Reference](https://github.com/codewizwit/human-in-the-loop/blob/main/docs/cli-reference.md)

## Contributing

We welcome contributions! To submit a new prompt, agent, or tool:

1. Fork the repository
2. Create your tool following our templates
3. Test with `hit contribute <type> <path>`
4. Submit a pull request

See [CONTRIBUTING.md](https://github.com/codewizwit/human-in-the-loop/blob/main/CONTRIBUTING.md) for detailed guidelines.

## Support

- **Issues**: [GitHub Issues](https://github.com/codewizwit/human-in-the-loop/issues)
- **CLI Help**: `hit --help` or `hit [command] --help`

## License

MIT © [codewizwit](https://github.com/codewizwit)

## Related Packages

- `@human-in-the-loop/prompts` - Prompt library (coming soon)
- `@human-in-the-loop/agents` - Agent definitions (coming soon)
- `@human-in-the-loop/evaluators` - Quality evaluators (coming soon)

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

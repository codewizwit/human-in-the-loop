# @human-in-the-loop/cli

> Command-line tool for installing and managing AI skills for Claude Code with built-in governance and quality standards.

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

# Install a skill by id
hit install code-review-ts

# List installed tools
hit list

# Update CLI to latest version
hit update

# Validate environment
hit doctor
```

## What is Human in the Loop?

Human in the Loop is a curated skill library for Claude Code with 25 unified skills covering code review, testing, architecture, governance, and more. It provides:

- **25 Unified Skills**: Production-ready skills in standardized `skill.md` format
- **5 Install Destinations**: Global/project skills, global/project commands, or custom paths
- **Interactive Browser**: Browse and install skills without memorizing IDs
- **Governance**: Contribution validation and quality control

## Commands

### `hit search [query]`

Search for skills by keyword.

```bash
# Show all tools
hit search

# Search by keyword
hit search "testing"
hit search "angular"

# Search by category
hit search "security"
```

### `hit install [skill-id]`

Install a unified skill from the library to your local system.

When no skill-id is provided, an interactive skill browser launches so you can explore and select from available skills.

```bash
# Browse all skills interactively
hit install

# Install a specific skill by id
hit install code-review-ts

# Install with a specific destination
hit install code-review-ts --destination project-skill

# Install to a custom path
hit install code-review-ts --path ~/my-tools/skills
```

**What does installing mean?**

Installing copies the skill's `skill.md` file to a destination where Claude Code can access it. When you install:

1. **The skill file is copied** - The `skill.md` file (not the whole directory) is placed in your chosen destination
2. **Registration** - The installation is tracked in `~/.hit/registry.json` for easy management
3. **Ready to use** - Claude Code can now access and use the skill in your sessions

**Common install locations:**

- `~/.claude/skills/` - Global skills, available in all projects
- `.claude/skills/` - Project-scoped skills, available in the current project
- `~/.claude/commands/` - Global slash commands, available in all projects
- `.claude/commands/` - Project-scoped slash commands, available in the current project

**Options:**

- `--path, -p <path>` - Installation path (skips interactive prompt)
- `--destination, -d <type>` - Destination type: `global-skill`, `project-skill`, `global-command`, `project-command`, or `custom`

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
# Contribute a skill
hit contribute skill lib/skills/my-skill/skill.md
```

**Types:** `prompt`, `agent`, `evaluator`, `guardrail`, `context-pack`, `skill`

### `hit stats`

View usage analytics and metrics.

```bash
# Global stats
hit stats

# Tool-specific stats
hit stats --tool code-review-ts
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

- All skills are versioned and reviewed
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
# Install TypeScript code review skill
hit install code-review-ts

# Install empathy guide for feedback
hit install code-review-empathy

# List installed tools
hit list
```

### Using with Claude Code

After installing a skill, Claude Code can access it in your sessions:

```bash
# Install the skill
hit install security-review

# Claude Code now has access to the security review skill
# Use it by referencing the skill in your conversations
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

We welcome contributions! To submit a new skill:

1. Fork the repository
2. Create your skill using the [skill template](https://github.com/codewizwit/human-in-the-loop/blob/main/docs/skill-template.md)
3. Test with `hit contribute skill <path>`
4. Submit a pull request

See [CONTRIBUTING.md](https://github.com/codewizwit/human-in-the-loop/blob/main/CONTRIBUTING.md) for detailed guidelines.

## Support

- **Issues**: [GitHub Issues](https://github.com/codewizwit/human-in-the-loop/issues)
- **CLI Help**: `hit --help` or `hit [command] --help`

## License

MIT © [codewizwit](https://github.com/codewizwit)

---

**Human-in-the-Loop by codewizwit** - Build with care. Ship with purpose.

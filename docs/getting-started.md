# 🚀 Getting Started

Welcome to Human in the Loop. This guide will help you install the CLI, set up your environment, and use your first AI productivity tool.

---

## Installation

### Global Installation

Install the CLI globally using npm:

```bash
npm install -g @human-in-the-loop/cli
```

Verify installation:

```bash
hit --version
```

### Using npx

You can also use npx without installing:

```bash
npx hit --version
```

---

## Quick Setup

Run the doctor command to validate your environment and install required dependencies:

```bash
hit doctor
```

This command checks for:

- Node.js version (20+)
- TypeScript installation
- Required CLI dependencies
- Configuration files

---

## Your First Prompt

### 1. Search for Prompts

Search the library for available prompts:

```bash
hit search "code review"
```

You'll see results like:

```
Found 3 prompts:

1. prompt/code-review-ts
   TypeScript code review with best practices
   Version: 1.2.0

2. prompt/code-review-angular
   Angular-specific code review
   Version: 1.0.1

3. prompt/code-review-security
   Security-focused code review
   Version: 2.0.0
```

### 2. Install a Prompt

Install the prompt you want:

```bash
hit install prompt/code-review-ts
```

The CLI will prompt you for an installation location (or use `--path` to specify):

```
📦 Installing prompt/code-review-ts...

  → Looking up tool...
  → Copying tool files...
  → Registering installation...

✓ Successfully installed Code Review TypeScript (v1.2.0)
  → Installed to: ~/.claude/tools/prompt/code-review-ts

💡 Tip: Use hit list to see all installed tools
```

**Non-interactive installation:**

```bash
hit install prompt/code-review-ts --path ~/.claude/tools/prompt/code-review-ts
```

### 3. Use the Prompt

The prompt is now available in your `.claude/` directory:

```
.claude/
└── prompts/
    └── code-review-ts/
        ├── prompt.md
        ├── metadata.json
        └── examples/
```

---

## Available Commands

### `hit search [query]`

Search for prompts and agents by keyword.

**Examples:**

```bash
hit search "testing"
hit search "angular component"
hit search "api documentation"
```

### `hit install [tool]`

Install a prompt or agent. Prompts you for installation location unless `--path` is provided.

**Examples:**

```bash
# Interactive install (prompts for path)
hit install prompt/code-review-ts

# Non-interactive install with custom path
hit install prompt/code-review-ts --path ~/my-tools/prompts/code-review

# Install to default location
hit install agent/test-generator --path ~/.claude/tools/agent/test-generator
```

**Options:**

- `--path, -p <path>` - Installation path (skips interactive prompt)

### `hit list`

Show all installed tools from your registry.

```bash
hit list
```

**Example output:**

```
📚 Installed Tools

Prompts:
  • code-review-ts v1.2.0
   Installed at: ~/.claude/tools/prompt/code-review-ts

Agents:
  • test-generator v1.0.0
   Installed at: ~/.claude/tools/agent/test-generator
```

### `hit update [tool]`

Update an installed tool to the latest version.

```bash
hit update prompt/code-review-ts
hit update --all
```

### `hit doctor`

Validate your local setup and diagnose issues.

```bash
hit doctor
```

### `hit contribute [type] [path]`

Submit a new tool for review.

```bash
hit contribute prompt ./my-prompt.yaml
hit contribute agent ./my-agent/
```

### `hit stats`

View usage analytics and metrics.

```bash
hit stats
hit stats --tool prompt/code-review-ts
```

---

## Configuration

Create a `.hitrc.json` file in your project root:

```json
{
  "defaultContextPacks": ["angular", "nestjs"],
  "autoUpdate": true,
  "telemetry": true
}
```

**Options:**

- `defaultContextPacks`: Array of context packs to load by default
- `autoUpdate`: Automatically update tools to latest versions
- `telemetry`: Send anonymous usage data (helps improve the toolkit)

---

## Context Packs

Context packs provide framework-specific knowledge to AI agents.

**Available Packs:**

- `angular` - Angular framework patterns
- `nestjs` - NestJS backend patterns
- `ci-cd` - CI/CD and DevOps
- `prompts` - Prompt engineering techniques
- `agents` - Agent development

**Install a context pack:**

```bash
hit install context/angular
```

**Configure default context packs** in `.hitrc.json` to automatically load them with every prompt.

---

## Next Steps

- [Best Practices](./ai-best-practices.md) - Learn prompt engineering and agent development patterns
- [Contributing](../CONTRIBUTING.md) - Submit your own prompts and agents
- [Governance](./governance-model.md) - Understand our quality standards and review process

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

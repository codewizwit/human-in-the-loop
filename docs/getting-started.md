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
hitl --version
```

### Using npx

You can also use npx without installing:

```bash
npx hitl --version
```

---

## Quick Setup

Run the doctor command to validate your environment and install required dependencies:

```bash
hitl doctor
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
hitl search "code review"
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
hitl install prompt/code-review-ts
```

The CLI will:
- Download the prompt and its dependencies
- Install required context packs
- Cache locally for offline use
- Show usage examples

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

### `hitl search [query]`

Search for prompts and agents by keyword.

**Examples:**
```bash
hitl search "testing"
hitl search "angular component"
hitl search "api documentation"
```

### `hitl install [tool]`

Install a prompt or agent.

**Examples:**
```bash
hitl install prompt/code-review-ts
hitl install agent/test-generator
hitl install prompt/api-docs-generator
```

### `hitl list`

Show all installed tools.

```bash
hitl list
```

### `hitl update [tool]`

Update an installed tool to the latest version.

```bash
hitl update prompt/code-review-ts
hitl update --all
```

### `hitl doctor`

Validate your local setup and diagnose issues.

```bash
hitl doctor
```

### `hitl contribute [type] [path]`

Submit a new tool for review.

```bash
hitl contribute prompt ./my-prompt.yaml
hitl contribute agent ./my-agent/
```

### `hitl stats`

View usage analytics and metrics.

```bash
hitl stats
hitl stats --tool prompt/code-review-ts
```

---

## Configuration

Create a `.hitlrc.json` file in your project root:

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
hitl install context/angular
```

**Configure default context packs** in `.hitlrc.json` to automatically load them with every prompt.

---

## Next Steps

- [Best Practices](./best-practices.md) - Learn prompt engineering and agent development patterns
- [Contributing](./contributing.md) - Submit your own prompts and agents
- [Governance](./governance.md) - Understand our quality standards and review process

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

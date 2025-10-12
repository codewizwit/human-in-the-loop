# Source Code

This directory contains the source code for the Human in the Loop project infrastructure.

## Structure

```
src/
├── cli/           # Command-line interface for managing toolkit
└── governance/    # Contribution validation and quality checks
```

## What's Inside

### ⚡ CLI (`/src/cli`)

Developer-friendly command-line tool for discovering, installing, and managing AI productivity tools from the toolkit.

**Commands:**

- `hitl search` - Search for prompts and agents
- `hitl install` - Install a tool to your project
- `hitl list` - List all installed tools
- `hitl doctor` - Validate local setup
- `hitl contribute` - Submit a new tool
- `hitl stats` - View usage analytics

### 🛡️ Governance (`/src/governance`)

Validation and quality assurance tooling that ensures all contributions meet project standards for quality, documentation, and security.

**Responsibilities:**

- YAML and TypeScript validation
- Documentation completeness checks
- Secret detection and security scanning
- Code formatting and style enforcement

## Development

Build all source code:

```bash
pnpm nx build --all
```

Build specific project:

```bash
pnpm nx build cli
```

Run CLI in development:

```bash
pnpm nx serve cli
```

## Technology Stack

- **TypeScript**: Strict mode enabled
- **Nx**: Monorepo build system
- **Commander.js**: CLI framework
- **Chalk**: Terminal styling
- **Zod**: Schema validation

---

**Human-in-the-Loop by codewizwit**

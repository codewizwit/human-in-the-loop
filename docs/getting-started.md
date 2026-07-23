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

## Your First Skill

### 1. Browse Available Skills

Browse or search the library of 25 available skills:

```bash
# Launch the interactive browser
hit install

# Or search by keyword
hit search "code review"
```

Search results look like:

```
Found 2 skills:

1. code-review-ts
   TypeScript code review with best practices
   Version: 3.0.0

2. code-review-empathy
   Empathy-driven code review feedback
   Version: 3.0.0
```

### 2. Install a Skill

Install a skill by its ID:

```bash
hit install code-review-ts
```

The CLI will prompt you for an installation destination (or use `--destination` to specify):

```
Installing code-review-ts...

  → Looking up skill...
  → Copying skill files...
  → Registering installation...

Successfully installed code-review-ts (v3.0.0)
  → Installed to: ~/.claude/skills/code-review-ts

Tip: Use hit list to see all installed tools
```

**Non-interactive installation:**

```bash
hit install code-review-ts --destination global-skill
```

### 3. Use the Skill

The skill is now available in your `.claude/` directory:

```
.claude/
└── skills/
    └── code-review-ts/
        ├── skill.md
        ├── metadata.json
        └── README.md
```

---

## Available Commands

### `hit search [query]`

Search for skills by keyword.

**Examples:**

```bash
hit search "testing"
hit search "angular component"
hit search "api documentation"
```

### `hit install [skill-id]`

Install a skill. When run with no arguments, launches an interactive browser. Use `--destination` to control where the skill is installed.

**Examples:**

```bash
# Launch interactive skill browser
hit install

# Install a skill (prompts for destination)
hit install code-review-ts

# Install as a global skill
hit install code-review-ts --destination global-skill

# Install as a project-level command
hit install security-review --destination project-command
```

**Options:**

- `--destination, -d <destination>` - Installation destination (`global-skill`, `project-skill`, `global-command`, `project-command`, `custom`)

### `hit list`

Show all installed tools from your registry.

```bash
hit list
```

**Example output:**

```
Installed Skills

Skills:
  * code-review-ts v3.0.0
   Installed at: ~/.claude/skills/code-review-ts

  * security-review v3.0.0
   Installed at: ~/.claude/skills/security-review
```

### `hit update`

Update the CLI and all bundled skills to the latest version.

```bash
hit update
```

### `hit doctor`

Validate your local setup and diagnose issues.

```bash
hit doctor
```

### `hit contribute <path>`

Submit a new skill for review.

```bash
hit contribute lib/skills/my-skill/skill.md
```

### `hit stats`

View usage analytics and metrics.

```bash
hit stats
hit stats --tool code-review-ts
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

## Skill Categories

All 25 skills in the toolkit use the unified `skill.md` format. Skills span multiple categories:

- **Code Review** - `code-review-ts`, `code-review-empathy`, `security-review`
- **Testing** - `unit-test-generator`, `test-coverage-analysis`, `bdd-scenarios`, `e2e-strategy`
- **Architecture** - `api-design`, `api-documentation`, `system-design-review`
- **Frameworks** - `angular-modern`, `angular-legacy`, `nestjs-backend`, `nx-monorepo`
- **DevOps** - `aws-deployment-strategy`, `pipeline-optimization`
- **AI/Governance** - `responsible-ai-audit`, `bias-detection`, `prompt-optimization`, `context-pack-builder`
- **Planning** - `user-story-breakdown`, `learning-path`, `codebase-explainer`
- **Culture** - `1-on-1-prep`, `team-retrospective`

**Install any skill:**

```bash
hit install <skill-id>
```

---

## Next Steps

- [Best Practices](./ai-best-practices.md) - Learn prompt engineering and agent development patterns
- [Contributing](../CONTRIBUTING.md) - Submit your own prompts and agents
- [Governance](./governance-model.md) - Understand our quality standards and review process

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

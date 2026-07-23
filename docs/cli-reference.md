# CLI Reference

Complete reference for the Human in the Loop CLI (`hit`).

---

## Global Options

```bash
hit [command] [options]
```

**Common Options:**

- `--version, -v` - Display CLI version
- `--help, -h` - Display help for command

---

## Commands

### `hit search [query]`

Search the toolkit for available skills.

**Usage:**

```bash
hit search [query]
```

**Arguments:**

- `query` (optional) - Search keyword or phrase

**Examples:**

```bash
# Show all available tools
hit search

# Search by keyword
hit search "code review"
hit search testing
hit search "angular component"

# Search by category
hit search documentation
hit search security
```

**Output:**

```
Searching for: "testing"

Found 3 skills:

1. unit-test-generator
   Generate comprehensive unit test suites
   Version: 3.0.0

2. test-coverage-analysis
   Analyze and improve test coverage
   Version: 3.0.0

3. bdd-scenarios
   Generate BDD test scenarios
   Version: 3.0.0

Tip: Use hit install <skill-id> to install a skill
```

---

### `hit install [skill-id]`

Install a skill from the toolkit to your local system.

**What does installing mean?**

Installing copies a skill from the library to a location where your AI applications can access it. The installation process:

1. **Copies Files** - All skill files (`skill.md`, `metadata.json`, `README.md`) are copied to your chosen destination
2. **Registers Installation** - The skill is tracked in `~/.hit/registry.json` for version management
3. **Makes Available** - AI tools like Claude Code can now discover and use the installed skill

**Usage:**

```bash
hit install [skill-id] [options]
```

**Arguments:**

- `skill-id` (optional) - Skill identifier in kebab-case format
  - Example: `code-review-ts`
  - Example: `security-review`
  - When omitted, launches an interactive browser to browse and select skills

**Options:**

- `--destination, -d <destination>` - Where to install the skill. Choices:
  - `global-skill` - Install as a global Claude Code skill (`~/.claude/skills/`)
  - `project-skill` - Install as a project-level skill (`.claude/skills/`)
  - `global-command` - Install as a global Claude Code slash command (`~/.claude/commands/`)
  - `project-command` - Install as a project-level slash command (`.claude/commands/`)
  - `custom` - Prompt for a custom path

**Examples:**

```bash
# Launch interactive browser to browse all 25 skills
hit install

# Install a skill by ID (prompts for destination)
hit install code-review-ts

# Install as a global skill
hit install code-review-ts --destination global-skill

# Install as a project-level command
hit install security-review --destination project-command

# Install to a custom location
hit install unit-test-generator --destination custom
```

**Interactive Browser:**

When `hit install` is run with no arguments, an interactive browser launches:

```
? Browse skills (Use arrow keys)
  1-on-1-prep          - Prepare for 1-on-1 meetings
  angular-legacy       - Angular legacy migration guidance
  angular-modern       - Modern Angular development
  api-design           - API design review
  ...
  (25 skills available)
```

**Interactive Flow:**

When `--destination` is not provided, the CLI prompts for installation location:

```
Installing code-review-ts...

  → Looking up skill...

? Where would you like to install this skill?
  > global-skill
    project-skill
    global-command
    project-command
    custom

  → Copying skill files...
  → Registering installation...

Successfully installed code-review-ts (v3.0.0)
  → Installed to: ~/.claude/skills/code-review-ts

Tip: Use hit list to see all installed tools
```

**Reinstall Flow:**

If a skill is already installed, the CLI prompts for confirmation:

```
Tool "code-review-ts" is already installed at: ~/.claude/skills/code-review-ts

? Do you want to reinstall? (y/N)
```

---

### `hit list`

Display all installed tools from your local registry.

**Usage:**

```bash
hit list
```

**Output:**

```
Installed Skills

Skills:
  * code-review-ts v3.0.0
   Installed at: ~/.claude/skills/code-review-ts

  * security-review v3.0.0
   Installed at: ~/.claude/skills/security-review

  * unit-test-generator v3.0.0
   Installed at: ~/.claude/skills/unit-test-generator

Tip: Use hit search to find more skills
```

**Empty State:**

```
No skills installed yet

Use hit search to discover available skills, then hit install <skill-id> to add them.
```

---

### `hit update`

Update the CLI to the latest version from npm. This command updates the entire CLI package, including all bundled tools (prompts, agents, skills, context packs, etc.).

**Usage:**

```bash
hit update
```

**What it does:**

1. Checks the npm registry for the latest version of `@human-in-the-loop/cli`
2. Compares it with your currently installed version
3. If a newer version exists, installs it globally via npm
4. All bundled tools are automatically updated with the CLI

**Output Example (Already Up-to-Date):**

```
🔍 Checking for updates...

  → Current version: v1.1.7
  → Latest version:  v1.1.7

✓ You are already running the latest version!
```

**Output Example (Update Available):**

```
🔍 Checking for updates...

  → Current version: v1.1.7
  → Latest version:  v1.2.0

⬆️  Updating CLI to latest version...

  → Running: npm install -g @human-in-the-loop/cli@latest

✓ Successfully updated CLI from v1.1.7 to v1.2.0
  → All bundled tools (prompts, agents, skills) have been updated!
```

**Output Example (Update Failed):**

```
🔍 Checking for updates...

  → Current version: v1.1.7
  → Latest version:  v1.2.0

⬆️  Updating CLI to latest version...

  → Running: npm install -g @human-in-the-loop/cli@latest

✗ Update failed. Please try manually:
  → npm install -g @human-in-the-loop/cli@latest
```

**Notes:**

- Requires internet connection to check npm registry
- Updates the entire CLI package (not individual tools)
- Uses global npm installation (`-g` flag)
- No arguments or options required
- Automatically updates all bundled tools with the CLI

**Manual Alternative:**

If `hit update` fails, you can manually update with:

```bash
npm install -g @human-in-the-loop/cli@latest
```

---

### `hit doctor`

Validate your environment and diagnose issues.

**Usage:**

```bash
hit doctor
```

**What it checks:**

**Environment:**

- Node.js installation and version
- npm installation and version
- pnpm installation (optional but recommended)

**Version Control:**

- Git installation and version
- GitHub CLI (`gh`) installation - required for `hit contribute` command

**Installation Paths:**

- `.claude` directory exists or can be created
- `tools` directory within `.claude`
- `registry.json` file

**Output Example:**

```
🔍 Running diagnostic checks...

Environment:
  ✓ Node.js v20.10.0
  ✓ npm 10.2.3
  ✓ pnpm 9.0.0

Version Control:
  ✓ git 2.42.0
  ✓ GitHub CLI gh version 2.40.0

Installation Paths:
  ✓ .claude directory /Users/you/.claude
  ✓ tools directory /Users/you/.claude/tools
  ✓ registry.json found

All checks passed! Your environment is ready.
```

**Status Messages:**

- ✓ Green checkmark - Component found and working
- ⚠ Yellow warning - Optional component missing (won't prevent CLI usage)
- ✗ Red X - Critical component missing (may cause errors)

**Exit Status:**

- Shows success if all critical checks pass
- Shows warning if optional tools are missing
- Shows error if critical dependencies are missing

---

### `hit stats`

View installation statistics and analytics for installed tools.

**Usage:**

```bash
hit stats [options]
```

**Options:**

- `--tool <id>` - Show stats for a specific installed tool

**Examples:**

```bash
# Overall stats for all installed skills
hit stats

# Stats for a specific skill
hit stats --tool code-review-ts
```

**Overall Stats Output:**

Shows summary of all installed skills:

```
Overall Stats:

Skills Installed: 3

Recently Installed:
  1. code-review-ts (2 days ago)
  2. security-review (1 week ago)
  3. unit-test-generator (2 weeks ago)

Note: Usage tracking (time saved, uses, etc.) is not yet implemented.
Currently showing installation data only. Use --tool=<id> for details.
```

**Tool-Specific Stats Output:**

Shows detailed information about a single installed skill:

```
Stats for code-review-ts:

Installation Info:
  ID: code-review-ts
  Version: 3.0.0
  Installed: 1/15/2025
  Path: ~/.claude/skills/code-review-ts

Note: Usage tracking is not yet implemented. This shows installation data only.
```

**When No Skills Installed:**

```
Overall Stats:

No skills installed yet

Use hit search to find skills
Use hit install <skill-id> to install a skill
```

**When Skill Not Found:**

```
Tool "nonexistent" not found in installed skills
Use hit list to see installed skills
```

**Current Limitations:**

- ⚠ Usage tracking (number of uses, time saved, etc.) is not yet implemented
- Currently shows only installation metadata
- Future versions will include usage analytics and metrics

---

### `hit contribute <path>`

Validate a skill contribution and automatically create a GitHub issue for review.

**What it does:**

1. **Validates** your skill against quality standards:

   - Unified `skill.md` format with YAML frontmatter and markdown body
   - Required frontmatter fields: `name` (kebab-case), `description`, `version` (semver), `allowed-tools` (array)
   - Required sections: "When to Activate", "Output Format" (or "Output")
   - README.md and metadata.json presence
   - No deprecated XML `<prompt>` format

2. **Creates GitHub issue** automatically with:
   - All validation results (pass/fail for each check)
   - List of errors that need fixing
   - Review checklist for maintainers
   - Next steps based on validation status

**Usage:**

```bash
hit contribute <path>
```

**Arguments:**

- `path` (required) - Path to skill directory or `skill.md` file (e.g., `lib/skills/my-skill/skill.md`)

**Examples:**

```bash
# Contribute a skill
hit contribute lib/skills/my-skill/skill.md
```

**Validation Checks:**

The `validate-skills.ts` script (`src/governance/checks/validate-skills.ts`) enforces:

- YAML frontmatter delimited by `---` lines
- Required frontmatter fields: `name`, `description`, `version`, `allowed-tools`
- `name` must be kebab-case
- `version` must be valid semver
- `allowed-tools` must be an array of strings
- Required markdown sections: "When to Activate", "Output Format" (or "Output")
- No legacy XML `<prompt>` wrapper detected

**Documentation checks:**

- README.md exists in skill directory
- README contains usage and example sections
- metadata.json exists alongside skill.md

**Success Output:**

```
Submitting skill for review...

  → Validating lib/skills/my-skill/skill.md...
  → Running quality checks...

[PASS] my-skill

  → Creating GitHub issue...

Contribution issue created successfully!
  → https://github.com/codewizwit/human-in-the-loop/issues/123

Next steps:
  1. Create a pull request with your changes
  2. Link the PR to the issue above
  3. Wait for peer review (typically 3-5 days)
  4. Address any feedback
  5. Approval and merge
```

**Validation Failure Output:**

```
Submitting skill for review...

  → Validating lib/skills/my-skill/skill.md...
  → Running quality checks...

[FAIL] my-skill
  ERROR: Missing required frontmatter field: "version"
  ERROR: Missing required section: "When to Activate"
  ERROR: Missing required section: "Output Format" (or "Output")

Next steps:
  1. Fix the validation errors listed above
  2. Run validation again: hit contribute <path>
  3. Create PR once all checks pass
```

**Requirements:**

Before running `hit contribute`, ensure your skill has:

- Valid `skill.md` with YAML frontmatter (name, description, version, allowed-tools)
- Required markdown sections: "When to Activate", "Output Format" (or "Output")
- `README.md` in the same directory
- `metadata.json` in the same directory
- Semantic version number (e.g., 3.0.0)
- No legacy XML format

**Prerequisites:**

- `gh` CLI installed and authenticated (`gh auth login`)
- Repository access to create issues

See [Contributing Guide](../CONTRIBUTING.md) for detailed contribution requirements.

---

## Configuration

The CLI looks for configuration in these locations (in order):

1. `.hitrc.json` in current directory
2. `.hitrc.json` in home directory
3. Default configuration

**Configuration File:**

```json
{
  "toolkitPath": "./toolkit",
  "registryPath": "~/.hit/registry.json",
  "defaultInstallPath": "~/.claude/tools",
  "autoUpdate": false,
  "telemetry": true
}
```

**Options:**

- `toolkitPath` - Path to toolkit directory (default: `./toolkit`)
- `registryPath` - Path to installation registry (default: `~/.hit/registry.json`)
- `defaultInstallPath` - Default installation directory (default: `~/.claude/tools`)
- `autoUpdate` - Automatically check for updates (default: `false`)
- `telemetry` - Send anonymous usage data (default: `true`)

---

## Registry

The CLI maintains an installation registry at `~/.hit/registry.json` to track installed tools.

**Registry Format:**

```json
{
  "version": "1.0.0",
  "installations": [
    {
      "id": "code-review-ts",
      "name": "code-review-ts",
      "version": "3.0.0",
      "type": "skill",
      "installedPath": "/Users/you/.claude/skills/code-review-ts",
      "installedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

**Registry Operations:**

- Automatically updated on `hit install`
- Read by `hit list`
- Used for reinstall detection
- Cleared on `hit uninstall` (not yet implemented)

---

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - Tool not found
- `4` - Installation failed
- `5` - Environment check failed

---

## Environment Variables

- `HITL_TOOLKIT_PATH` - Override toolkit directory location
- `HITL_REGISTRY_PATH` - Override registry file location
- `NO_COLOR` - Disable colored output

---

## Troubleshooting

### Tool Not Found

```
Tool "nonexistent" not found in toolkit
```

**Solution:** Run `hit search` to see available skills, or check the `lib/skills/` directory exists.

### Installation Failed

```
✗ Installation failed: Permission denied
```

**Solution:** Check file permissions on the installation directory, or use `--path` to specify a writable location.

### Registry Corrupted

```
✗ Failed to read registry: Invalid JSON
```

**Solution:** Delete `~/.hit/registry.json` and reinstall your tools. The registry will be recreated automatically.

---

## See Also

- [Getting Started Guide](./getting-started.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Best Practices](./ai-best-practices.md)
- [Governance Model](./governance-model.md)

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

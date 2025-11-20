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

Search the toolkit for available prompts, agents, and other tools.

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
🔍 Searching for: "testing"

Found 3 tools:

1. agent/test-generator
   Generate comprehensive test suites
   Version: 1.0.0
   Tags: testing, automation

2. prompt/unit-test-writer
   Write unit tests with best practices
   Version: 2.1.0
   Tags: testing, unit-tests

3. evaluator/test-coverage
   Evaluate test coverage quality
   Version: 1.5.0
   Tags: testing, quality

💡 Tip: Use hit install <type>/<id> to install a tool
```

---

### `hit install <tool>`

Install a prompt, agent, or other tool from the toolkit to your local system.

**What does installing mean?**

Installing copies a tool from the library to a location where your AI applications can access it. The installation process:

1. **Copies Files** - All tool files (YAML configs, READMEs, examples) are copied to your chosen directory
2. **Registers Installation** - The tool is tracked in `~/.hit/registry.json` for version management
3. **Makes Available** - AI tools like Claude Code can now discover and use the installed prompts/agents

**Common install locations:**

- `~/.claude/prompts/` - For Claude Code slash commands and prompts
- `~/.claude/tools/` - For general AI tool integration and agents
- Custom paths for your specific AI workflow or team setup

**Usage:**

```bash
hit install <tool> [options]
```

**Arguments:**

- `tool` (required) - Tool identifier in format `<type>/<id>`
  - Example: `prompt/code-review-ts`
  - Example: `agent/test-generator`

**Options:**

- `--path, -p <path>` - Installation path (skips interactive prompt)
- `--claude-command, -c` - Create Claude Code slash command (prompts only)

**Examples:**

```bash
# Interactive install (prompts for path)
hit install prompt/code-review-ts

# Non-interactive with custom path
hit install prompt/code-review-ts --path ~/my-tools/prompts

# Install to specific location
hit install agent/test-generator -p ~/.claude/tools/agent/test-generator

# Install with Claude Code integration
hit install prompt/security-review --claude-command

# Combine path and Claude Code integration
hit install prompt/security-review --path ~/.claude/tools/prompt/security-review --claude-command
```

**Interactive Flow:**

When `--path` is not provided, the CLI prompts for installation location:

```
📦 Installing prompt/code-review-ts...

  → Looking up tool...

? Where would you like to install this tool? (~/.claude/tools/prompt/code-review-ts)

  → Copying tool files...
  → Registering installation...

✓ Successfully installed Code Review TypeScript (v1.2.0)
  → Installed to: ~/.claude/tools/prompt/code-review-ts

💡 Tip: Use hit list to see all installed tools
```

**Reinstall Flow:**

If a tool is already installed, the CLI prompts for confirmation:

```
⚠ Tool "code-review-ts" is already installed at: ~/.claude/tools/prompt/code-review-ts

? Do you want to reinstall? (y/N)
```

**Claude Code Integration:**

The `--claude-command` flag automatically creates a Claude Code slash command for installed prompts:

```bash
hit install prompt/security-review --claude-command
```

**Output:**

```
📦 Installing prompt/security-review...

  → Looking up tool...
  → Copying tool files...
  → Registering installation...

✓ Successfully installed Security Review (v1.1.0)
  → Installed to: ~/.claude/tools/prompt/security-review

  → Creating Claude Code slash command...
✓ Created slash command: /security-review
  → Command file: ~/.claude/commands/security-review.md
  → Use /security-review in Claude Code to activate this prompt

💡 Tip: Use hit list to see all installed tools
```

**How it works:**

1. Extracts the prompt template from `prompt.yaml`
2. Creates `~/.claude/commands/{prompt-id}.md`
3. Includes variable documentation as comments
4. Makes the prompt available as a slash command in Claude Code

**Usage in Claude Code:**

After installing with `--claude-command`, open Claude Code and type:

```
/security-review
```

The prompt will be activated and ready to use with your code.

**Limitations:**

- Only works for **prompt** type tools (not agents, skills, or context packs)
- Requires `~/.claude` directory to exist or be creatable
- If Claude Code integration fails, installation still succeeds (shows warning)

---

### `hit list`

Display all installed tools from your local registry.

**Usage:**

```bash
hit list
```

**Output:**

```
📚 Installed Tools

Prompts:
  • code-review-ts v1.2.0
   Installed at: ~/.claude/tools/prompt/code-review-ts

  • api-docs-generator v2.1.0
   Installed at: ~/.claude/tools/prompt/api-docs-generator

Agents:
  • test-generator v1.0.0
   Installed at: ~/.claude/tools/agent/test-generator

Context Packs:
  • angular v3.0.0
   Installed at: ~/.claude/tools/context-pack/angular

💡 Tip: Use hit search to find more tools
```

**Empty State:**

```
⚠ No tools installed yet

Use hit search to discover available tools, then hit install to add them.
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
# Overall stats for all installed tools
hit stats

# Stats for a specific tool
hit stats --tool code-review-ts
```

**Overall Stats Output:**

Shows summary of all installed tools:

```
📊 Overall Stats:

Tools Installed: 5

By Type:
  prompt: 3
  agent: 1
  context-pack: 1

Recently Installed:
  1. code-review-ts (2 days ago)
  2. api-design (1 week ago)
  3. angular (2 weeks ago)

Note: Usage tracking (time saved, uses, etc.) is not yet implemented.
Currently showing installation data only. Use --tool=<id> for details.
```

**Tool-Specific Stats Output:**

Shows detailed information about a single installed tool:

```
📊 Stats for Code Review TypeScript:

Installation Info:
  ID: code-review-ts
  Type: prompt
  Version: 1.2.0
  Installed: 1/15/2024
  Path: ~/.claude/tools/prompt/code-review-ts

Note: Usage tracking is not yet implemented. This shows installation data only.
```

**When No Tools Installed:**

```
📊 Overall Stats:

⚠ No tools installed yet

Use hit search to find tools
Use hit install <type>/<id> to install a tool
```

**When Tool Not Found:**

```
⚠ Tool "nonexistent" not found in installed tools
Use hit list to see installed tools
```

**Current Limitations:**

- ⚠ Usage tracking (number of uses, time saved, etc.) is not yet implemented
- Currently shows only installation metadata
- Future versions will include usage analytics and metrics

---

### `hit contribute <type> <path>`

Validate a contribution and automatically create a GitHub issue for review.

**What it does:**

1. **Validates** your tool against quality standards:

   - YAML structure and required metadata fields
   - README.md presence and "## Usage" section
   - Examples provided (warns if missing)
   - Type-specific requirements (e.g., prompts need `template` field)

2. **Auto-detects** tool type from directory path (verifies it matches specified type)

3. **Creates GitHub issue** automatically with:
   - All validation results (pass/fail for each check)
   - List of errors that need fixing
   - Review checklist for maintainers
   - Next steps based on validation status

**Usage:**

```bash
hit contribute <type> <path>
```

**Arguments:**

- `type` (required) - Tool type: `prompt`, `agent`, `evaluator`, `guardrail`, or `context-pack`
- `path` (required) - Path to tool YAML file (e.g., `prompt.yaml`)

**Examples:**

```bash
# Contribute a prompt
hit contribute prompt lib/prompts/my-prompt/prompt.yaml

# Contribute an agent
hit contribute agent lib/agents/my-agent/agent.yaml

# Contribute a context pack
hit contribute context-pack lib/context-packs/react/config.yaml
```

**Validation Checks:**

✅ **YAML Structure:**

- Required fields: `id`, `name`, `version`, `description`, `category`
- Required metadata: `author`, `license`
- Type-specific fields (e.g., prompts need `template`)
- Examples array (warns if empty)

✅ **Documentation:**

- README.md exists in tool directory
- README contains "## Usage" section
- Sufficient content (warns if too short)

**Success Output:**

```
📤 Submitting prompt for review...

  → Validating lib/prompts/my-prompt/prompt.yaml...
  → Running quality checks...

✓ ✅ YAML validation passed
✓ ✅ Documentation validation passed

  → Creating GitHub issue...

✓ Contribution issue created successfully!
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
📤 Submitting prompt for review...

  → Validating lib/prompts/my-prompt/prompt.yaml...
  → Running quality checks...

✗ ❌ YAML validation failed
  - Missing required field: version
  - Missing metadata section
  - Prompts must have a template field

✗ ❌ Documentation validation failed
  - Missing README.md file

⚠️  Warnings:
  - No examples provided (recommended: at least 2)

  → Creating GitHub issue...

✓ Contribution issue created successfully!
  → https://github.com/codewizwit/human-in-the-loop/issues/124

Next steps:
  1. Fix the validation errors listed above
  2. Run validation again: hit contribute <type> <path>
  3. Create PR once all checks pass
```

**Requirements:**

Before running `hit contribute`, ensure your tool has:

- ✅ Valid YAML file with all required fields
- ✅ README.md in the same directory as the YAML
- ✅ "## Usage" section in README
- ✅ At least 2 usage examples
- ✅ Proper metadata (author, license)
- ✅ Semantic version number

**GitHub Issue:**

The created issue includes:

- 📊 Validation status (all passed / issues found)
- 📝 Detailed error messages and warnings
- ✅ Review checklist for maintainers
- 📋 Contextual next steps

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
      "name": "Code Review TypeScript",
      "version": "1.2.0",
      "type": "prompt",
      "installedPath": "/Users/you/.claude/tools/prompt/code-review-ts",
      "installedAt": "2024-01-15T10:30:00.000Z"
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
✗ Tool "prompt/nonexistent" not found in toolkit
```

**Solution:** Run `hit search` to see available tools, or check the toolkit directory exists.

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

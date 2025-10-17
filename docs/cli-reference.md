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

**Examples:**

```bash
# Interactive install (prompts for path)
hit install prompt/code-review-ts

# Non-interactive with custom path
hit install prompt/code-review-ts --path ~/my-tools/prompts

# Install to specific location
hit install agent/test-generator -p ~/.claude/tools/agent/test-generator
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

### `hit doctor`

Validate your environment and diagnose issues.

**Usage:**

```bash
hit doctor
```

**Checks:**

- Node.js version (requires 20+)
- pnpm installation
- Toolkit directory structure
- Registry file integrity
- File system permissions

**Output:**

```
🏥 Running diagnostics...

✓ Node.js version: v20.10.0
✓ pnpm installed
✓ Toolkit directory found
✓ Registry accessible
✓ File permissions OK

All checks passed! Your environment is ready.
```

---

### `hit stats`

View usage statistics and analytics.

**Usage:**

```bash
hit stats [options]
```

**Options:**

- `--tool <tool>` - Show stats for specific tool

**Examples:**

```bash
# Global stats
hit stats

# Tool-specific stats
hit stats --tool prompt/code-review-ts
```

---

### `hit contribute <type> <path>`

Submit a new tool for review and inclusion in the toolkit.

**Usage:**

```bash
hit contribute <type> <path>
```

**Arguments:**

- `type` (required) - Tool type: `prompt`, `agent`, `evaluator`, `guardrail`, or `context-pack`
- `path` (required) - Path to tool directory or YAML file

**Examples:**

```bash
# Contribute a prompt
hit contribute prompt ./my-prompt.yaml

# Contribute an agent
hit contribute agent ./my-agent/

# Contribute with full directory
hit contribute prompt ./code-reviewer/
```

**Requirements:**

- Valid YAML configuration file
- Required metadata fields (id, name, version, description)
- Proper directory structure
- README.md with usage instructions

See [Contributing Guide](../CONTRIBUTING.md) for detailed requirements.

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

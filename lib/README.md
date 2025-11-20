# Toolkit

This directory contains all AI productivity tools, resources, and knowledge bases for the Human in the Loop project.

## Structure

```
lib/
├── prompts/           # Reusable Claude prompts
├── agents/            # AI agent configurations
├── skills/            # Framework-specific expertise
├── evaluators/        # Quality validation tools
├── guardrails/        # Safety and governance mechanisms
└── context-packs/     # Cross-cutting patterns
```

## What's Inside

### 📚 Prompts

Production-ready Claude prompts organized by use case. Each prompt is versioned, documented, and includes usage examples.

**Examples**: Code review prompts, documentation generators, test case creators

### 🤖 Agents

AI agent configurations with defined capabilities, tools, and permissions. Agents use prompts and context packs to perform complex tasks.

**Examples**: Test generation agents, refactoring assistants, code analyzers

### ✅ Evaluators

Quality assurance tools that validate AI outputs against defined criteria like code quality, security, and documentation completeness.

**Examples**: Code quality validators, security scanners, documentation checkers

### 🛡️ Guardrails

Safety mechanisms that enforce responsible AI usage, including input validation, output filtering, and audit logging.

**Examples**: Secret detection, rate limiting, permission enforcement

### 🎓 Skills

Framework-specific expertise for Claude Code and GitHub Copilot. Each skill includes platform-native formats for automatic activation.

**Examples**: Angular Modern (signals, standalone), Angular Legacy (NgModules, RxJS)

### 🎯 Context Packs

Cross-cutting patterns and domain knowledge for specialized use cases.

**Examples**: Security patterns, testing strategies, deployment workflows

## Usage

Browse subdirectories to find specific tooling. Each subdirectory contains its own README with detailed documentation and usage examples.

Install tools using the CLI:

```bash
hit search "code review"
hit install prompt/code-review-ts
```

## Contributing

To add new tools to the toolkit:

1. Choose the appropriate subdirectory
2. Follow the structure defined in that directory's README
3. Include a README.md with usage examples
4. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for full guidelines.

---

**Human-in-the-Loop by codewizwit**

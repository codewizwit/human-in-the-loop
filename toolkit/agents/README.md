# Agents

AI agent configurations that perform complex, multi-step tasks using Claude. Each agent defines its capabilities, required tools, permissions, and context packs.

## Structure

```
agents/
├── test-generator/        # Generates comprehensive test suites
│   ├── agent.yaml
│   └── README.md
├── code-analyzer/         # Analyzes code quality and patterns
└── refactoring-assistant/ # Suggests and implements refactorings
```

## What's an Agent?

An agent is a configured AI assistant with:
- **Tools**: Specific capabilities (file operations, bash, web access)
- **Context Packs**: Framework knowledge it can access
- **Permissions**: What it's allowed to do
- **Evaluation Criteria**: How its outputs are validated

## Usage

```bash
# Search for agents
hitl search "test generator"

# Install an agent
hitl install agent/test-generator

# Use with context
hitl config agent/test-generator --context angular,nestjs
```

## Agent Definition

```yaml
id: my-agent
name: My Agent
version: 1.0.0
model: claude-sonnet-4
tools:
  - file-read
  - file-write
  - bash
contextPacks:
  - angular
  - typescript
permissions:
  - read:filesystem
  - write:filesystem
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for agent contribution guidelines.

---

**Human-in-the-Loop by codewizwit**

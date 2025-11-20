# Context Packs

Cross-cutting patterns and domain knowledge for specialized use cases.

> **Note:** Framework-specific expertise (Angular, NestJS, Nx) is now in [lib/skills](../skills/) with native Claude Code and GitHub Copilot formats.

## Structure

```
context-packs/
├── security/      # Security patterns (planned)
├── testing/       # Testing strategies (planned)
└── deployment/    # Deployment workflows (planned)
```

## What's a Context Pack?

A context pack contains:

- Framework-specific best practices
- Common patterns and anti-patterns
- Code examples with TypeDoc comments
- Testing strategies
- Performance tips
- Migration guides

## Usage

```bash
# Install a context pack
hit install context/angular

# Configure as default
echo '{"defaultContextPacks": ["angular", "nestjs"]}' > .hitrc.json
```

## Available Packs

_(Context packs are for cross-cutting patterns. Framework-specific expertise moved to [lib/skills](../skills/))_

Coming soon:

- Security patterns
- Testing strategies
- Deployment workflows

## Contributing

To add a new context pack:

1. Create directory under `context-packs/`
2. Add comprehensive README.md
3. Include code examples (TypeDoc comments only)
4. Document common patterns
5. Add usage examples

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

---

**Human-in-the-Loop by codewizwit**

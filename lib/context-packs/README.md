# Context Packs

Cross-cutting patterns and domain knowledge for specialized use cases.

> **Note:** Framework-specific expertise (Angular, NestJS, Nx) is now in [lib/skills](../skills/README.md) with native Claude Code and GitHub Copilot formats.

## Structure

```
context-packs/
├── ci-cd/         # CI/CD patterns and deployment strategies
├── security/      # Security patterns (planned)
└── testing/       # Testing strategies (planned)
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

_(Context packs are for cross-cutting patterns. Framework-specific expertise moved to [lib/skills](../skills/README.md))_

### CI/CD

Complete CI/CD patterns including GitHub Actions workflows, deployment strategies, caching, and pipeline optimization.

```bash
hit install context/ci-cd
```

**Includes**:

- GitHub Actions patterns (reusable workflows, matrix builds)
- Deployment strategies (blue-green, canary, rolling)
- Caching strategies (dependencies, build artifacts)
- Secrets management and OIDC authentication
- Monorepo CI/CD (Nx affected, path filtering)

See [ci-cd/README.md](./ci-cd/README.md) for full documentation.

### Coming Soon

- Security patterns
- Testing strategies

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

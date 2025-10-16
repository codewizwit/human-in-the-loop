# Context Packs

Framework-specific knowledge bases that provide AI agents with deep technical context for better, more accurate results.

## Structure

```
context-packs/
├── angular/       # Angular framework patterns
├── nestjs/        # NestJS backend patterns
├── ci-cd/         # CI/CD and DevOps
├── prompts/       # Prompt engineering techniques
└── agents/        # Agent development guides
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

### Angular

Component patterns, routing, state management, RxJS, testing with Jasmine/Jest

[See documentation →](./angular/README.md)

### NestJS

Module structure, dependency injection, middleware, guards, interceptors

### CI/CD

Pipeline patterns, deployment strategies, environment configurations

### Prompts

Prompt engineering techniques, templates, optimization strategies

### Agents

Agent development, tool integration, evaluation methods

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

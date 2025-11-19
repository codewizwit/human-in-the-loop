# Claude Code Skills

This directory contains [Claude Code skills](https://docs.anthropic.com/en/docs/claude-code/skills) that automatically activate when Claude detects relevant context in your work.

## What are Skills?

Skills are domain-specific expertise that Claude can invoke automatically when working on related tasks. Unlike slash commands that require manual invocation, skills activate based on context - such as when you're working with specific frameworks, discussing architecture patterns, or performing certain types of tasks.

## Available Skills

### Framework Expertise

#### `angular-expert.md`

**Activates when**: Working with Angular components, discussing reactive patterns, or optimizing Angular applications

**Provides**:

- Component architecture (smart vs presentational)
- OnPush change detection strategy
- RxJS reactive programming patterns
- Signals API (Angular 16+)
- State management (component, service, NgRx)
- Performance optimization techniques
- Testing strategies

#### `nestjs-expert.md`

**Activates when**: Building NestJS backends, designing APIs, or reviewing Node.js server code

**Provides**:

- Module structure and organization
- Dependency injection patterns
- Controllers, providers, guards, interceptors
- Exception handling and validation
- Testing patterns (unit and E2E)
- Avoiding circular dependencies
- Best practices and anti-patterns

#### `nx-monorepo-expert.md`

**Activates when**: Working in Nx workspaces, discussing monorepo structure, or optimizing builds

**Provides**:

- Workspace organization and project boundaries
- Dependency constraints and module boundaries
- Build caching and computation caching
- Task orchestration and affected commands
- Library vs application architecture
- Module federation patterns
- CI/CD optimization for monorepos

## How Skills Work

Skills use markdown files with YAML frontmatter:

```yaml
---
name: skill-name
description: Brief description of when this skill should activate
---
# Skill Content

Detailed knowledge and patterns...
```

When Claude detects context matching the skill's description, it automatically activates that skill's knowledge without requiring manual invocation.

## Relationship to Context Packs

These skills are generated from the context packs in `lib/context-packs/`. The context packs serve as the source of truth for framework-specific knowledge, while skills provide that knowledge in a format optimized for Claude Code's automatic activation.

- **Context Packs** (`lib/context-packs/`) - Source of truth, installable via CLI
- **Skills** (`.claude/skills/`) - Claude Code format for automatic activation

## Using Skills

Skills activate automatically when relevant - you don't need to do anything! Just work on your code, and Claude will invoke the appropriate skill knowledge when needed.

To see which skills are available:

```bash
ls -la .claude/skills/
```

## Creating New Skills

Skills should be created from context packs in `lib/context-packs/`. To add a new skill:

1. Create the context pack in `lib/context-packs/{framework}/`
2. Write comprehensive documentation in the context pack README
3. Generate the skill file in `.claude/skills/{framework}-expert.md`
4. Include YAML frontmatter with `name` and `description`
5. Ensure the description clearly defines when the skill should activate

## References

- [Claude Code Skills Documentation](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Context Packs Documentation](../../lib/context-packs/README.md)
- [Claude Code Guide](https://docs.anthropic.com/en/docs/claude-code)

---

**Human-in-the-Loop by codewizwit**

# Claude Code Skills

This directory contains [Claude Code skills](https://docs.anthropic.com/en/docs/claude-code/skills) that automatically activate when Claude detects relevant context in your work.

## Source of Truth

**Important**: The source of truth for skills is `lib/skills/`. This directory contains copies installed for use by Claude Code in this project.

To update skills, edit files in `lib/skills/*/claude-skill.md` and copy here.

## Available Skills

### Framework Expertise

#### `angular-modern.md`

**Activates when**: Building Angular 16+ applications with signals, standalone components

**Provides**:

- Signals, computed, effect patterns
- Signal-based inputs/outputs
- Standalone components (no NgModules)
- Control flow syntax (@if, @for, @switch)
- Resource API for data loading

#### `angular-legacy.md`

**Activates when**: Maintaining pre-Angular 16 applications

**Provides**:

- NgModule architecture
- Lifecycle hooks (ngOnInit, ngOnDestroy)
- @Input/@Output decorators
- Structural directives (*ngIf, *ngFor)
- RxJS subscription management

#### `nestjs-backend.md`

**Activates when**: Building NestJS backends, designing APIs

**Provides**:

- Module architecture and organization
- Dependency injection patterns
- Controllers, guards, interceptors
- Exception handling and validation
- Testing patterns (unit and E2E)

#### `nx-monorepo.md`

**Activates when**: Working in Nx workspaces, monorepo structure

**Provides**:

- Workspace organization and project boundaries
- Dependency constraints and module boundaries
- Computation caching strategies
- Task orchestration and affected commands
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

When Claude detects context matching the skill's description, it automatically activates that skill's knowledge.

## Installation

Skills are installed from `lib/skills/` using the CLI:

```bash
# Install as Claude Code skill
hit install skill/angular-modern --as-skill

# Install as GitHub Copilot instructions
hit install skill/angular-modern --as-copilot
```

## Creating New Skills

1. Create the skill in `lib/skills/{name}/`
2. Include: `README.md`, `claude-skill.md`, `copilot-instructions.md`
3. Copy `claude-skill.md` to `.claude/skills/{name}.md`

See `lib/skills/README.md` for full documentation.

## References

- [Claude Code Skills Documentation](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Skills Source Directory](../../lib/skills/README.md)

---

**Human-in-the-Loop by codewizwit**

# Nx Monorepo Skill

Framework-specific expertise for **Nx monorepo** development with workspace organization, project boundaries, caching, and task orchestration.

## Overview

This skill provides comprehensive guidance for building and maintaining Nx monorepos. It covers workspace structure, dependency constraints, computation caching, and CI/CD optimization.

## What's Included

- **Workspace Organization** - Apps vs libs, directory structure, naming conventions
- **Project Boundaries** - Tags, dependency constraints, module boundaries
- **Computation Caching** - Local and remote caching strategies
- **Task Orchestration** - Affected commands, parallel execution
- **Module Federation** - Micro-frontend patterns with Nx
- **CI/CD Optimization** - Distributed task execution, caching in pipelines

## Installation

### As Claude Code Skill

```bash
hit install skill/nx-monorepo --as-skill
```

This copies `claude-skill.md` to `.claude/skills/nx-monorepo.md` for automatic activation when working with Nx workspaces.

### As GitHub Copilot Custom Instruction

```bash
hit install skill/nx-monorepo --as-copilot
```

This copies `copilot-instructions.md` to `.github/instructions/nx-monorepo.instructions.md` for GitHub Copilot integration.

### As Documentation

```bash
hit install skill/nx-monorepo
```

Installs to `~/.claude/tools/skill/nx-monorepo/` for reference.

## Key Patterns

### Workspace Structure

```
my-workspace/
├── apps/           # Deployable applications
├── libs/           # Shared libraries
│   ├── shared/     # Cross-app shared code
│   └── feature-x/  # Feature-specific libraries
├── tools/          # Custom generators/executors
└── nx.json         # Nx configuration
```

### Project Boundaries

```json
// nx.json
{
  "targetDefaults": {},
  "namedInputs": {},
  "plugins": ["@nx/eslint/plugin"]
}

// .eslintrc.json with @nx/enforce-module-boundaries
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          { "sourceTag": "type:app", "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:util"] },
          { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:ui", "type:util", "type:data-access"] },
          { "sourceTag": "type:ui", "onlyDependOnLibsWithTags": ["type:util"] }
        ]
      }
    ]
  }
}
```

### Affected Commands

```bash
# Only test affected projects
nx affected -t test

# Build affected with parallel execution
nx affected -t build --parallel=5

# Show affected graph
nx affected:graph
```

## Prerequisites

- Node.js 18.0.0 or higher
- Nx 16.0.0 or higher

## Related Skills

- **angular-modern** - Modern Angular patterns
- **nestjs-backend** - NestJS backend development
- **typescript-expert** - Advanced TypeScript patterns

## References

- [Nx Documentation](https://nx.dev)
- [Module Boundaries](https://nx.dev/features/enforce-module-boundaries)
- [Computation Caching](https://nx.dev/concepts/how-caching-works)
- [Affected Commands](https://nx.dev/features/run-tasks#run-tasks-on-projects-affected-by-a-pr)

---

**Human-in-the-Loop by codewizwit**

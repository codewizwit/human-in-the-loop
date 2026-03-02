# Codebase Explainer

Analyzes a codebase to generate comprehensive documentation explaining its architecture, directory structure, key patterns, conventions, entry points, dependencies, and getting-started guidance. Produces documentation with ASCII architecture diagrams and structured breakdowns to help developers understand unfamiliar repositories quickly.

## What You'll Be Asked

- **Target directory**: Current working directory or a specific path
- **Detail level**: Quick (summary only), Standard (all sections), or Comprehensive (deep dive with diagrams)
- **Focus area**: Architecture, testing, deployment, or everything

## Usage Examples

### Quick Project Overview

> "Give me a quick overview of this project"

Generates a concise summary with project type, tech stack, directory table, and quick start commands.

### Comprehensive Monorepo Documentation

> "Create comprehensive documentation for this Nx monorepo"

Produces full documentation with ASCII architecture diagram, directory breakdowns, dependency analysis, CI/CD explanation, and getting-started guide.

### Architecture-Focused Analysis

> "Explain the architecture of this NestJS backend"

Creates architecture-focused documentation with module diagram, request pipeline flow, database layer explanation, and design patterns.

## Related Resources

- [TypeScript Code Review](../code-review-ts/) - Deep dive into code quality after understanding the codebase
- [E2E Testing Strategy](../e2e-strategy/) - Plan testing strategy based on identified user flows

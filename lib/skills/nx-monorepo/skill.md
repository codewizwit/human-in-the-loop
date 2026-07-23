---
name: nx-monorepo
description: >-
  Applies Nx monorepo best practices including workspace organization, project
  boundaries, dependency constraints, caching, and task orchestration. Use when
  user asks to "set up Nx workspace", "configure module boundaries", "optimize
  monorepo builds", or mentions "Nx monorepo patterns".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion, EnterPlanMode
---

# Nx Monorepo Expert

Provides comprehensive guidance for building and maintaining Nx monorepos. Covers workspace structure, project boundaries, dependency constraints, computation caching, task orchestration, module federation, CI/CD optimization, custom generators, and dependency graph analysis.

## When to Activate

- User is reviewing Nx workspace configuration
- User is designing monorepo structure and project boundaries
- User is implementing module boundaries and dependency constraints
- User is optimizing build performance with caching
- User is setting up task orchestration and affected commands
- User is discussing library vs application architecture
- User is implementing module federation patterns
- User is optimizing CI/CD pipelines for monorepos

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>What type of Nx monorepo work are you doing?</question>
<options>

  <option value="setup">Setting up a new Nx workspace</option>
  <option value="structure">Organizing workspace structure and libraries</option>
  <option value="boundaries">Configuring module boundaries and dependency constraints</option>
  <option value="caching">Optimizing build caching and task orchestration</option>
  <option value="cicd">Setting up CI/CD for the monorepo</option>
  <option value="federation">Implementing module federation</option>
  <option value="review">Reviewing existing workspace configuration</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>What frameworks are used in the monorepo?</question>
<options>

  <option value="angular">Angular</option>
  <option value="react">React</option>
  <option value="nestjs">Angular + NestJS</option>
  <option value="multi">Multiple frameworks</option>
  <option value="other">Other</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>How many applications and libraries are in the workspace? Provide approximate numbers or type "new" for a new workspace.</question>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Discovery

1. Use Glob to find workspace configuration files (nx.json, project.json, workspace.json)
2. Use Read to examine the current workspace structure and configuration
3. Use Grep to identify existing project tags, dependency constraints, and caching configuration

### Step 3: Plan (if complex)

For large workspaces or significant restructuring, enter plan mode:

<EnterPlanMode>
<summary>
Outline the workspace changes, identify affected projects,
and confirm the approach with the user before implementation.
</summary>
</EnterPlanMode>

### Step 4: Apply Nx Patterns

Apply the appropriate patterns based on the user's needs. For detailed Nx patterns, see [context.md](context.md). For configuration templates, see [templates.md](templates.md).

### Step 5: Deliver Results

Provide configuration and code following Nx conventions with proper boundary enforcement, caching strategy, and CI optimization.

## Core Methodology

### Workspace Organization

- Separate `apps/` (deployable) from `libs/` (shared code)
- Group libraries by scope (`shared/`, `{app-name}/`) and type (`feature-*`, `data-access`, `ui`, `utils`)
- Follow unidirectional dependency flow: apps -> features -> data-access/ui -> utils

### Module Boundaries

- Tag every project with scope and type tags
- Enforce boundaries via `@nx/enforce-module-boundaries` ESLint rule
- Scope tags control cross-app access; type tags control architectural layering
- Never bypass boundary rules with ESLint disable comments

### Computation Caching

- Define cacheable operations in `nx.json` (build, test, lint, e2e)
- Configure `inputs` and `outputs` per target for accurate cache keys
- Use `dependsOn: ["^build"]` to ensure dependencies build first
- Enable Nx Cloud for remote caching shared across team and CI

### Task Orchestration

- Use `nx affected` in CI to only build/test what changed
- Use `nx run-many --parallel` for local development speed
- Use `nrwl/nx-set-shas` in GitHub Actions to determine the correct base SHA

### Library Architecture

- Create libraries when code is shared, represents a domain, or needs boundary enforcement
- Use buildable libraries for large projects (incremental builds, better caching)
- Use publishable libraries when npm distribution is needed
- Avoid over-segmentation; keep library count proportional to complexity

### CI/CD Optimization

- Use `nx affected` with `--parallel` for efficient CI runs
- Configure Nx Cloud distributed task execution for large workspaces
- Use selective deployment based on `nx print-affected`
- Cache `node_modules` and Nx cache in CI for faster pipeline execution

For detailed patterns including module federation, dependency graph analysis, and custom generators, see [context.md](context.md).

For complete configuration templates including ESLint rules, nx.json, project.json, CI/CD workflows, and generator code, see [templates.md](templates.md).

## Output Format

<output_format>
When providing Nx monorepo guidance, structure the output as follows:

**Workspace Configuration**
[nx.json, project.json, and tsconfig.base.json changes]

**Project Structure**
[Directory organization and library generation commands]

**Boundary Rules**
[ESLint configuration with module boundary constraints]

**CI/CD Configuration**
[GitHub Actions or other CI pipeline configuration]

**Task Commands**
[Nx CLI commands for building, testing, and deploying]
</output_format>

## Best Practices

- Maintain clear separation between apps and libs directories
- Use consistent naming conventions (scope:app, type:feature)
- Organize libraries by scope and type
- Enforce module boundaries with ESLint rules and project tags
- Enable computation caching for build, test, lint, and e2e targets
- Use affected commands in CI to only build and test changed projects
- Create buildable libraries for large projects with many dependencies
- Use parallel execution to speed up task orchestration
- Configure remote caching with Nx Cloud for team-wide cache sharing
- Create custom generators to codify architectural patterns

## Anti-Patterns

- Do not create too many small libraries (over-segmentation adds overhead)
- Do not ignore module boundaries by using relative path imports
- Do not skip affected commands in CI (running all tests wastes resources)
- Do not create circular dependencies between libraries
- Do not make all libraries buildable (simple utilities do not need separate builds)
- Do not use `latest` tags for action versions in CI pipelines
- Do not bypass boundary rules with ESLint disable comments

## Examples

### Example 1: New Workspace Setup

**Input**: "Set up an Nx workspace for an Angular frontend with NestJS API"

**Output**: Complete workspace structure with apps/web-app and apps/api, shared libraries for UI, data-access, and utils, project tags, module boundary rules, and GitHub Actions CI pipeline.

### Example 2: Adding Module Boundaries

**Input**: "Configure module boundaries so feature libraries cannot import from other features"

**Output**: ESLint configuration with depConstraints ensuring feature libs only depend on data-access, ui, and util libs. Project.json updates with appropriate scope and type tags.

### Example 3: CI/CD Pipeline Optimization

**Input**: "Our CI pipeline runs all tests on every PR even when only one lib changed"

**Output**: GitHub Actions workflow using nx affected with nrwl/nx-set-shas, parallel execution, and Nx Cloud remote caching configuration for faster builds.

## References

- [Nx Documentation](https://nx.dev)
- [Module Boundaries](https://nx.dev/core-features/enforce-module-boundaries)
- [Computation Caching](https://nx.dev/concepts/how-caching-works)
- [Affected Commands](https://nx.dev/concepts/affected)
- [Module Federation](https://nx.dev/recipes/module-federation)

---

**Human-in-the-Loop by codewizwit**

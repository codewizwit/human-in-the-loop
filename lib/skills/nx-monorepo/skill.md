---
name: nx-monorepo
description: >-
  Applies Nx monorepo best practices including workspace organization, project
  boundaries, dependency constraints, caching, and task orchestration. Use when
  user asks to "set up Nx workspace", "configure module boundaries", "optimize
  monorepo builds", or mentions "Nx monorepo patterns".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
  - EnterPlanMode
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

Apply the appropriate patterns from the reference sections below based on the user's needs.

### Step 5: Deliver Results

Provide configuration and code following Nx conventions with proper boundary enforcement, caching strategy, and CI optimization.

## Workspace Structure Best Practices

### Optimal Directory Organization

```
my-workspace/
├── apps/
│   ├── web-app/              # Main web application
│   ├── mobile-app/           # Mobile application
│   └── api/                  # Backend API
├── libs/
│   ├── shared/
│   │   ├── ui/               # Shared UI components
│   │   ├── data-access/      # Shared data access layer
│   │   └── utils/            # Shared utilities
│   ├── web-app/
│   │   ├── feature-home/     # Feature-specific modules
│   │   ├── feature-auth/
│   │   └── data-access/      # App-specific data access
│   └── api/
│       ├── feature-users/
│       └── data-access/
├── tools/                     # Custom workspace tools
├── nx.json                    # Nx configuration
├── package.json
└── tsconfig.base.json         # Base TypeScript config
```

**Naming Convention**:

- `apps/` - Deployable applications
- `libs/shared/` - Code shared across all apps
- `libs/{app-name}/` - App-specific libraries
- `libs/{app-name}/feature-*` - Feature modules
- `libs/{app-name}/data-access` - State management and API calls
- `libs/{app-name}/ui` - Presentational components
- `libs/{app-name}/utils` - Helper functions

## Project Boundaries and Dependency Constraints

### Enforce Module Boundaries

Configure in `.eslintrc.json`:

```json
{
  "overrides": [
    {
      "files": ["*.ts"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "scope:shared",
                "onlyDependOnLibsWithTags": ["scope:shared"]
              },
              {
                "sourceTag": "scope:web-app",
                "onlyDependOnLibsWithTags": ["scope:web-app", "scope:shared"]
              },
              {
                "sourceTag": "scope:api",
                "onlyDependOnLibsWithTags": ["scope:api", "scope:shared"]
              },
              {
                "sourceTag": "type:feature",
                "onlyDependOnLibsWithTags": [
                  "type:feature",
                  "type:ui",
                  "type:data-access",
                  "type:util"
                ]
              },
              {
                "sourceTag": "type:ui",
                "onlyDependOnLibsWithTags": ["type:ui", "type:util"]
              },
              {
                "sourceTag": "type:data-access",
                "onlyDependOnLibsWithTags": ["type:data-access", "type:util"]
              },
              {
                "sourceTag": "type:util",
                "onlyDependOnLibsWithTags": ["type:util"]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### Tagging Projects

In `project.json`:

```json
{
  "name": "web-app-feature-home",
  "tags": ["scope:web-app", "type:feature"]
}
```

**Dependency Flow**:

```
apps → feature libs → data-access/ui libs → util libs
```

## Build Caching and Computation Caching

### Enable Computation Caching

Configure in `nx.json`:

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "e2e"],
        "parallel": 3,
        "cacheDirectory": "node_modules/.cache/nx"
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "outputs": ["{workspaceRoot}/dist/{projectName}"]
    },
    "test": {
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],
      "outputs": ["{workspaceRoot}/coverage/{projectName}"]
    }
  }
}
```

**Cache Inputs**:

- `production` - Source files, configs, dependencies
- `default` - Includes test files
- `^production` - Production inputs of dependencies

### Remote Caching with Nx Cloud

```bash
npx nx connect-to-nx-cloud

export NX_CLOUD_ACCESS_TOKEN=your-token
```

**Benefits**:

- Share cache across team and CI
- Distributed task execution
- Build analytics and insights
- Faster CI pipelines

## Task Orchestration

### Run Tasks Efficiently

```bash
nx build web-app

nx run-many --target=build --all

nx affected --target=build

nx run-many --target=lint,test,build --all

nx run-many --target=test --all --parallel=5

nx build web-app --skip-nx-cache
```

### Affected Command Optimization

```bash
nx affected --target=test --base=main

nx affected --target=build --base=origin/main --head=HEAD

nx affected:graph

nx print-affected --target=build --select=projects
```

**CI Pipeline Usage**:

```yaml
- name: Test affected
  run: npx nx affected --target=test --base=origin/main --head=HEAD --parallel=3
```

## Library vs Application Architecture

### When to Create a Library

**Create a library when:**

- Code is shared across multiple apps
- Code represents a distinct domain or feature
- You want to enforce boundaries and prevent circular dependencies
- Code should be independently testable and publishable

**Do not create a library when:**

- Code is only used in one place
- Overhead of library structure is not worth it
- Code is experimental or temporary

### Generating Libraries

```bash
nx g @nx/angular:library feature-home \
  --directory=libs/web-app/feature-home \
  --tags=scope:web-app,type:feature \
  --routing

nx g @nx/angular:library data-access \
  --directory=libs/shared/data-access \
  --tags=scope:shared,type:data-access

nx g @nx/angular:library ui \
  --directory=libs/shared/ui \
  --tags=scope:shared,type:ui \
  --buildable

nx g @nx/js:library utils \
  --directory=libs/shared/utils \
  --tags=scope:shared,type:util \
  --publishable \
  --importPath=@my-org/utils
```

**Library Types**:

- **Buildable** (`--buildable`) - Can be built independently, faster incremental builds
- **Publishable** (`--publishable`) - Can be published to npm, includes package.json
- **Routing** (`--routing`) - Includes routing configuration for lazy loading

### Buildable Libraries for Better Performance

```json
{
  "name": "shared-ui",
  "targets": {
    "build": {
      "executor": "@nx/angular:ng-packagr-lite",
      "outputs": ["{workspaceRoot}/dist/libs/shared/ui"],
      "options": {
        "project": "libs/shared/ui/ng-package.json"
      }
    }
  }
}
```

**Benefits**:

- Incremental builds - only rebuild changed libraries
- Better caching granularity
- Can be published independently
- Faster CI pipelines

## Module Federation Patterns

### Host and Remote Configuration

**Host Application** (`apps/shell/module-federation.config.js`):

```javascript
module.exports = {
  name: 'shell',
  remotes: ['home', 'about', 'dashboard'],
};
```

**Remote Application** (`apps/home/module-federation.config.js`):

```javascript
module.exports = {
  name: 'home',
  exposes: {
    './Module': 'apps/home/src/app/remote-entry/entry.module.ts',
  },
};
```

### Lazy Loading Remote Modules

```typescript
import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';

export const appRoutes: Route[] = [
  {
    path: 'home',
    loadChildren: () =>
      loadRemoteModule('home', './Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      loadRemoteModule('dashboard', './Module').then(
        (m) => m.RemoteEntryModule
      ),
  },
];
```

### Shared Dependencies

```javascript
module.exports = {
  name: 'home',
  exposes: {
    './Module': 'apps/home/src/app/remote-entry/entry.module.ts',
  },
  shared: (libraryName, defaultConfig) => {
    if (libraryName === '@angular/core') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
        requiredVersion: defaultConfig.requiredVersion,
      };
    }
    return defaultConfig;
  },
};
```

**Shared Library Best Practices**:

- Share framework dependencies (`@angular/core`, `react`, `vue`)
- Use `singleton: true` for frameworks
- Share common libraries to reduce bundle size
- Do not share libraries that change frequently
- Do not over-share as it increases coordination overhead

## CI/CD Optimization for Monorepos

### GitHub Actions with Nx

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Set SHAs for Nx
        uses: nrwl/nx-set-shas@v3

      - name: Lint affected
        run: npx nx affected --target=lint --parallel=3

      - name: Test affected
        run: npx nx affected --target=test --parallel=3 --ci --code-coverage

      - name: Build affected
        run: npx nx affected --target=build --parallel=3

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./coverage
```

### Distributed Task Execution with Nx Cloud

```yaml
- name: Distributed task execution
  run: |
    npx nx affected --target=test --parallel=3 \
      --configuration=ci \
      --distributed
```

**Benefits**:

- Split tasks across multiple agents
- Dramatically faster CI times
- Automatic task distribution
- Remote caching shared across agents

### Selective Deployment

```yaml
- name: Deploy affected apps
  run: |
    AFFECTED=$(npx nx print-affected --target=build --select=projects | tr ',' '\n')
    for app in $AFFECTED; do
      if [[ $app == *"web-app"* ]]; then
        echo "Deploying $app to production"
        npx nx deploy $app --configuration=production
      fi
    done
```

## Dependency Graph Visualization

### View Project Dependencies

```bash
nx graph

nx graph --focus=web-app

nx affected:graph

nx graph --file=output.json
```

### Analyze Circular Dependencies

```bash
nx graph --affected --with-deps

nx lint --fix
```

**Circular Dependency Prevention**:

- Use `@nx/enforce-module-boundaries` ESLint rule
- Define clear dependency constraints with tags
- Follow unidirectional dependency flow
- Use events or shared services to break cycles

## Nx Generators for Consistency

### Create Custom Generators

```bash
nx g @nx/plugin:generator my-generator --project=tools
```

**Example Custom Generator** (`tools/generators/feature/index.ts`):

```typescript
import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';

export interface FeatureGeneratorSchema {
  name: string;
  app: string;
}

export default async function (tree: Tree, options: FeatureGeneratorSchema) {
  const projectRoot = `libs/${options.app}/feature-${options.name}`;

  generateFiles(tree, joinPathFragments(__dirname, 'files'), projectRoot, {
    ...options,
    tmpl: '',
  });

  await formatFiles(tree);
}
```

**Usage**:

```bash
nx g @my-org/tools:feature my-feature --app=web-app
```

**Benefits**:

- Enforce consistent project structure
- Automate boilerplate code generation
- Codify architectural patterns
- Reduce human error

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

---

**Human-in-the-Loop by codewizwit**

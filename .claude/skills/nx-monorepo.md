---
name: nx-monorepo-expert
description: Apply Nx monorepo best practices including workspace organization, project boundaries, dependency constraints, computation caching, task orchestration, and module federation when building or reviewing Nx-based projects.
---

# Nx Monorepo Expert Skill

Use this skill when working with Nx monorepos, designing workspace structure, reviewing build configurations, or discussing monorepo patterns.

## When to Activate This Skill

Activate automatically when:

- Reviewing Nx workspace configuration
- Designing monorepo structure and project boundaries
- Implementing module boundaries and dependency constraints
- Optimizing build performance with caching
- Setting up task orchestration and affected commands
- Discussing library vs application architecture
- Implementing module federation patterns
- Optimizing CI/CD pipelines for monorepos

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
# Connect to Nx Cloud
npx nx connect-to-nx-cloud

# Set access token
export NX_CLOUD_ACCESS_TOKEN=your-token
```

**Benefits**:

- ✅ Share cache across team and CI
- ✅ Distributed task execution
- ✅ Build analytics and insights
- ✅ Faster CI pipelines

## Task Orchestration

### Run Tasks Efficiently

```bash
# Run task for single project
nx build web-app

# Run task for all projects
nx run-many --target=build --all

# Run task for affected projects only
nx affected --target=build

# Run multiple tasks in sequence
nx run-many --target=lint,test,build --all

# Parallel execution (default: 3)
nx run-many --target=test --all --parallel=5

# Skip cache
nx build web-app --skip-nx-cache
```

### Affected Command Optimization

```bash
# Test only affected projects
nx affected --target=test --base=main

# Build affected projects for deployment
nx affected --target=build --base=origin/main --head=HEAD

# See what's affected (dry run)
nx affected:graph

# Print affected project names
nx print-affected --target=build --select=projects
```

**CI Pipeline Usage**:

```yaml
# .github/workflows/ci.yml
- name: Test affected
  run: npx nx affected --target=test --base=origin/main --head=HEAD --parallel=3
```

## Library vs Application Architecture

### When to Create a Library

**✅ Create a library when:**

- Code is shared across multiple apps
- Code represents a distinct domain or feature
- You want to enforce boundaries and prevent circular dependencies
- Code should be independently testable and publishable

**❌ Don't create a library when:**

- Code is only used in one place
- Overhead of library structure isn't worth it
- Code is experimental or temporary

### Generating Libraries

```bash
# Feature library (Angular example)
nx g @nx/angular:library feature-home \
  --directory=libs/web-app/feature-home \
  --tags=scope:web-app,type:feature \
  --routing

# Data access library
nx g @nx/angular:library data-access \
  --directory=libs/shared/data-access \
  --tags=scope:shared,type:data-access

# UI component library
nx g @nx/angular:library ui \
  --directory=libs/shared/ui \
  --tags=scope:shared,type:ui \
  --buildable

# Utility library (TypeScript)
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
// libs/shared/ui/project.json
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

- ✅ Incremental builds - only rebuild changed libraries
- ✅ Better caching granularity
- ✅ Can be published independently
- ✅ Faster CI pipelines

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
// apps/shell/src/app/app.routes.ts
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
// module-federation.config.js
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

- ✅ Share framework dependencies (`@angular/core`, `react`, `vue`)
- ✅ Use `singleton: true` for frameworks
- ✅ Share common libraries to reduce bundle size
- ❌ Don't share libraries that change frequently
- ❌ Don't over-share - increases coordination overhead

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

- ✅ Split tasks across multiple agents
- ✅ Dramatically faster CI times
- ✅ Automatic task distribution
- ✅ Remote caching shared across agents

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
# Interactive dependency graph
nx graph

# Focus on specific project
nx graph --focus=web-app

# Show affected projects
nx affected:graph

# Export as JSON
nx graph --file=output.json
```

### Analyze Circular Dependencies

```bash
# Check for circular dependencies
nx graph --affected --with-deps

# Lint for circular dependencies
nx lint --fix
```

**Circular Dependency Prevention**:

- ✅ Use `@nx/enforce-module-boundaries` ESLint rule
- ✅ Define clear dependency constraints with tags
- ✅ Follow unidirectional dependency flow
- ✅ Use events or shared services to break cycles

## Nx Generators for Consistency

### Create Custom Generators

```bash
# Generate a new generator
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

- ✅ Enforce consistent project structure
- ✅ Automate boilerplate code generation
- ✅ Codify architectural patterns
- ✅ Reduce human error

## Best Practices Checklist

When reviewing or working with Nx monorepos, ensure:

### Workspace Organization

- ✅ Clear separation between apps and libs
- ✅ Consistent naming convention (scope:app, type:feature)
- ✅ Libraries organized by scope and type
- ✅ Shared libraries in `libs/shared/`
- ✅ App-specific libraries in `libs/{app-name}/`

### Dependency Management

- ✅ Module boundaries enforced with ESLint
- ✅ Tags applied to all projects
- ✅ Dependency constraints defined
- ✅ No circular dependencies
- ✅ Unidirectional dependency flow

### Performance

- ✅ Computation caching enabled
- ✅ Remote caching with Nx Cloud
- ✅ Buildable libraries for large projects
- ✅ Parallel execution in CI
- ✅ Affected commands for incremental builds

### CI/CD

- ✅ Only test/build/deploy affected projects
- ✅ Distributed task execution enabled
- ✅ Remote cache shared across CI agents
- ✅ Selective deployment based on affected apps
- ✅ Code coverage tracked per project

### Module Federation

- ✅ Clear host/remote separation
- ✅ Shared dependencies configured
- ✅ Singleton for framework dependencies
- ✅ Lazy loading for remote modules
- ✅ Version compatibility ensured

## Common Anti-Patterns to Avoid

❌ **Don't create too many small libraries**

```
// BAD - Over-segmented
libs/web-app/feature-home/component-header/
libs/web-app/feature-home/component-footer/
libs/web-app/feature-home/service-home/

// GOOD - Cohesive feature module
libs/web-app/feature-home/
```

❌ **Don't ignore module boundaries**

```typescript
// BAD - Direct import bypasses boundaries
import { UserService } from '../../../api/feature-users/src/lib/user.service';

// GOOD - Use barrel exports with enforced boundaries
import { UserService } from '@my-org/api/feature-users';
```

❌ **Don't skip affected commands in CI**

```yaml
# BAD - Always run all tests
- run: nx run-many --target=test --all

# GOOD - Only test affected
- run: nx affected --target=test --base=origin/main
```

❌ **Don't create circular dependencies**

```
// BAD - Circular dependency
libs/web-app/feature-home → libs/web-app/feature-auth
libs/web-app/feature-auth → libs/web-app/feature-home

// GOOD - Extract shared code
libs/web-app/feature-home → libs/shared/ui
libs/web-app/feature-auth → libs/shared/ui
```

❌ **Don't make all libraries buildable**

```json
// BAD - Buildable library for simple utilities
{
  "name": "shared-utils",
  "targets": {
    "build": { ... }  // Unnecessary overhead
  }
}

// GOOD - Only make libraries buildable when needed
// Simple utility libraries don't need separate builds
```

## Related Skills

- **Angular Expert** - For Angular-specific Nx patterns
- **NestJS Expert** - For NestJS backend monorepo structure
- **CI/CD Pipelines** - For optimizing Nx in continuous integration
- **TypeScript Expert** - For shared library development
- **Testing Automation** - For comprehensive test strategies in monorepos

## References

- [Nx Official Documentation](https://nx.dev)
- [Module Boundaries](https://nx.dev/core-features/enforce-module-boundaries)
- [Module Federation](https://nx.dev/concepts/module-federation)
- [Nx Cloud](https://nx.app)

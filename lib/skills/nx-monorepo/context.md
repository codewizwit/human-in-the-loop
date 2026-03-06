# Nx Monorepo - Detailed Patterns and Conventions

This file contains detailed workspace patterns, boundary enforcement, caching strategies, and architectural guidance for Nx monorepos. Referenced from [skill.md](skill.md).

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

### Naming Conventions

- `apps/` - Deployable applications
- `libs/shared/` - Code shared across all apps
- `libs/{app-name}/` - App-specific libraries
- `libs/{app-name}/feature-*` - Feature modules
- `libs/{app-name}/data-access` - State management and API calls
- `libs/{app-name}/ui` - Presentational components
- `libs/{app-name}/utils` - Helper functions

## Project Boundaries and Dependency Constraints

### Enforce Module Boundaries

Use the `@nx/enforce-module-boundaries` ESLint rule to prevent unauthorized imports between projects. Configure dependency constraints using project tags that define scope (which app owns the code) and type (what kind of library it is).

**Dependency Flow**:

```
apps → feature libs → data-access/ui libs → util libs
```

### Tagging Strategy

Projects receive two categories of tags:

- **Scope tags** (`scope:shared`, `scope:web-app`, `scope:api`) - Define which application owns the library
- **Type tags** (`type:feature`, `type:ui`, `type:data-access`, `type:util`) - Define the library's role in the architecture

**Constraint Rules**:

- `scope:shared` libraries can only depend on other `scope:shared` libraries
- App-scoped libraries (`scope:web-app`, `scope:api`) can depend on their own scope and `scope:shared`
- `type:feature` can depend on `type:feature`, `type:ui`, `type:data-access`, and `type:util`
- `type:ui` can depend on `type:ui` and `type:util`
- `type:data-access` can depend on `type:data-access` and `type:util`
- `type:util` can only depend on other `type:util` libraries

For complete ESLint and project.json configuration examples, see [templates.md](templates.md).

## Build Caching and Computation Caching

### Cache Configuration

Nx caches the results of cacheable operations (build, test, lint, e2e) so repeated runs with the same inputs skip execution and replay stored outputs.

**Cache Inputs**:

- `production` - Source files, configs, dependencies
- `default` - Includes test files
- `^production` - Production inputs of dependencies

### Target Defaults

Configure `targetDefaults` in `nx.json` to define:

- `dependsOn` - Which tasks must run first (e.g., `^build` means build dependencies first)
- `inputs` - Which files affect the cache key
- `outputs` - Where the task writes its results

For the complete `nx.json` caching configuration template, see [templates.md](templates.md).

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

### Library Types

- **Buildable** (`--buildable`) - Can be built independently, faster incremental builds
- **Publishable** (`--publishable`) - Can be published to npm, includes package.json
- **Routing** (`--routing`) - Includes routing configuration for lazy loading

### Library Generation Commands

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

### Buildable Library Benefits

- Incremental builds - only rebuild changed libraries
- Better caching granularity
- Can be published independently
- Faster CI pipelines

## Module Federation Patterns

### Host and Remote Configuration

Module federation allows splitting a monolithic frontend into independently deployable micro-frontends. The host application loads remote modules at runtime.

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

## Dependency Graph Visualization

### View Project Dependencies

```bash
nx graph

nx graph --focus=web-app

nx affected:graph

nx graph --file=output.json
```

### Circular Dependency Prevention

- Use `@nx/enforce-module-boundaries` ESLint rule
- Define clear dependency constraints with tags
- Follow unidirectional dependency flow
- Use events or shared services to break cycles

```bash
nx graph --affected --with-deps

nx lint --fix
```

## Nx Generators for Consistency

### Custom Generator Overview

Custom generators codify architectural patterns and enforce consistent project structure across the workspace.

```bash
nx g @nx/plugin:generator my-generator --project=tools
```

**Benefits**:

- Enforce consistent project structure
- Automate boilerplate code generation
- Codify architectural patterns
- Reduce human error

For the complete custom generator code template, see [templates.md](templates.md).

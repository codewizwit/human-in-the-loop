# Nx Monorepo - Configuration Templates and Code Examples

This file contains complete configuration templates, scaffolding examples, and reference code blocks for Nx monorepo development. Referenced from [skill.md](skill.md).

## Module Boundary ESLint Configuration

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

## Project Tag Configuration

In `project.json`:

```json
{
  "name": "web-app-feature-home",
  "tags": ["scope:web-app", "type:feature"]
}
```

## Computation Caching Configuration

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

## Buildable Library Configuration

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

## GitHub Actions CI Pipeline

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

## Distributed Task Execution with Nx Cloud

```yaml
- name: Distributed task execution
  run: |
    npx nx affected --target=test --parallel=3 \
      --configuration=ci \
      --distributed
```

## Selective Deployment Script

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

## CI Affected Commands

```yaml
- name: Test affected
  run: npx nx affected --target=test --base=origin/main --head=HEAD --parallel=3
```

## Custom Generator Template

Generator file at `tools/generators/feature/index.ts`:

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

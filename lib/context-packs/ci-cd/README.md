# CI/CD Context Pack

Cross-cutting CI/CD patterns for GitHub Actions, deployment strategies, and pipeline optimization.

## Overview

This context pack provides comprehensive guidance for building robust CI/CD pipelines. It covers GitHub Actions workflows, deployment strategies, caching, secrets management, and pipeline optimization.

## What's Included

- **GitHub Actions Patterns** - Workflows, reusable actions, matrix builds
- **Deployment Strategies** - Blue-green, canary, rolling deployments
- **Caching Strategies** - Dependency caching, build artifact caching
- **Secrets Management** - Secure handling of credentials and tokens
- **Pipeline Optimization** - Parallelization, conditional execution, cost reduction
- **Monorepo CI/CD** - Affected-based builds, selective testing

## Installation

```bash
hit install context/ci-cd
```

## Key Patterns

### GitHub Actions Workflow Structure

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

### Reusable Workflows

```yaml
# .github/workflows/reusable-test.yml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '20'
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci
      - run: npm test
```

```yaml
# Calling the reusable workflow
jobs:
  call-tests:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '20'
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Dependency Caching

```yaml
# pnpm caching
- uses: pnpm/action-setup@v2
  with:
    version: 8

- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'

# Custom caching for other tools
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/pip
      ~/.local/share/virtualenvs
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

### Matrix Builds

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
        exclude:
          - os: windows-latest
            node: 18
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npm test
```

### Conditional Execution

```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Skip if only docs changed
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            src:
              - 'src/**'
              - 'package.json'

      - name: Deploy
        if: steps.changes.outputs.src == 'true'
        run: ./deploy.sh
```

### Secrets Management

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      # Use environment secrets
      - name: Deploy to AWS
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync ./dist s3://${{ vars.S3_BUCKET }}

      # Or use OIDC for AWS (preferred)
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
          aws-region: us-east-1
```

## Deployment Strategies

### Blue-Green Deployment

```yaml
name: Blue-Green Deploy

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to green environment
        run: |
          aws ecs update-service \
            --cluster production \
            --service app-green \
            --task-definition app:${{ github.sha }}

      - name: Health check green
        run: |
          for i in {1..30}; do
            if curl -s https://green.example.com/health | grep -q "ok"; then
              echo "Green is healthy"
              exit 0
            fi
            sleep 10
          done
          exit 1

      - name: Switch traffic to green
        run: |
          aws elbv2 modify-listener \
            --listener-arn ${{ secrets.ALB_LISTENER_ARN }} \
            --default-actions Type=forward,TargetGroupArn=${{ secrets.GREEN_TG_ARN }}

      - name: Verify production
        run: curl -s https://example.com/health

      - name: Update blue for next deploy
        if: success()
        run: |
          aws ecs update-service \
            --cluster production \
            --service app-blue \
            --task-definition app:${{ github.sha }}
```

### Canary Deployment

```yaml
name: Canary Deploy

jobs:
  canary:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy canary (10% traffic)
        run: |
          aws ecs update-service \
            --cluster production \
            --service app-canary \
            --task-definition app:${{ github.sha }}

      - name: Monitor canary metrics
        run: |
          sleep 300  # 5 minutes observation
          ERROR_RATE=$(aws cloudwatch get-metric-statistics \
            --namespace AWS/ApplicationELB \
            --metric-name HTTPCode_Target_5XX_Count \
            --dimensions Name=TargetGroup,Value=canary-tg \
            --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ) \
            --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
            --period 300 \
            --statistics Sum \
            --query 'Datapoints[0].Sum')

          if [ "$ERROR_RATE" -gt 10 ]; then
            echo "Canary failed - rolling back"
            exit 1
          fi

      - name: Promote to full deployment
        if: success()
        run: |
          aws ecs update-service \
            --cluster production \
            --service app-primary \
            --task-definition app:${{ github.sha }}
```

### Rolling Deployment

```yaml
name: Rolling Deploy

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure rolling update
        run: |
          aws ecs update-service \
            --cluster production \
            --service app \
            --task-definition app:${{ github.sha }} \
            --deployment-configuration \
              minimumHealthyPercent=50,maximumPercent=200

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster production \
            --services app
```

## Monorepo CI/CD

### Nx Affected Builds

```yaml
name: Monorepo CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  affected:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: nrwl/nx-set-shas@v4

      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Run affected tests
        run: pnpm nx affected -t test --parallel=3

      - name: Run affected builds
        run: pnpm nx affected -t build --parallel=3

      - name: Run affected lint
        run: pnpm nx affected -t lint --parallel=3
```

### Path-Based Filtering

```yaml
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.filter.outputs.frontend }}
      backend: ${{ steps.filter.outputs.backend }}
      shared: ${{ steps.filter.outputs.shared }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            frontend:
              - 'apps/frontend/**'
              - 'libs/ui/**'
            backend:
              - 'apps/api/**'
              - 'libs/data-access/**'
            shared:
              - 'libs/shared/**'
              - 'package.json'

  frontend:
    needs: changes
    if: needs.changes.outputs.frontend == 'true' || needs.changes.outputs.shared == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm nx build frontend

  backend:
    needs: changes
    if: needs.changes.outputs.backend == 'true' || needs.changes.outputs.shared == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm nx build api
```

## Pipeline Optimization

### Parallelization

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm test:unit

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm test:e2e

  # Only deploy if all checks pass
  deploy:
    needs: [lint, typecheck, unit-tests, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Artifact Sharing

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm build

      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 1

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - run: ./deploy.sh
```

### Job Timeouts

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - run: pnpm test

  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - run: pnpm test:e2e
```

## Best Practices

### Do's

- ✅ Use `actions/checkout@v4` with `fetch-depth: 0` for history-dependent operations
- ✅ Pin action versions to specific tags (`@v4`) not branches (`@main`)
- ✅ Use `concurrency` to cancel redundant runs
- ✅ Cache dependencies aggressively (pnpm, pip, maven)
- ✅ Use `--frozen-lockfile` or equivalent for reproducible installs
- ✅ Use OIDC for cloud provider authentication (no long-lived secrets)
- ✅ Set appropriate timeouts on jobs
- ✅ Use environments for deployment approvals
- ✅ Run jobs in parallel when independent

### Don'ts

- ❌ Don't commit secrets to workflows (use GitHub Secrets)
- ❌ Don't use `pull_request_target` without careful security review
- ❌ Don't skip `--frozen-lockfile` in CI
- ❌ Don't run all tests on every change (use affected/path filtering)
- ❌ Don't use self-hosted runners without security hardening
- ❌ Don't ignore failing tests (fix or remove them)
- ❌ Don't use `continue-on-error: true` without good reason

## Security Considerations

### Branch Protection

```yaml
# Require status checks before merging
jobs:
  required-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

### Dependency Scanning

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Run npm audit
        run: npm audit --audit-level=high
```

### OIDC Authentication (Preferred)

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
          aws-region: us-east-1

      - run: aws s3 ls # No long-lived credentials needed
```

## Related Resources

- [Pipeline Optimization Prompt](../../prompts/ci-cd/pipeline-optimization) - Analyze and optimize existing pipelines
- [E2E Strategy Prompt](../../prompts/testing/e2e-strategy) - E2E testing in CI/CD
- [Nx Monorepo Skill](../../skills/nx-monorepo) - Monorepo-specific patterns

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
- [OIDC for Cloud Providers](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

---

**Human-in-the-Loop by codewizwit**

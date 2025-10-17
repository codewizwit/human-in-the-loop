#!/bin/bash

# Human-in-the-Loop: Scaffold Remaining High Priority Items
# Skips api-design (already done)

set -e

echo "🚀 Scaffolding remaining high-priority items..."
echo ""

# Testing
echo "🧪 Scaffolding Testing Templates..."

git checkout main
git checkout -b feature/e2e-strategy
mkdir -p lib/prompts/testing
cat > lib/prompts/testing/generate-e2e-strategy.md << 'EOF'
# E2E Strategy Generator

## Overview
Generates comprehensive E2E testing strategy using Playwright or Cypress.

## Variables
- `framework`: Playwright or Cypress
- `app_type`: Web app, SPA, SSR, etc.
- `critical_flows`: List of critical user flows

## Template
Coming soon...

## Examples
Coming soon...

## Metadata
- Author: TBD
- Version: 1.0.0
- License: MIT
EOF
git add .
git commit -m "feat: add e2e-strategy template"
git push origin feature/e2e-strategy
gh pr create --base main --title "Add E2E Strategy Generator Prompt" --body "Adds initial draft for E2E testing strategy generator"

git checkout main
git checkout -b feature/unit-test-generator
cat > lib/prompts/testing/generate-unit-tests.md << 'EOF'
# Unit Test Generator

## Overview
Auto-generates unit tests for TypeScript/Angular code with comprehensive coverage.

## Variables
- `code_input`: Code to generate tests for
- `framework`: Jest or Jasmine
- `test_type`: Unit, integration, or component

## Template
Coming soon...

## Examples
Coming soon...

## Metadata
- Author: TBD
- Version: 1.0.0
- License: MIT
EOF
git add .
git commit -m "feat: add unit-test-generator template"
git push origin feature/unit-test-generator
gh pr create --base main --title "Add Unit Test Generator Prompt" --body "Adds initial draft for unit test generator"

echo ""
echo "✅ Testing templates scaffolded!"
echo ""

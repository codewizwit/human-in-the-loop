#!/bin/bash

# Human-in-the-Loop: High Priority Scaffolding Script
# This script creates feature branches, stub files, commits, and draft PRs
# for all high-priority items identified in the roadmap.

set -e

echo "🚀 Starting high-priority scaffolding for Human-in-the-Loop..."
echo ""

# Architecture
echo "📐 Scaffolding Architecture Templates..."

git checkout main
git checkout -b feature/system-design-review
mkdir -p toolkit/prompts/architecture
cat > toolkit/prompts/architecture/system-design-review.md << 'EOF'
# System Design Review Prompt

## Overview
Validates architectural decisions against best practices, scalability concerns, and maintainability.

## Variables
- `system_description`: Description of the system to review
- `requirements`: Functional and non-functional requirements
- `constraints`: Technical, budget, or timeline constraints

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
git commit -m "feat: add system-design-review template"
git push origin feature/system-design-review
gh pr create --base main --title "Add System Design Review Prompt" --body "Adds initial draft for system design review prompt template"

git checkout main
git checkout -b feature/api-design
cat > toolkit/prompts/architecture/api-design.md << 'EOF'
# API Design Pattern Prompt

## Overview
Provides REST/GraphQL API design guidance following industry best practices.

## Variables
- `api_type`: REST, GraphQL, or gRPC
- `endpoints`: List of endpoints to design
- `requirements`: Business and technical requirements

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
git commit -m "feat: add api-design template"
git push origin feature/api-design
gh pr create --base main --title "Add API Design Pattern Prompt" --body "Adds initial draft for API design pattern prompt"

# Testing
echo "🧪 Scaffolding Testing Templates..."

git checkout main
git checkout -b feature/e2e-strategy
mkdir -p toolkit/prompts/testing
cat > toolkit/prompts/testing/generate-e2e-strategy.md << 'EOF'
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
cat > toolkit/prompts/testing/generate-unit-tests.md << 'EOF'
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

# CI/CD
echo "⚙️  Scaffolding CI/CD Templates..."

git checkout main
git checkout -b feature/pipeline-optimization
mkdir -p toolkit/prompts/ci-cd
cat > toolkit/prompts/ci-cd/pipeline-optimization.md << 'EOF'
# Pipeline Optimization Prompt

## Overview
Analyzes and optimizes GitHub Actions workflows for speed and cost.

## Variables
- `workflow_yaml`: GitHub Actions workflow YAML
- `goals`: Speed, cost, reliability, etc.
- `constraints`: Budget, resources, timeline

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
git commit -m "feat: add pipeline-optimization template"
git push origin feature/pipeline-optimization
gh pr create --base main --title "Add Pipeline Optimization Prompt" --body "Adds initial draft for GitHub Actions pipeline optimization"

git checkout main
git checkout -b feature/aws-deployment
cat > toolkit/prompts/ci-cd/aws-deployment-strategy.md << 'EOF'
# AWS Deployment Strategy

## Overview
Designs AWS deployment strategy aligned with application requirements.

## Variables
- `app_type`: Web app, API, microservices, etc.
- `scale_requirements`: Expected load and growth
- `budget`: Monthly AWS budget

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
git commit -m "feat: add aws-deployment-strategy template"
git push origin feature/aws-deployment
gh pr create --base main --title "Add AWS Deployment Strategy Prompt" --body "Adds initial draft for AWS deployment strategy prompt"

git checkout main
git checkout -b feature/ci-cd-context-pack
mkdir -p toolkit/context-packs/ci-cd
cat > toolkit/context-packs/ci-cd/README.md << 'EOF'
# CI/CD Context Pack

## Overview
Comprehensive CI/CD patterns, pipeline templates, and deployment strategies.

## Contents
- GitHub Actions best practices
- AWS deployment patterns
- Docker containerization strategies
- Monitoring and alerting setups
- Examples from real projects

## Usage
Coming soon...
EOF
git add .
git commit -m "feat: add ci-cd context pack"
git push origin feature/ci-cd-context-pack
gh pr create --base main --title "Add CI/CD Context Pack" --body "Adds initial draft for CI/CD context pack with patterns and examples"

# Planning
echo "📋 Scaffolding Planning Templates..."

git checkout main
git checkout -b feature/user-story-breakdown
mkdir -p toolkit/prompts/planning
cat > toolkit/prompts/planning/user-story-breakdown.md << 'EOF'
# User Story Breakdown

## Overview
Breaks epics into actionable, testable user stories.

## Variables
- `epic_description`: Epic description and goals
- `acceptance_criteria`: High-level acceptance criteria
- `constraints`: Technical or business constraints

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
git commit -m "feat: add user-story-breakdown template"
git push origin feature/user-story-breakdown
gh pr create --base main --title "Add User Story Breakdown Prompt" --body "Adds initial draft for user story breakdown from epics"

# Documentation
echo "📝 Scaffolding Documentation Templates..."

git checkout main
git checkout -b feature/api-documentation
mkdir -p toolkit/prompts/documentation
cat > toolkit/prompts/documentation/api-documentation.md << 'EOF'
# API Documentation Generator

## Overview
Auto-generates comprehensive API documentation from code.

## Variables
- `code_input`: Source code (controllers, routes, etc.)
- `api_type`: REST, GraphQL, gRPC
- `format`: Markdown, OpenAPI, Swagger

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
git commit -m "feat: add api-documentation template"
git push origin feature/api-documentation
gh pr create --base main --title "Add API Documentation Generator" --body "Adds initial draft for API documentation generator"

# Governance
echo "🛡️  Scaffolding Governance Templates..."

git checkout main
git checkout -b feature/responsible-ai-audit
mkdir -p toolkit/prompts/governance
cat > toolkit/prompts/governance/responsible-ai-audit.md << 'EOF'
# Responsible AI Audit Prompt

## Overview
Audits AI outputs for quality, bias, safety, and alignment with responsible AI principles.

## Variables
- `ai_output`: AI-generated content to audit
- `use_case`: Context and intended use
- `risk_level`: Low, medium, high

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
git commit -m "feat: add responsible-ai-audit template"
git push origin feature/responsible-ai-audit
gh pr create --base main --title "Add Responsible AI Audit Prompt" --body "Adds initial draft for responsible AI audit prompt"

git checkout main
git checkout -b feature/bias-detection
cat > toolkit/prompts/governance/bias-detection.md << 'EOF'
# Bias Detection Prompt

## Overview
Analyzes AI outputs for potential bias across protected characteristics.

## Variables
- `content`: Content to analyze
- `context`: Usage context
- `protected_characteristics`: Gender, race, age, etc.

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
git commit -m "feat: add bias-detection template"
git push origin feature/bias-detection
gh pr create --base main --title "Add Bias Detection Prompt" --body "Adds initial draft for bias detection prompt"

git checkout main
git checkout -b feature/security-review
cat > toolkit/prompts/governance/security-review.md << 'EOF'
# Security Review Prompt

## Overview
Reviews AI-generated code for security vulnerabilities and best practices.

## Variables
- `code_input`: Code to review
- `language`: Programming language
- `framework`: Framework (Angular, NestJS, etc.)

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
git commit -m "feat: add security-review template"
git push origin feature/security-review
gh pr create --base main --title "Add Security Review Prompt" --body "Adds initial draft for security review prompt"

# Evaluators
echo "✅ Scaffolding Evaluators..."

git checkout main
git checkout -b feature/code-quality-evaluator
cat > toolkit/evaluators/code-quality-evaluator.yaml << 'EOF'
id: code-quality-evaluator
name: Code Quality Evaluator
version: 1.0.0
description: Validates code quality metrics for AI-generated code

criteria:
  - complexity
  - maintainability
  - test_coverage
  - documentation

thresholds:
  complexity_max: 10
  coverage_min: 80
  documentation_required: true

rules:
  - name: cyclomatic_complexity
    description: Maximum cyclomatic complexity per function
    threshold: 10
  - name: test_coverage
    description: Minimum test coverage percentage
    threshold: 80
EOF
git add .
git commit -m "feat: add code-quality-evaluator"
git push origin feature/code-quality-evaluator
gh pr create --base main --title "Add Code Quality Evaluator" --body "Adds initial draft for code quality evaluator YAML"

git checkout main
git checkout -b feature/security-evaluator
cat > toolkit/evaluators/security-evaluator.yaml << 'EOF'
id: security-evaluator
name: Security Evaluator
version: 1.0.0
description: Validates security best practices in AI-generated code

criteria:
  - secrets_detection
  - sql_injection
  - xss
  - authentication
  - authorization

rules:
  - name: no_hardcoded_secrets
    description: No hardcoded secrets or credentials
    severity: critical
  - name: validate_inputs
    description: All inputs must be validated and sanitized
    severity: high
  - name: sanitize_outputs
    description: All outputs must be sanitized to prevent XSS
    severity: high
EOF
git add .
git commit -m "feat: add security-evaluator"
git push origin feature/security-evaluator
gh pr create --base main --title "Add Security Evaluator" --body "Adds initial draft for security evaluator YAML"

# Context Packs
echo "📦 Scaffolding Context Packs..."

git checkout main
git checkout -b feature/angular-component-patterns
cat > toolkit/context-packs/angular/component-patterns.md << 'EOF'
# Angular Component Patterns

## Overview
Comprehensive Angular component patterns and best practices.

## Smart vs Presentational Components
Coming soon...

## OnPush Change Detection
Coming soon...

## Input/Output Patterns
Coming soon...

## Lifecycle Hooks
Coming soon...

## Examples
Coming soon...
EOF
git add .
git commit -m "feat: add angular component patterns"
git push origin feature/angular-component-patterns
gh pr create --base main --title "Add Angular Component Patterns" --body "Adds initial draft for Angular component patterns context"

git checkout main
git checkout -b feature/nestjs-module-structure
mkdir -p toolkit/context-packs/nestjs
cat > toolkit/context-packs/nestjs/module-structure.md << 'EOF'
# NestJS Module Structure

## Overview
NestJS module organization and dependency patterns.

## Module Organization
Coming soon...

## Providers and Services
Coming soon...

## Import/Export Patterns
Coming soon...

## Circular Dependencies
Coming soon...

## Examples
Coming soon...
EOF
git add .
git commit -m "feat: add nestjs module structure"
git push origin feature/nestjs-module-structure
gh pr create --base main --title "Add NestJS Module Structure Context" --body "Adds initial draft for NestJS module structure context"

git checkout main
git checkout -b feature/nx-monorepo-context
mkdir -p toolkit/context-packs/nx-monorepo
cat > toolkit/context-packs/nx-monorepo/README.md << 'EOF'
# Nx Monorepo Context Pack

## Overview
Comprehensive Nx monorepo patterns, workspace organization, and tooling.

## Workspace Organization
Coming soon...

## Library Boundaries
Coming soon...

## Nx Generators
Coming soon...

## Caching Strategies
Coming soon...

## Examples
Coming soon...
EOF
git add .
git commit -m "feat: add nx-monorepo context pack"
git push origin feature/nx-monorepo-context
gh pr create --base main --title "Add Nx Monorepo Context Pack" --body "Adds initial draft for Nx monorepo context pack"

# Culture
echo "💬 Scaffolding Culture Templates..."

git checkout main
git checkout -b feature/code-review-empathy
mkdir -p toolkit/prompts/culture
cat > toolkit/prompts/culture/code-review-empathy.md << 'EOF'
# Code Review Empathy Prompt

## Overview
Helps reviewers provide empathetic, constructive code review feedback.

## Variables
- `review_comment`: Original review comment
- `context`: Code context and author experience level
- `severity`: Issue severity (critical, major, minor, suggestion)

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
git commit -m "feat: add code-review-empathy template"
git push origin feature/code-review-empathy
gh pr create --base main --title "Add Code Review Empathy Prompt" --body "Adds initial draft for empathetic code review prompt"

git checkout main

echo ""
echo "✅ All high-priority items scaffolded!"
echo ""
echo "📊 Summary:"
echo "   - 18 feature branches created"
echo "   - 18 draft PRs opened"
echo "   - Ready for review and completion"
echo ""
echo "Next steps:"
echo "1. Review each PR and add detailed content"
echo "2. Add usage examples and test cases"
echo "3. Update with TypeDoc comments where applicable"
echo "4. Run lint, format, typecheck, build before merging"

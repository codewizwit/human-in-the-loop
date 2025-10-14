#!/bin/bash

# Create GitHub labels for the project
# These labels are used to categorize issues and PRs

echo "🏷️  Creating GitHub labels..."
echo ""

# Toolkit labels
gh label create "prompt" --description "Prompt templates" --color "0075ca" --force
gh label create "agent" --description "AI agents" --color "0075ca" --force
gh label create "context-pack" --description "Framework context packs" --color "0075ca" --force
gh label create "evaluator" --description "Quality evaluators" --color "0075ca" --force
gh label create "guardrail" --description "Safety guardrails" --color "0075ca" --force

# Category labels
gh label create "architecture" --description "Architecture and system design" --color "d4c5f9" --force
gh label create "testing" --description "Testing and QA" --color "d4c5f9" --force
gh label create "ci-cd" --description "CI/CD and DevOps" --color "d4c5f9" --force
gh label create "governance" --description "Governance and compliance" --color "d4c5f9" --force
gh label create "planning" --description "Planning and roadmap" --color "d4c5f9" --force
gh label create "culture" --description "Culture and mentorship" --color "d4c5f9" --force
gh label create "mentorship" --description "Mentorship and learning" --color "d4c5f9" --force
gh label create "community" --description "Community engagement" --color "d4c5f9" --force
gh label create "meta" --description "Meta tooling" --color "d4c5f9" --force

# Type labels
gh label create "documentation" --description "Documentation improvements" --color "0e8a16" --force
gh label create "cli" --description "CLI tool changes" --color "0e8a16" --force
gh label create "config" --description "Configuration changes" --color "0e8a16" --force
gh label create "dependencies" --description "Dependencies updates" --color "0e8a16" --force

# Priority labels
gh label create "high" --description "High priority" --color "d93f0b" --force
gh label create "medium" --description "Medium priority" --color "fbca04" --force
gh label create "low" --description "Low priority" --color "c2e0c6" --force

# Framework labels
gh label create "angular" --description "Angular framework" --color "5319e7" --force
gh label create "nestjs" --description "NestJS framework" --color "5319e7" --force
gh label create "nx" --description "Nx monorepo" --color "5319e7" --force
gh label create "monorepo" --description "Monorepo tooling" --color "5319e7" --force

# Special labels
gh label create "responsible-ai" --description "Responsible AI practices" --color "e99695" --force
gh label create "security" --description "Security improvements" --color "e99695" --force
gh label create "refactoring" --description "Code refactoring" --color "fbca04" --force
gh label create "test" --description "Test improvements" --color "bfd4f2" --force

echo ""
echo "✅ All labels created!"
echo ""
echo "View labels: gh label list"

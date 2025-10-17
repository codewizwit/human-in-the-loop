#!/bin/bash
# Check all markdown files for broken links

set -e

echo "🔍 Checking documentation links..."
echo ""

# Find all markdown files (excluding node_modules, .nx, .git, .claude)
# and run markdown-link-check on each
find . -name "*.md" \
  -not -path "./node_modules/*" \
  -not -path "./.nx/*" \
  -not -path "./.git/*" \
  -not -path "./.claude/*" \
  -type f \
  -print0 | xargs -0 -n1 pnpm exec markdown-link-check --quiet

echo ""
echo "✅ All documentation links are valid!"

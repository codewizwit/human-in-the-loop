#!/bin/bash
# Check for inline comments in TypeScript source files
# Enforces TypeDoc-only commenting style per CLAUDE.md standards

set -e

echo "💬 Checking for inline comments..."
echo ""

# Check for inline comments (// style) in production code only
# Exclude test files (*.spec.ts) which are allowed to have inline comments per CLAUDE.md
inline_comments=$(grep -r --include="*.ts" --exclude="*.spec.ts" \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.nx \
  --exclude-dir=coverage --exclude-dir=tmp \
  "^\s*//" . 2>/dev/null || echo "")

if [ -n "$inline_comments" ]; then
  echo "❌ Found inline comments in production code:"
  echo "$inline_comments"
  echo ""
  echo "Please use TypeDoc comments above functions only."
  echo "Inline (//) comments are only allowed in test files (*.spec.ts)."
  exit 1
fi

echo "✅ No inline comments found in production code"

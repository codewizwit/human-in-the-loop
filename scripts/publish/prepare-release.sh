#!/bin/bash
set -e

CLI_PACKAGE="src/cli/package.json"
CURRENT=$(cat "$CLI_PACKAGE" | grep '"version"' | awk -F'"' '{print $4}')
PUBLISHED=$(npm view @human-in-the-loop/cli version 2>/dev/null || echo "0.0.0")

echo "🚀 Release Validation"
echo "Current: $CURRENT | Published: $PUBLISHED"
echo ""

if [[ ! $CURRENT =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "❌ Invalid version format (use semver: 1.0.11)"
  exit 1
fi

if [ "$CURRENT" == "$PUBLISHED" ]; then
  echo "❌ Version $CURRENT already published"
  exit 1
fi

if [ "$(printf '%s\n' "$PUBLISHED" "$CURRENT" | sort -V | head -n1)" == "$CURRENT" ]; then
  echo "❌ Version must be higher than $PUBLISHED"
  exit 1
fi

echo "✅ Version: $PUBLISHED → $CURRENT"
echo ""
echo "Running checks..."
pnpm lint && pnpm typecheck && pnpm build && pnpm test

echo ""
echo "✅ Ready to publish!"
echo ""
echo "Next steps:"
echo "  1. git add src/cli/package.json && git commit -m 'chore: bump to $CURRENT'"
echo "  2. git push origin main"
echo "  3. CI will auto-publish and create release"

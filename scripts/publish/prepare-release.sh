#!/bin/bash

set -e

echo "🚀 Preparing Release"
echo "===================="
echo ""

CLI_PACKAGE="src/cli/package.json"
FAILED=0

check_version_format() {
  local version="$1"
  if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "❌ Version must follow semver format (e.g., 1.0.11)"
    return 1
  fi
  return 0
}

check_version_bump() {
  local current_version=$(cat "$CLI_PACKAGE" | grep '"version"' | head -1 | awk -F'"' '{print $4}')

  echo "Step 1: Checking version..."
  echo "  Current version: $current_version"

  if ! check_version_format "$current_version"; then
    FAILED=$((FAILED + 1))
    return 1
  fi

  # Check if version is higher than published version
  PUBLISHED_VERSION=$(npm view @human-in-the-loop/cli version 2>/dev/null || echo "0.0.0")
  echo "  Published version: $PUBLISHED_VERSION"

  if [ "$current_version" == "$PUBLISHED_VERSION" ]; then
    echo "❌ Version $current_version is already published"
    echo "   Bump the version in $CLI_PACKAGE"
    FAILED=$((FAILED + 1))
    return 1
  fi

  # Simple version comparison (works for semver)
  if [ "$(printf '%s\n' "$PUBLISHED_VERSION" "$current_version" | sort -V | head -n1)" == "$current_version" ]; then
    echo "❌ New version ($current_version) must be higher than published ($PUBLISHED_VERSION)"
    FAILED=$((FAILED + 1))
    return 1
  fi

  echo "✅ Version bump valid: $PUBLISHED_VERSION → $current_version"
}

check_git_status() {
  echo ""
  echo "Step 2: Checking git status..."

  if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Commit all changes before publishing"
  else
    echo "✅ Working directory clean"
  fi
}

run_tests() {
  echo ""
  echo "Step 3: Running tests..."

  echo "  → Linting..."
  if ! pnpm lint > /dev/null 2>&1; then
    echo "❌ Linting failed"
    FAILED=$((FAILED + 1))
    return 1
  fi
  echo "  ✅ Linting passed"

  echo "  → Type checking..."
  if ! pnpm typecheck > /dev/null 2>&1; then
    echo "❌ Type checking failed"
    FAILED=$((FAILED + 1))
    return 1
  fi
  echo "  ✅ Type checking passed"

  echo "  → Building..."
  if ! pnpm build > /dev/null 2>&1; then
    echo "❌ Build failed"
    FAILED=$((FAILED + 1))
    return 1
  fi
  echo "  ✅ Build passed"

  echo "  → Unit tests..."
  if ! pnpm test > /dev/null 2>&1; then
    echo "❌ Unit tests failed"
    FAILED=$((FAILED + 1))
    return 1
  fi
  echo "  ✅ Unit tests passed"
}

check_required_files() {
  echo ""
  echo "Step 4: Checking required files..."

  local files=(
    "src/cli/package.json"
    "src/cli/README.md"
    "LICENSE"
  )

  for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
      echo "❌ Missing required file: $file"
      FAILED=$((FAILED + 1))
    else
      echo "  ✅ $file exists"
    fi
  done
}

generate_dry_run_summary() {
  local version=$(cat "$CLI_PACKAGE" | grep '"version"' | head -1 | awk -F'"' '{print $4}')

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 Release Summary"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Package: @human-in-the-loop/cli"
  echo "Version: $version"
  echo "Registry: https://registry.npmjs.org"
  echo ""
  echo "Files to publish:"
  echo "  • dist/src/cli/main.js (CLI entry point)"
  echo "  • dist/src/cli/package.json"
  echo "  • dist/src/cli/README.md"
  echo "  • dist/src/cli/lib/ (toolkit)"
  echo ""
  echo "Next steps:"
  echo "  1. Commit version bump: git add src/cli/package.json && git commit"
  echo "  2. Push to trigger CI: git push origin main"
  echo "  3. Auto-publish will run if all tests pass"
  echo "  4. GitHub release will be created automatically"
  echo ""
  echo "Or publish manually:"
  echo "  cd dist/src/cli && npm publish"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Run all checks
check_version_bump
check_git_status
run_tests
check_required_files

echo ""
if [ $FAILED -eq 0 ]; then
  echo "✅ All pre-release checks passed!"
  generate_dry_run_summary
  exit 0
else
  echo "❌ $FAILED check(s) failed"
  echo ""
  echo "Fix the issues above and try again."
  exit 1
fi

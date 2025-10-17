#!/bin/bash

set -e

echo "🧪 Running CLI Regression Tests"
echo "================================"
echo ""

CLI="node dist/src/cli/main.js"
TEST_DIR="/tmp/hit-test-$$"
FAILED=0

cleanup() {
  echo ""
  echo "🧹 Cleaning up..."
  rm -rf "$TEST_DIR"

  if [ $FAILED -eq 0 ]; then
    echo "✅ All regression tests passed!"
    exit 0
  else
    echo "❌ $FAILED test(s) failed"
    exit 1
  fi
}

trap cleanup EXIT

test_command() {
  local name="$1"
  local command="$2"
  local expected_pattern="$3"

  echo "Testing: $name"

  output=$($command 2>&1 || true)

  if echo "$output" | grep -q "$expected_pattern"; then
    echo "  ✅ Pass"
    return 0
  else
    echo "  ❌ Fail: Expected pattern not found: $expected_pattern"
    echo "  Output: $output"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo "Step 1: Building CLI..."
pnpm build > /dev/null 2>&1
echo "  ✅ Build complete"
echo ""

echo "Step 2: Testing basic commands"
echo "-------------------------------"

test_command \
  "Version command" \
  "$CLI --version" \
  "1.0."

test_command \
  "Help command" \
  "$CLI --help" \
  "Human in the Loop"

test_command \
  "Search command" \
  "$CLI search code" \
  "Found.*tools"

test_command \
  "Doctor command" \
  "$CLI doctor" \
  "All checks passed"

echo ""
echo "Step 3: Testing contribute command with valid prompt"
echo "----------------------------------------------------"

test_command \
  "Contribute valid prompt" \
  "$CLI contribute prompt lib/prompts/code-review-ts/prompt.yaml" \
  "✅ YAML validation passed"

echo ""
echo "Step 4: Testing contribute command with invalid prompt"
echo "-------------------------------------------------------"

mkdir -p "$TEST_DIR"
cat > "$TEST_DIR/prompt.yaml" <<'EOF'
id: test
name: Test
EOF

output=$($CLI contribute prompt "$TEST_DIR/prompt.yaml" 2>&1 || true)

if echo "$output" | grep -q "❌ YAML validation failed"; then
  echo "Testing: Contribute invalid prompt"
  echo "  ✅ Pass"
else
  echo "Testing: Contribute invalid prompt"
  echo "  ❌ Fail: Expected validation errors"
  FAILED=$((FAILED + 1))
fi

echo ""
echo "Step 5: Cleaning up test GitHub issues"
echo "---------------------------------------"

latest_issue=$(gh issue list --limit 1 --json number -q '.[0].number' 2>/dev/null || echo "")

if [ -n "$latest_issue" ]; then
  issue_title=$(gh issue view "$latest_issue" --json title -q '.title' 2>/dev/null || echo "")

  if echo "$issue_title" | grep -q "\[Contribution\]"; then
    echo "  → Closing test issue #$latest_issue"
    gh issue close "$latest_issue" --comment "Automated test cleanup" > /dev/null 2>&1
    echo "  ✅ Test issue closed"
  else
    echo "  → No test issues to clean up"
  fi
else
  echo "  → No issues found"
fi

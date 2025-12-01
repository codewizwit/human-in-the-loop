#!/bin/bash
# Check for proper documentation in new features
# Validates that all prompts/agents have READMEs with required sections

set -e

echo "📚 Checking documentation requirements..."
echo ""

# Get list of changed files (if running in CI)
if [ -n "$CHANGED_FILES" ]; then
  files=$CHANGED_FILES
else
  # Local mode: check all lib/ files
  files=$(find lib/prompts lib/agents -type f 2>/dev/null || echo "")
fi

has_errors=false

for file in $files; do
  # Check if file is in a prompt or agent directory
  if [[ $file == lib/prompts/*/* || $file == lib/agents/*/* ]]; then
    dir=$(dirname "$file")

    # Skip if this is the directory itself
    if [ ! -d "$dir" ]; then
      continue
    fi

    # Check for README.md
    if [ ! -f "$dir/README.md" ]; then
      echo "❌ Missing README.md in $dir"
      has_errors=true
      continue
    fi

    # Check README has required sections for v2.0.0 format
    if ! grep -q "## What You'll Be Asked" "$dir/README.md"; then
      echo "❌ README in $dir missing '## What You'll Be Asked' section"
      has_errors=true
    fi

    if ! grep -q "## Usage Examples" "$dir/README.md"; then
      echo "❌ README in $dir missing '## Usage Examples' section"
      has_errors=true
    fi

    if ! grep -q "## Related Resources" "$dir/README.md"; then
      echo "❌ README in $dir missing '## Related Resources' section"
      has_errors=true
    fi

    # Check README has proper section headers
    section_count=$(grep -c "^## " "$dir/README.md" || echo "0")
    if [ "$section_count" -lt 2 ]; then
      echo "❌ README in $dir needs clear section headers (## Title)"
      has_errors=true
    fi

    # Check for prompt.md (pure XML format v2.0.0) or agent.yaml
    if [[ $file == lib/prompts/*/* ]] && [ ! -f "$dir/prompt.md" ]; then
      echo "❌ Missing prompt.md in $dir"
      has_errors=true
    fi

    if [[ $file == lib/agents/*/* ]] && [ ! -f "$dir/agent.yaml" ]; then
      echo "❌ Missing agent.yaml in $dir"
      has_errors=true
    fi
  fi
done

if [ "$has_errors" = true ]; then
  echo ""
  echo "❌ Documentation check failed"
  exit 1
fi

echo "✅ All documentation requirements met"

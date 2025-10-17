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

    # Check README has Usage section
    if ! grep -q "## Usage" "$dir/README.md"; then
      echo "❌ README in $dir missing '## Usage' section"
      has_errors=true
    fi

    # Check README has proper section headers
    section_count=$(grep -c "^## " "$dir/README.md" || echo "0")
    if [ "$section_count" -lt 2 ]; then
      echo "❌ README in $dir needs clear section headers (## Title)"
      has_errors=true
    fi

    # Check for prompt.yaml or agent.yaml
    if [[ $file == lib/prompts/*/* ]] && [ ! -f "$dir/prompt.yaml" ]; then
      echo "❌ Missing prompt.yaml in $dir"
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

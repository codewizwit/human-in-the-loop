#!/bin/bash
# Validate prompt markdown files have required XML structure
# Ensures prompts meet quality standards for metadata and structure
# Supports v2.0.0 pure XML format

set -e

echo "🔍 Validating prompt markdown files (pure XML format)..."
echo ""

# Find all prompt.md files in lib/
prompt_files=$(find lib/prompts -name "prompt.md" 2>/dev/null || echo "")

if [ -z "$prompt_files" ]; then
  echo "⚠️  No prompt files found"
  exit 0
fi

has_errors=false

while IFS= read -r file; do
  echo "Checking $file..."
  file_has_errors=false

  # Check for root <prompt> element
  if ! grep -q "<prompt>" "$file"; then
    echo "  ❌ Missing root <prompt> element"
    has_errors=true
    file_has_errors=true
  fi

  # Check for closing </prompt> element
  if ! grep -q "</prompt>" "$file"; then
    echo "  ❌ Missing closing </prompt> element"
    has_errors=true
    file_has_errors=true
  fi

  # Check for <metadata> section
  if ! grep -q "<metadata>" "$file"; then
    echo "  ❌ Missing <metadata> section"
    has_errors=true
    file_has_errors=true
  fi

  # Check required metadata fields (within XML tags)
  if ! grep -q "<id>" "$file"; then
    echo "  ❌ Missing <id> field in metadata"
    has_errors=true
    file_has_errors=true
  fi

  if ! grep -q "<name>" "$file"; then
    echo "  ❌ Missing <name> field in metadata"
    has_errors=true
    file_has_errors=true
  fi

  if ! grep -q "<version>" "$file"; then
    echo "  ❌ Missing <version> field in metadata"
    has_errors=true
    file_has_errors=true
  fi

  if ! grep -q "<description>" "$file"; then
    echo "  ❌ Missing <description> field in metadata"
    has_errors=true
    file_has_errors=true
  fi

  if ! grep -q "<category>" "$file"; then
    echo "  ❌ Missing <category> field in metadata"
    has_errors=true
    file_has_errors=true
  fi

  if ! grep -q "<author>" "$file"; then
    echo "  ❌ Missing <author> field in metadata"
    has_errors=true
    file_has_errors=true
  fi

  if ! grep -q "<license>" "$file"; then
    echo "  ❌ Missing <license> field in metadata"
    has_errors=true
    file_has_errors=true
  fi

  # Check for <examples> section
  if ! grep -q "<examples>" "$file"; then
    echo "  ⚠️  Missing <examples> section (recommended)"
    # Not a hard error, just a warning
  fi

  # Check for core prompt sections (sent to Claude)
  if ! grep -q "<context>" "$file"; then
    echo "  ❌ Missing <context> section"
    has_errors=true
    file_has_errors=true
  fi

  if ! grep -q "<instructions>" "$file"; then
    echo "  ❌ Missing <instructions> section"
    has_errors=true
    file_has_errors=true
  fi

  if ! grep -q "<constraints>" "$file"; then
    echo "  ⚠️  Missing <constraints> section (recommended)"
    # Not a hard error, just a warning
  fi

  if ! grep -q "<output_format>" "$file"; then
    echo "  ❌ Missing <output_format> section"
    has_errors=true
    file_has_errors=true
  fi

  if [ "$file_has_errors" = false ]; then
    echo "  ✅ Valid XML structure"
  fi

done <<< "$prompt_files"

echo ""

if [ "$has_errors" = true ]; then
  echo "❌ Prompt validation failed"
  exit 1
fi

echo "✅ All prompt files validated successfully (pure XML format)"

echo ""
echo "🔍 Validating skill markdown files..."
echo ""

skill_files=$(find lib/skills -name "skill.md" 2>/dev/null || echo "")

if [ -n "$skill_files" ]; then
  if npx ts-node src/governance/checks/validate-skills.ts; then
    echo "✅ All skill files validated successfully"
  else
    echo "❌ Skill validation failed"
    exit 1
  fi
else
  echo "⚠️  No skill.md files found (skipping skill validation)"
fi

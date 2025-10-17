#!/bin/bash
# Validate prompt YAML files have required fields
# Ensures prompts meet quality standards for metadata and structure

set -e

echo "🔍 Validating prompt YAML files..."
echo ""

# Find all prompt.yaml files in lib/
prompt_files=$(find lib/prompts -name "prompt.yaml" 2>/dev/null || echo "")

if [ -z "$prompt_files" ]; then
  echo "⚠️  No prompt files found"
  exit 0
fi

has_errors=false

while IFS= read -r file; do
  echo "Checking $file..."

  # Check required top-level fields
  if ! grep -q "^id:" "$file"; then
    echo "  ❌ Missing 'id' field"
    has_errors=true
  fi

  if ! grep -q "^name:" "$file"; then
    echo "  ❌ Missing 'name' field"
    has_errors=true
  fi

  if ! grep -q "^version:" "$file"; then
    echo "  ❌ Missing 'version' field"
    has_errors=true
  fi

  if ! grep -q "^description:" "$file"; then
    echo "  ❌ Missing 'description' field"
    has_errors=true
  fi

  if ! grep -q "^category:" "$file"; then
    echo "  ❌ Missing 'category' field"
    has_errors=true
  fi

  # Check required metadata fields
  if ! grep -q "author:" "$file"; then
    echo "  ❌ Missing 'author' in metadata"
    has_errors=true
  fi

  if ! grep -q "license:" "$file"; then
    echo "  ❌ Missing 'license' in metadata"
    has_errors=true
  fi

  # Check for examples
  if ! grep -q "^examples:" "$file"; then
    echo "  ❌ Missing 'examples' section"
    has_errors=true
  fi

  # Check for template
  if ! grep -q "^template:" "$file"; then
    echo "  ❌ Missing 'template' field"
    has_errors=true
  fi

  if [ "$has_errors" = false ]; then
    echo "  ✅ Valid"
  fi

done <<< "$prompt_files"

echo ""

if [ "$has_errors" = true ]; then
  echo "❌ Prompt validation failed"
  exit 1
fi

echo "✅ All prompt files validated successfully"

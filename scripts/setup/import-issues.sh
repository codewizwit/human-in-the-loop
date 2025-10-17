#!/bin/bash

# Import GitHub issues from planning/github-issues.json
# Uses gh CLI to create issues with labels

set -e

ISSUES_FILE="planning/github-issues.json"

if [ ! -f "$ISSUES_FILE" ]; then
  echo "❌ Error: $ISSUES_FILE not found"
  exit 1
fi

echo "🚀 Importing issues from $ISSUES_FILE..."
echo ""

# Get total count
TOTAL=$(jq 'length' "$ISSUES_FILE")
echo "Found $TOTAL issues to import"
echo ""

# Counter
COUNT=0

# Read each issue from JSON and create it
jq -c '.[]' "$ISSUES_FILE" | while read -r issue; do
  COUNT=$((COUNT + 1))

  TITLE=$(echo "$issue" | jq -r '.title')
  BODY=$(echo "$issue" | jq -r '.body')
  LABELS=$(echo "$issue" | jq -r '.labels | join(",")')
  PRIORITY=$(echo "$issue" | jq -r '.priority')

  echo "[$COUNT/$TOTAL] Creating: $TITLE"

  # Create the issue with labels
  gh issue create \
    --title "$TITLE" \
    --body "$BODY" \
    --label "$LABELS,$PRIORITY" || echo "  ⚠️  Failed to create issue, continuing..."

  echo "  ✅ Created"
  echo ""
done

echo ""
echo "✅ Issue import complete!"
echo ""
echo "View all issues: gh issue list"

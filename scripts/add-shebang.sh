#!/bin/bash
# Add shebang only to main.js after build

MAIN_FILE="dist/src/cli/main.js"

if [ ! -f "$MAIN_FILE" ]; then
  echo "Error: $MAIN_FILE not found"
  exit 1
fi

# Check if shebang already exists
if ! head -1 "$MAIN_FILE" | grep -q "^#!/usr/bin/env node"; then
  # Prepend shebang
  echo "#!/usr/bin/env node" | cat - "$MAIN_FILE" > temp && mv temp "$MAIN_FILE"
  echo "✅ Added shebang to $MAIN_FILE"
else
  echo "✅ Shebang already present in $MAIN_FILE"
fi

# Remove shebang from src/cli/src/main.js (not the entry point)
INTERNAL_MAIN="dist/src/cli/src/cli/src/main.js"
if [ -f "$INTERNAL_MAIN" ]; then
  sed -i '' '1{/^#!\/usr\/bin\/env node/d;}' "$INTERNAL_MAIN"
  echo "✅ Removed shebang from internal $INTERNAL_MAIN"
fi

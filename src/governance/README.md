# Governance

Quality assurance and validation tooling for the Human in the Loop repository.

## Purpose

The governance layer ensures all contributions meet quality, documentation, and security standards before being merged. Validation runs automatically in GitHub Actions and can be executed locally during development.

## Structure

```
governance/
└── checks/                  # Validation scripts
    ├── check-links.sh       # Validate markdown links
    ├── check-docs.sh        # Ensure proper documentation
    ├── check-inline-comments.sh  # Enforce TypeDoc-only comments
    └── validate-prompts.sh  # Validate prompt YAML structure
```

## Available Checks

### 📎 check-links.sh

Validates all markdown links in documentation and README files.

**Usage:**
```bash
./src/governance/checks/check-links.sh
```

**What it checks:**
- Broken links to external URLs
- Invalid relative links between docs
- Missing referenced files

**CI Integration:** `.github/workflows/check-links.yml`

---

### 📚 check-docs.sh

Ensures all prompts and agents have proper documentation.

**Usage:**
```bash
./src/governance/checks/check-docs.sh
```

**What it checks:**
- README.md exists in all prompt/agent directories
- README has required sections (## Usage, etc.)
- prompt.yaml or agent.yaml files are present
- Section headers are properly formatted

**CI Integration:** `.github/workflows/pr-validation.yml` (documentation-checks job)

---

### 💬 check-inline-comments.sh

Enforces TypeDoc-only commenting style in TypeScript code.

**Usage:**
```bash
./src/governance/checks/check-inline-comments.sh
```

**What it checks:**
- No inline `//` comments in production code (*.ts)
- Test files (*.spec.ts) are exempt
- Enforces TypeDoc comments above functions

**CI Integration:** `.github/workflows/pr-validation.yml` (documentation-checks job)

---

### 🔍 validate-prompts.sh

Validates prompt YAML files have required metadata.

**Usage:**
```bash
./src/governance/checks/validate-prompts.sh
```

**What it checks:**
- Required fields: id, name, version, description, category
- Required metadata: author, license
- Examples section exists
- Template field is present

**CI Integration:** `.github/workflows/pr-validation.yml` (contribution-validation job)

---

## Running Checks Locally

### Run all checks
```bash
# From project root
pnpm validate
```

### Run individual checks
```bash
# Check documentation
./src/governance/checks/check-docs.sh

# Validate prompts
./src/governance/checks/validate-prompts.sh

# Check links
./src/governance/checks/check-links.sh

# Check inline comments
./src/governance/checks/check-inline-comments.sh
```

## CI/CD Integration

All governance checks run automatically on pull requests via GitHub Actions:

- **Pre-merge validation:** `.github/workflows/pr-validation.yml`
  - Documentation checks
  - Prompt validation
  - Inline comment enforcement

- **Link validation:** `.github/workflows/check-links.yml`
  - Runs on push to main
  - Validates all markdown links

- **Security:** `.github/workflows/pr-validation.yml`
  - Secret scanning with TruffleHog
  - Dependency audits

## Adding New Checks

To add a new governance check:

1. **Create the script** in `src/governance/checks/`
   ```bash
   touch src/governance/checks/my-check.sh
   chmod +x src/governance/checks/my-check.sh
   ```

2. **Follow the pattern:**
   ```bash
   #!/bin/bash
   set -e

   echo "🔍 Running my check..."

   # Validation logic here

   if [ "$has_errors" = true ]; then
     echo "❌ Check failed"
     exit 1
   fi

   echo "✅ Check passed"
   ```

3. **Add to GitHub Actions** in `.github/workflows/pr-validation.yml`:
   ```yaml
   - name: Run my check
     run: ./src/governance/checks/my-check.sh
   ```

4. **Document here** in this README

5. **Add to validation script** if needed:
   ```json
   // package.json
   "scripts": {
     "validate": "... && ./src/governance/checks/my-check.sh"
   }
   ```

## Quality Standards

All scripts in this directory must:

- Use `#!/bin/bash` and `set -e` for error handling
- Provide clear emoji-prefixed output (🔍 ✅ ❌)
- Exit with status code 1 on failure, 0 on success
- Be executable (`chmod +x`)
- Include comments explaining the check purpose

## Related Documentation

- [Governance Model](../../docs/governance-model.md) - Review process and standards
- [Contributing Guidelines](../../docs/contributing-guidelines.md) - How to contribute
- [Architecture](../../docs/architecture.md) - System design overview

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

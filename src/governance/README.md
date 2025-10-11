# Governance

This directory contains governance tooling for contribution validation, quality checks, and repository standards enforcement.

## Purpose

The governance layer ensures all contributions to the Human in the Loop toolkit meet quality, documentation, and security standards before being merged.

## Structure

```
governance/
├── validators/      # Validation scripts for YAML, TypeScript, etc.
├── checks/          # Quality and security checks
└── schemas/         # JSON schemas for validating tool definitions
```

## Key Responsibilities

### 🔍 Validation
- YAML structure validation for prompts and agents
- TypeScript type checking and compilation
- Schema validation for tool metadata

### 📚 Documentation
- Ensure READMEs exist in all feature directories
- Verify usage examples and clear instructions
- Check for proper TypeDoc comments

### 🛡️ Security
- Secret detection in contributed code
- Dependency vulnerability scanning
- Permission and access control validation

### ✨ Quality
- Code formatting checks
- No inline comments enforcement
- Consistent naming conventions

## Usage

These governance tools are primarily run via GitHub Actions during pull request validation. See `.github/workflows/pr-validation.yml` for implementation.

Local validation can be run with:

```bash
# Run all validation checks
pnpm nx run governance:validate

# Run specific checks
pnpm nx run governance:check-docs
pnpm nx run governance:check-security
```

## Contributing

When adding new governance checks:

1. Create validation script in appropriate subdirectory
2. Add TypeDoc comments above all functions
3. Update GitHub Actions workflow if needed
4. Document the check in this README

---

**Human-in-the-Loop by codewizwit**

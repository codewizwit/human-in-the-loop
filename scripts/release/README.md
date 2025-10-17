# Release Process

This repository uses **automated releases** on every merge to main.

---

## 📋 How It Works

1. **Create a PR with conventional commits:**

   - `feat:` New feature (bumps **minor** version: 1.1.0 → 1.2.0)
   - `fix:` Bug fix (bumps **patch** version: 1.1.0 → 1.1.1)
   - `BREAKING CHANGE:` Breaking change (bumps **major** version: 1.1.0 → 2.0.0)
   - `chore:`, `docs:`, `refactor:`, etc. (no version bump)

2. **Merge PR to main**

3. **GitHub Actions automatically:**
   - ✅ Analyzes commits since last release
   - ✅ Bumps version using standard-version
   - ✅ Updates `CHANGELOG.md`
   - ✅ Runs tests and builds
   - ✅ Publishes to npm with provenance
   - ✅ Creates GitHub release with changelog
   - ✅ Pushes version commit + tag back to main

---

## 💡 Tips

- **Use conventional commit format** in PR titles for clear versioning
- **Version bumps are automatic** based on commit types
- **Every merge to main triggers a release** (unless it's already a release commit)
- **Check the workflow status** after merge: [Actions](https://github.com/codewizwit/human-in-the-loop/actions/workflows/publish-npm.yml)

---

## 🔧 Manual Testing (Pre-Publish)

If you need to test the package locally before merging:

```bash
# Build the package
pnpm build

# Test the CLI locally
cd dist/src/cli
npm link

# Run the CLI
hit --help

# Unlink when done
npm unlink -g @human-in-the-loop/cli
```

---

## 🚀 Workflow Details

**File:** `.github/workflows/publish-npm.yml`

**Triggers:** Push to `main` branch

**Steps:**

1. Check if commit is already a release (skip if yes)
2. Install dependencies
3. Run linting, type checking, tests, and build
4. Run `standard-version` to bump version
5. Push version commit + tag
6. Publish to npm with OIDC provenance
7. Create GitHub release

**Environment:** `production` (for npm trusted publisher)

---

## 📦 Release Artifacts

Each release creates:

- **Git tag** (e.g., `v1.2.0`)
- **GitHub Release** with changelog
- **npm Package** at https://www.npmjs.com/package/@human-in-the-loop/cli
- **Provenance Statement** at https://search.sigstore.dev

---

## 🔗 Resources

- [Conventional Commits](https://www.conventionalcommits.org)
- [standard-version](https://github.com/conventional-changelog/standard-version)
- [npm Trusted Publishers](https://docs.npmjs.com/generating-provenance-statements)
- [Latest Releases](https://github.com/codewizwit/human-in-the-loop/releases)

---

## 🛠️ Troubleshooting

### Release didn't trigger after merge

Check:

- Does the latest commit have a conventional commit type (`feat:`, `fix:`, etc.)?
- Is it a `chore:` or `docs:` commit? (these don't trigger version bumps)
- View workflow logs: [Actions](https://github.com/codewizwit/human-in-the-loop/actions)

### Version didn't bump as expected

- `feat:` bumps **minor** version
- `fix:` bumps **patch** version
- `BREAKING CHANGE:` in commit body bumps **major** version
- Other types (`chore:`, `docs:`, etc.) create no version bump

### Publish failed

Check the [workflow logs](https://github.com/codewizwit/human-in-the-loop/actions) for:

- Test failures
- Build errors
- npm authentication issues

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

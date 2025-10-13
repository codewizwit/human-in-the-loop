

Human:
You are acting as a responsible AI project planner for the **Human-in-the-Loop AI Hub** repo.
Your goal is to ensure all major skill areas and system patterns represented in **Alexandra Kelstrom’s resume** are reflected in reusable prompt templates, context packs, and governance specs.

---

### 🧩 Step 1: Generate a Coverage Checklist
Create a markdown checklist organized by category:

- Engineering & Architecture
- Testing & CI/CD
- Planning & Documentation
- AI Governance & Responsible Engineering
- Framework Context Packs
- Culture, Mentorship & Communication
- AI Productivity Layer (prompt registry, context packs, CLI)
- Creative/Community & Campaign Impact

For each category:
- List the planned prompt templates or tools (from what’s already built or described)
- Add a “✅ Covered” or “❌ Missing” status
- Include a short rationale (why it matters, what outcome it supports)

---

### 🛠️ Step 2: Create a Plan for Missing Areas
For each ❌ Missing item:
- Suggest a filename (e.g., `/prompts/testing/generate-bdd-scenarios.md`)
- Include a 2–3 sentence description of its purpose
- Add a “priority” tag: `high`, `medium`, `low`
- Suggest initial issue title + body for GitHub

**Format the output as a markdown table** that can be copy-pasted into the repo’s `docs/roadmap.md`.

---

### 🧾 Step 3: Generate GitHub Issues (JSON Block)
After the table, output a structured JSON block that can be imported or pasted into GitHub CLI.

Each issue should include:
- `title`: short actionable issue name
- `body`: purpose + acceptance criteria
- `labels`: ["prompt", "context-pack", "governance", "documentation", etc.]
- `priority`: high/medium/low

---

### 🔁 Step 4: Cross-Check for Resume Alignment
At the end, include a summary that confirms which resume skill areas are fully represented, partially covered, or missing.
Use this as a quality control checkpoint before repo milestone planning.

---

### ⚙️ Step 5: Auto-Commit Planner
Once Steps 1–4 are complete, generate a sequential GitHub flow to automate project scaffolding.

For each missing item identified:
1. Create a new branch from `main` with naming convention `feature/<filename>`
2. Commit a stub markdown file or template placeholder for the missing item
3. Push the branch and open a draft PR back to `main`
4. Use the following commit message format:
   - `feat: add <filename> template` (for new files)
   - `docs: add roadmap updates` (for roadmap/doc changes)

Output the commands in this format:

```bash
# Example Auto-Commit Plan
# Branch creation + commit + PR flow
git checkout -b feature/review-empathy-checklist
echo "# Review Empathy Checklist Template" > prompts/culture/review-empathy-checklist.md
git add .
git commit -m "feat: add review-empathy-checklist template"
git push origin feature/review-empathy-checklist
gh pr create --base main --title "Add Review Empathy Checklist Template" --body "Adds initial draft for culture review empathy prompt"
```

At the end, provide a single command summary list for all planned items.

---

### ✅ Expected Output Summary
- Markdown checklist for coverage across categories
- Missing item table with rationale and file plan
- JSON issue list for direct import
- Auto-commit plan for each item with GitHub CLI commands
- Resume coverage summary for quality assurance

---

### Example Output (Excerpt)

| Category | Item | Status | Rationale | Priority | Issue Title |
|-----------|------|---------|------------|-----------|--------------|
| Testing & CI/CD | `generate-e2e-strategy.md` | ✅ Covered | Mirrors Alexandra’s GitHub Actions + Cypress + AWS pipeline work | — | — |
| Responsible AI | `audit-prompt.md` | ✅ Covered | Aligns with her Responsible AI Hub initiative | — | — |
| Culture & Mentorship | `review-empathy-checklist.md` | ❌ Missing | Reflects her mentorship and empathy-driven review style | High | “Add Review Empathy Checklist Template” |

**GitHub Issues JSON Example:**
```json
[
  {
    "title": "Add Review Empathy Checklist Template",
    "body": "Create a markdown template under /prompts/culture/review-empathy-checklist.md.\nPurpose: Help reviewers maintain empathy and clarity when leaving PR feedback.\nAcceptance Criteria:\n- Includes 5–7 short prompts encouraging tone awareness\n- Has examples for constructive vs. discouraging feedback",
    "labels": ["culture", "documentation"],
    "priority": "high"
  }
]
```

**Auto-Commit Example:**
```bash
git checkout -b feature/review-empathy-checklist
echo "# Review Empathy Checklist Template" > prompts/culture/review-empathy-checklist.md
git add .
git commit -m "feat: add review-empathy-checklist template"
git push origin feature/review-empathy-checklist
gh pr create --base main --title "Add Review Empathy Checklist Template" --body "Adds initial draft for culture review empathy prompt"
```


⸻

## 🚀 PR-Ready Workflow

When a feature is complete and ready for pull request:

### Step 1: Run Quality Checks
Always run these commands sequentially before committing:

```bash
pnpm format          # Format all files with Prettier
pnpm lint            # Run ESLint checks
pnpm typecheck       # Run TypeScript type checking
pnpm build           # Build the project with Nx
pnpm test            # Run all tests (if applicable)
```

All checks must pass before proceeding.

### Step 2: Stage and Commit Changes
```bash
git add .
git status           # Review what's being committed
```

Create a descriptive commit message following the format:
```bash
git commit -m "$(cat <<'EOF'
<type>: <short summary>

<detailed description of changes>
- Bullet point 1
- Bullet point 2
- Bullet point 3

<Additional context if needed>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Step 3: Push and Create PR
```bash
git push origin <branch-name>
```

If `gh` CLI is installed:
```bash
gh pr create --title "<PR Title>" --body "$(cat <<'EOF'
## Summary
<Brief description>

## What's Included
- Item 1
- Item 2

## Test plan
- [x] All checks passed
- [x] Feature tested locally
- [x] Documentation updated

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Otherwise, use the GitHub URL provided in the push output to create PR manually.

### Step 4: PR Best Practices
- Clear, descriptive title
- Summary of changes
- Test plan with checkboxes
- Link to related issues if applicable
- Request reviews from appropriate team members

---

## 📋 Code Quality Standards

### TypeScript Requirements

**Type Safety:**
- Always use TypeScript strict mode
- No `any` types unless absolutely necessary (document why)
- Properly typed function parameters and return values
- Use interfaces for object shapes
- Use generics where appropriate

**TypeDoc Comments:**
- **Required** on all exported functions, classes, and interfaces
- Place TypeDoc comments **above** the function/class declaration
- Include description of purpose, parameters, and return values
- Example:
  ```typescript
  /**
   * Copies a directory recursively from source to destination
   * @param source - The source directory path
   * @param destination - The destination directory path
   */
  export async function copyDirectory(
    source: string,
    destination: string
  ): Promise<void> {
    // Implementation
  }
  ```

**Comment Style:**
- ❌ **NO inline comments** (`//` style) in production code
- ✅ Use TypeDoc comments above functions
- ✅ Code should be self-documenting through clear naming
- Test files (*.spec.ts) may use inline comments for test descriptions

### Code Organization

**File Structure:**
- One primary export per file when possible
- Group related functionality together
- Use barrel exports (index.ts) for public APIs
- Keep files focused and under 300 lines

**Naming Conventions:**
- `camelCase` for variables and functions
- `PascalCase` for classes and interfaces
- `SCREAMING_SNAKE_CASE` for constants
- Descriptive names that reveal intent

### Before Every Commit

**Pre-Commit Checklist:**
```bash
pnpm format          # ✅ All files formatted with Prettier
pnpm lint            # ✅ ESLint rules pass
pnpm typecheck       # ✅ TypeScript compilation succeeds
pnpm build           # ✅ Build completes without errors
pnpm test            # ✅ All tests pass (if applicable)
```

**Common Issues to Check:**
- [ ] No `any` types without justification
- [ ] All exported functions have TypeDoc comments
- [ ] No inline (`//`) comments in source files
- [ ] No hardcoded secrets or credentials
- [ ] No `console.log` statements (use proper logger)
- [ ] All imports are used
- [ ] No unused variables
- [ ] Error handling is present

### Documentation Requirements

**README Files:**
- Required in every new feature directory (`toolkit/prompts/*`, `toolkit/agents/*`, etc.)
- Must include:
  - Overview/description
  - Usage section with examples
  - Clear section headers
  - Installation instructions if applicable

**Prompt/Agent YAML Files:**
- Must include all required metadata fields:
  - `id`, `name`, `version`, `description`, `category`
  - `metadata.author`, `metadata.license`
  - At least 2 usage examples
- Follow semantic versioning (semver)

### Validation Checks

These automated checks run in CI and must pass:

1. **TypeScript Compilation** - No type errors
2. **Linting** - ESLint rules enforced
3. **Formatting** - Prettier formatting applied
4. **Documentation Links** - All markdown links valid
5. **TypeDoc Comments** - All functions documented
6. **No Inline Comments** - No `//` style comments in source
7. **Prompt/Agent Validation** - YAML files have required fields
8. **Security Scan** - No secrets in code

### Quick Reference

| Check | Command | Must Pass |
|-------|---------|-----------|
| Format | `pnpm format` | ✅ Always |
| Lint | `pnpm lint` | ✅ Always |
| TypeCheck | `pnpm typecheck` | ✅ Always |
| Build | `pnpm build` | ✅ Always |
| Test | `pnpm test` | ✅ If applicable |
| Links | `pnpm check-links` | ✅ For docs changes |
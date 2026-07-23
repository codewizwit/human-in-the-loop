# Contributing to Human in the Loop

Thank you for your interest in contributing! This document outlines the process for submitting new prompts, agents, and improvements to the Human in the Loop toolkit.

---

## How to Contribute

> **Note**: As of v4.0.0, all skills use a **unified `skill.md` format** with YAML frontmatter. The old XML prompt format is deprecated. Each skill lives in `lib/skills/<skill-id>/` and contains `skill.md`, `metadata.json`, and `README.md`.

### 1. Types of Contributions

We accept the following types of contributions:

- **Prompts**: Reusable Claude prompts for specific tasks
- **Agents**: AI agent configurations with tools and capabilities
- **Context Packs**: Framework or domain-specific knowledge bases
- **Evaluators**: Quality validation tools
- **Guardrails**: Safety and governance mechanisms
- **Documentation**: Improvements to guides and examples
- **Bug Fixes**: Fixes to existing tools or CLI
- **Features**: New CLI features or improvements

### 2. Before You Start

1. Check existing issues and PRs to avoid duplication
2. For major changes, open an issue first to discuss your approach
3. Review an existing skill in `lib/skills/` to understand the unified `skill.md` format
4. Review [Best Practices](./docs/ai-best-practices.md) guide (if available)
5. Familiarize yourself with our [Governance](./docs/governance-model.md) model (if available)

---

## Submission Process

### Step 1: Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/human-in-the-loop
cd human-in-the-loop

# Install dependencies
pnpm install
```

### Step 2: Create a Branch

```bash
git checkout -b feat/my-new-prompt
# or
git checkout -b fix/prompt-bug
```

**Branch naming conventions:**

- `feat/` - New features or tools
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Step 3: Make Your Changes

Follow the appropriate guide based on what you're contributing:

#### Contributing a Skill

1. Create a new directory in `lib/skills/`:

```bash
mkdir -p lib/skills/my-skill
```

2. Create `skill.md` (unified format with YAML frontmatter):

```markdown
---
id: my-skill
name: My Awesome Skill
version: 1.0.0
description: A clear, concise description of what this skill does
category: code-review
author: Your Name
license: MIT
tags:
  - code-review
  - quality
lastUpdated: 2026-03-01
---

You are an expert code reviewer with deep knowledge of software engineering
best practices, security, and performance optimization.

## Instructions

Review the code in the current workspace and analyze:

1. **Code Quality** - Assess readability and maintainability
2. **Security** - Identify potential vulnerabilities
3. **Performance** - Identify optimization opportunities

## Constraints

- Focus on critical issues over style preferences
- Provide specific line references for issues
- Include code examples for recommendations

## Output Format

Structure your review with clear headings: Code Quality, Security, Performance.
For each issue, explain the problem, provide actionable recommendations, and note severity.
```

3. Create `metadata.json` in the same directory:

```json
{
  "id": "my-skill",
  "name": "My Awesome Skill",
  "version": "1.0.0",
  "description": "A clear, concise description of what this skill does",
  "category": "code-review",
  "author": "Your Name",
  "tags": ["code-review", "quality"]
}
```

4. Create `README.md` in the same directory with usage examples and expected output.

5. Install and test locally:

```bash
hit install my-skill
```

#### Contributing an Agent

1. Create directory in `libs/agents/src/`:

```bash
mkdir -p libs/agents/src/my-agent
```

2. Create `agent.yaml`:

```yaml
id: my-agent
name: My Agent
version: 1.0.0
description: What this agent does
model: claude-sonnet-4
tools:
  - file-read
  - file-write
  - bash
contextPacks:
  - angular
  - typescript
permissions:
  - read:filesystem
  - write:filesystem
```

3. Add TypeScript configuration types
4. Create README with usage examples

### Step 4: Add Tests

All contributions should include tests:

```typescript
import { describe, it, expect } from 'vitest';
import { validatePrompt } from './my-prompt';

/**
 * Tests for my-prompt validation
 */
describe('my-prompt', () => {
  it('should validate correct input', () => {
    const input = { code: 'test', language: 'TypeScript' };
    expect(validatePrompt(input)).toBe(true);
  });
});
```

### Step 5: Run Quality Checks

```bash
# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Build
pnpm build
```

### Step 6: Commit Your Changes

Use conventional commit messages:

```bash
git add .
git commit -m "feat(prompts): add my-awesome-prompt for code review"
```

**Commit message format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**

```
feat(prompts): add TypeScript code review prompt
fix(cli): resolve installation path issue
docs(readme): update contribution guidelines
```

### Step 7: Push and Create PR

```bash
git push origin feat/my-new-prompt
```

Then create a Pull Request on GitHub with:

- Clear title describing the change
- Description of what was added/fixed
- Link to related issues
- Screenshots/examples if applicable

---

## Quality Standards

All contributions must meet these standards:

### Code Quality

- TypeScript strict mode enabled
- All functions documented with TypeDoc comments (no inline comments)
- No `any` types without justification
- Proper error handling

### Documentation

- Clear README for each tool
- Usage examples with expected outputs
- All configuration options documented

### Testing

- Unit tests for logic
- Integration tests for CLI commands
- Test coverage > 80%

### Security

- No hardcoded secrets or credentials
- Input validation for all user data
- Safe file system operations

---

## Review Process

1. **Automated Checks**: CI runs tests, linting, and security scans
2. **Peer Review**: 2+ team members review the code
3. **Quality Evaluation**: Contribution is tested against evaluators
4. **Approval**: Governance team approves for merge

**Review timeline:**

- Simple fixes: 1-2 days
- New prompts/agents: 3-5 days
- Major features: 1-2 weeks

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're building this together.

---

## Questions?

- Open an issue for questions
- Join discussions in GitHub Discussions
- Check existing documentation first

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

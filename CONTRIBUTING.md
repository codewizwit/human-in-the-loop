# Contributing to Human in the Loop

Thank you for your interest in contributing! This document outlines the process for submitting new prompts, agents, and improvements to the Human in the Loop toolkit.

---

## How to Contribute

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

###2. Before You Start

1. Check existing issues and PRs to avoid duplication
2. For major changes, open an issue first to discuss your approach
3. Read our [Best Practices](./docs/best-practices.md) guide
4. Familiarize yourself with our [Governance](./docs/governance.md) model

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

#### Contributing a Prompt

1. Create a new directory in `libs/prompts/src/`:

```bash
mkdir -p libs/prompts/src/my-prompt
```

2. Create `prompt.yaml`:

```yaml
id: my-prompt
name: My Awesome Prompt
version: 1.0.0
description: A clear, concise description of what this prompt does
category: code-review # or documentation, testing, refactoring, etc.
author: Your Name
license: MIT

variables:
  - name: code
    description: The code to review
    required: true
  - name: language
    description: Programming language
    required: true

template: |
  Review the following {{language}} code:

  {{code}}

  Provide feedback on:
  - Code quality and readability
  - Potential bugs or issues
  - Performance considerations
  - Best practices

examples:
  - input:
      code: "function test() { console.log('hello') }"
      language: 'TypeScript'
    output: 'The function works but could be improved...'
```

3. Add TypeScript types in `libs/prompts/src/my-prompt/types.ts`:

```typescript
/**
 * Input variables for my-prompt
 */
export interface MyPromptInput {
  code: string;
  language: string;
}

/**
 * Expected output structure from my-prompt
 */
export interface MyPromptOutput {
  feedback: string;
  suggestions: string[];
}
```

4. Create README in `libs/prompts/src/my-prompt/README.md`

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

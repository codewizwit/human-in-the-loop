# Contributing to Human in the Loop

Thank you for your interest in contributing! This document outlines the process for submitting new prompts, agents, and improvements to the Human in the Loop toolkit.

---

## How to Contribute

> **Note**: As of v2.0.0, all prompts use **pure XML format** (no YAML frontmatter). See the [Pure XML Template Format Guide](./docs/xml-template-migration.md) for details.

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
3. Read our [Pure XML Template Format Guide](./docs/xml-template-migration.md)
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

#### Contributing a Prompt

1. Create a new directory in `lib/prompts/category/`:

```bash
mkdir -p lib/prompts/code-review/my-prompt
```

2. Create `prompt.md` (Pure XML format):

```xml
<prompt>
  <metadata>
    <id>my-prompt</id>
    <name>My Awesome Prompt</name>
    <version>1.0.0</version>
    <description>A clear, concise description of what this prompt does</description>
    <category>code-review</category>
    <author>Your Name</author>
    <license>MIT</license>
    <tags>
      <tag>code-review</tag>
      <tag>quality</tag>
    </tags>
    <lastUpdated>2025-01-15</lastUpdated>
  </metadata>

  <examples>
    <example>
      <description>Review entire workspace</description>
      <input>
        <user_message>Please review all code in this project</user_message>
      </input>
    </example>
    <example>
      <description>Review specific file</description>
      <input>
        <user_message>Review src/auth/login.ts for security issues</user_message>
      </input>
    </example>
  </examples>

  <context>
You are an expert code reviewer with deep knowledge of software engineering best practices, security, and performance optimization.
  </context>

  <instructions>
Review the code in the current workspace and analyze:

1. **Code Quality**
   - Use Glob tool to find relevant code files
   - Use Read tool to examine each file
   - Assess readability and maintainability

2. **Security**
   - Identify potential vulnerabilities
   - Check for input validation issues

3. **Performance**
   - Identify optimization opportunities
  </instructions>

  <constraints>
- Use Read, Grep, and Glob tools to analyze code
- Focus on critical issues over style preferences
- Provide specific line references for issues
- Include code examples for recommendations
  </constraints>

  <output_format>
Write your code review to a markdown file in the workspace. Use proper markdown syntax with clear headings and code blocks. Structure your review as follows:

**Code Quality**
- [Specific findings with code examples]

**Security**
- [Specific findings with code examples]

**Performance**
- [Specific findings with code examples]

For each issue:
- Explain the problem clearly
- Provide actionable recommendations
- Include code examples showing improvements
- Note severity (Critical, High, Medium, Low)
  </output_format>
</prompt>
```

3. Create `README.md` in the same directory (185-233 words):

````markdown
# My Awesome Prompt

A clear, concise description of what this prompt does.

## What You'll Be Asked

- The prompt automatically analyzes code files in your workspace (no input required)
- Optionally: Specific focus areas (e.g., "focus on security")

## Usage Examples

### Example 1: Full Workspace Review

Analyze an entire project for code quality, security, and performance issues.

**Expected Output:**

\```markdown
**Code Quality**

- src/auth/login.ts:45 - Complex function should be split
  Recommendation: Extract validation logic to separate function

**Security**

- src/api/users.ts:23 - SQL injection vulnerability
  CRITICAL: Use parameterized queries
  \```

### Example 2: Focused Security Review

Review specific components for security vulnerabilities.

**Expected Output:**

\```markdown
**Security**

- Input validation missing on user registration
  Recommendation: Add validation using [library]
  \```

## Related Resources

- [Other Related Prompt](../other-prompt) - Description
- [External Documentation](https://example.com) - Description
- [Tool/Framework Guide](https://example.com) - Description
````

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

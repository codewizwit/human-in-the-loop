# Toolkit Usage

Complete guide to using skills from the Human in the Loop toolkit. All 25 tools use the unified `skill.md` format.

---

## Table of Contents

- [Working with Skills](#working-with-skills)
- [Skill Format](#skill-format)
- [Using Evaluators](#using-evaluators)
- [Implementing Guardrails](#implementing-guardrails)
- [Combining Tools](#combining-tools)

---

## Working with Skills

### What are Skills?

Skills are reusable AI productivity tools for common tasks like code reviews, documentation generation, test creation, architecture planning, and more. Each skill is defined in a unified `skill.md` format with YAML frontmatter and a markdown body.

### Finding Skills

Search the toolkit:

```bash
# Search by keyword
hit search "code review"
hit search "documentation"
hit search "testing"

# Browse all 25 skills interactively
hit install
```

### Installing Skills

```bash
# Install a skill by ID
hit install code-review-ts

# Install with a specific destination
hit install code-review-ts --destination global-skill

# Destination options: global-skill, project-skill, global-command, project-command, custom
```

### Skill Directory Structure

Each skill in `lib/skills/` contains three files:

```
lib/skills/code-review-ts/
├── skill.md             # Skill definition (YAML frontmatter + markdown body)
├── metadata.json        # Machine-readable metadata
└── README.md            # Usage instructions
```

After installation, the skill is copied to your chosen destination:

```
~/.claude/skills/code-review-ts/
├── skill.md
├── metadata.json
└── README.md
```

### Using Skills in Claude Code

Reference an installed skill directly in Claude Code:

```
User: Use the code-review-ts skill to review src/components/UserProfile.tsx
```

Skills are automatically activated based on trigger phrases in their description. For example, `code-review-ts` activates when you mention "review my TypeScript code", "check code quality", or "code review".

### Customizing Skills

Create a custom variant:

```bash
# Copy an existing skill
cp -r ~/.claude/skills/code-review-ts/ ~/.claude/skills/my-custom-review/

# Edit skill.md to customize the YAML frontmatter and instructions
# Then reference your custom skill
```

### Creating Your Own Skills

See [Contributing Guidelines](./contributing-guidelines.md) for details on submitting new skills.

---

## Skill Format

### Unified skill.md Format

All skills use a unified format consisting of YAML frontmatter and a markdown body. The old XML prompt format is deprecated.

### YAML Frontmatter

Required fields in the frontmatter block:

```yaml
---
name: code-review-ts
description: >-
  Automated TypeScript code review for your workspace. Use when user asks to
  "review my TypeScript code", "check code quality", or mentions "code review".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
  - EnterPlanMode
---
```

| Field           | Type     | Rules                                       |
| --------------- | -------- | ------------------------------------------- |
| `name`          | string   | Must be kebab-case (e.g., `code-review-ts`) |
| `description`   | string   | Include trigger phrases for activation      |
| `version`       | string   | Must be valid semver (e.g., `3.0.0`)        |
| `allowed-tools` | string[] | Array of tools the skill can use            |

### Required Markdown Sections

The body must include these `##` sections:

- **When to Activate** - Describes the conditions under which the skill should be triggered
- **Output Format** (or **Output**) - Defines the expected output structure

### Validation

Skills are validated by `src/governance/checks/validate-skills.ts`, which checks:

- Valid YAML frontmatter delimited by `---` lines
- All required frontmatter fields present and correctly typed
- `name` is kebab-case, `version` is valid semver, `allowed-tools` is an array of strings
- Required `##` sections present in the markdown body
- No legacy XML `<prompt>` wrapper detected

Run validation locally:

```bash
npx ts-node src/governance/checks/validate-skills.ts
```

---

## Using Evaluators

### What are Evaluators?

Evaluators are automated quality checks that validate AI outputs against defined criteria.

### Types of Evaluators

**Code Quality**

- Checks code style, complexity, maintainability
- Validates against project conventions
- Identifies code smells

**Security**

- Scans for vulnerabilities
- Checks for exposed secrets
- Validates input sanitization

**Documentation**

- Ensures adequate comments
- Checks documentation completeness
- Validates examples

**Performance**

- Identifies performance bottlenecks
- Checks for inefficient algorithms
- Validates resource usage

### Installing Evaluators

```bash
# Install evaluator (if available as a standalone tool)
hit install code-quality

# Install security review skill
hit install security-review
```

### Running Evaluators

**On AI-Generated Code:**

```bash
# Evaluate single file
hit evaluate --evaluator code-quality ./generated.ts

# Evaluate directory
hit evaluate --evaluator code-quality ./src/

# Run multiple evaluators
hit evaluate --evaluator code-quality,security ./src/
```

**Example Output:**

```
Running evaluators on: ./src/components/Button.tsx

✓ code-quality: PASS
  - Complexity: Low (score: 2/10)
  - Maintainability: High (score: 9/10)
  - Style: Compliant

✗ security: FAIL
  - Issue: Potential XSS vulnerability in props.children
  - Location: Line 23
  - Severity: HIGH
  - Recommendation: Sanitize user input before rendering

Overall: FAIL (1 evaluator failed)
```

### Configuring Evaluators

Create `.evaluatorrc.json`:

```json
{
  "evaluators": {
    "code-quality": {
      "enabled": true,
      "maxComplexity": 10,
      "minMaintainability": 7,
      "enforceStyle": true
    },
    "security": {
      "enabled": true,
      "level": "strict",
      "blockOnFail": true
    }
  }
}
```

### Auto-Evaluation

Run evaluators automatically:

```bash
# Enable auto-evaluation in .hitrc.json
{
  "autoEvaluate": true,
  "evaluators": ["code-quality", "security"]
}

# Now all AI-generated code is automatically evaluated
```

---

## Implementing Guardrails

### What are Guardrails?

Guardrails are safety mechanisms that prevent inappropriate AI usage, enforce policies, and protect sensitive data.

### Types of Guardrails

**Input Guardrails**

- Block prompts containing secrets
- Prevent prohibited content
- Validate prompt structure

**Output Guardrails**

- Filter sensitive data from responses
- Block unsafe code patterns
- Enforce output format

**Operational Guardrails**

- Rate limiting
- Cost controls
- Audit logging

### Installing Guardrails

```bash
# Install security-related skills
hit install security-review
hit install responsible-ai-audit
```

### Configuring Guardrails

Create `.guardrailsrc.json`:

```json
{
  "guardrails": {
    "security-check": {
      "enabled": true,
      "blockSecrets": true,
      "secretPatterns": ["password", "api[_-]?key", "secret", "token"]
    },
    "pii-protection": {
      "enabled": true,
      "blockTypes": ["ssn", "credit-card", "email"],
      "redactInLogs": true
    },
    "rate-limit": {
      "enabled": true,
      "maxRequestsPerHour": 100,
      "maxTokensPerDay": 1000000
    }
  }
}
```

### Guardrail Actions

Guardrails can:

1. **Block** - Prevent the request entirely
2. **Redact** - Remove sensitive content before processing
3. **Warn** - Log warning but allow request
4. **Audit** - Log all requests for compliance

### Example: Secret Detection

```bash
# This prompt will be blocked:
User: "Review this code with my API key: sk-abc123..."

🛡️ Guardrail blocked request
Reason: Detected API key in prompt
Guardrail: security-check
Action: Request blocked

# Use environment variables instead:
User: "Review this code that uses process.env.API_KEY"

✓ Request allowed
```

---

## Combining Tools

### Complete Workflow Example

Combining prompts, agents, evaluators, guardrails, and context packs:

**Scenario: Generate and validate Angular component tests**

**1. Setup**

```bash
# Install relevant skills
hit install unit-test-generator
hit install test-coverage-analysis
hit install angular-modern
hit install security-review
```

**2. Configure**

`.hitrc.json`:

```json
{
  "defaultContextPacks": ["angular", "testing"],
  "autoEvaluate": true,
  "evaluators": ["code-quality", "test-coverage"],
  "guardrails": {
    "security-check": { "enabled": true }
  }
}
```

**3. Use Skills**

In Claude Code, skills activate based on trigger phrases in their descriptions:

```
User: Generate unit tests for src/app/button/button.component.ts
```

The `unit-test-generator` skill activates automatically and uses its allowed tools to analyze the code and produce tests.

**4. Layer Additional Skills**

After generating tests, use additional skills for validation:

```
User: Run a security review on the generated test file
User: Analyze test coverage for the button component
```

**5. Review and Iterate**

Skills produce structured output that you can review and refine iteratively.

### Best Practice: Layered Safety

Always combine multiple tools for safety:

```
1. Guardrails (prevent bad inputs/outputs)
2. Context Packs (provide correct knowledge)
3. Evaluators (validate quality)
4. Human Review (final check)
```

---

## Additional Resources

- [AI Best Practices](./ai-best-practices.md) - Responsible AI usage guidelines
- [Getting Started](./getting-started.md) - Installation and setup
- [Contributing Guidelines](./contributing-guidelines.md) - Submit your own tools
- [Responsible AI Playbook](../RESPONSIBLE-AI-PLAYBOOK.md) - Developer-first AI principles

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

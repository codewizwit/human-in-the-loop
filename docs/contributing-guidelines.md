# Contributing Guidelines

Detailed guide for contributing prompts, agents, evaluators, guardrails, and context packs to the Human in the Loop toolkit.

---

## Quick Links

- [Contribution Workflow](#contribution-workflow)
- [Quality Standards](#quality-standards)
- [Submitting Prompts](#submitting-prompts)
- [Submitting Agents](#submitting-agents)
- [Submitting Evaluators](#submitting-evaluators)
- [Submitting Guardrails](#submitting-guardrails)
- [Submitting Context Packs](#submitting-context-packs)

---

## Contribution Workflow

### Step 1: Prepare Your Contribution

1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/prompt-react-review
   ```
3. **Place your contribution** in the appropriate toolkit directory:
   - Prompts: `lib/prompts/[your-prompt]/`
   - Agents: `lib/agents/[your-agent]/`
   - Evaluators: `lib/evaluators/[your-evaluator]/`
   - Guardrails: `lib/guardrails/[your-guardrail]/`
   - Context Packs: `lib/context-packs/[your-pack]/`

### Step 2: Meet Quality Standards

Every contribution must include:

1. **README.md** with:

   - Clear description
   - Usage examples
   - Installation instructions
   - Prerequisites
   - Known limitations

2. **Definition file** (`prompt.yaml`, `agent.yaml`, etc.) following the schema

3. **Metadata**:

   - Author name/GitHub handle
   - License (MIT recommended)
   - Version (semver format: X.Y.Z)
   - Tags for discoverability

4. **Examples** showing realistic usage

5. **TypeDoc comments** above all functions (no inline comments)

### Step 3: Test Your Contribution

```bash
# Run validation
pnpm nx run governance:validate

# Test locally
hitl install lib/[type]/[your-contribution]
# Use the tool and verify it works as expected

# Run evaluators if applicable
hitl evaluate --evaluator code-quality lib/[your-contribution]
```

### Step 4: Submit Pull Request

1. **Push to your fork**

   ```bash
   git add .
   git commit -m "Add [type]: [name]"
   git push origin feature/[your-contribution]
   ```

2. **Create Pull Request** using the [PR template](../.github/PULL_REQUEST_TEMPLATE.md)

3. **Complete the checklist** in the PR template

4. **Respond to review feedback**

### Step 5: Review Process

Your contribution will be reviewed for:

- [ ] Quality and usefulness
- [ ] Documentation completeness
- [ ] Security concerns
- [ ] Alignment with [Accountability Framework](../ACCOUNTABILITY.md)
- [ ] Technical correctness

---

## Quality Standards

### Code Quality

- TypeScript strict mode compliance
- No inline comments (TypeDoc only)
- Properly formatted (Prettier)
- Follows project conventions

### Documentation Quality

- Clear, concise writing
- Real-world examples
- Prerequisites listed
- Known limitations documented
- Usage instructions step-by-step

### Security Requirements

- No hardcoded secrets
- No malicious code
- Input validation where applicable
- Safe defaults

###Accountability Alignment
All contributions must align with the [Developer-First AI Accountability Framework](../ACCOUNTABILITY.md):

- Enhance developer experience
- Support learning and growth
- Maintain transparency
- Preserve human oversight

---

## Submitting Prompts

### Prompt Structure

```
lib/prompts/[prompt-name]/
├── prompt.yaml          # Prompt definition
├── README.md            # Documentation
└── examples/            # Example usage
    ├── input-1.md
    └── output-1.md
```

### prompt.yaml Schema

```yaml
id: prompt-name
name: Human-Readable Name
description: Brief description of what this prompt does
version: 1.0.0
category: code-review | testing | documentation | refactoring | other

# Variables for customization
variables:
  - name: code
    description: Code to review
    required: true
  - name: focus_areas
    description: Specific areas to focus on
    required: false
    defaultValue: general best practices

# Context packs that provide domain knowledge
contextPacks:
  - typescript
  - testing

# The actual prompt template
template: |
  Review this code with focus on {{focus_areas}}:

  {{code}}

  Provide structured feedback with:
  1. Issues found
  2. Recommendations
  3. Positive patterns

# Examples of usage
examples:
  - name: TypeScript Component Review
    input:
      code: |
        [example code]
      focus_areas: performance, security
    output: |
      [example output]

# Metadata
metadata:
  author: your-github-username
  license: MIT
  tags: [typescript, code-review, security]
  estimatedTokens: 500
```

### README Template

```markdown
# [Prompt Name]

[Brief description]

## Purpose

[Detailed explanation of what this prompt does and when to use it]

## Prerequisites

- Node.js 20+
- TypeScript project
- [Any other requirements]

## Installation

\`\`\`bash
hitl install prompt/[prompt-name]
\`\`\`

## Usage

### Basic Example

\`\`\`
[Show how to use the prompt]
\`\`\`

### Advanced Example

\`\`\`
[Show advanced usage]
\`\`\`

## Variables

| Variable    | Required | Description       | Default                  |
| ----------- | -------- | ----------------- | ------------------------ |
| code        | Yes      | Code to review    | -                        |
| focus_areas | No       | Areas to focus on | "general best practices" |

## Examples

### Example 1: [Scenario]

[Show input and output]

## Limitations

- [List any known limitations]

## Related Tools

- [Link to related prompts/agents]

---

**Author**: [@your-username](https://github.com/your-username)
**License**: MIT
```

---

## Submitting Agents

Agents are more complex than prompts. Requirements:

- Clear scope and purpose
- Well-defined permissions
- Safety constraints (guardrails)
- Evaluation criteria
- Comprehensive testing

See existing agents in `lib/agents/` for examples.

---

## Submitting Evaluators

Evaluators must:

- Have clear pass/fail criteria
- Provide actionable feedback
- Be deterministic (same input → same output)
- Include test cases
- Document scoring methodology

---

## Submitting Guardrails

Guardrails must:

- Have clear trigger conditions
- Define actions (block/warn/redact)
- Include bypass mechanisms for authorized users
- Log all activations
- Be thoroughly tested

---

## Submitting Context Packs

Context packs provide framework knowledge. Include:

- Patterns and best practices
- Anti-patterns to avoid
- Code examples
- Framework-specific conventions
- Common pitfalls

---

## Review Criteria

Your contribution will be evaluated on:

### Usefulness (40%)

- Solves a real problem
- Fills a gap in the toolkit
- Has clear use cases

### Quality (30%)

- Well-documented
- Properly tested
- Follows standards

### Safety (20%)

- No security issues
- Appropriate guardrails
- Safe defaults

### Accountability (10%)

- Aligns with framework
- Preserves human agency
- Transparent operation

---

## After Your Contribution is Merged

1. **Celebrate!** 🎉
2. **Monitor usage** via `hitl stats --tool [your-contribution]`
3. **Respond to issues** reported by users
4. **Update** as needed (bug fixes, improvements)
5. **Maintain** for at least 6 months after submission

---

## Getting Help

- **Questions**: Open an [Issue](https://github.com/codewizwit/human-in-the-loop/issues)
- **Issues**: Report in [Issues](https://github.com/codewizwit/human-in-the-loop/issues)
- **Review Help**: Tag `@maintainers` in your PR

---

## Additional Resources

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Quick overview
- [Governance Model](./governance-model.md) - Review process details
- [Accountability Framework](../ACCOUNTABILITY.md) - Core principles
- [Toolkit Usage](./toolkit-usage.md) - How tools are used

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

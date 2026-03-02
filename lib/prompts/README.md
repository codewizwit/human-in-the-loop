# Prompts

Production-ready Claude prompts for common software development tasks. Each prompt is versioned, well-documented, and includes usage examples.

> **Note**: Several prompts listed below have been upgraded to the unified skill format under [`lib/skills/`](../../lib/skills/). The prompts here remain for backward compatibility. New contributions should consider using the unified skill format—see [`docs/skill-template.md`](../../docs/skill-template.md).

## Structure

```
prompts/
├── architecture/
│   ├── api-design/                    # REST/GraphQL API design patterns
│   └── system-design-review/          # Architecture & scalability analysis
├── ci-cd/
│   ├── aws-deployment-strategy/       # Lambda, ECS, CDK patterns
│   └── pipeline-optimization/         # GitHub Actions optimization
├── code-review-ts/                    # TypeScript code review
├── culture/
│   ├── 1-on-1-prep/                   # Meeting preparation
│   ├── code-review-empathy/           # Empathetic feedback
│   └── team-retrospective/            # Retrospective facilitation
├── documentation/
│   ├── api-documentation/             # API docs from code
│   └── codebase-explainer/            # Repository architecture analysis
├── governance/
│   ├── bias-detection/                # AI bias and fairness analysis
│   ├── responsible-ai-audit/          # AI output quality audit
│   └── security-review/               # OWASP Top 10, vulnerability detection
├── mentorship/
│   └── learning-path/                 # Personalized learning roadmaps
├── meta/
│   ├── context-pack-builder/          # Create context packs
│   └── prompt-optimization/           # Improve existing prompts
├── planning/
│   └── user-story-breakdown/          # Epic → INVEST stories
├── refactoring/                       # (coming soon)
└── testing/
    ├── bdd-scenarios/                 # Gherkin scenarios
    ├── e2e-strategy/                  # Playwright/Cypress planning
    ├── test-coverage-analysis/        # Coverage gap analysis
    └── unit-test-generator/           # Jest/Vitest test generation
```

## What's a Prompt?

A prompt is a reusable template for interacting with Claude. Each prompt defines:

- **Variables**: Input parameters the prompt accepts
- **Template**: The structured prompt text
- **Examples**: Sample inputs and expected outputs
- **Metadata**: Author, version, license, tags

## Usage

### Via CLI

```bash
# Search for prompts
hit search "code review"

# Install a prompt
hit install prompt/code-review-ts

# List installed prompts
hit list
```

### Direct Use

Each prompt is defined in a `prompt.md` file (XML format):

```xml
<claude_prompt version="1.0">
  <id>my-prompt</id>
  <name>My Prompt</name>
  <version>1.0.0</version>
  <description>What this prompt does</description>
  <category>code-review</category>

  <variables>
    <variable>
      <name>code</name>
      <description>The code to analyze</description>
      <required>true</required>
    </variable>
  </variables>

  <template>
Review the following code:
{{code}}

Provide feedback on...
  </template>

  <metadata>
    <author>yourname</author>
    <license>MIT</license>
    <tags>typescript, code-review</tags>
  </metadata>
</claude_prompt>
```

## Available Prompts (21 total)

### Architecture

- **api-design** - REST/GraphQL API design patterns and best practices _(also available as unified skill)_
- **system-design-review** - Architecture & scalability analysis

### CI/CD

- **aws-deployment-strategy** - Lambda, ECS, CDK infrastructure patterns
- **pipeline-optimization** - GitHub Actions cost & speed optimization _(also available as unified skill)_

### Code Quality

- **code-review-ts** - TypeScript code review with constructive feedback _(also available as unified skill)_

### Culture

- **1-on-1-prep** - Structured meeting preparation
- **code-review-empathy** - Transform feedback into helpful coaching
- **team-retrospective** - Facilitate effective team retros

### Documentation

- **api-documentation** - Generate API docs from code
- **codebase-explainer** - Analyze and document repository architecture _(also available as unified skill)_

### Governance

- **bias-detection** - Identify bias in AI-generated content
- **responsible-ai-audit** - Audit AI outputs for accuracy, fairness, transparency _(also available as unified skill)_
- **security-review** - OWASP Top 10, auth flaws, injection detection

### Mentorship

- **learning-path** - Personalized learning roadmaps

### Meta

- **context-pack-builder** - Generate framework context packs
- **prompt-optimization** - Analyze and improve existing prompts

### Planning

- **user-story-breakdown** - Break epics into INVEST stories with acceptance criteria _(also available as unified skill)_

### Testing

- **bdd-scenarios** - Gherkin scenarios from user stories
- **e2e-strategy** - Playwright/Cypress test planning _(also available as unified skill)_
- **test-coverage-analysis** - Coverage gap analysis and risk assessment
- **unit-test-generator** - Generate Jest/Vitest tests with edge cases _(also available as unified skill)_

## Contributing a New Prompt

1. Create a new directory: `prompts/your-prompt-name/`
2. Add `prompt.md` with prompt definition (XML format)
3. Add `README.md` with:
   - Description
   - Usage examples
   - Expected inputs/outputs
4. Test your prompt thoroughly
5. Submit a pull request

### Prompt Requirements

All prompts must have:

- ✅ Unique ID and semantic version
- ✅ Clear description and category
- ✅ Documented variables with types
- ✅ At least 2 usage examples
- ✅ Author and license in metadata
- ✅ README.md with usage instructions

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

---

**Human-in-the-Loop by codewizwit**

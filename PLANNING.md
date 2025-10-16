# Human in the Loop

## Internal Design Proposal

---

## Vision & Purpose

AI productivity tools are transforming how we work, but without centralized governance, we risk inconsistency, duplication, and quality drift. **Human in the Loop** solves this by creating a single source of truth for all AI tooling: prompt libraries, agents, context packs, evaluators, and guardrails.

This project standardizes how we use AI for productivity, improves responsibility and quality, and gives us visibility into adoption across the organization. It's built developer-first, but accessible to everyone.

### The Problem We're Solving

- **Scattered tools**: Prompts and agents live in individual repos, Slack threads, or local files
- **No standardization**: Each team reinvents the wheel with different patterns and quality levels
- **Zero visibility**: We can't track what works, what's adopted, or what needs improvement
- **Quality concerns**: No review process means unvetted AI tools can introduce risk

### What Success Looks Like

- Single repository where all AI productivity tools are discoverable, versioned, and governed
- Standardized contribution workflow that ensures quality and consistency
- Clear metrics on tool adoption and effectiveness
- Developer-friendly CLI that makes it easy to find, install, and use AI tools
- Living documentation that grows with our practices

---

## Repository Structure

```
human-in-the-loop/
├── apps/
│   ├── docs/                    # Documentation site (Next.js)
│   └── cli/                     # TypeScript CLI tool
├── libs/
│   ├── prompts/                 # Shared prompt library
│   ├── agents/                  # Agent definitions and configs
│   ├── evaluators/              # Quality evaluation tools
│   └── guardrails/              # Safety and governance rules
├── context-packs/
│   ├── angular/                 # Angular-specific context
│   ├── nestjs/                  # NestJS-specific context
│   ├── ci-cd/                   # CI/CD patterns and configs
│   ├── prompts/                 # Prompt engineering best practices
│   └── agents/                  # Agent development guides
├── tools/
│   ├── install/                 # Installation scripts
│   └── validation/              # Quality validation tools
├── .github/
│   └── workflows/               # CI/CD automation
└── docs/
    ├── getting-started.md
    ├── best-practices.md
    ├── contribution-guide.md
    └── governance.md
```

---

## Core Components

### 1. Prompt Library (`/libs/prompts`)

Centralized, versioned collection of production-ready prompts organized by use case.

**Structure:**

```typescript
/**
 * Represents a versioned prompt with metadata and usage tracking
 */
interface Prompt {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  template: string;
  variables: string[];
  examples: PromptExample[];
  metadata: PromptMetadata;
}
```

**Key Features:**

- Semantic versioning for prompts
- Category-based organization (code review, documentation, testing, etc.)
- Usage examples and expected outputs
- Quality ratings based on real usage

### 2. Agent Registry (`/libs/agents`)

Catalog of AI agents with their configurations, capabilities, and integration guides.

**Structure:**

```typescript
/**
 * Defines an AI agent configuration with its capabilities and requirements
 */
interface Agent {
  id: string;
  name: string;
  purpose: string;
  model: string;
  tools: string[];
  contextPacks: string[];
  permissions: Permission[];
  evaluationCriteria: EvaluationRule[];
}
```

**Key Features:**

- Agent capabilities and limitations documented
- Required context packs and dependencies
- Performance benchmarks and cost estimates
- Integration patterns for common frameworks

### 3. Context Packs (`/context-packs`)

Framework-specific knowledge bases that provide agents with deep technical context.

**Available Packs:**

- **Angular**: Component patterns, routing, state management, testing
- **NestJS**: Module structure, dependency injection, middleware, guards
- **CI/CD**: Pipeline patterns, deployment strategies, environment configs
- **Prompts**: Prompt engineering techniques, templates, optimization
- **Agents**: Agent development, tool integration, evaluation methods

Each pack includes:

- Framework-specific best practices
- Code examples with TypeDoc comments
- Common pitfalls and solutions
- Integration guides

### 4. Evaluators (`/libs/evaluators`)

Quality assurance tools that validate AI outputs against defined criteria.

**Structure:**

```typescript
/**
 * Evaluates AI-generated output against quality criteria
 */
interface Evaluator {
  id: string;
  name: string;
  criteria: EvaluationCriteria[];
  threshold: number;
  evaluate(input: string, output: string): EvaluationResult;
}
```

**Use Cases:**

- Code quality validation (linting, type safety, test coverage)
- Documentation completeness checks
- Security and compliance verification
- Performance impact assessment

### 5. Guardrails (`/libs/guardrails`)

Safety mechanisms that enforce responsible AI usage and prevent misuse.

**Key Features:**

- Input validation and sanitization
- Output filtering for sensitive data
- Rate limiting and cost controls
- Audit logging for compliance
- Permission-based access control

### 6. TypeScript CLI (`/apps/cli`)

Developer-friendly command-line tool for discovering, installing, and managing AI tools.

**Core Commands:**

```bash
# Search for prompts and agents
hit search "code review"

# Install a prompt or agent
hit install prompt/code-review-ts

# Validate local setup
hit doctor

# Submit a new tool
hit contribute prompt ./my-prompt.yaml

# View usage analytics
hit stats
```

**Features:**

- Interactive prompt selection
- Automatic dependency resolution
- Local caching for offline use
- Usage telemetry (opt-in)

---

## Documentation Site (`/apps/docs`)

Next.js-powered documentation portal with the following pages:

### Getting Started

- Quick setup guide
- CLI installation and configuration
- First prompt/agent walkthrough
- Common workflows

### Best Practices

- Prompt engineering guidelines
- Agent development patterns
- Context pack usage
- Security considerations
- Cost optimization

### Contribution Guide

- How to submit new prompts/agents
- Quality standards and review process
- Testing requirements
- Documentation expectations

### Governance

- Review and approval workflow
- Version management policy
- Deprecation process
- Metrics and reporting

**Technical Standards:**

- All examples in TypeScript
- TypeDoc comments above all functions (no inline comments)
- Code snippets runnable and tested
- Mobile-responsive design

---

## Contribution Workflow

### Submitting New Tools

1. **Develop Locally**

   ```bash
   # Clone the repo
   git clone https://github.com/codewizwit/human-in-the-loop

   # Create feature branch
   git checkout -b prompts/my-new-prompt

   # Add your tool following the template
   cp templates/prompt-template.yaml libs/prompts/my-prompt.yaml
   ```

2. **Validate Quality**

   ```bash
   # Run validation checks
   hit validate ./libs/prompts/my-prompt.yaml

   # Test with evaluators
   npm run test:prompts
   ```

3. **Submit for Review**

   ```bash
   # Create pull request
   gh pr create --title "feat(prompts): add code review prompt for TypeScript"
   ```

4. **Review Process**

   - Automated quality checks run (linting, tests, security scans)
   - Peer review by 2+ team members
   - Evaluation against success criteria
   - Approval required from governance team

5. **Deployment**
   - Merged to main branch
   - Automatically versioned and tagged
   - Published to internal registry
   - Available via CLI within minutes

### Quality Gates

Every contribution must pass:

- **Functionality**: Does it work as intended?
- **Documentation**: Is it well-documented with examples?
- **Security**: Does it introduce any risks?
- **Performance**: What's the cost and latency impact?
- **Maintainability**: Is it easy to update and extend?

---

## Technology Stack

### Monorepo Setup

- **Framework**: Next.js 14+ with App Router
- **Build System**: Nx for monorepo orchestration
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm

### CLI Tool

- **Runtime**: Node.js 20+
- **Framework**: Commander.js for CLI
- **Validation**: Zod for schema validation
- **Testing**: Vitest

### Documentation Site

- **Frontend**: Next.js + React
- **Styling**: Tailwind CSS
- **Content**: MDX for rich documentation
- **Search**: Algolia DocSearch
- **Analytics**: Internal telemetry

### Infrastructure

- **Hosting**: GitHub Pages (docs), npm registry (packages)
- **CI/CD**: GitHub Actions
- **Monitoring**: Custom usage analytics dashboard

---

## Example Use Cases

### Use Case 1: Code Review Automation

**Scenario**: A developer wants consistent, high-quality code reviews for TypeScript PRs.

**Solution**:

```bash
# Install the code review agent
hit install agent/code-review-ts

# Configure for your project
hit config agent/code-review-ts --context angular,nestjs

# Run review on PR
hit review --pr 123
```

**Impact**:

- Catches common issues before human review
- Provides actionable feedback with line-specific comments
- Reduces review time by 40%
- Maintains consistent quality standards

### Use Case 2: Documentation Generation

**Scenario**: A team needs to generate API documentation from NestJS controllers.

**Solution**:

```bash
# Install the docs generator
hit install agent/api-docs-generator

# Generate docs for a controller
hit generate docs ./src/users/users.controller.ts

# Output: Markdown file with full API documentation
```

**Impact**:

- Eliminates manual documentation work
- Keeps docs in sync with code
- Follows company documentation standards
- Saves 2-3 hours per API endpoint

### Use Case 3: Test Case Generation

**Scenario**: Developers need comprehensive test coverage but struggle to write thorough test cases.

**Solution**:

```bash
# Install test generation agent
hit install agent/test-generator

# Generate tests for a service
hit test generate ./src/auth/auth.service.ts --framework jest

# Output: Full test suite with edge cases covered
```

**Impact**:

- Increases test coverage from 60% to 90%
- Identifies edge cases developers might miss
- Maintains consistent testing patterns
- Reduces testing time by 50%

### Use Case 4: Onboarding New Developers

**Scenario**: New team member needs to understand project structure and conventions.

**Solution**:

```bash
# Install onboarding assistant
hit install agent/onboarding-assistant

# Get project overview
hit onboard --project ./

# Interactive walkthrough of codebase
```

**Impact**:

- Reduces onboarding time from 2 weeks to 3 days
- Provides consistent knowledge transfer
- Documents tribal knowledge
- Allows self-paced learning

---

## Governance & Metrics

### Approval Process

- **Prompt/Agent Submissions**: Require 2 approvals from core team
- **Context Pack Updates**: Require domain expert approval
- **Breaking Changes**: Require governance team review
- **Security-Sensitive Tools**: Require security team sign-off

### Usage Metrics

Track adoption and effectiveness:

- Tool installation counts
- Usage frequency by team/individual
- Success rates (evaluator pass/fail)
- Cost per tool execution
- Time saved estimates

### Quality Monitoring

- Regular audits of prompt/agent performance
- User feedback collection and analysis
- Deprecation of low-quality or unused tools
- Continuous improvement based on real usage data

---

## Rollout Plan

### Phase 1: Foundation (Weeks 1-2)

- Set up Nx monorepo with Next.js + TypeScript
- Create basic CLI with core commands
- Build initial documentation site structure
- Define contribution templates

### Phase 2: Core Library (Weeks 3-4)

- Migrate existing prompts to centralized library
- Document top 10 most-used agents
- Create first 3 context packs (Angular, NestJS, Prompts)
- Implement basic evaluators

### Phase 3: Tooling (Weeks 5-6)

- Complete CLI with all features
- Add automated validation and testing
- Set up CI/CD pipelines
- Deploy documentation site

### Phase 4: Adoption (Weeks 7-8)

- Internal beta with 2-3 teams
- Gather feedback and iterate
- Create video tutorials and workshops
- Full rollout to organization

---

## Success Criteria

After 3 months, we should see:

✅ **Adoption**: 80% of engineering teams using at least one tool from the library
✅ **Quality**: 90% of submitted tools passing all quality gates on first review
✅ **Efficiency**: Average 5 hours/week saved per developer using AI tools
✅ **Standardization**: Single source of truth for all AI productivity tooling
✅ **Visibility**: Clear metrics dashboard showing usage and impact

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

# Architecture

System design and technical overview of the Human in the Loop toolkit.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
├─────────────────────────────────────────────────────────────┤
│                          CLI Tool                            │
│  (Discovery, Installation, Execution, Stats)                 │
├─────────────────────────────────────────────────────────────┤
│                      Governance Layer                         │
│  (validate-skills.ts, Quality Checks, Security Scanning)     │
├─────────────────────────────────────────────────────────────┤
│                     Skills (25 unified)                       │
│  lib/skills/ - Each with skill.md, metadata.json, README.md  │
└─────────────────────────────────────────────────────────────┘
```

---

## Repository Structure

```
human-in-the-loop/
├── src/                      # Source code
│   ├── cli/                  # CLI tool implementation
│   │   ├── commands/         # CLI commands
│   │   ├── utils/            # Utility functions
│   │   └── main.ts           # Entry point
│   └── governance/           # Governance tooling
│       └── checks/           # Quality and validation scripts
│
├── lib/                      # AI productivity tools
│   ├── skills/              # 25 unified skills (skill.md + metadata.json + README.md)
│   │   ├── 1-on-1-prep/
│   │   ├── angular-legacy/
│   │   ├── angular-modern/
│   │   ├── api-design/
│   │   ├── api-documentation/
│   │   ├── aws-deployment-strategy/
│   │   ├── bdd-scenarios/
│   │   ├── bias-detection/
│   │   ├── code-review-empathy/
│   │   ├── code-review-ts/
│   │   ├── codebase-explainer/
│   │   ├── context-pack-builder/
│   │   ├── e2e-strategy/
│   │   ├── learning-path/
│   │   ├── nestjs-backend/
│   │   ├── nx-monorepo/
│   │   ├── pipeline-optimization/
│   │   ├── prompt-optimization/
│   │   ├── responsible-ai-audit/
│   │   ├── security-review/
│   │   ├── system-design-review/
│   │   ├── team-retrospective/
│   │   ├── test-coverage-analysis/
│   │   ├── unit-test-generator/
│   │   └── user-story-breakdown/
│   ├── prompts/             # Legacy prompts (deprecated)
│   ├── agents/              # Legacy agents (deprecated)
│   ├── evaluators/          # Quality evaluators
│   ├── guardrails/          # Safety mechanisms
│   └── context-packs/       # Framework knowledge
│
├── docs/                     # Documentation
├── .github/workflows/        # CI/CD pipelines
└── [config files]
```

---

## CLI Architecture

### Component Diagram

```
CLI (Commander.js)
├── Search Command → Skills Index (lib/skills/)
├── Install Command [skill-id] → --destination → Local Install
│   └── (no args) → Interactive Browser
├── List Command → Local Registry
├── Doctor Command → Environment Validator
├── Contribute Command → validate-skills.ts → Submission Handler
└── Stats Command → Metrics Collector
```

### Key Components

**Command Handler**

- Parses CLI arguments
- Routes to appropriate command
- Handles errors gracefully

**Toolkit Index**

- Searchable catalog of all tools
- Metadata for discovery
- Version management

**Package Manager**

- Downloads tools from registry
- Installs to `.claude/` directory
- Manages dependencies

**Local Cache**

- Stores downloaded tools
- Enables offline usage
- Tracks installed versions

**Metrics Collector**

- Anonymous usage telemetry
- Tool popularity tracking
- Performance metrics

---

## Governance Layer

### Validation Pipeline

```
Pull Request
   ↓
[Automated Checks]
   ├→ TypeScript Compilation
   ├→ Type Checking
   ├→ Formatting
   ├→ Security Audit
   ↓
[Documentation Checks]
   ├→ README presence
   ├→ Usage examples
   ├→ TypeDoc comments
   ↓
[Skill Validation (validate-skills.ts)]
   ├→ YAML frontmatter (name, description, version, allowed-tools)
   ├→ Required sections (When to Activate, Output Format)
   ├→ No legacy XML format
   ↓
[Security Scan]
   ├→ Secret detection
   ├→ Dependency vulnerabilities
   ↓
[Human Review]
   ├→ Quality assessment
   ├→ Usefulness evaluation
   ├→ Accountability alignment
   ↓
[Merge & Release]
```

### Validation Components

Located in `src/governance/checks/`:

**validate-skills.ts**

- Unified skill format validation for all 25 skills in `lib/skills/`
- YAML frontmatter extraction and field validation (`name`, `description`, `version`, `allowed-tools`)
- Enforces kebab-case naming, semver versioning, and string-array tool lists
- Checks for required markdown sections: "When to Activate", "Output Format" (or "Output")
- Detects and rejects legacy XML `<prompt>` format

**validate-prompts.sh** (deprecated)

- Legacy XML structure validation
- Required metadata fields
- Schema compliance for old prompt format

**check-docs.sh**

- README completeness
- Usage section presence
- Proper section headers

**check-inline-comments.sh**

- TypeDoc-only enforcement
- No inline // comments in production code
- Test file exemptions

**check-links.sh**

- Markdown link validation
- Broken link detection
- Relative path checking

**Security Validators** (GitHub Actions)

- Secret detection (Trufflehog)
- Dependency scanning
- Security audit

---

## Toolkit Organization

### Skill Structure (Unified Format)

All 25 skills follow the same structure in `lib/skills/`:

```
lib/skills/[skill-name]/
├── skill.md                 # Skill definition (YAML frontmatter + markdown body)
├── metadata.json            # Machine-readable metadata
└── README.md                # Documentation and usage instructions
```

**skill.md format:**

```yaml
---
name: skill-name            # kebab-case identifier
description: >-             # Description with trigger phrases
  Description text here.
version: 3.0.0              # semver
allowed-tools:              # Array of permitted tools
  - Read
  - Glob
  - Grep
---

# Skill Title

## When to Activate
(required section)

## Output Format
(required section)
```

### Data Flow

```
User Request
   ↓
CLI Parser
   ↓
Load Skill Definition (skill.md)
   ↓
Run Guardrails (Input Validation)
   ↓
Send to AI Model (with allowed-tools)
   ↓
Run Guardrails (Output Validation)
   ↓
Run Evaluators
   ↓
Return to User
```

---

## Technology Stack

### Core Technologies

**Build System**: Nx Monorepo

- Fast builds with caching
- Task orchestration
- Dependency graph

**Language**: TypeScript (Strict Mode)

- Type safety
- Better tooling
- Reduced runtime errors

**Package Manager**: pnpm

- Fast installation
- Disk space efficient
- Strict dependency management

### CLI Framework

**Commander.js**

- Command parsing
- Help generation
- Error handling

**Chalk**

- Terminal colors
- Better UX
- Status indicators

### Validation

**Zod**

- Runtime type checking
- Schema validation
- Type inference

**YAML**

- Human-readable config
- Easy to edit
- Wide tool support

---

## Integration Points

### Claude Code Integration

Skills can be installed to various destinations:

```
~/.claude/
├── skills/               # Global skills (--destination global-skill)
└── commands/             # Global commands (--destination global-command)

.claude/
├── skills/               # Project skills (--destination project-skill)
└── commands/             # Project commands (--destination project-command)
```

Claude Code automatically discovers skills in `.claude/` directories.

### CI/CD Integration

GitHub Actions workflows:

**PR Validation** (`.github/workflows/pr-validation.yml`)

- Runs on all pull requests
- Validates quality, security, documentation
- Blocks merge if checks fail

**Auto-Labeling** (`.github/workflows/label-pr.yml`)

- Labels PRs by type (prompt, agent, docs, etc.)
- Helps with triage and organization

---

## Scalability Considerations

### Performance

**CLI Performance**

- Command execution: < 100ms (search, list)
- Installation: < 5s (single tool)
- Validation: < 30s (full check)

**Build Performance**

- Full build: < 60s
- Incremental build: < 10s
- Parallel execution where possible

### Storage

**Local Cache**

- Max size: 1GB (configurable)
- LRU eviction policy
- Compressed storage

**Registry**

- CDN-backed for fast downloads
- Version-specific URLs
- Immutable artifacts

---

## Security Architecture

### Threat Model

**Threats:**

1. Malicious prompt injection
2. Secret leakage
3. Unsafe code execution
4. Supply chain attacks

**Mitigations:**

1. Guardrails validate all inputs/outputs
2. Secret detection in governance layer
3. No eval() or dynamic code execution
4. Dependency scanning + lock files

### Security Boundaries

```
User Input
   ↓ [Guardrails]
Validated Input
   ↓ [Sandboxed Execution]
AI Output
   ↓ [Guardrails]
Validated Output
   ↓ [Evaluators]
Final Result
```

---

## Extension Points

### Adding New Tool Types

1. Define schema in `lib/[type]/schema.ts`
2. Create README template
3. Add validation script to `src/governance/checks/`
4. Update CI workflows to run new validation
5. Update CLI commands to support new type
6. Document in contributing guidelines

### Custom Evaluators

```typescript
/**
 * Custom evaluator interface
 */
export interface Evaluator {
  id: string;
  name: string;
  evaluate(input: string): EvaluationResult;
}

/**
 * Evaluation result
 */
export interface EvaluationResult {
  pass: boolean;
  score: number;
  issues: Issue[];
  recommendations: string[];
}
```

---

## Future Architecture

### Planned Enhancements

**Remote Registry**

- Centralized tool distribution
- Version management
- Usage analytics

**Plugin System**

- Third-party integrations
- Custom tool types
- Extended functionality

**Web UI**

- Browse toolkit visually
- Test tools online
- Community ratings

---

## Related Documentation

- [Contributing Guidelines](./contributing-guidelines.md) - How to contribute
- [Governance Model](./governance-model.md) - Review process
- [Toolkit Usage](./toolkit-usage.md) - Using the tools

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

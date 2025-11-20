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
│  (Validation, Quality Checks, Security Scanning)             │
├─────────────────────────────────────────────────────────────┤
│                          Toolkit                             │
│  Prompts │ Agents │ Evaluators │ Guardrails │ Context Packs  │
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
├── lib/                  # AI productivity tools
│   ├── prompts/             # Reusable prompts
│   ├── agents/              # AI agents
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
├── Search Command → Toolkit Index
├── Install Command → Package Manager → Local Cache
├── List Command → Local Registry
├── Doctor Command → Environment Validator
├── Contribute Command → Submission Handler
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
[Contribution Validation]
   ├→ YAML structure
   ├→ Required metadata
   ├→ Schema compliance
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

**validate-prompts.sh**

- YAML structure validation
- Required metadata fields
- Schema compliance for prompts

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

### Prompt Structure

```
lib/prompts/[prompt-name]/
├── prompt.md                # Prompt definition (Markdown with frontmatter)
├── README.md                # Documentation
├── examples/                # Usage examples
│   ├── input-1.md
│   └── output-1.md
└── [optional files]
```

### Agent Structure

```
lib/agents/[agent-name]/
├── agent.yaml               # Agent configuration
├── README.md                # Documentation
├── tools/                   # Agent-specific tools
├── evaluators/              # Quality checks
└── examples/                # Usage examples
```

### Data Flow

```
User Request
   ↓
CLI Parser
   ↓
Load Prompt/Agent Definition
   ↓
Apply Context Packs
   ↓
Run Guardrails (Input Validation)
   ↓
Send to AI Model
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

### Claude Desktop Integration

```
.claude/
├── prompts/              # Installed prompts
├── agents/               # Installed agents
└── config.json           # User configuration
```

Claude Desktop automatically discovers tools in `.claude/` directory.

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

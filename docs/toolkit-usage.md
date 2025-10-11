# Toolkit Usage

Complete guide to using prompts, agents, evaluators, guardrails, and context packs from the Human in the Loop toolkit.

---

## Table of Contents

- [Working with Prompts](#working-with-prompts)
- [Working with Agents](#working-with-agents)
- [Using Evaluators](#using-evaluators)
- [Implementing Guardrails](#implementing-guardrails)
- [Applying Context Packs](#applying-context-packs)
- [Combining Tools](#combining-tools)

---

## Working with Prompts

### What are Prompts?

Prompts are reusable templates for common AI tasks like code reviews, documentation generation, test creation, and more.

### Finding Prompts

Search the toolkit:

```bash
# Search by keyword
hitl search "code review"
hitl search "documentation"
hitl search "testing"

# List all prompts
hitl list --type prompt
```

### Installing Prompts

```bash
# Install specific prompt
hitl install prompt/code-review-ts

# Install with specific version
hitl install prompt/code-review-ts@1.2.0
```

### Using Prompts

Prompts are installed to your `.claude/` directory:

```
.claude/
└── prompts/
    └── code-review-ts/
        ├── prompt.yaml      # Prompt definition
        ├── README.md        # Usage instructions
        └── examples/        # Example outputs
```

**Using in Claude Desktop/CLI:**

1. Reference the prompt file in your conversation
2. Provide required variables
3. Review and apply the output

**Example:**

```
User: Use the prompt at .claude/prompts/code-review-ts/prompt.yaml

Variables:
- code: [paste code here]
- focus_areas: security, performance

Claude: [Provides structured code review...]
```

### Customizing Prompts

Create a custom variant:

```bash
# Copy existing prompt
cp .claude/prompts/code-review-ts/prompt.yaml ./my-review.yaml

# Edit to customize
# Then use your custom prompt
```

### Creating Your Own Prompts

See [Contributing Guidelines](./contributing-guidelines.md) for details on submitting new prompts.

---

## Working with Agents

### What are Agents?

Agents are autonomous AI assistants configured with specific tools, capabilities, and permissions to perform complex, multi-step tasks.

### Agent vs. Prompt

| Aspect | Prompt | Agent |
|--------|--------|-------|
| Interaction | Single request/response | Multi-step conversation |
| Tools | None | Can use tools (search, execute, etc.) |
| Autonomy | Guided by user | Self-directed within scope |
| Complexity | Simple tasks | Complex workflows |

### Finding Agents

```bash
# Search agents
hitl search "test generation"
hitl search "refactoring"

# List all agents
hitl list --type agent
```

### Installing Agents

```bash
# Install agent
hitl install agent/test-generator

# View agent capabilities
hitl info agent/test-generator
```

### Agent Structure

Agents are defined with:

```yaml
id: test-generator
name: Test Generation Agent
version: 1.0.0

# Model configuration
model: claude-3-5-sonnet-20241022

# Tools the agent can use
tools:
  - file_read
  - file_write
  - code_analysis

# Context packs for domain knowledge
contextPacks:
  - testing
  - typescript

# Permissions and constraints
permissions:
  - read: "**/*.ts"
  - write: "**/*.spec.ts"
  - deny: "**/node_modules/**"

# Evaluation criteria for outputs
evaluationCriteria:
  - code_quality
  - test_coverage
  - security
```

### Using Agents

Agents run autonomously within defined constraints:

```bash
# Start agent
hitl agent test-generator --target src/components/Button.tsx

# The agent will:
# 1. Read the target file
# 2. Analyze the code
# 3. Generate comprehensive tests
# 4. Write test file
# 5. Report results
```

### Monitoring Agents

Track agent activity:

```bash
# View agent logs
hitl agent logs test-generator

# View agent metrics
hitl agent stats test-generator
```

### Agent Safety

Agents are constrained by:

1. **Permissions** - Can only access allowed files/operations
2. **Guardrails** - Validate all agent actions
3. **Evaluators** - Check quality of agent outputs
4. **Audit Logs** - Track all agent activities

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
# Install evaluator
hitl install evaluator/code-quality

# Install multiple evaluators
hitl install evaluator/code-quality evaluator/security
```

### Running Evaluators

**On AI-Generated Code:**

```bash
# Evaluate single file
hitl evaluate --evaluator code-quality ./generated.ts

# Evaluate directory
hitl evaluate --evaluator code-quality ./src/

# Run multiple evaluators
hitl evaluate --evaluator code-quality,security ./src/
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
# Enable auto-evaluation in .hitlrc.json
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
# Install security guardrail
hitl install guardrail/security-check

# Install PII protection guardrail
hitl install guardrail/pii-protection
```

### Configuring Guardrails

Create `.guardrailsrc.json`:

```json
{
  "guardrails": {
    "security-check": {
      "enabled": true,
      "blockSecrets": true,
      "secretPatterns": [
        "password",
        "api[_-]?key",
        "secret",
        "token"
      ]
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

## Applying Context Packs

### What are Context Packs?

Context packs provide framework-specific knowledge, patterns, and best practices to AI without consuming your context window.

### Available Context Packs

```bash
# List available context packs
hitl list --type context

# Output:
# - context/angular        # Angular patterns and best practices
# - context/nestjs         # NestJS backend patterns
# - context/ci-cd          # CI/CD workflows
# - context/react          # React patterns
# - context/testing        # Testing strategies
```

### Installing Context Packs

```bash
# Install single context pack
hitl install context/angular

# Install multiple packs
hitl install context/angular context/nestjs context/testing
```

### Using Context Packs

**Automatically (Recommended):**

Configure in `.hitlrc.json`:

```json
{
  "defaultContextPacks": ["angular", "testing"],
  "autoLoadContextPacks": true
}
```

Now all prompts and agents automatically understand Angular and testing patterns.

**Explicitly:**

Reference in a prompt:

```yaml
# prompt.yaml
contextPacks:
  - angular
  - testing

template: |
  Generate tests for this Angular component:
  {{code}}
```

### Context Pack Contents

Each context pack includes:

- **Patterns** - Framework-specific patterns
- **Best Practices** - Recommended approaches
- **Anti-Patterns** - Things to avoid
- **Examples** - Code examples
- **Documentation** - Framework conventions

### Creating Custom Context Packs

See [Contributing Guidelines](./contributing-guidelines.md#context-packs) for details on creating context packs.

---

## Combining Tools

### Complete Workflow Example

Combining prompts, agents, evaluators, guardrails, and context packs:

**Scenario: Generate and validate Angular component tests**

**1. Setup**

```bash
# Install required tools
hitl install prompt/test-generation
hitl install agent/test-generator
hitl install evaluator/code-quality
hitl install evaluator/test-coverage
hitl install guardrail/security-check
hitl install context/angular
hitl install context/testing
```

**2. Configure**

`.hitlrc.json`:
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

**3. Generate Tests**

```bash
# Use agent to generate tests
hitl agent test-generator --target src/app/button/button.component.ts
```

**4. Automatic Validation**

The workflow automatically:
- ✅ Applies Angular and testing context
- ✅ Runs security guardrail on generated code
- ✅ Evaluates code quality
- ✅ Checks test coverage
- ✅ Reports results

**5. Review and Iterate**

```bash
# Review results
hitl agent logs test-generator --last

# If evaluators failed, regenerate with feedback
hitl agent test-generator --target src/app/button/button.component.ts --feedback "Increase test coverage to 90%"
```

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
- [Accountability Framework](../ACCOUNTABILITY.md) - Developer-first AI principles

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

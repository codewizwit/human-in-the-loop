# AI Best Practices

Comprehensive guide to responsible AI usage, prompt engineering, and optimization strategies for the Human in the Loop toolkit.

---

## Table of Contents

- [Responsible AI Usage](#responsible-ai-usage)
- [Prompt Engineering](#prompt-engineering)
- [Model Selection](#model-selection)
- [Context Management](#context-management)
- [Cost Optimization](#cost-optimization)
- [Quality Assurance](#quality-assurance)
- [Common Pitfalls](#common-pitfalls)

---

## Responsible AI Usage

### Core Principles

Always apply the [Developer-First Responsible AI Playbook](../RESPONSIBLE-AI-PLAYBOOK.md) when using AI tools:

1. **Developer Experience & Growth** - AI should enhance, not replace, developer judgment and learning
2. **Responsibility & Equity** - Ensure fair access and clear accountability
3. **Culture & Collaboration** - Preserve meaningful human interactions
4. **Transparency & Trust** - Make AI reasoning visible and explainable

### Practical Guidelines

**Do:**

- Use AI to accelerate repetitive tasks
- Review and understand all AI-generated code before accepting
- Test AI outputs thoroughly
- Document when and how AI was used
- Preserve opportunities for learning and mentorship

**Don't:**

- Blindly accept AI suggestions without review
- Use AI as a substitute for understanding code
- Skip testing because "AI wrote it"
- Let AI make critical architectural decisions alone
- Remove human review processes

### Human-in-the-Loop Workflow

Always maintain human oversight:

```
1. Define clear requirements
2. Use AI tool to generate initial solution
3. Human review for correctness, security, maintainability
4. Test thoroughly
5. Iterate based on results
6. Document decisions and rationale
```

---

## Prompt Engineering

### Anatomy of a Great Prompt

Effective prompts have these characteristics:

**1. Clear Context**

```markdown
You are reviewing TypeScript code for a React application that uses Redux for state management.
```

**2. Specific Task**

```markdown
Review the attached component for:

- Performance issues
- Accessibility violations
- Redux best practices
```

**3. Desired Output Format**

```markdown
Provide feedback as:

1. Critical issues (must fix)
2. Suggested improvements
3. Positive patterns to maintain
```

**4. Constraints**

```markdown
- Focus only on the component, not the entire app
- Assume TypeScript strict mode
- Target modern browsers (last 2 versions)
```

### Prompt Templates

**Code Review Prompt**

```markdown
# Context

[Describe the codebase, framework, patterns]

# Code to Review

[Paste code here]

# Review Criteria

- [ ] Security vulnerabilities
- [ ] Performance issues
- [ ] Code quality and maintainability
- [ ] Best practices adherence

# Output Format

For each issue found:

- Severity: Critical | High | Medium | Low
- Location: [file:line]
- Issue: [description]
- Recommendation: [specific fix]
```

**Test Generation Prompt**

```markdown
# Context

Function: [function name and purpose]
Framework: [testing framework]
Coverage goal: [unit/integration/e2e]

# Requirements

Generate tests that cover:

1. Happy path
2. Edge cases
3. Error handling
4. Boundary conditions

# Code

[Paste function here]

# Output

Provide complete, runnable test file with:

- Descriptive test names
- Arrange-Act-Assert structure
- Meaningful assertions
```

### Variables and Templating

Use variables for reusable prompts:

```markdown
<!-- prompt.md -->

---

variables:

- name: framework
  description: 'Frontend framework (React, Angular, Vue)'
  required: true

- name: code
  description: 'Code to review'
  required: true

- name: focus_areas
  description: 'Specific areas to focus on'
  required: false
  defaultValue: 'general best practices'

---

Review this {{framework}} code with focus on {{focus_areas}}:

{{code}}
```

---

## Model Selection

### Choosing the Right Model

Different tasks require different models:

| Task                | Recommended Model     | Why                                      |
| ------------------- | --------------------- | ---------------------------------------- |
| Code review         | Claude 3.5 Sonnet     | Deep reasoning, understanding of context |
| Simple completions  | Claude 3 Haiku        | Fast, cost-effective                     |
| Complex refactoring | Claude 3 Opus         | Maximum capability for hard problems     |
| Documentation       | Claude 3.5 Sonnet     | Clear explanations, good writing         |
| Test generation     | Claude 3 Haiku/Sonnet | Consistent output, good at patterns      |

### Model Configuration

**Temperature Settings:**

- `0.0-0.3`: Deterministic tasks (code generation, refactoring)
- `0.4-0.7`: Creative tasks (naming, documentation)
- `0.8-1.0`: Brainstorming (avoid for production code)

**Max Tokens:**

- Set based on expected output length
- Add buffer for explanations (20-30% extra)
- Monitor truncation in responses

---

## Context Management

### Context Window Strategies

Optimize context usage to stay within model limits:

**1. Prioritize Relevant Context**

```
Essential (always include):
- Task description
- Code being modified
- Immediate dependencies

Secondary (include if space allows):
- Related files
- Project conventions
- Historical context

Tertiary (rarely needed):
- Entire codebase
- Full documentation
```

**2. Use Context Packs**

Context packs provide framework-specific knowledge without consuming your context window:

```bash
# Install Angular context pack
hit install context/angular

# Now your prompts understand:
# - Angular component patterns
# - Dependency injection
# - RxJS best practices
# - Testing conventions
```

**3. Hierarchical Context**

Structure context from general to specific:

```markdown
# Project Context (broad)

- Tech stack
- Architecture patterns
- Coding standards

# Module Context (medium)

- Module purpose
- Key files
- Dependencies

# Task Context (specific)

- Exact problem
- Relevant code
- Expected outcome
```

### Managing Large Codebases

**Strategies:**

1. **Chunking** - Break large tasks into smaller, focused prompts
2. **Summarization** - Summarize non-critical context
3. **File References** - Reference file names instead of full contents
4. **Selective Inclusion** - Only include modified sections

---

## Cost Optimization

### Token Efficiency

**Reduce Input Tokens:**

- Remove unnecessary whitespace
- Strip comments when not needed
- Use abbreviated context for simple tasks
- Cache frequently used context (if supported)

**Reduce Output Tokens:**

- Request concise responses
- Limit explanation depth for routine tasks
- Use structured output formats (JSON, lists)

### Cost-Effective Workflows

**1. Progressive Enhancement**

```
Start simple → Add complexity only if needed

Example:
1. Try with Haiku (cheap)
2. If inadequate, use Sonnet (medium)
3. If still inadequate, use Opus (expensive)
```

**2. Batch Processing**

```
Process multiple items in one request:
- Review multiple files together
- Generate multiple tests at once
- Batch similar refactorings
```

**3. Caching Strategy**

```
Cache:
- Project documentation
- Coding standards
- Common patterns
- Framework conventions

Don't cache:
- Code being modified
- Task-specific context
```

### Monitoring Costs

Track token usage per prompt type:

```bash
hit stats --cost-breakdown

# Output:
# Prompt Type          | Calls | Avg Tokens | Total Cost
# code-review-ts       | 47    | 3,200      | $2.34
# test-generator       | 23    | 1,800      | $0.89
# refactor-component   | 12    | 5,400      | $1.67
```

---

## Quality Assurance

### Validating AI Outputs

Never ship AI-generated code without validation:

**1. Evaluators**

Use automated evaluators to catch issues:

```bash
# Install code quality evaluator
hit install evaluator/code-quality

# Run on AI-generated code
hit evaluate --evaluator code-quality ./generated-code.ts
```

**2. Testing Requirements**

AI-generated code must:

- Pass all existing tests
- Include new tests for new functionality
- Meet code coverage requirements
- Pass linting and formatting checks

**3. Human Review Checklist**

- [ ] Does it solve the problem correctly?
- [ ] Is it secure (no injection vulnerabilities)?
- [ ] Is it performant (no obvious bottlenecks)?
- [ ] Is it maintainable (readable, documented)?
- [ ] Does it follow project conventions?
- [ ] Are edge cases handled?
- [ ] Are errors handled appropriately?

### Guardrails

Implement guardrails to prevent issues:

```bash
# Install security guardrail
hit install guardrail/security-check

# This guardrail will:
# - Block prompts containing secrets
# - Validate AI outputs for security issues
# - Log all AI interactions for audit
```

---

## Common Pitfalls

### Pitfall 1: Over-Reliance on AI

**Problem:**
Developers stop thinking critically and accept AI suggestions blindly.

**Solution:**

- Always understand the code before accepting
- Require explanation for complex changes
- Maintain "AI-free zones" for critical systems
- Regular code reviews by humans

### Pitfall 2: Inadequate Context

**Problem:**
AI provides incorrect solutions because it lacks necessary context.

**Solution:**

- Use context packs for framework-specific knowledge
- Include relevant code and dependencies
- Specify constraints and requirements explicitly
- Provide examples of desired output

### Pitfall 3: Inconsistent Patterns

**Problem:**
AI generates code that doesn't match project conventions.

**Solution:**

- Include coding standards in prompts
- Use project-specific prompt templates
- Configure evaluators to enforce conventions
- Regular audits of AI-generated code

### Pitfall 4: Security Vulnerabilities

**Problem:**
AI introduces security issues (SQL injection, XSS, etc.).

**Solution:**

- Always run security evaluators
- Human review all authentication/authorization code
- Never blindly accept AI suggestions for security-critical code
- Use guardrails to block unsafe patterns

### Pitfall 5: Technical Debt

**Problem:**
AI generates code that "works" but is hard to maintain.

**Solution:**

- Evaluate for maintainability, not just correctness
- Reject overly complex solutions
- Require documentation for non-obvious logic
- Track technical debt from AI-generated code

---

## Best Practices Checklist

Before using AI in your workflow:

- [ ] Read the [Responsible AI Playbook](../RESPONSIBLE-AI-PLAYBOOK.md)
- [ ] Install relevant context packs for your tech stack
- [ ] Configure evaluators for your quality standards
- [ ] Set up guardrails for security and compliance
- [ ] Establish human review requirements
- [ ] Define clear success criteria for AI assistance
- [ ] Monitor costs and adjust usage as needed

---

## Additional Resources

- [Responsible AI Playbook](../RESPONSIBLE-AI-PLAYBOOK.md) - Developer-first AI principles
- [Toolkit Usage](./toolkit-usage.md) - How to use prompts, agents, evaluators
- [Contributing Guidelines](./contributing-guidelines.md) - Submit your own prompts
- [Governance Model](./governance-model.md) - Quality standards and review process

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

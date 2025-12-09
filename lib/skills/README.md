# Skills

Framework-specific expertise modules that provide AI agents with deep technical knowledge for particular programming languages, frameworks, and patterns. Skills are available for both Claude Code and GitHub Copilot integration.

## What Are Skills?

Skills are comprehensive knowledge bases designed to teach AI models the best practices, patterns, and anti-patterns for specific frameworks or technologies. Each skill is tailored for optimal performance on that technology and includes:

- **Framework-specific best practices** - Patterns recommended by the framework maintainers
- **Modern vs. legacy approaches** - Clear guidance on what's current vs. deprecated
- **Code examples** - Real-world patterns with TypeScript/TypeDoc comments
- **Testing strategies** - How to test effectively within the framework
- **Common anti-patterns** - What to avoid and why
- **Migration guides** - How to upgrade from older versions
- **Performance tips** - Optimization techniques specific to the framework

## How Skills Differ from Context Packs

While context packs and skills both contain framework knowledge, they serve different purposes:

| Aspect          | Skills                                       | Context Packs                       |
| --------------- | -------------------------------------------- | ----------------------------------- |
| **Purpose**     | AI model instruction & knowledge             | Additional reference material       |
| **Format**      | Markdown prompts for Claude/Copilot          | Documentation & guides              |
| **Integration** | Automatic activation via Claude Code/Copilot | Manual loading when needed          |
| **Content**     | Do's/don'ts, patterns, best practices        | In-depth guides, API docs, examples |
| **Use Case**    | Real-time coding assistance                  | Research & learning                 |
| **Frequency**   | Always used when activated                   | Occasional reference                |

**Example**: The `angular-modern` skill teaches Claude Code to write modern Angular code automatically. The corresponding context pack provides supplementary documentation on Angular architecture.

## File Structure

Each skill directory contains four files:

```
skills/
├── angular-modern/                  # Angular 16+ with signals, standalone
│   ├── README.md
│   ├── metadata.json
│   ├── claude-skill.md
│   └── copilot-instructions.md
├── angular-legacy/                  # Pre-Angular 16 with NgModules, RxJS
│   ├── README.md
│   ├── metadata.json
│   ├── claude-skill.md
│   └── copilot-instructions.md
├── nestjs-backend/                  # NestJS backend patterns
│   ├── README.md
│   ├── claude-skill.md
│   └── copilot-instructions.md
└── nx-monorepo/                     # Nx monorepo best practices
    ├── README.md
    ├── claude-skill.md
    └── copilot-instructions.md
```

### README.md

Overview of the skill with:

- What's included
- Installation instructions (with all three options)
- Key patterns (3-4 code examples)
- When to use this skill
- Prerequisites/version requirements
- Related skills
- References

**Example**: `/lib/skills/angular-modern/README.md`

### metadata.json

Structured metadata for the skill. Required fields:

```json
{
  "id": "angular-modern",
  "name": "Angular Modern",
  "version": "1.0.0",
  "type": "skill",
  "description": "Modern Angular development with signals, computed, effect, standalone components, and latest patterns (Angular 16+)",
  "category": "framework",
  "tags": [
    "angular",
    "signals",
    "standalone",
    "modern",
    "typescript",
    "frontend"
  ],
  "platforms": ["claude-code", "github-copilot"],
  "metadata": {
    "author": "Human-in-the-Loop",
    "license": "MIT",
    "frameworks": ["angular"]
  },
  "minAngularVersion": "16.0.0"
}
```

**Field Definitions**:

- `id` - Unique identifier (kebab-case, must be unique across all skills)
- `name` - Human-readable skill name
- `version` - Semantic version (MAJOR.MINOR.PATCH)
- `type` - Always "skill"
- `description` - 1-2 sentence description of what the skill teaches
- `category` - Category: "framework", "tool", "methodology", "pattern"
- `tags` - Array of searchable keywords (7-10 tags recommended)
- `platforms` - Array of supported platforms: "claude-code", "github-copilot", or both
- `metadata.author` - Author/organization name
- `metadata.license` - License type (MIT, Apache-2.0, etc.)
- `metadata.frameworks` - Primary frameworks covered (if applicable)
- Additional fields - Version constraints like `minAngularVersion`, `maxNodeVersion`, etc.

### claude-skill.md

Markdown content that teaches Claude Code the skill. Format:

```markdown
---
name: angular-modern
description: Apply modern Angular patterns with signals, computed, effect...
---

# Angular Modern Skill

[Comprehensive content covering patterns, best practices, anti-patterns, testing]
```

**Content Structure**:

1. YAML frontmatter with `name` and `description`
2. Skill title as H1
3. Activation triggers (when to use)
4. Core concepts with examples
5. Best practices & anti-patterns
6. Testing patterns
7. Migration guides (if applicable)
8. References

**Key Characteristics**:

- ~800-1000 lines of markdown
- Code examples with `typescript` syntax highlighting
- Use checkmarks (✅) and X marks (❌) for good/bad patterns
- Include both positive and negative examples
- Include at least 5-10 code examples
- Focus on practical, actionable guidance

### copilot-instructions.md

GitHub Copilot-compatible instructions. Format similar to `claude-skill.md` but optimized for Copilot's instruction format:

```markdown
---
applyTo: '**/*.ts,**/*.component.ts,**/*.service.ts,**/*.html'
---

# Angular Modern Development (Angular 16+)

[Practical guidelines for Copilot to follow when generating code]
```

**Key Differences from claude-skill.md**:

- Shorter, more concise
- Include `applyTo` glob pattern in frontmatter
- Focus on "do's and don'ts" rather than deep explanations
- Include brief code examples (2-3 lines)
- More imperative tone ("DO use signals", "DON'T use @Input")

## Installation Options

### Option 1: As Claude Code Skill

```bash
hit install skill/angular-modern --as-skill
```

**Effect**: Copies `claude-skill.md` to `.claude/skills/angular-modern.md`

**Usage**: Claude Code automatically loads and applies the skill when working with Angular code in your project.

**Best for**: Real-time code generation and review assistance in Claude Code

### Option 2: As GitHub Copilot Custom Instruction

```bash
hit install skill/angular-modern --as-copilot
```

**Effect**: Copies `copilot-instructions.md` to `.github/instructions/angular-modern.instructions.md`

**Usage**: GitHub Copilot reads and applies these instructions when generating code suggestions in VS Code

**Best for**: Real-time code suggestions while writing in your IDE

### Option 3: As Documentation

```bash
hit install skill/angular-modern
```

**Effect**: Installs to `~/.claude/tools/skill/angular-modern/`

**Usage**: Accessible as reference material without automatic activation

**Best for**: Learning and research

## Available Skills

### Angular Modern

**ID**: `angular-modern`
**Version**: 1.0.0
**Minimum**: Angular 16.0.0
**Platforms**: Claude Code, GitHub Copilot

Framework-specific expertise for **modern Angular 16+** development using signals, computed values, effects, and standalone components. Use this skill when working with current Angular applications using the latest reactive primitives.

**What's Covered**:

- Signals for reactive state management
- Computed values for derived state
- Effects for side effects
- Signal-based inputs and outputs
- Standalone components (no NgModules)
- Resource API for data loading (Angular 19+)
- Control flow syntax (@if, @for, @switch)
- Service-level state management
- Component testing patterns

**When to Activate**:

- Building new Angular 16+ applications
- Working with signals, computed, or effect
- Using standalone components
- Implementing signal-based inputs/outputs
- Migrating from RxJS to signals

**Installation**:

```bash
hit install skill/angular-modern --as-skill
hit install skill/angular-modern --as-copilot
```

**Learn More**: See [Angular Modern README](./angular-modern/README.md)

### Angular Legacy

**ID**: `angular-legacy`
**Version**: 1.0.0
**Maximum**: Angular 15.x
**Platforms**: Claude Code, GitHub Copilot

Framework-specific expertise for **legacy Angular (pre-16)** development using NgModules, lifecycle hooks, decorators, and RxJS observables.

**What's Covered**:

- NgModule structure and organization
- Lifecycle hooks (ngOnInit, ngOnDestroy, etc.)
- @Input/@Output decorators
- Structural directives (*ngIf, *ngFor, \*ngSwitch)
- RxJS observables for state management
- Change detection strategies
- Subscription management patterns

**When to Activate**:

- Maintaining pre-Angular 16 applications
- Working with NgModule-based architecture
- Using RxJS observables for state
- Implementing traditional lifecycle hooks
- Working with decorator-based inputs/outputs

**Installation**:

```bash
hit install skill/angular-legacy --as-skill
hit install skill/angular-legacy --as-copilot
```

**Learn More**: See [Angular Legacy README](./angular-legacy/README.md)

## How to Create a New Skill

### Step 1: Plan the Skill

Identify:

- **Framework/Technology**: What is this skill for?
- **Audience**: Junior developers, experienced developers, or both?
- **Version Range**: What versions does this apply to?
- **Key Patterns**: What are 5-10 essential patterns for this technology?
- **Anti-patterns**: What are common mistakes to avoid?

### Step 2: Create Directory Structure

```bash
mkdir -p lib/skills/my-framework
cd lib/skills/my-framework
touch README.md metadata.json claude-skill.md copilot-instructions.md
```

### Step 3: Write metadata.json

```json
{
  "id": "my-framework",
  "name": "My Framework",
  "version": "1.0.0",
  "type": "skill",
  "description": "Expert guidance on building applications with My Framework",
  "category": "framework",
  "tags": ["framework", "typescript", "example"],
  "platforms": ["claude-code", "github-copilot"],
  "metadata": {
    "author": "Human-in-the-Loop",
    "license": "MIT",
    "frameworks": ["my-framework"]
  },
  "minVersion": "1.0.0"
}
```

### Step 4: Write README.md

Structure:

```markdown
# My Framework Skill

Brief overview (2-3 sentences)

## Overview

What's included (bullet points)

## Installation

Show all three installation options:

- As Claude Code Skill
- As GitHub Copilot Custom Instruction
- As Documentation

## Key Patterns

Include 3-4 code examples showing essential patterns

## When to Use This Skill

## Prerequisites

## Related Skills

## References
```

**Length**: 200-300 lines
**Code Examples**: 4-8 examples

### Step 5: Write claude-skill.md

Structure:

```markdown
---
name: my-framework
description: Apply My Framework best practices...
---

# My Framework Skill

## When to Activate This Skill

- List activation triggers

## Core Concepts

- Explain 3-5 key concepts

## Essential Patterns

- Detailed examples of 5-10 patterns
- Include both positive (✅) and negative (❌) examples

## Best Practices Checklist

- Do's and don'ts
- Common anti-patterns

## Testing Patterns

- How to test effectively

## Migration Guides (if applicable)

- Upgrading between versions

## References

- Links to official docs
```

**Length**: 800-1200 lines
**Code Examples**: 15-25 examples
**Focus**: Comprehensive, educational, thorough

### Step 6: Write copilot-instructions.md

Structure:

```markdown
---
applyTo: '**/*.ts,**/*.component.ts'
---

# My Framework Development

## Core Principles

1. Principle one
2. Principle two

## Code Patterns

## Do's and Don'ts

## Testing
```

**Length**: 200-400 lines
**Code Examples**: 5-8 small examples
**Focus**: Concise, actionable, scannable

### Step 7: Add Comprehensive Examples

Each skill should include:

**In claude-skill.md**:

```typescript
// ✅ CORRECT: Best practice example
export class MyComponent {
  // Recommended approach
}

// ❌ WRONG: Anti-pattern example
export class MyComponent {
  // Pattern to avoid and why
}
```

**In copilot-instructions.md**:

```typescript
// ✅ DO use this pattern
count = signal(0);

// ❌ DON'T use this pattern
count = 0;
```

### Step 8: Version and Release

1. Set `version` in `metadata.json` to semantic version (e.g., "1.0.0")
2. Add appropriate tags for discoverability
3. Include all frameworks in tags and metadata
4. Test installations with `hit install`

### Step 9: Submit Pull Request

Include:

- New skill directory with all 4 files
- Update to `/lib/skills/README.md` with new skill entry
- Description of when to use the skill
- Link to related skills

## Metadata.json Format Reference

### Required Fields

```json
{
  "id": "string (kebab-case, unique)",
  "name": "string (human-readable)",
  "version": "string (semantic version)",
  "type": "string (always 'skill')",
  "description": "string (1-2 sentences)",
  "category": "string (framework|tool|methodology|pattern)",
  "tags": ["string array (7-10 tags)"],
  "platforms": ["string array (claude-code, github-copilot)"],
  "metadata": {
    "author": "string",
    "license": "string",
    "frameworks": ["string array"]
  }
}
```

### Optional Fields (For Version Constraints)

```json
{
  "minVersion": "1.0.0",
  "maxVersion": "2.0.0",
  "minAngularVersion": "16.0.0",
  "maxAngularVersion": "18.x",
  "minNodeVersion": "18.0.0",
  "minTypeScriptVersion": "4.9.0"
}
```

### Optional Fields (For Additional Metadata)

```json
{
  "author": "string (individual name)",
  "authorEmail": "string",
  "repository": "string (GitHub URL)",
  "keywords": ["string array"],
  "dependencies": {
    "frameworks": ["string array"],
    "tools": ["string array"]
  }
}
```

## Best Practices for Skills

1. **Keep skills focused** - One skill per framework/technology, not multiple
2. **Use real examples** - Show actual code patterns, not theoretical examples
3. **Include both do's and don'ts** - Use ✅ and ❌ to make it scannable
4. **Version carefully** - Use semantic versioning (MAJOR.MINOR.PATCH)
5. **Test with both tools** - Ensure content works with Claude Code and Copilot
6. **Keep claude-skill.md and copilot-instructions.md in sync** - Same core guidance, different tone
7. **Include prerequisites** - List version requirements clearly
8. **Link to originals** - Always reference official documentation
9. **Make it searchable** - Use descriptive tags for discovery
10. **Update regularly** - Keep skills current as frameworks evolve

## Skill Discovery

### Search for Skills

```bash
hit search "angular"
hit search "signals"
hit search "framework"
```

### List Installed Skills

```bash
hit list skills
```

### View Skill Details

```bash
hit show skill/angular-modern
```

## Integration with Claude Code

When a skill is installed with `--as-skill`, it's automatically activated when Claude Code detects relevant file types or project patterns.

**Example**: The `angular-modern` skill activates automatically when Claude Code is used in an Angular 16+ project.

You can also explicitly activate a skill:

```bash
hit activate skill/angular-modern
```

## Integration with GitHub Copilot

When a skill is installed with `--as-copilot`, GitHub Copilot reads the instructions file (`.github/instructions/`) and applies them when generating code.

The `applyTo` glob pattern determines when the instructions are active:

```markdown
---
applyTo: '**/*.ts,**/*.component.ts,**/*.service.ts,**/*.html'
---
```

## Contributing

To contribute a new skill or update an existing one:

1. Follow the structure and guidelines in this README
2. Include all four required files
3. Test the skill with both Claude Code and GitHub Copilot
4. Submit a pull request with detailed description
5. Include links to official framework documentation

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

## Support

For questions about skills or to suggest new ones:

- Open an issue: [GitHub Issues](https://github.com/codewizwit/human-in-the-loop/issues)
- Visit docs: [Human-in-the-Loop Documentation](https://github.com/codewizwit/human-in-the-loop)

---

**Human-in-the-Loop by codewizwit**
Framework expertise for better AI coding assistance

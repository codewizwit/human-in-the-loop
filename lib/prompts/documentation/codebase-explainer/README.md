# Codebase Explainer

Analyze and explain a codebase's architecture, structure, patterns, and conventions. Generates comprehensive documentation to help developers understand unfamiliar repositories quickly.

## What It Does

- **Analyzes** repository structure and identifies patterns
- **Explains** architecture with ASCII diagrams
- **Documents** directory purposes and conventions
- **Guides** new developers with getting started steps

## What You'll Be Asked

When using this prompt, you'll need to provide:

1. **Directory Structure** (required) - The file/folder tree of the codebase
2. **Key Files** (optional) - Contents of package.json, config files, etc.
3. **Tech Stack** (optional) - Known technologies if available
4. **Depth** (optional) - Level of detail: quick, standard, or comprehensive
5. **Focus Area** (optional) - Specific area to emphasize (architecture, testing, etc.)

## Depth Levels

| Level             | Sections Included               | Use Case             |
| ----------------- | ------------------------------- | -------------------- |
| **quick**         | Summary, Structure, Quick Start | Fast orientation     |
| **standard**      | All sections, moderate detail   | Day-to-day reference |
| **comprehensive** | All sections, extensive detail  | Deep onboarding      |

## Usage Examples

### Example 1: Nx Monorepo (Comprehensive)

```
Directory structure: [paste tree output]
Key files: package.json, nx.json contents
Depth: comprehensive
```

**What You Get:**

- Architecture diagram showing apps and libs
- Directory breakdown with purpose tables
- Nx-specific patterns explained
- Build/test/lint commands
- Key files to read first
- Contributor guide

### Example 2: NestJS Backend (Standard)

```
Directory structure: [paste tree output]
Depth: standard
```

**What You Get:**

- Module architecture diagram
- Feature module breakdown
- Common patterns (guards, pipes, interceptors)
- Request pipeline explanation
- Database/ORM setup
- Getting started commands

### Example 3: React Frontend (Quick)

```
Directory structure: [paste tree output]
Depth: quick
```

**What You Get:**

- Quick summary (2-3 sentences)
- Directory purpose table
- Essential commands
- Key files list

## Output Sections

Every codebase explanation includes:

| Section                   | Purpose                     |
| ------------------------- | --------------------------- |
| **Quick Summary**         | 2-3 sentence overview       |
| **Architecture Overview** | ASCII diagram of components |
| **Directory Breakdown**   | Purpose of each directory   |
| **Key Patterns**          | Conventions and code style  |
| **Entry Points**          | Where execution starts      |
| **Dependencies**          | Major deps and their roles  |
| **Getting Started**       | Steps for new developers    |
| **Common Tasks**          | Frequent commands           |

## Supported Project Types

| Type            | Patterns Recognized                       |
| --------------- | ----------------------------------------- |
| **Nx Monorepo** | Apps, libs, project.json, nx.json         |
| **Angular**     | Modules, components, services, routing    |
| **React**       | Components, hooks, Redux/Zustand, routing |
| **NestJS**      | Modules, controllers, services, guards    |
| **Node.js**     | Express routes, middleware, utils         |
| **Full-stack**  | Combined frontend + backend patterns      |

## Architecture Diagram Style

The prompt generates ASCII diagrams like:

```
┌─────────────────────────────────────────────────────────────┐
│                        Application                           │
├─────────────────────────────────────────────────────────────┤
│  Feature Modules                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Module  │ │  Module  │ │  Module  │                    │
│  │    A     │ │    B     │ │    C     │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
├─────────────────────────────────────────────────────────────┤
│  Shared Infrastructure                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │  Utils   │ │ Services │ │  Types   │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## Tips for Best Results

1. **Include the full tree** - More context = better analysis
2. **Add key config files** - package.json, tsconfig.json reveal tech choices
3. **Specify focus area** - If you care most about testing, say so
4. **Use comprehensive depth** - For unfamiliar, complex codebases
5. **Use quick depth** - For simple orientation or time constraints

## Related Resources

- [API Documentation](../api-documentation) - Generate API docs

<prompt>
  <metadata>
    <id>codebase-explainer</id>
    <name>Codebase Explainer</name>
    <version>1.0.0</version>
    <description>Analyze and explain a codebase's architecture, structure, patterns, and conventions. Generates comprehensive documentation to help developers understand unfamiliar repositories quickly.</description>
    <category>documentation</category>
    <author>codewizwit</author>
    <license>MIT</license>
    <tags>
      <tag>documentation</tag>
      <tag>onboarding</tag>
      <tag>architecture</tag>
      <tag>codebase</tag>
      <tag>developer-experience</tag>
      <tag>exploration</tag>
    </tags>
    <lastUpdated>2025-12-01</lastUpdated>
  </metadata>

  <variables>
    <variable name="directory_structure" required="true">The directory tree or file listing of the codebase</variable>
    <variable name="key_files" required="false">Contents of key configuration files (package.json, tsconfig.json, etc.)</variable>
    <variable name="tech_stack" required="false">Known technologies if available</variable>
    <variable name="depth" required="false" default="standard">Level of detail (quick, standard, comprehensive)</variable>
    <variable name="focus_area" required="false">Specific area to focus on (architecture, testing, deployment, etc.)</variable>
  </variables>

  <examples>
    <example>
      <title>Angular Nx Monorepo</title>
      <input>
Directory structure:
```
human-in-the-loop/
├── .github/
│   └── workflows/
│       ├── pr-validation.yml
│       └── publish-npm.yml
├── docs/
│   ├── architecture.md
│   ├── cli-reference.md
│   └── getting-started.md
├── lib/
│   ├── agents/
│   ├── context-packs/
│   ├── evaluators/
│   ├── guardrails/
│   ├── prompts/
│   │   ├── architecture/
│   │   ├── ci-cd/
│   │   ├── culture/
│   │   ├── documentation/
│   │   ├── governance/
│   │   ├── mentorship/
│   │   ├── meta/
│   │   ├── planning/
│   │   └── testing/
│   └── skills/
├── src/
│   ├── cli/
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   ├── utils/
│   │   │   └── main.ts
│   │   ├── project.json
│   │   └── package.json
│   └── governance/
│       └── checks/
├── nx.json
├── package.json
├── tsconfig.base.json
└── CLAUDE.md
```

Key files:

- package.json shows: nx, typescript, jest, prettier, eslint
- nx.json configured for CLI project
- CLAUDE.md contains AI assistant instructions

Depth: comprehensive
</input>
<output>

# Codebase Explainer: Human-in-the-Loop AI Hub

## Quick Summary

This is an **Nx monorepo** containing a CLI tool and library of AI prompt templates, context packs, and governance tools. It's designed to help developers work more effectively with AI assistants by providing curated, tested prompts and best practices.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      human-in-the-loop                       │
├─────────────────────────────────────────────────────────────┤
│  Applications                                                │
│  ┌─────────────┐                                            │
│  │   CLI       │  Command-line interface for managing       │
│  │   (src/cli) │  prompts, context packs, and skills        │
│  └─────────────┘                                            │
├─────────────────────────────────────────────────────────────┤
│  Libraries                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ prompts  │ │ context- │ │  skills  │ │evaluators│       │
│  │          │ │  packs   │ │          │ │          │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐                                  │
│  │  agents  │ │guardrails│                                  │
│  └──────────┘ └──────────┘                                  │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ GitHub   │ │Governance│ │   Docs   │                    │
│  │ Actions  │ │  Checks  │ │          │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Project Type

- **Monorepo Tool**: Nx
- **Language**: TypeScript
- **Package Manager**: pnpm (inferred from Nx + modern setup)
- **Primary Application**: CLI tool

---

## Directory Structure Breakdown

### `/src` - Application Code

| Directory                | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `src/cli/`               | Main CLI application                                      |
| `src/cli/src/commands/`  | CLI command implementations (install, list, search, etc.) |
| `src/cli/src/utils/`     | Shared utilities (file operations, logging, registry)     |
| `src/cli/src/main.ts`    | CLI entry point                                           |
| `src/governance/checks/` | Validation scripts for quality gates                      |

### `/lib` - Shared Libraries

| Directory            | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| `lib/prompts/`       | Curated AI prompt templates organized by category |
| `lib/context-packs/` | Domain knowledge bundles for AI assistants        |
| `lib/skills/`        | AI skill configurations (Claude, Copilot)         |
| `lib/agents/`        | AI agent definitions                              |
| `lib/evaluators/`    | Output quality evaluation rules                   |
| `lib/guardrails/`    | Safety and constraint definitions                 |

### `/docs` - Documentation

| File                 | Purpose                     |
| -------------------- | --------------------------- |
| `architecture.md`    | System design and decisions |
| `cli-reference.md`   | CLI command documentation   |
| `getting-started.md` | Quick start guide           |

### Root Configuration

| File                 | Purpose                                 |
| -------------------- | --------------------------------------- |
| `nx.json`            | Nx workspace configuration              |
| `package.json`       | Dependencies and scripts                |
| `tsconfig.base.json` | Shared TypeScript config                |
| `CLAUDE.md`          | AI assistant instructions for this repo |

---

## Key Patterns & Conventions

### 1. Prompt Organization

Prompts follow a consistent category-based structure:

```
lib/prompts/
├── [category]/
│   └── [prompt-name]/
│       ├── prompt.md      # XML-structured prompt template
│       └── README.md      # Usage documentation
```

**Categories**: architecture, ci-cd, culture, documentation, governance, mentorship, meta, planning, testing

### 2. Nx Project Structure

- Single application (`cli`) in `src/`
- Libraries in `lib/` are content packages, not buildable code
- `project.json` defines build, test, lint targets

### 3. Code Style

- TypeScript strict mode
- TypeDoc comments (no inline `//` comments)
- Prettier + ESLint for formatting/linting
- Jest for testing

### 4. AI-First Design

- `CLAUDE.md` provides context for AI assistants
- Prompts use XML structure for LLM parsing
- Skills support multiple AI tools (Claude, Copilot)

---

## Entry Points

### CLI Application

```typescript
// src/cli/src/main.ts
// Entry point - parses commands and routes to handlers

// Available commands (src/cli/src/commands/):
// - install: Install prompts/context packs
// - list: List available resources
// - search: Search for prompts
// - stats: Show usage statistics
// - doctor: Diagnose installation issues
// - contribute: Contribute new prompts
```

### Build & Run

```bash
# Install dependencies
pnpm install

# Build CLI
pnpm build

# Run CLI
./dist/src/cli/main.js [command]

# Or via nx
npx nx run cli:build
```

---

## Dependencies & Their Roles

### Production Dependencies

| Dependency  | Role                     |
| ----------- | ------------------------ |
| `commander` | CLI argument parsing     |
| `chalk`     | Terminal styling         |
| `fs-extra`  | Enhanced file operations |
| `glob`      | File pattern matching    |
| `yaml`      | YAML parsing for prompts |

### Development Dependencies

| Dependency   | Role                   |
| ------------ | ---------------------- |
| `nx`         | Monorepo orchestration |
| `typescript` | Type checking          |
| `jest`       | Unit testing           |
| `eslint`     | Code linting           |
| `prettier`   | Code formatting        |

---

## CI/CD Pipeline

### PR Validation (`.github/workflows/pr-validation.yml`)

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Lint   │───▶│  Type   │───▶│  Build  │───▶│  Test   │
│         │    │  Check  │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### Publish (`.github/workflows/publish-npm.yml`)

Publishes CLI to npm on release tags.

---

## Getting Started

### For New Developers

1. **Clone and install**:

   ```bash
   git clone <repo>
   cd human-in-the-loop
   pnpm install
   ```

2. **Understand the structure**:

   - Browse `lib/prompts/` to see available templates
   - Read `CLAUDE.md` for project conventions
   - Check `docs/` for detailed documentation

3. **Run quality checks**:
   ```bash
   pnpm format
   pnpm lint
   pnpm typecheck
   pnpm build
   pnpm test
   ```

### For Contributors

1. **Adding a new prompt**:

   - Create `lib/prompts/[category]/[name]/prompt.md`
   - Add `README.md` with usage examples
   - Run governance checks

2. **Modifying CLI**:
   - Edit files in `src/cli/src/`
   - Add tests in `__tests__/` directories
   - Update `cli-reference.md` if commands change

---

## Key Files to Read First

| Priority | File                      | Why                                     |
| -------- | ------------------------- | --------------------------------------- |
| 1        | `CLAUDE.md`               | Project conventions and AI instructions |
| 2        | `docs/getting-started.md` | Quick start guide                       |
| 3        | `docs/architecture.md`    | Design decisions                        |
| 4        | `src/cli/src/main.ts`     | CLI entry point                         |
| 5        | `lib/prompts/README.md`   | Prompt library overview                 |

---

## Common Tasks

| Task       | Command                             |
| ---------- | ----------------------------------- |
| Build      | `pnpm build`                        |
| Test       | `pnpm test`                         |
| Lint       | `pnpm lint`                         |
| Format     | `pnpm format`                       |
| Type check | `pnpm typecheck`                    |
| Add prompt | Create in `lib/prompts/[category]/` |
| Run CLI    | `./dist/src/cli/main.js`            |

      </output>
    </example>

    <example>
      <title>NestJS Backend API</title>
      <input>

Directory structure:

```
backend-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/
│   │   └── configuration.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   └── guards/
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   └── orders/
│   │       ├── orders.controller.ts
│   │       ├── orders.service.ts
│   │       └── orders.module.ts
│   └── database/
│       ├── migrations/
│       └── seeds/
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
├── nest-cli.json
└── package.json
```

Depth: standard
</input>
<output>

# Codebase Explainer: Backend API

## Quick Summary

This is a **NestJS REST API** following modular architecture with Prisma ORM for database access. It includes authentication, user management, and order processing with a well-organized structure.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        NestJS API                            │
├─────────────────────────────────────────────────────────────┤
│  Entry Point                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  main.ts → AppModule                                 │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  Feature Modules                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │   Auth   │ │  Users   │ │  Orders  │                    │
│  │  Module  │ │  Module  │ │  Module  │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
├─────────────────────────────────────────────────────────────┤
│  Shared Infrastructure                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Guards   │ │ Filters  │ │Intercept-│ │  Pipes   │       │
│  │          │ │          │ │   ors    │ │          │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Prisma ORM → PostgreSQL                             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure Breakdown

### `/src/modules` - Feature Modules

Each module follows NestJS conventions:

```
[module]/
├── [module].module.ts      # Module definition
├── [module].controller.ts  # HTTP endpoints
├── [module].service.ts     # Business logic
├── dto/                    # Data transfer objects
├── entities/               # Database entities
├── guards/                 # Module-specific guards
└── strategies/             # Auth strategies (auth module)
```

| Module   | Responsibility                           |
| -------- | ---------------------------------------- |
| `auth`   | Authentication (JWT, strategies, guards) |
| `users`  | User CRUD operations                     |
| `orders` | Order management                         |

### `/src/common` - Shared Infrastructure

| Directory       | Purpose                                  |
| --------------- | ---------------------------------------- |
| `decorators/`   | Custom decorators (@CurrentUser, @Roles) |
| `filters/`      | Exception filters (error handling)       |
| `guards/`       | Auth guards (JWT, roles)                 |
| `interceptors/` | Request/response transformers            |
| `pipes/`        | Validation pipes                         |

### `/prisma` - Database Schema

- `schema.prisma` - Database models and relations
- Migrations in `/database/migrations`

---

## Key Patterns

### 1. Module Organization

- Feature-based modules (auth, users, orders)
- Each module encapsulates its own controller, service, DTOs

### 2. Dependency Injection

- Services injected via constructors
- Modules declare providers and exports

### 3. Request Pipeline

```
Request → Guards → Interceptors → Pipes → Controller → Service → Response
```

### 4. Authentication Flow

```
Login → JWT Strategy → Guard → Protected Route
```

---

## Entry Points

```typescript
// main.ts - Bootstrap
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

// app.module.ts - Root module
@Module({
  imports: [AuthModule, UsersModule, OrdersModule],
})
export class AppModule {}
```

---

## Common Tasks

| Task               | Command                  |
| ------------------ | ------------------------ |
| Start dev          | `pnpm start:dev`         |
| Build              | `pnpm build`             |
| Test               | `pnpm test`              |
| E2E test           | `pnpm test:e2e`          |
| Generate migration | `npx prisma migrate dev` |
| Start with Docker  | `docker-compose up`      |

      </output>
    </example>

    <example>
      <title>React Frontend</title>
      <input>

Directory structure:

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── index.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Modal/
│   │   └── features/
│   │       ├── auth/
│   │       └── dashboard/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   ├── index.ts
│   │   └── slices/
│   ├── types/
│   └── utils/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Depth: quick
</input>
<output>

# Codebase Explainer: Frontend

## Quick Summary

**React + TypeScript** single-page application using Vite, Redux Toolkit for state management, and a feature-based component structure.

---

## Structure at a Glance

| Directory                  | Purpose                                       |
| -------------------------- | --------------------------------------------- |
| `src/components/common/`   | Reusable UI components (Button, Input, Modal) |
| `src/components/features/` | Feature-specific components (auth, dashboard) |
| `src/hooks/`               | Custom React hooks                            |
| `src/services/`            | API client and external services              |
| `src/store/`               | Redux store and slices                        |
| `src/types/`               | TypeScript type definitions                   |
| `src/utils/`               | Helper functions                              |

---

## Key Files

| File                 | Purpose                     |
| -------------------- | --------------------------- |
| `src/index.tsx`      | App entry point             |
| `src/App.tsx`        | Root component with routing |
| `src/store/index.ts` | Redux store configuration   |
| `vite.config.ts`     | Build configuration         |

---

## Quick Start

```bash
pnpm install
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm test       # Run tests
```

      </output>
    </example>

  </examples>

  <context>
You are an expert software architect who specializes in understanding and documenting codebases. You can:
- Identify architectural patterns and design decisions
- Recognize framework conventions (Angular, React, NestJS, etc.)
- Understand monorepo structures (Nx, Turborepo, Lerna)
- Explain dependency relationships and data flow
- Identify entry points and key files
- Recognize testing strategies and CI/CD patterns
  </context>

  <instructions>
Analyze the provided codebase and generate a comprehensive explanation following this structure:

## 1. Quick Summary (2-3 sentences)

- What type of project is this?
- What's its primary purpose?
- Key technologies used

## 2. Architecture Overview

- ASCII diagram showing major components
- How different parts relate to each other
- Data flow if applicable

## 3. Directory Structure Breakdown

- Explain each major directory's purpose
- Use tables for clarity
- Highlight conventions and patterns

## 4. Key Patterns & Conventions

- Naming conventions
- File organization patterns
- Code style observations
- Framework-specific patterns

## 5. Entry Points

- Where does execution start?
- Key configuration files
- How to run/build the project

## 6. Dependencies & Their Roles (if key_files provided)

- Major dependencies and why they're used
- Development vs production dependencies
- Any notable or unusual choices

## 7. Getting Started

- Steps for new developers
- Essential commands
- Key files to read first

## 8. Common Tasks

- Table of frequent operations and commands

Adjust depth based on the `depth` variable:

- **quick**: Summary + Structure + Quick Start only
- **standard**: All sections, moderate detail
- **comprehensive**: All sections with extensive detail, diagrams, and examples
  </instructions>

  <constraints>

- Base analysis ONLY on the provided directory structure and files
- Don't assume files or features that aren't shown
- Use tables for structured information
- Include ASCII diagrams for architecture visualization
- Keep explanations practical and actionable
- Focus on helping new developers get productive quickly
- Use clear section headers for easy navigation
- If information is missing, note what would be helpful to know
  </constraints>

  <output_format>

# Codebase Explainer: [Project Name]

## Quick Summary

[2-3 sentence overview]

---

## Architecture Overview

```
[ASCII diagram]
```

[Brief explanation of architecture]

---

## Directory Structure Breakdown

### [Section Name]

| Directory | Purpose     |
| --------- | ----------- |
| `path/`   | Description |

---

## Key Patterns & Conventions

### 1. [Pattern Name]

[Explanation with examples]

---

## Entry Points

```typescript
// [file] - [purpose]
[Key code or explanation]
```

---

## Dependencies & Their Roles

| Dependency | Role    |
| ---------- | ------- |
| `name`     | Purpose |

---

## Getting Started

### For New Developers

1. [Step]
2. [Step]

---

## Key Files to Read First

| Priority | File   | Why    |
| -------- | ------ | ------ |
| 1        | `file` | Reason |

---

## Common Tasks

| Task   | Command   |
| ------ | --------- |
| Action | `command` |

</output_format>
</prompt>

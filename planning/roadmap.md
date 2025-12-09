# Human-in-the-Loop: Project Roadmap

**Status**: Active
**Last Updated**: 2025-12-01
**Overall Resume Alignment**: 75% complete

This roadmap ensures all major skill areas from Alexandra Kelstrom's resume are reflected in reusable prompt templates, context packs, and governance specs.

---

## Priority Legend

- 🔴 **High**: Critical for resume alignment and immediate value
- 🟡 **Medium**: Important but can be scheduled after high-priority items
- 🟢 **Low**: Nice-to-have, community/creative focus

---

## Missing Items Plan

| Category          | Item                     | Status     | Rationale                                                | Priority  | Filename                                                | Issue Title                           |
| ----------------- | ------------------------ | ---------- | -------------------------------------------------------- | --------- | ------------------------------------------------------- | ------------------------------------- |
| **Architecture**  | System design review     | ✅ Done    | Validates architectural decisions against best practices | 🔴 High   | `lib/prompts/architecture/system-design-review`         | ~Add System Design Review Prompt~     |
| **Architecture**  | API design patterns      | ✅ Done    | REST/GraphQL API design guidance                         | 🔴 High   | `lib/prompts/architecture/api-design`                   | ~Add API Design Pattern Prompt~       |
| **Architecture**  | Microservices patterns   | ❌ Missing | Microservices architecture guidance                      | 🟡 Medium | `prompts/architecture/microservices-pattern.md`         | Add Microservices Pattern Prompt      |
| **Architecture**  | Technical debt audit     | ❌ Missing | Identifies and prioritizes tech debt                     | 🟡 Medium | `prompts/refactoring/technical-debt-audit.md`           | Add Technical Debt Audit Prompt       |
| **Testing**       | E2E strategy generator   | ✅ Done    | Cypress/Playwright E2E test strategy                     | 🔴 High   | `lib/prompts/testing/e2e-strategy`                      | ~Add E2E Strategy Generator Prompt~   |
| **Testing**       | Unit test generator      | ✅ Done    | TypeScript/Angular unit test generation                  | 🔴 High   | `lib/prompts/testing/unit-test-generator`               | ~Add Unit Test Generator Prompt~      |
| **Testing**       | BDD scenarios            | ✅ Done    | Behavior-driven development scenarios                    | 🟡 Medium | `lib/prompts/testing/bdd-scenarios`                     | ~Add BDD Scenarios Prompt~            |
| **Testing**       | Test coverage analysis   | ✅ Done    | Analyzes test coverage gaps                              | 🟡 Medium | `lib/prompts/testing/test-coverage-analysis`            | ~Add Test Coverage Analysis Prompt~   |
| **CI/CD**         | Pipeline optimization    | ✅ Done    | GitHub Actions workflow optimization                     | 🔴 High   | `lib/prompts/ci-cd/pipeline-optimization`               | ~Add Pipeline Optimization Prompt~    |
| **CI/CD**         | AWS deployment           | ✅ Done    | AWS deployment strategy patterns                         | 🔴 High   | `lib/prompts/ci-cd/aws-deployment-strategy`             | ~Add AWS Deployment Strategy Prompt~  |
| **CI/CD**         | CI/CD context pack       | ✅ Done    | Complete CI/CD patterns library                          | 🔴 High   | `lib/context-packs/ci-cd`                               | ~Add CI/CD Context Pack~              |
| **Planning**      | User story breakdown     | ✅ Done    | Break epics into user stories                            | 🔴 High   | `lib/prompts/planning/user-story-breakdown`             | ~Add User Story Breakdown Prompt~     |
| **Planning**      | Technical spike template | ❌ Missing | Technical spike planning                                 | 🟡 Medium | `prompts/planning/technical-spike-template.md`          | Add Technical Spike Template          |
| **Documentation** | API documentation        | ✅ Done    | Auto-generate API docs from code                         | 🔴 High   | `lib/prompts/documentation/api-documentation`           | ~Add API Documentation Generator~     |
| **Documentation** | ADR generator            | ❌ Missing | Architecture Decision Records                            | 🟡 Medium | `prompts/documentation/architecture-decision-record.md` | Add ADR Generator Prompt              |
| **Documentation** | Codebase explainer       | ✅ Done    | Analyze and document repository architecture             | 🟡 Medium | `lib/prompts/documentation/codebase-explainer`          | ~Add Codebase Explainer~              |
| **Documentation** | Onboarding guide         | ❌ Missing | New developer onboarding docs                            | 🟡 Medium | `prompts/documentation/onboarding-guide.md`             | Add Onboarding Guide Generator        |
| **Governance**    | Responsible AI audit     | ✅ Done    | AI output quality audit checklist                        | 🔴 High   | `lib/prompts/governance/responsible-ai-audit`           | ~Add Responsible AI Audit Prompt~     |
| **Governance**    | Bias detection           | ✅ Done    | Bias and fairness analysis                               | 🔴 High   | `lib/prompts/governance/bias-detection`                 | ~Add Bias Detection Prompt~           |
| **Governance**    | Security review          | ✅ Done    | AI-generated code security review                        | 🔴 High   | `lib/prompts/governance/security-review`                | ~Add Security Review Prompt~          |
| **Evaluators**    | Code quality evaluator   | ❌ Missing | Validates code quality metrics                           | 🔴 High   | `lib/evaluators/code-quality-evaluator.yaml`            | Add Code Quality Evaluator            |
| **Evaluators**    | Security evaluator       | ❌ Missing | Security validation rules                                | 🔴 High   | `lib/evaluators/security-evaluator.yaml`                | Add Security Evaluator                |
| **Context Packs** | Angular components       | ✅ Done    | Angular component patterns (via skills)                  | 🔴 High   | `lib/skills/angular-modern`                             | ~Add Angular Component Patterns~      |
| **Context Packs** | Angular state mgmt       | ❌ Missing | NgRx/signals patterns                                    | 🟡 Medium | `context-packs/angular/state-management.md`             | Add Angular State Management Context  |
| **Context Packs** | Angular testing          | ❌ Missing | Angular testing best practices                           | 🟡 Medium | `context-packs/angular/testing-patterns.md`             | Add Angular Testing Patterns          |
| **Context Packs** | NestJS modules           | ✅ Done    | NestJS module structure (via skill)                      | 🔴 High   | `lib/skills/nestjs-backend`                             | ~Add NestJS Module Structure Context~ |
| **Context Packs** | NestJS DI                | ✅ Done    | Dependency injection patterns (via skill)                | 🟡 Medium | `lib/skills/nestjs-backend`                             | ~Add NestJS DI Patterns Context~      |
| **Context Packs** | Nx monorepo              | ✅ Done    | Nx monorepo best practices (via skill)                   | 🔴 High   | `lib/skills/nx-monorepo`                                | ~Add Nx Monorepo Context Pack~        |
| **Culture**       | Review empathy           | ✅ Done    | Empathetic code review feedback                          | 🔴 High   | `lib/prompts/culture/code-review-empathy`               | ~Add Code Review Empathy Prompt~      |
| **Culture**       | Constructive feedback    | ❌ Missing | Constructive feedback generator                          | 🟡 Medium | `prompts/culture/constructive-feedback.md`              | Add Constructive Feedback Prompt      |
| **Culture**       | 1-on-1 prep              | ✅ Done    | 1-on-1 meeting preparation                               | 🟢 Low    | `lib/prompts/culture/1-on-1-prep`                       | ~Add 1-on-1 Prep Template~            |
| **Culture**       | Team retrospective       | ✅ Done    | Retrospective facilitation                               | 🟢 Low    | `lib/prompts/culture/team-retrospective`                | ~Add Team Retrospective Template~     |
| **Mentorship**    | Learning path            | ✅ Done    | Personalized learning paths                              | 🟡 Medium | `lib/prompts/mentorship/learning-path`                  | ~Add Learning Path Generator~         |
| **Meta**          | Prompt optimization      | ✅ Done    | Optimize existing prompts                                | 🟡 Medium | `lib/prompts/meta/prompt-optimization`                  | ~Add Prompt Optimization Template~    |
| **Meta**          | Context pack builder     | ✅ Done    | Create new context packs                                 | 🟡 Medium | `lib/prompts/meta/context-pack-builder`                 | ~Add Context Pack Builder~            |
| **Community**     | Blog post outline        | ❌ Missing | Technical blog post creation                             | 🟢 Low    | `prompts/community/blog-post-outline.md`                | Add Blog Post Outline Template        |
| **Community**     | Conference talk          | ❌ Missing | Conference talk preparation                              | 🟢 Low    | `prompts/community/conference-talk-outline.md`          | Add Conference Talk Template          |
| **Community**     | OSS contribution         | ❌ Missing | OSS contribution guide                                   | 🟢 Low    | `prompts/community/open-source-contribution.md`         | Add OSS Contribution Guide            |

---

## Milestones

### Milestone 1: Core Architecture & Testing (Q1 2025)

**Goal**: Establish foundation for architecture and testing templates

- System Design Review Prompt
- API Design Pattern Prompt
- E2E Strategy Generator
- Unit Test Generator
- Pipeline Optimization Prompt
- AWS Deployment Strategy

**Success Metrics**:

- 6 high-priority templates completed
- Used in at least 3 real projects
- Positive feedback from team

---

### Milestone 2: Governance & Quality (Q1-Q2 2025)

**Goal**: Operationalize responsible AI practices

- Responsible AI Audit Prompt
- Bias Detection Prompt
- Security Review Prompt
- Code Quality Evaluator
- Security Evaluator

**Success Metrics**:

- All governance prompts tested and validated
- Evaluators integrated into CI/CD
- Zero critical vulnerabilities in AI-generated code

---

### Milestone 3: Context Packs (Q2 2025)

**Goal**: Complete framework-specific knowledge bases

- Angular Component Patterns
- NestJS Module Structure
- Nx Monorepo Context Pack
- CI/CD Context Pack

**Success Metrics**:

- Context packs reduce AI hallucinations by 40%
- Used by entire engineering team
- Documented with real examples

---

### Milestone 4: Culture & Mentorship (Q2-Q3 2025)

**Goal**: Systematize leadership and mentorship practices

- Code Review Empathy Prompt
- Constructive Feedback Prompt
- Learning Path Generator
- 1-on-1 Prep Template

**Success Metrics**:

- Improved team satisfaction scores
- Reduced onboarding time by 30%
- Positive feedback from mentees

---

### Milestone 5: Planning & Documentation (Q3 2025)

**Goal**: Streamline planning and documentation workflows

- User Story Breakdown
- API Documentation Generator
- ADR Generator
- Onboarding Guide Generator

**Success Metrics**:

- Documentation always up-to-date
- 50% reduction in documentation time
- Improved clarity in planning

---

## Resume Alignment Summary

### ✅ Fully Covered (6 areas)

1. TypeScript/JavaScript Expertise - Code review prompts
2. Governance Framework - RESPONSIBLE-AI-PLAYBOOK.md, governance model, security review
3. CLI Tooling - CLI structure and documentation
4. Monorepo Experience - Nx workspace configured, nx-monorepo skill
5. Testing & CI/CD - E2E, unit tests, BDD, coverage analysis, pipeline optimization, AWS deployment
6. Meta-tooling - Prompt optimization, context pack builder

### 🟡 Partially Covered (4 areas)

1. Angular/NestJS - Skills created, some context packs missing
2. Planning & Documentation - User stories, API docs, codebase explainer done; ADR, onboarding missing
3. Culture & Mentorship - Code review empathy, 1-on-1 prep, retros, learning paths done
4. Architecture - System design, API design done; microservices, tech debt missing

### ❌ Not Covered (2 areas)

1. Community Engagement - Blog posts, conference talks, OSS contribution
2. Evaluators - Code quality and security evaluators not implemented

---

## Next Steps

1. Review and prioritize roadmap with stakeholders
2. Import GitHub issues from `planning/github-issues.json`
3. Begin Milestone 1 implementation
4. Set up tracking dashboard for metrics
5. Schedule quarterly roadmap reviews

---

## Related Documentation

- [Coverage Checklist](./coverage-checklist.md) - Detailed coverage by category
- [GitHub Issues](./github-issues.json) - Importable issue definitions
- [Auto-Commit Script](./scaffold-high-priority.sh) - Scaffold all high-priority items
- [CLAUDE.md](../CLAUDE.md) - Project planning instructions

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

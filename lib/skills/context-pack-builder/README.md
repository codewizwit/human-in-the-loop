# Context Pack Builder

Generates comprehensive context packs for frameworks, technologies, or domains. Creates structured knowledge bases with patterns, best practices, complete code examples, anti-patterns, and reference tables that serve as reusable guides for AI assistants and team documentation.

## What You'll Be Asked

- **Technology or domain**: Framework, library, or domain to cover
- **Scope**: Minimal (core patterns), standard (patterns + anti-patterns + tables), or comprehensive (full guide)
- **Focus areas**: General best practices, testing, performance, security, or custom

## Usage Examples

- "Create a comprehensive context pack for RxJS in Angular applications"
- "Build a context pack for GraphQL with Apollo Client in Angular"
- "Generate a context pack for JWT authentication with Angular and NestJS"
- "Create a patterns guide for our team's state management conventions"

## Key Features

- TypeDoc-commented code examples that are complete and working
- Paired anti-pattern examples showing bad and good approaches
- Decision trees and reference tables for choosing between approaches
- Modern framework patterns (Angular 16+ signals, standalone components)
- Installation via `hit install context/[name]`
- Cross-references to related context packs and skills

## Installation

```bash
hit install context-pack-builder
```

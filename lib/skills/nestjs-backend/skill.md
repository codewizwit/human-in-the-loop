---
name: nestjs-backend
description: >-
  Apply NestJS best practices for building scalable Node.js backends with
  dependency injection, modules, microservices, and clean architecture.
  Use when user asks to "build a NestJS API", "create a NestJS module",
  or mentions "NestJS patterns".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion
---

# NestJS Backend Skill

Use this skill when working with **NestJS** applications. NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications using TypeScript.

## When to Activate

- Building new NestJS applications
- Working with NestJS modules, controllers, or services
- Implementing dependency injection patterns
- Creating REST APIs or GraphQL endpoints
- Setting up microservices or message queues
- Configuring guards, interceptors, or pipes
- Writing tests for NestJS applications

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>What NestJS task would you like help with?</question>
<options>

  <option value="new-module">Create a new module/feature</option>
  <option value="api-endpoint">Build REST or GraphQL endpoints</option>
  <option value="auth">Set up authentication and authorization</option>
  <option value="testing">Write tests for NestJS code</option>
  <option value="review">Review existing NestJS code</option>
  <option value="other">Something else</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Analyze Codebase

1. Use Glob to find NestJS files (`*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.guard.ts`)
2. Use Read to examine existing modules and architecture
3. Use Grep to identify patterns (decorators, providers, imports)
4. Check `package.json` for NestJS version and installed packages

### Step 3: Execute

Apply NestJS best practices based on the task. For detailed patterns and conventions, see [context.md](context.md). For code templates and scaffolding examples, see [templates.md](templates.md).

## Core Methodology

### Module Architecture

- One module per domain/feature (Users, Orders, Products)
- Keep modules focused and cohesive
- Export only what other modules need
- Use `forRoot()` / `forRootAsync()` for configurable modules
- Use `forFeature()` for feature-specific configuration

### Dependency Injection

- Use constructor injection
- Program to interfaces, not implementations
- Use appropriate scopes (DEFAULT for stateless)
- Avoid circular dependencies (use events or forwardRef)
- Use custom providers for flexibility

### Controller Layer

- Controllers handle HTTP layer only
- Use DTOs for request/response validation with class-validator
- Apply proper HTTP status codes
- Use Swagger decorators for API documentation
- Use ParseUUIDPipe and other built-in pipes for parameter validation

### Security Layer

- Validate all inputs with class-validator
- Use Guards for authentication/authorization
- Implement rate limiting
- Use Helmet for security headers
- Never expose internal errors to clients

### Testing Strategy

- Unit test services with mocked dependencies
- E2E test controllers with supertest
- Use TestingModule for dependency setup
- Mock external services and databases

For detailed patterns including module examples, DI patterns, guards, interceptors, pipes, and exception handling, see [context.md](context.md).

For complete code templates including RESTful controllers, DTOs, testing examples, and configuration patterns, see [templates.md](templates.md).

## Output Format

<output_format>
When generating NestJS code, follow the modular architecture pattern:

- One module per domain/feature
- Controller handles HTTP layer only
- Service contains business logic
- Repository handles data access
- DTOs for request/response validation
- Guards for authentication/authorization
- Interceptors for response transformation
- Pipes for input validation

Provide complete, working code examples with proper imports and decorators.
</output_format>

## Best Practices

- One module per domain/feature
- Keep modules cohesive and focused
- Use DTOs for request/response validation
- Separate business logic into services
- Use repositories for data access
- Implement proper error handling

## Anti-Patterns

- Don't put business logic in controllers
- Don't use circular dependencies without resolution
- Don't skip input validation
- Don't expose stack traces in production
- Don't hardcode configuration values

## Examples

**Create a new module:**

> Create a NestJS products module with CRUD endpoints, DTOs, and validation

**Set up authentication:**

> Add JWT authentication with guards and role-based access control to my NestJS app

**Write tests:**

> Write unit tests for the UsersService and E2E tests for the UsersController

## References

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Modules](https://docs.nestjs.com/modules)
- [Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [Guards](https://docs.nestjs.com/guards)
- [Interceptors](https://docs.nestjs.com/interceptors)
- [Testing](https://docs.nestjs.com/fundamentals/testing)

---

**Human-in-the-Loop by codewizwit**

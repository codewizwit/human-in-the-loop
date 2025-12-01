# NestJS Backend Skill

Framework-specific expertise for **NestJS** backend development with dependency injection, modules, and clean architecture patterns.

## Overview

This skill provides comprehensive guidance for building scalable Node.js backend applications using NestJS. It covers module architecture, dependency injection patterns, guards, interceptors, and testing strategies.

## What's Included

- **Module Architecture** - Feature modules, dynamic modules, forRoot/forFeature patterns
- **Dependency Injection** - Provider types, scopes, custom providers, circular dependency resolution
- **Controllers & DTOs** - RESTful patterns, validation, Swagger documentation
- **Guards & Interceptors** - Authentication, authorization, response transformation
- **Exception Handling** - Custom exceptions, global filters, error formatting
- **Testing** - Unit testing with mocks, E2E testing with supertest
- **Configuration** - Environment-based config with validation

## Installation

### As Claude Code Skill

```bash
hit install skill/nestjs-backend --as-skill
```

This copies `claude-skill.md` to `.claude/skills/nestjs-backend.md` for automatic activation when working with NestJS code.

### As GitHub Copilot Custom Instruction

```bash
hit install skill/nestjs-backend --as-copilot
```

This copies `copilot-instructions.md` to `.github/instructions/nestjs-backend.instructions.md` for GitHub Copilot integration.

### As Documentation

```bash
hit install skill/nestjs-backend
```

Installs to `~/.claude/tools/skill/nestjs-backend/` for reference.

## Key Patterns

### Module Organization

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Dependency Injection

```typescript
// Interface-based injection
export const USERS_SERVICE = Symbol('USERS_SERVICE');

@Module({
  providers: [
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}

// Usage
@Injectable()
export class OrdersService {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService
  ) {}
}
```

### Guards for Authorization

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();
    return roles.some((role) => user.roles?.includes(role));
  }
}
```

### DTO Validation

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
```

## Core Concepts Covered

### Architecture

- ✅ Feature module pattern
- ✅ Dynamic modules (forRoot/forRootAsync)
- ✅ Module imports and exports
- ✅ Global modules

### Dependency Injection

- ✅ Standard class providers
- ✅ Value providers
- ✅ Factory providers
- ✅ Existing (alias) providers
- ✅ Injection scopes (DEFAULT, REQUEST, TRANSIENT)
- ✅ Circular dependency resolution

### Request Handling

- ✅ Controllers and routes
- ✅ DTOs with class-validator
- ✅ Pipes for transformation
- ✅ Guards for authorization
- ✅ Interceptors for cross-cutting concerns

### Error Handling

- ✅ Built-in HTTP exceptions
- ✅ Custom domain exceptions
- ✅ Global exception filters

### Testing

- ✅ Unit testing services
- ✅ Mocking dependencies
- ✅ E2E testing controllers
- ✅ Test database setup

## What's Different from Express

### ❌ Express Patterns (Don't Use in NestJS)

- Manual middleware chains
- Callback-based error handling
- Global state for dependencies
- Manual request validation

### ✅ NestJS Patterns (Use These)

- Decorators for routing (@Get, @Post, etc.)
- Exception filters for error handling
- Dependency injection container
- DTOs with class-validator decorators

## Prerequisites

- Node.js 16.0.0 or higher
- TypeScript 4.7+
- NestJS 9.0.0 or higher

## Related Skills

- **typescript-expert** - Advanced TypeScript patterns
- **testing-automation** - Comprehensive testing strategies
- **aws-serverless** - AWS deployment patterns

## References

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Modules](https://docs.nestjs.com/modules)
- [Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [Guards](https://docs.nestjs.com/guards)
- [Testing](https://docs.nestjs.com/fundamentals/testing)

---

**Human-in-the-Loop by codewizwit**

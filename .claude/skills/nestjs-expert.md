---
name: nestjs-expert
description: Apply NestJS backend development best practices including module structure, dependency injection, providers, controllers, guards, interceptors, and architectural patterns when building or reviewing Node.js backend code.
---

# NestJS Expert Skill

Use this skill when working with NestJS backend code, designing Node.js APIs, reviewing backend architecture, or discussing TypeScript server-side patterns.

## When to Activate This Skill

Activate automatically when:

- Reviewing NestJS code (modules, controllers, services)
- Designing REST or GraphQL APIs with NestJS
- Discussing dependency injection patterns
- Implementing authentication/authorization
- Setting up middleware, guards, or interceptors
- Structuring backend modules and features
- Testing NestJS services or controllers
- Optimizing backend performance
- Implementing CQRS or event-driven patterns

## Module Structure Best Practices

### Feature Module Organization

Every feature should be a self-contained module:

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    EmailModule, // Shared services
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserProfileService],
  exports: [UsersService], // Only export what other modules need
})
export class UsersModule {}
```

**Directory structure**:

```
users/
├── users.module.ts          # Module definition
├── users.controller.ts      # HTTP endpoints
├── users.service.ts         # Business logic
├── users.repository.ts      # Data access
├── dto/                     # Data transfer objects
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── entities/                # Database entities
│   └── user.entity.ts
├── guards/                  # Route guards
├── interceptors/            # Transform logic
└── __tests__/              # Tests
```

## Dependency Injection Patterns

### Service Providers (Most Common)

```typescript
@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly emailService: EmailService
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.repository.save(dto);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}
```

### Repository Pattern

```typescript
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async findPaginated(criteria: FindUsersDto, page: number, limit: number) {
    const [users, total] = await this.repository.findAndCount({
      where: criteria,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
```

### Injection Scopes

- **Singleton** (default): Shared across entire app - use for most services
- **Request**: New instance per HTTP request - use sparingly, impacts performance
- **Transient**: New instance per injection - use for stateful objects

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

## Controller Patterns

### REST API Best Practices

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<PaginatedResult<User>> {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  @UseGuards(UserOwnershipGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
```

## Guards for Security

### JWT Authentication

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
```

### Role-Based Authorization

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

## Interceptors for Cross-Cutting Concerns

### Logging Interceptor

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    this.logger.log(`→ ${method} ${url}`, 'HTTP');

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`← ${method} ${url} ${responseTime}ms`, 'HTTP');
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        this.logger.error(
          `← ${method} ${url} ${error.status} ${responseTime}ms`,
          error.stack,
          'HTTP'
        );
        throw error;
      })
    );
  }
}
```

### Response Transformation

```typescript
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}
```

## Exception Handling

### Global Exception Filter

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || 'Internal server error',
    };

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception.stack
    );

    response.status(status).json(errorResponse);
  }
}
```

## Validation with Pipes

### Global Validation

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip non-whitelisted properties
    forbidNonWhitelisted: true, // Throw on unknown properties
    transform: true, // Transform to DTO instances
    transformOptions: {
      enableImplicitConversion: true,
    },
  })
);
```

### DTOs with Validation

```typescript
export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  @ApiProperty({ example: 'Password123' })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({ enum: Role, required: false })
  role?: Role;
}
```

## Avoiding Circular Dependencies

### Problem

```typescript
// ❌ BAD: Circular dependency
@Injectable()
export class UsersService {
  constructor(private authService: AuthService) {} // AuthService depends on UsersService
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {} // Circular!
}
```

### Solution 1: Events (Best)

```typescript
// ✅ BEST: Use events to decouple
@Injectable()
export class UsersService {
  constructor(private eventEmitter: EventEmitter2) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.repository.save(dto);
    this.eventEmitter.emit('user.created', new UserCreatedEvent(user));
    return user;
  }
}

@Injectable()
export class AuthService {
  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent) {
    await this.sendWelcomeEmail(event.user);
  }
}
```

### Solution 2: Shared Service

```typescript
// ✅ GOOD: Extract to shared module
@Injectable()
export class EmailService {
  async sendWelcomeEmail(user: User): Promise<void> {
    // Email logic
  }
}

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

// Both modules import EmailModule
```

## Testing Patterns

### Unit Testing Services

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<UsersRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useFactory: () => ({
            save: jest.fn(),
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  it('should create a user', async () => {
    const dto = { email: 'test@example.com', name: 'Test' };
    const saved = { id: '1', ...dto };

    repository.save.mockResolvedValue(saved);

    const result = await service.create(dto);

    expect(result).toEqual(saved);
    expect(repository.save).toHaveBeenCalledWith(dto);
  });
});
```

### E2E Testing Controllers

```typescript
describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) should create user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@example.com', name: 'Test User' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe('test@example.com');
      });
  });

  it('/users (POST) should reject invalid email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'invalid', name: 'Test' })
      .expect(400);
  });
});
```

## Best Practices Checklist

When reviewing or writing NestJS code, ensure:

### Architecture

- ✅ Each module is self-contained with clear boundaries
- ✅ Business logic lives in services, not controllers
- ✅ Controllers are thin - just HTTP layer
- ✅ Repository pattern for data access
- ✅ DTOs for all input/output
- ✅ No circular dependencies

### Dependency Injection

- ✅ All dependencies injected through constructor
- ✅ Use `readonly` for injected dependencies
- ✅ Prefer singleton scope (default)
- ✅ Only export what's needed from modules

### Security

- ✅ Guards for authentication/authorization
- ✅ Validation pipes on all inputs
- ✅ Exception filters for consistent errors
- ✅ Rate limiting on public endpoints
- ✅ CORS configured properly

### Performance

- ✅ Use caching where appropriate
- ✅ Implement pagination for large datasets
- ✅ Avoid request-scoped providers unless necessary
- ✅ Database query optimization
- ✅ Connection pooling configured

### Testing

- ✅ Unit tests for services (business logic)
- ✅ E2E tests for controllers (API endpoints)
- ✅ Mock all external dependencies
- ✅ Test error cases
- ✅ >80% code coverage for critical paths

### Documentation

- ✅ Swagger/OpenAPI documentation
- ✅ TypeDoc comments on public APIs
- ✅ README for each major module
- ✅ API versioning strategy

## Common Anti-Patterns to Avoid

❌ **Don't mix business logic in controllers**

```typescript
// BAD
@Post()
async create(@Body() dto: CreateUserDto) {
  const user = await this.repository.save(dto); // Business logic in controller
  await this.emailService.send(user.email); // Side effects in controller
  return user;
}

// GOOD
@Post()
async create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto); // Delegate to service
}
```

❌ **Don't skip validation**

```typescript
// BAD - No validation
@Post()
async create(@Body() dto: any) {
  return this.service.create(dto);
}

// GOOD - DTO with validation
@Post()
async create(@Body() dto: CreateUserDto) {
  return this.service.create(dto);
}
```

❌ **Don't create tight coupling**

```typescript
// BAD - Direct repository access in controller
@Get()
async findAll() {
  return this.userRepository.find(); // Skip service layer
}

// GOOD - Use service layer
@Get()
async findAll() {
  return this.usersService.findAll();
}
```

## Related Skills

- **TypeScript Expert** - For advanced TypeScript patterns
- **Testing Automation** - For comprehensive test strategies
- **Engineering Practices** - For SOLID principles and clean code
- **Responsible AI Governance** - For validating generated backend code

## References

- [NestJS Official Documentation](https://docs.nestjs.com)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

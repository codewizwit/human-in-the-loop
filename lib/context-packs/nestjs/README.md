# NestJS Context Pack

Framework-specific knowledge base for NestJS backend development including module structure, dependency injection, providers, controllers, guards, interceptors, and architectural patterns.

## Overview

This context pack provides comprehensive guidance on building scalable, maintainable NestJS applications following best practices for module organization, dependency injection, and architectural patterns. It covers everything from basic module structure to advanced microservices patterns.

## When to Use This Context Pack

Use this NestJS context pack when:

- **Building NestJS Applications** - Starting new NestJS projects or features
- **Refactoring Backend Code** - Improving existing NestJS codebases
- **Code Review** - Reviewing NestJS PRs for best practices
- **Architecture Decisions** - Designing module boundaries and dependencies
- **Microservices Development** - Building distributed NestJS systems
- **API Development** - Creating REST or GraphQL APIs
- **Testing Backend Code** - Writing unit and E2E tests for NestJS

## Module Structure

### Basic Module Anatomy

```typescript
/**
 * User module that encapsulates all user-related functionality
 * @module UsersModule
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Database entities
  ],
  controllers: [UsersController], // HTTP endpoints
  providers: [UsersService, UsersRepository], // Injectable services
  exports: [UsersService], // Services available to other modules
})
export class UsersModule {}
```

### Directory Structure

```
src/
├── app.module.ts                 # Root module
├── main.ts                       # Application entry point
├── users/                        # Feature module
│   ├── users.module.ts          # Module definition
│   ├── users.controller.ts      # HTTP controllers
│   ├── users.service.ts         # Business logic
│   ├── users.repository.ts      # Data access layer
│   ├── dto/                     # Data transfer objects
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/                # Database entities
│   │   └── user.entity.ts
│   ├── guards/                  # Route guards
│   │   └── user-ownership.guard.ts
│   ├── interceptors/            # Request/response interceptors
│   │   └── transform-user.interceptor.ts
│   └── __tests__/              # Tests
│       ├── users.controller.spec.ts
│       └── users.service.spec.ts
├── auth/                         # Authentication module
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       └── roles.guard.ts
└── common/                       # Shared module
    ├── common.module.ts
    ├── filters/                  # Exception filters
    ├── interceptors/             # Global interceptors
    ├── pipes/                    # Validation pipes
    └── decorators/               # Custom decorators
```

## Dependency Injection Patterns

### Provider Types

#### 1. Service Providers (Most Common)

```typescript
/**
 * Service that handles user business logic
 * @class UsersService
 */
@Injectable()
export class UsersService {
  /**
   * Creates a new UsersService instance
   * @param usersRepository - Repository for user data access
   */
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService
  ) {}

  /**
   * Finds a user by ID
   * @param id - User identifier
   * @returns User entity or null if not found
   */
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Creates a new user and sends welcome email
   * @param createUserDto - User creation data
   * @returns Newly created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save(createUserDto);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}
```

#### 2. Repository Providers

```typescript
/**
 * Repository for user data access
 * @class UsersRepository
 */
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  /**
   * Finds users by criteria with pagination
   * @param criteria - Search criteria
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @returns Paginated user results
   */
  async findPaginated(
    criteria: FindUsersDto,
    page: number,
    limit: number
  ): Promise<PaginatedResult<User>> {
    const [users, total] = await this.repository.findAndCount({
      where: criteria,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
```

#### 3. Factory Providers

```typescript
/**
 * Factory provider for creating database connections
 */
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const connection = await createConnection({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
        });
        return connection;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
```

#### 4. Value Providers

```typescript
/**
 * Configuration value provider
 */
@Module({
  providers: [
    {
      provide: 'API_CONFIG',
      useValue: {
        version: '1.0.0',
        baseUrl: 'https://api.example.com',
        timeout: 5000,
      },
    },
  ],
  exports: ['API_CONFIG'],
})
export class ConfigModule {}
```

### Injection Scopes

```typescript
/**
 * Request-scoped provider (new instance per request)
 * Use sparingly - impacts performance
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor(@Inject(REQUEST) private request: Request) {}
}

/**
 * Transient provider (new instance per injection)
 * Use for stateful or heavy objects
 */
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}

/**
 * Default (singleton) provider
 * Recommended for most services
 */
@Injectable()
export class SingletonService {}
```

## Controllers

### REST API Controller

```typescript
/**
 * Controller handling user-related HTTP endpoints
 * @class UsersController
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user
   * @param createUserDto - User creation data
   * @returns Created user entity
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieves all users with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated user list
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<PaginatedResult<User>> {
    return this.usersService.findAll(page, limit);
  }

  /**
   * Retrieves a user by ID
   * @param id - User identifier
   * @returns User entity
   * @throws NotFoundException if user not found
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Updates a user
   * @param id - User identifier
   * @param updateUserDto - Update data
   * @returns Updated user entity
   */
  @Patch(':id')
  @UseGuards(UserOwnershipGuard)
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Deletes a user (soft delete)
   * @param id - User identifier
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
```

## Guards

### Authentication Guard

```typescript
/**
 * JWT authentication guard
 * Validates JWT tokens on protected routes
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Handles authentication errors
   * @param err - Error from Passport
   * @param user - Authenticated user or false
   * @throws UnauthorizedException if authentication fails
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
```

### Authorization Guard

```typescript
/**
 * Role-based authorization guard
 * Checks if user has required roles
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if request can proceed based on user roles
   * @param context - Execution context
   * @returns True if user has required roles
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

/**
 * Custom decorator for role requirements
 */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

## Interceptors

### Logging Interceptor

```typescript
/**
 * Request/response logging interceptor
 * Logs incoming requests and outgoing responses
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  /**
   * Intercepts and logs HTTP requests/responses
   * @param context - Execution context
   * @param next - Call handler
   * @returns Observable with response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const now = Date.now();

    this.logger.log(`→ ${method} ${url}`, 'HTTP');
    this.logger.debug(`Request body: ${JSON.stringify(body)}`, 'HTTP');

    return next.handle().pipe(
      tap((response) => {
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

### Transform Interceptor

```typescript
/**
 * Response transformation interceptor
 * Wraps all responses in consistent format
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  /**
   * Transforms response data into standardized format
   * @param context - Execution context
   * @param next - Call handler
   * @returns Observable with transformed response
   */
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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
```

## Pipes

### Validation Pipe

```typescript
/**
 * Global validation pipe configuration
 */
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip non-whitelisted properties
    forbidNonWhitelisted: true, // Throw error on non-whitelisted properties
    transform: true, // Transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true, // Convert types automatically
    },
  })
);
```

### Custom Pipe

```typescript
/**
 * Parse and validate integer pipe
 * Converts string to integer with validation
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  /**
   * Transforms and validates string to integer
   * @param value - String value to transform
   * @param metadata - Argument metadata
   * @returns Parsed integer
   * @throws BadRequestException if value is not a valid integer
   */
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed: "${value}" is not an integer`
      );
    }
    return val;
  }
}
```

## Exception Filters

### HTTP Exception Filter

```typescript
/**
 * Global HTTP exception filter
 * Standardizes error responses
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  /**
   * Catches and formats HTTP exceptions
   * @param exception - HTTP exception
   * @param host - Arguments host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Internal server error',
      errors:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).errors
          : undefined,
    };

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception.stack,
      'ExceptionFilter'
    );

    response.status(status).json(errorResponse);
  }
}
```

## Module Organization Patterns

### Feature Module

```typescript
/**
 * Self-contained feature module
 * Encapsulates all user-related functionality
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    EmailModule, // Import shared services
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserProfileService],
  exports: [UsersService], // Export for use in other modules
})
export class UsersModule {}
```

### Shared Module

```typescript
/**
 * Shared module with global utilities
 * @global decorator makes it globally available
 */
@Global()
@Module({
  providers: [Logger, ConfigService, CacheService],
  exports: [Logger, ConfigService, CacheService],
})
export class SharedModule {}
```

### Dynamic Module

```typescript
/**
 * Dynamic module with configuration
 * Allows runtime configuration of module behavior
 */
@Module({})
export class DatabaseModule {
  /**
   * Registers database module with configuration
   * @param options - Database configuration options
   * @returns Dynamic module
   */
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }

  /**
   * Registers database module asynchronously
   * Allows dependency injection in configuration
   * @param options - Async configuration options
   * @returns Dynamic module
   */
  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
```

## Circular Dependency Avoidance

### Problem: Circular Dependencies

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

### Solution 1: Forward Reference

```typescript
// ✅ BETTER: Use forwardRef
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}
}
```

### Solution 2: Event-Driven Architecture

```typescript
// ✅ BEST: Use events to decouple modules
@Injectable()
export class UsersService {
  constructor(private eventEmitter: EventEmitter2) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.repository.save(createUserDto);

    // Emit event instead of direct dependency
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

### Solution 3: Shared Service

```typescript
// ✅ BEST: Extract shared logic to separate module
@Injectable()
export class EmailService {
  async sendWelcomeEmail(user: User): Promise<void> {
    // Email logic here
  }
}

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

// Both modules can now depend on EmailModule
@Module({
  imports: [EmailModule],
  providers: [UsersService],
})
export class UsersModule {}

@Module({
  imports: [EmailModule],
  providers: [AuthService],
})
export class AuthModule {}
```

## Testing Patterns

### Unit Testing Services

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<UsersRepository>;
  let emailService: MockType<EmailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useFactory: mockRepository,
        },
        {
          provide: EmailService,
          useFactory: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
    emailService = module.get(EmailService);
  });

  describe('create', () => {
    it('should create a user and send welcome email', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const savedUser = { id: '1', ...createUserDto };

      repository.save.mockResolvedValue(savedUser);
      emailService.sendWelcomeEmail.mockResolvedValue(undefined);

      const result = await service.create(createUserDto);

      expect(result).toEqual(savedUser);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        savedUser.email
      );
    });
  });
});

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

const mockRepository = (): MockType<UsersRepository> => ({
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
});

const mockEmailService = (): MockType<EmailService> => ({
  sendWelcomeEmail: jest.fn(),
});
```

### E2E Testing Controllers

```typescript
describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.name).toBe(createUserDto.name);
        });
    });

    it('should reject invalid email', () => {
      const invalidDto = {
        email: 'invalid-email',
        name: 'Test User',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should get user by id', async () => {
      const user = await usersService.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      return request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(user.id);
        });
    });

    it('should return 404 for non-existent user', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer()).get(`/users/${fakeId}`).expect(404);
    });
  });
});
```

## Best Practices

### DO ✅

- **Use dependency injection** - Inject all dependencies through constructor
- **Follow single responsibility** - One class, one purpose
- **Export only what's needed** - Minimize module exports
- **Use DTOs for validation** - Validate all input with class-validator
- **Handle errors consistently** - Use exception filters for standard responses
- **Write tests** - Unit test services, E2E test controllers
- **Use TypeDoc comments** - Document all public APIs
- **Leverage decorators** - Use built-in and custom decorators
- **Use pipes for transformation** - Transform and validate data
- **Use guards for authorization** - Separate auth logic from business logic

### DON'T ❌

- **Don't create circular dependencies** - Use events or shared services
- **Don't use request-scoped providers unnecessarily** - They impact performance
- **Don't skip validation** - Always validate input
- **Don't mix business logic in controllers** - Controllers should be thin
- **Don't hardcode configuration** - Use ConfigModule
- **Don't catch errors silently** - Let exception filters handle them
- **Don't bypass TypeScript types** - Avoid `any` type
- **Don't repeat yourself** - Extract shared logic to services
- **Don't forget error handling** - Handle all error cases
- **Don't skip documentation** - Document complex logic

## Common Patterns

### Repository Pattern

```typescript
/**
 * Generic repository base class
 * Provides common CRUD operations
 */
export abstract class BaseRepository<T> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<T>
  ) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
```

### CQRS Pattern

```typescript
/**
 * Command for creating a user
 */
export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

/**
 * Command handler for user creation
 */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const user = await this.repository.save(command.createUserDto);
    this.eventBus.publish(new UserCreatedEvent(user));
    return user;
  }
}

/**
 * Query for getting user by ID
 */
export class GetUserQuery {
  constructor(public readonly userId: string) {}
}

/**
 * Query handler for getting user
 */
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(query: GetUserQuery): Promise<User> {
    return this.repository.findById(query.userId);
  }
}
```

## Related Resources

- [NestJS Official Documentation](https://docs.nestjs.com)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## Contributing

To improve this NestJS context pack:

1. Share real-world NestJS patterns and solutions
2. Suggest additional architectural patterns
3. Provide microservices examples
4. Contribute GraphQL resolver patterns
5. Share testing strategies and best practices

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.

---
name: nestjs-backend
description: >-
  Apply NestJS best practices for building scalable Node.js backends with
  dependency injection, modules, microservices, and clean architecture.
  Use when user asks to "build a NestJS API", "create a NestJS module",
  or mentions "NestJS patterns".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
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

Apply NestJS best practices based on the task. See detailed guidance below.

## Module Architecture

### Module Organization

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
```

**Module Best Practices**:

- One module per domain/feature (Users, Orders, Products)
- Keep modules focused and cohesive
- Export only what other modules need
- Use `forRoot()` / `forRootAsync()` for configurable modules
- Use `forFeature()` for feature-specific configuration

### Feature Module Pattern

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Dynamic Module Pattern

```typescript
import { Module, DynamicModule } from '@nestjs/common';

export interface DatabaseModuleOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
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

  static forRootAsync(options: {
    useFactory: (
      ...args: unknown[]
    ) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
    inject?: unknown[];
    imports?: unknown[];
  }): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
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

**Usage**:

```typescript
@Module({
  imports: [
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Dependency Injection

### Provider Types

```typescript
import { Module } from '@nestjs/common';

@Module({
  providers: [
    UsersService,

    {
      provide: 'API_KEY',
      useValue: 'my-api-key-12345',
    },

    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async (config: ConfigService) => {
        const connection = await createConnection(config.get('DB_URL'));
        return connection;
      },
      inject: [ConfigService],
    },

    {
      provide: 'IUsersService',
      useClass:
        process.env.NODE_ENV === 'test' ? MockUsersService : UsersService,
    },

    {
      provide: 'AliasedService',
      useExisting: UsersService,
    },
  ],
})
export class UsersModule {}
```

### Injection Scopes

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable()
export class SingletonService {}

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor(@Inject(REQUEST) private request: Request) {}
}

@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}
```

**Scope Best Practices**:

- Use DEFAULT (singleton) for stateless services
- Use REQUEST scope when you need request context
- Use TRANSIENT for services with internal state per consumer
- REQUEST and TRANSIENT scopes have performance overhead
- Scope bubbles up - if A depends on REQUEST-scoped B, A becomes REQUEST-scoped

### Custom Providers with Interfaces

```typescript
export interface IUsersService {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  create(dto: CreateUserDto): Promise<User>;
}

export const USERS_SERVICE = Symbol('USERS_SERVICE');

@Injectable()
export class UsersService implements IUsersService {
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ where: { id } });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }
}

@Module({
  providers: [
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
  ],
  exports: [USERS_SERVICE],
})
export class UsersModule {}

@Injectable()
export class OrdersService {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService
  ) {}
}
```

### Circular Dependency Resolution

```typescript
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService
  ) {}
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}
}

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

```typescript
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(private eventEmitter: EventEmitter2) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save(dto);

    this.eventEmitter.emit('user.created', { userId: user.id });

    return user;
  }
}

@Injectable()
export class OrdersService {
  @OnEvent('user.created')
  async handleUserCreated(payload: { userId: string }) {
    await this.createWelcomeOrder(payload.userId);
  }
}
```

## Controllers and Routes

### RESTful Controller

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(
    @Query() pagination: PaginationDto
  ): Promise<UserResponseDto[]> {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204 })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
```

### DTOs and Validation

```typescript
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
```

## Guards, Interceptors, and Pipes

### Authentication Guard

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers['authorization'];
    if (!authorization) return undefined;

    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
```

### Role-Based Authorization

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  @Get('dashboard')
  getDashboard() {
    return { message: 'Admin dashboard' };
  }
}
```

### Response Interceptor

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta: {
    timestamp: string;
    path: string;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      }))
    );
  }
}
```

### Custom Validation Pipe

```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
      }));

      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

## Exception Handling

### Custom Exceptions

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(userId: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `User with ID ${userId} not found`,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND
    );
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `User with email ${email} already exists`,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT
    );
  }
}
```

### Global Exception Filter

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : (message as Record<string, unknown>).message,
      ...(typeof message === 'object' && message !== null ? message : {}),
    };

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).json(errorResponse);
  }
}
```

## Testing

### Unit Testing Services

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', email: 'test@example.com', name: 'Test User' }];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const dto = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };
      const user = { id: '1', ...dto };

      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user);

      const result = await service.create(dto);

      expect(result).toEqual(user);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
```

### E2E Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('test@example.com');
        });
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'invalid-email',
          name: 'Test',
          password: 'password123',
        })
        .expect(400);
    });
  });

  describe('/users (GET)', () => {
    it('should return all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
```

## Configuration

### Environment-Based Configuration

```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getDatabaseHost(): string {
    return this.config.get<string>('database.host');
  }
}
```

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

### Architecture

- One module per domain/feature
- Keep modules cohesive and focused
- Use DTOs for request/response validation
- Separate business logic into services
- Use repositories for data access
- Implement proper error handling

### Dependency Injection

- Use constructor injection
- Program to interfaces, not implementations
- Use appropriate scopes (DEFAULT for stateless)
- Avoid circular dependencies (use events or forwardRef)
- Use custom providers for flexibility

### Security

- Validate all inputs with class-validator
- Use Guards for authentication/authorization
- Implement rate limiting
- Use Helmet for security headers
- Never expose internal errors to clients

### Testing

- Unit test services with mocked dependencies
- E2E test controllers with supertest
- Use TestingModule for dependency setup
- Mock external services and databases

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

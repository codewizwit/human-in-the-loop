---
applyTo: '**/*.ts,**/*.controller.ts,**/*.service.ts,**/*.module.ts,**/*.guard.ts,**/*.interceptor.ts,**/*.pipe.ts,**/*.dto.ts'
---

# NestJS Backend Development

This project uses **NestJS** for building scalable Node.js backend applications. Follow these guidelines:

## Core Principles

1. **Modular Architecture** - Organize code into feature modules
2. **Dependency Injection** - Use NestJS DI container for loose coupling
3. **DTOs for Validation** - Always validate inputs with class-validator
4. **Separation of Concerns** - Controllers handle HTTP, services handle logic
5. **Proper Error Handling** - Use NestJS exceptions and filters

## Module Structure

```typescript
// ✅ CORRECT: Feature module with clear boundaries
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// ❌ WRONG: God module with everything
@Module({
  controllers: [UsersController, OrdersController, ProductsController],
  providers: [UsersService, OrdersService, ProductsService, ...],
})
export class AppModule {}
```

## Controllers

```typescript
// ✅ CORRECT: Thin controller, delegates to service
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}

// ❌ WRONG: Business logic in controller
@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.repository.create({ ...dto, password: hashedPassword });
    await this.repository.save(user);
    return user;
  }
}
```

## Services

```typescript
// ✅ CORRECT: Service with business logic
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }
}
```

## DTOs and Validation

```typescript
// ✅ CORRECT: DTO with validation decorators
export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}

// ❌ WRONG: No validation
export class CreateUserDto {
  email: string;
  name: string;
  password: string;
}
```

## Dependency Injection

```typescript
// ✅ CORRECT: Interface-based injection
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

// ✅ CORRECT: Factory provider for async setup
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (config: ConfigService) => {
        return createConnection(config.get('DB_URL'));
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
```

## Guards and Authorization

```typescript
// ✅ CORRECT: JWT Auth Guard
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.user = await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

// ✅ CORRECT: Role-based access
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {}
```

## Error Handling

```typescript
// ✅ CORRECT: Custom exceptions
export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

// ✅ CORRECT: Exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception instanceof HttpException
        ? exception.message
        : 'Internal server error',
    });
  }
}

// ❌ WRONG: Exposing internal errors
@Get(':id')
async findById(@Param('id') id: string) {
  try {
    return await this.service.findById(id);
  } catch (error) {
    throw new InternalServerErrorException(error.stack); // Never do this!
  }
}
```

## Configuration

```typescript
// ✅ CORRECT: Type-safe configuration
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}

// ❌ WRONG: Hardcoded values
const connection = createConnection({
  host: 'localhost',
  port: 5432,
  password: 'secret123', // Never do this!
});
```

## Testing

```typescript
// ✅ CORRECT: Unit test with mocks
describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should find user by id', async () => {
    const user = { id: '1', email: 'test@example.com' };
    repository.findOne.mockResolvedValue(user);

    const result = await service.findById('1');

    expect(result).toEqual(user);
  });
});
```

## Key Anti-Patterns to Avoid

❌ **NO** business logic in controllers - use services
❌ **NO** circular dependencies - use forwardRef or events
❌ **NO** hardcoded configuration - use ConfigModule
❌ **NO** skipping input validation - always use DTOs
❌ **NO** exposing internal errors - use exception filters
❌ **NO** God modules - split into feature modules
❌ **NO** direct repository access in controllers

## Best Practices

✅ **DO** use one module per feature/domain
✅ **DO** validate all inputs with class-validator
✅ **DO** use Guards for authentication/authorization
✅ **DO** use Interceptors for cross-cutting concerns
✅ **DO** use Pipes for data transformation
✅ **DO** use Exception Filters for error handling
✅ **DO** write unit tests for services
✅ **DO** write E2E tests for controllers
✅ **DO** use ConfigService for configuration
✅ **DO** use proper HTTP status codes

---

**Generated by Human-in-the-Loop AI Hub**
Framework expertise for NestJS backend development

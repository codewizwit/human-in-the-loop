<prompt>
  <metadata>
    <id>context-pack-builder</id>
    <name>Context Pack Builder</name>
    <version>1.0.0</version>
    <description>Generate comprehensive context packs for frameworks, technologies, or domains. Creates structured knowledge bases with patterns, best practices, code examples, and anti-patterns that can be used to guide AI assistants.</description>
    <category>meta</category>
    <author>codewizwit</author>
    <license>MIT</license>
    <tags>
      <tag>meta</tag>
      <tag>context-pack</tag>
      <tag>knowledge-base</tag>
      <tag>patterns</tag>
      <tag>best-practices</tag>
      <tag>documentation</tag>
    </tags>
    <lastUpdated>2025-12-01</lastUpdated>
  </metadata>

  <variables>
    <variable name="technology" required="true">The framework, library, or domain to create a context pack for</variable>
    <variable name="scope" required="false" default="comprehensive">Scope of the context pack (minimal, standard, comprehensive)</variable>
    <variable name="target_audience" required="false" default="intermediate">Target audience skill level (beginner, intermediate, advanced)</variable>
    <variable name="focus_areas" required="false">Specific areas to emphasize (e.g., "testing", "performance", "security")</variable>
  </variables>

  <examples>
    <example>
      <title>RxJS Context Pack</title>
      <input>
Technology: RxJS for Angular applications
Scope: comprehensive
Focus areas: error handling, memory management, testing
      </input>
      <output>
# RxJS Context Pack

Cross-cutting patterns for reactive programming with RxJS in Angular applications.

## Overview

This context pack provides comprehensive guidance for using RxJS effectively in Angular applications. It covers operators, patterns, error handling, memory management, and testing strategies.

## What's Included

- **Core Operators** - Essential operators and when to use them
- **Error Handling** - Strategies for handling errors in streams
- **Memory Management** - Preventing memory leaks with proper subscription handling
- **Testing** - Testing observables with marble diagrams and fakeAsync
- **Common Patterns** - Caching, polling, debouncing, throttling
- **Anti-Patterns** - Common mistakes and how to avoid them

## Installation

```bash
hit install context/rxjs
```

## Key Patterns

### Subscription Management

```typescript
/**
 * Use takeUntilDestroyed for automatic cleanup in Angular 16+
 */
@Component({
  selector: 'app-user-list',
  template: `...`,
})
export class UserListComponent {
  private destroyRef = inject(DestroyRef);

  users$ = this.userService
    .getUsers()
    .pipe(takeUntilDestroyed(this.destroyRef));
}
```

```typescript
/**
 * Use AsyncPipe for template subscriptions (preferred)
 * Automatically subscribes and unsubscribes
 */
@Component({
  selector: 'app-user-list',
  template: `
    @if (users$ | async; as users) { @for (user of users; track user.id) {
    <app-user-card [user]="user" />
    } }
  `,
})
export class UserListComponent {
  users$ = this.userService.getUsers();
}
```

### Error Handling Strategies

```typescript
/**
 * catchError with fallback value
 * Use when you can provide a default value
 */
this.userService.getUser(id).pipe(
  catchError((error) => {
    this.logger.error('Failed to fetch user', error);
    return of(null);
  })
);
```

```typescript
/**
 * retry with exponential backoff
 * Use for transient network failures
 */
this.apiService.fetchData().pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1000),
  }),
  catchError((error) => {
    this.notificationService.showError('Request failed after retries');
    return EMPTY;
  })
);
```

```typescript
/**
 * Error boundaries with shareReplay
 * Prevent error from breaking shared streams
 */
const user$ = this.userService.getUser(id).pipe(
  catchError((error) => {
    this.errorHandler.handle(error);
    return EMPTY;
  }),
  shareReplay({ bufferSize: 1, refCount: true })
);
```

### Caching Pattern

```typescript
/**
 * Simple in-memory cache with shareReplay
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config$ = this.http
    .get<Config>('/api/config')
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getConfig(): Observable<Config> {
    return this.config$;
  }
}
```

```typescript
/**
 * Cache with expiration using timer
 */
@Injectable({ providedIn: 'root' })
export class CachedDataService {
  private cache$ = new BehaviorSubject<Data | null>(null);
  private cacheTime = 5 * 60 * 1000; // 5 minutes

  getData(): Observable<Data> {
    return this.cache$.pipe(
      switchMap((cached) => {
        if (cached && !this.isExpired(cached)) {
          return of(cached);
        }
        return this.fetchFreshData();
      })
    );
  }
}
```

### Combining Streams

```typescript
/**
 * combineLatest - when you need latest values from multiple streams
 * Emits when ANY source emits (after all have emitted once)
 */
const userWithPermissions$ = combineLatest([
  this.userService.currentUser$,
  this.permissionService.permissions$,
]).pipe(map(([user, permissions]) => ({ user, permissions })));
```

```typescript
/**
 * forkJoin - when you need all values to complete
 * Emits once when ALL sources complete
 */
const initialData$ = forkJoin({
  users: this.userService.getUsers(),
  roles: this.roleService.getRoles(),
  settings: this.settingsService.getSettings(),
});
```

```typescript
/**
 * withLatestFrom - when you need current value from another stream
 * Only emits when source emits, includes latest from other streams
 */
this.saveAction$.pipe(
  withLatestFrom(this.form.valueChanges),
  switchMap(([_, formValue]) => this.saveService.save(formValue))
);
```

### Testing Observables

```typescript
/**
 * Testing with marbles
 */
describe('UserService', () => {
  it('should retry failed requests', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-#', {}, new Error('Network error'));
      const expected = '-#';

      expectObservable(source$.pipe(retry(2))).toBe(expected);
    });
  });
});
```

```typescript
/**
 * Testing with fakeAsync
 */
it('should debounce search input', fakeAsync(() => {
  const results: string[] = [];

  component.search$
    .pipe(debounceTime(300))
    .subscribe((value) => results.push(value));

  component.searchControl.setValue('a');
  tick(100);
  component.searchControl.setValue('ab');
  tick(100);
  component.searchControl.setValue('abc');
  tick(300);

  expect(results).toEqual(['abc']);
}));
```

## Anti-Patterns

### Memory Leaks

```typescript
/**
 * ❌ BAD: Manual subscription without cleanup
 */
ngOnInit() {
  this.userService.getUsers().subscribe(users => {
    this.users = users;
  });
}

/**
 * ✅ GOOD: Use takeUntilDestroyed or AsyncPipe
 */
users$ = this.userService.getUsers();
// Use in template with | async
```

### Nested Subscriptions

```typescript
/**
 * ❌ BAD: Subscribe inside subscribe
 */
this.userService.getUser(id).subscribe((user) => {
  this.orderService.getOrders(user.id).subscribe((orders) => {
    this.orders = orders;
  });
});

/**
 * ✅ GOOD: Use switchMap/mergeMap
 */
this.userService
  .getUser(id)
  .pipe(switchMap((user) => this.orderService.getOrders(user.id)))
  .subscribe((orders) => {
    this.orders = orders;
  });
```

### Overusing BehaviorSubject

```typescript
/**
 * ❌ BAD: BehaviorSubject when you don't need initial value
 */
private data$ = new BehaviorSubject<Data | null>(null);

/**
 * ✅ GOOD: Use ReplaySubject(1) or shareReplay
 */
private data$ = new ReplaySubject<Data>(1);
// OR
private data$ = this.http.get<Data>('/api/data').pipe(
  shareReplay(1)
);
```

## Operator Decision Tree

| Need                                      | Operator               |
| ----------------------------------------- | ---------------------- |
| Transform each value                      | `map`                  |
| Filter values                             | `filter`               |
| Switch to new observable, cancel previous | `switchMap`            |
| Switch to new observable, keep all        | `mergeMap`             |
| Switch to new observable, queue them      | `concatMap`            |
| Combine latest from multiple              | `combineLatest`        |
| Wait for all to complete                  | `forkJoin`             |
| Add delay between emissions               | `debounceTime`         |
| Limit emission rate                       | `throttleTime`         |
| Emit only distinct values                 | `distinctUntilChanged` |
| Handle errors                             | `catchError`           |
| Retry on error                            | `retry`                |
| Cache/share results                       | `shareReplay`          |

## Related Resources

- **Angular Testing Patterns** - Testing strategies for Angular apps
- **NgRx Patterns** - State management with RxJS
  </output>
  </example>

      <example>
        <title>GraphQL Context Pack</title>
        <input>

  Technology: GraphQL with Apollo Client in Angular
  Scope: standard
  Focus areas: caching, error handling, code generation
  </input>
  <output>

# GraphQL Context Pack

Patterns for using GraphQL with Apollo Client in Angular applications.

## Overview

This context pack provides guidance for integrating GraphQL with Angular using Apollo Client. It covers queries, mutations, caching, error handling, and code generation.

## What's Included

- **Apollo Setup** - Configuring Apollo Client for Angular
- **Queries & Mutations** - Best practices for data fetching
- **Caching** - Apollo cache strategies and normalization
- **Error Handling** - Handling GraphQL and network errors
- **Code Generation** - Type-safe operations with GraphQL Codegen

## Installation

```bash
hit install context/graphql
```

## Key Patterns

### Apollo Module Setup

```typescript
/**
 * Apollo configuration with error handling and caching
 */
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';

export function apolloOptionsFactory(httpLink: HttpLink): ApolloOptions {
  const http = httpLink.create({ uri: '/graphql' });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(`GraphQL error: ${message}`);
      });
    }
    if (networkError) {
      console.error(`Network error: ${networkError}`);
    }
  });

  return {
    link: ApolloLink.from([errorLink, http]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            users: {
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
          },
        },
      },
    }),
  };
}
```

### Type-Safe Queries with Codegen

```typescript
/**
 * Generated query hook usage
 * Run: npx graphql-codegen
 */
import { GetUsersGQL, GetUsersQuery } from './generated/graphql';

@Component({
  selector: 'app-user-list',
  template: `
    @if (users$ | async; as result) { @if (result.loading) {
    <app-loading />
    } @if (result.data?.users; as users) { @for (user of users; track user.id) {
    <app-user-card [user]="user" />
    } } }
  `,
})
export class UserListComponent {
  users$ = this.getUsersGQL.watch().valueChanges;

  constructor(private getUsersGQL: GetUsersGQL) {}
}
```

### Optimistic Updates

```typescript
/**
 * Optimistic UI for mutations
 */
addUser(user: CreateUserInput) {
  return this.addUserGQL.mutate({
    variables: { input: user },
    optimisticResponse: {
      __typename: 'Mutation',
      addUser: {
        __typename: 'User',
        id: 'temp-id',
        ...user
      }
    },
    update: (cache, { data }) => {
      const existing = cache.readQuery<GetUsersQuery>({
        query: GET_USERS
      });

      if (existing && data?.addUser) {
        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: [...existing.users, data.addUser]
          }
        });
      }
    }
  });
}
```

### Error Handling

```typescript
/**
 * Component-level error handling
 */
@Component({...})
export class UserDetailComponent {
  user$ = this.getUserGQL.watch({ id: this.userId }).valueChanges.pipe(
    map(result => ({
      data: result.data?.user,
      loading: result.loading,
      error: result.error
    })),
    catchError(error => of({
      data: null,
      loading: false,
      error: this.formatError(error)
    }))
  );
}
```

## Cache Strategies

| Strategy            | Use Case                        |
| ------------------- | ------------------------------- |
| `cache-first`       | Static data, infrequent changes |
| `network-only`      | Real-time data, always fresh    |
| `cache-and-network` | Show cached, update with fresh  |
| `no-cache`          | Mutations, one-time fetches     |

## Anti-Patterns

```typescript
/**
 * ❌ BAD: Not using generated types
 */
this.apollo.query({ query: GET_USERS }).subscribe((result) => {
  this.users = result.data.users; // No type safety
});

/**
 * ✅ GOOD: Use generated query classes
 */
this.getUsersGQL.fetch().subscribe((result) => {
  this.users = result.data.users; // Fully typed
});
```

      </output>
    </example>

    <example>
      <title>Authentication Context Pack</title>
      <input>

Technology: JWT Authentication with Angular and NestJS
Scope: comprehensive
Focus areas: security, token management, guards
</input>
<output>

# Authentication Context Pack

Comprehensive patterns for JWT authentication in Angular + NestJS applications.

## Overview

This context pack provides end-to-end authentication patterns for Angular frontends with NestJS backends. It covers JWT tokens, refresh flows, guards, interceptors, and security best practices.

## What's Included

- **Token Management** - Access tokens, refresh tokens, storage
- **Angular Guards** - Route protection and role-based access
- **HTTP Interceptors** - Automatic token injection and refresh
- **NestJS Guards** - Server-side authentication and authorization
- **Security Patterns** - XSS/CSRF protection, secure storage

## Installation

```bash
hit install context/auth
```

## Key Patterns

### Angular Auth Service

```typescript
/**
 * Authentication service with token management
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private refreshTokenTimeout?: ReturnType<typeof setTimeout>;

  readonly isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/login', credentials)
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  logout(): void {
    this.stopRefreshTokenTimer();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<AuthResponse>('/api/auth/refresh', { refreshToken })
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    this.currentUser$.next(response.user);
    this.startRefreshTokenTimer(response.expiresIn);
  }

  private startRefreshTokenTimer(expiresIn: number): void {
    const timeout = (expiresIn - 60) * 1000; // Refresh 1 min before expiry
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
}
```

### Auth Interceptor

```typescript
/**
 * HTTP interceptor for token injection and refresh
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  if (token && !req.url.includes('/auth/')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = localStorage.getItem('access_token');
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(newReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
```

### Route Guards

```typescript
/**
 * Functional auth guard for Angular 16+
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuth) => {
      if (!isAuth) {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
      return true;
    })
  );
};

/**
 * Role-based guard
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const requiredRoles = route.data['roles'] as string[];

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (!user) return false;
      return requiredRoles.some((role) => user.roles.includes(role));
    })
  );
};
```

### NestJS JWT Strategy

```typescript
/**
 * JWT strategy for NestJS Passport
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
```

### NestJS Guards

```typescript
/**
 * Roles guard for NestJS
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

/**
 * Usage with decorator
 */
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin')
getAdminData() {
  return this.adminService.getData();
}
```

## Security Best Practices

| Practice                  | Implementation                                  |
| ------------------------- | ----------------------------------------------- |
| Store tokens securely     | HttpOnly cookies for refresh, memory for access |
| Short access token expiry | 15 minutes recommended                          |
| Rotate refresh tokens     | Issue new refresh token on each use             |
| Validate on server        | Never trust client-side validation              |
| Use HTTPS                 | Always in production                            |
| Implement CSRF protection | Double-submit cookie pattern                    |

## Anti-Patterns

```typescript
/**
 * ❌ BAD: Storing tokens in localStorage (XSS vulnerable)
 */
localStorage.setItem('token', response.token);

/**
 * ✅ BETTER: Store in memory, use HttpOnly cookie for refresh
 */
// Access token in memory (AuthService)
// Refresh token in HttpOnly cookie (set by server)
```

      </output>
    </example>

  </examples>

  <context>
You are a technical documentation expert specializing in creating comprehensive context packs for AI assistants. You understand:
- Framework and library best practices
- Common patterns and anti-patterns
- Code documentation standards (TypeDoc)
- Angular, NestJS, and TypeScript ecosystems
- Testing strategies and patterns
- Security best practices
  </context>

  <instructions>
Generate comprehensive context packs following this structure:

## 1. Overview Section

- Clear description of what the context pack covers
- List of included topics
- Installation instructions (using `hit install context/[name]`)

## 2. Key Patterns

For each pattern include:

- TypeDoc-style comments explaining the pattern
- Complete, working code examples
- When to use this pattern
- Common variations

## 3. Anti-Patterns Section

- Show the wrong way with ❌ BAD label
- Show the correct way with ✅ GOOD label
- Explain why it matters

## 4. Reference Tables

- Decision trees for choosing approaches
- Quick reference for common operations
- Configuration options

## 5. Code Style Requirements

- Use TypeDoc comments (not inline //)
- Include complete, working examples
- Show Angular 16+ patterns (signals, inject, standalone)
- Follow project naming conventions

## 6. Related Resources

- Link to related context packs
- Link to related prompts in the toolkit
  </instructions>

  <constraints>

- Use TypeDoc comments only, no inline // comments
- All code examples must be complete and working
- Focus on the specified technology stack (Angular, NestJS, TypeScript)
- Include both happy path and error handling patterns
- Provide practical, real-world examples
- Keep examples concise but complete
- Do not include external URLs that may break
  </constraints>

  <output_format>

# [Technology] Context Pack

[Description of what this context pack provides]

## Overview

[Detailed overview with bullet list of included topics]

## What's Included

- **Topic 1** - Description
- **Topic 2** - Description

## Installation

```bash
hit install context/[name]
```

## Key Patterns

### Pattern Name

```typescript
/**
 * TypeDoc comment explaining the pattern
 */
[Complete code example]
```

## Anti-Patterns

### Anti-Pattern Name

```typescript
/**
 * ❌ BAD: Description of what's wrong
 */
[Bad code example]

/**
 * ✅ GOOD: Description of correct approach
 */
[Good code example]
```

## Reference

| Topic | Description |
| ----- | ----------- |
| Item  | Details     |

## Related Resources

- **Related Pack** - Description
  </output_format>
  </prompt>

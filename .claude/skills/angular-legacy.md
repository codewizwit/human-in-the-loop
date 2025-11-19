---
name: angular-expert
description: Apply Angular frontend development best practices including component patterns, OnPush change detection, lifecycle hooks, RxJS reactive programming, state management, and performance optimization when building or reviewing Angular applications.
---

# Angular Expert Skill

Use this skill when working with Angular frontend code, designing component architecture, reviewing Angular patterns, or discussing TypeScript client-side development.

## When to Activate This Skill

Activate automatically when:

- Reviewing Angular components, services, or modules
- Designing component architecture (smart vs presentational)
- Implementing change detection strategies
- Working with RxJS observables and reactive patterns
- Setting up state management (NgRx, Signals)
- Optimizing Angular performance
- Implementing routing and navigation
- Testing Angular applications
- Using Angular CLI or Nx for development

## Component Architecture Patterns

### Smart vs Presentational Components

**Smart (Container) Components**:

- Manage state and business logic
- Connect to services and stores
- Handle routing and navigation
- Typically use default change detection
- Minimal template logic

```typescript
@Component({
  selector: 'app-user-list-container',
  template: `
    <app-user-list
      [users]="users$ | async"
      [loading]="loading$ | async"
      (userSelected)="onUserSelected($event)"
      (userDeleted)="onUserDeleted($event)"
    >
    </app-user-list>
  `,
})
export class UserListContainerComponent {
  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectUsersLoading);

  constructor(private store: Store, private router: Router) {}

  onUserSelected(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  onUserDeleted(user: User): void {
    this.store.dispatch(UserActions.deleteUser({ id: user.id }));
  }
}
```

**Presentational (Dumb) Components**:

- Receive data via `@Input()`
- Emit events via `@Output()`
- No direct service dependencies
- Use `OnPush` change detection
- Highly reusable and testable

```typescript
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  @Input({ required: true }) users: User[] = [];
  @Input() loading = false;
  @Output() userSelected = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<User>();

  trackByUserId(_index: number, user: User): string {
    return user.id;
  }

  selectUser(user: User): void {
    this.userSelected.emit(user);
  }

  deleteUser(user: User): void {
    this.userDeleted.emit(user);
  }
}
```

## Change Detection Strategies

### OnPush Strategy (Recommended)

Use `OnPush` for better performance - component only checks when:

1. Input references change
2. Events are emitted from the component or children
3. Observables emit (with async pipe)
4. Manually triggered with `ChangeDetectorRef`

```typescript
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Output() edit = new EventEmitter<User>();

  // ✅ GOOD: Immutable update triggers change detection
  updateUser(updates: Partial<User>): void {
    const updatedUser = { ...this.user, ...updates }; // New reference
    this.edit.emit(updatedUser);
  }

  // ❌ BAD: Mutating input doesn't trigger OnPush
  badUpdate(name: string): void {
    this.user.name = name; // Mutation - won't detect change
  }
}
```

### Manual Change Detection

```typescript
@Component({
  selector: 'app-polling-component',
  template: `<div>{{ data }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollingComponent implements OnInit, OnDestroy {
  data: string;
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // For non-async pipe observables, mark for check
    this.dataService
      .poll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.data = data;
        this.cdr.markForCheck(); // Tell Angular to check this component
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Lifecycle Hooks

### Common Lifecycle Hooks

```typescript
@Component({
  selector: 'app-lifecycle-demo',
  template: `<div>{{ data }}</div>`,
})
export class LifecycleDemoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userId!: string;
  data: any;

  constructor(private service: DataService) {
    // ✅ GOOD: Dependency injection only
    // ❌ BAD: Don't call services or access inputs here
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before ngOnInit and whenever inputs change
    if (changes['userId'] && !changes['userId'].firstChange) {
      console.log('UserId changed:', changes['userId'].currentValue);
      this.loadUserData(changes['userId'].currentValue);
    }
  }

  ngOnInit(): void {
    // ✅ GOOD: Initialize component, call services, subscribe to observables
    this.loadUserData(this.userId);
  }

  ngOnDestroy(): void {
    // ✅ GOOD: Clean up subscriptions, timers, event listeners
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();

  private loadUserData(id: string): void {
    this.service
      .getUserData(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.data = data));
  }
}
```

### Lifecycle Hook Order

1. `constructor()` - Dependency injection
2. `ngOnChanges()` - When inputs change (called before ngOnInit)
3. `ngOnInit()` - Component initialization (called once)
4. `ngDoCheck()` - Custom change detection
5. `ngAfterContentInit()` - After content projection
6. `ngAfterContentChecked()` - After content checked
7. `ngAfterViewInit()` - After view initialization
8. `ngAfterViewChecked()` - After view checked
9. `ngOnDestroy()` - Cleanup before component destruction

## Input/Output Patterns

### Required Inputs (Angular 16+)

```typescript
@Component({
  selector: 'app-user-profile',
  template: `<div>{{ user.name }}</div>`,
})
export class UserProfileComponent {
  // ✅ GOOD: Required input enforced at compile time
  @Input({ required: true }) user!: User;

  // ✅ GOOD: Optional input with default
  @Input() theme: 'light' | 'dark' = 'light';

  // ✅ GOOD: Transform input
  @Input({ transform: booleanAttribute }) disabled = false;
}
```

### Output Events

```typescript
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as User);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
```

### Two-Way Binding with Model

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <button (click)="decrement()">-</button>
    <span>{{ value }}</span>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();

  increment(): void {
    this.value++;
    this.valueChange.emit(this.value);
  }

  decrement(): void {
    this.value--;
    this.valueChange.emit(this.value);
  }
}

// Usage: <app-counter [(value)]="count"></app-counter>
```

## RxJS Reactive Patterns

### Unsubscribing Strategies

**Best: Async Pipe (No Manual Unsubscribe)**:

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
    </div>
  `,
})
export class UserListComponent {
  users$ = this.service.getUsers();

  constructor(private service: UserService) {}
  // No ngOnDestroy needed - async pipe handles unsubscribe
}
```

**Good: takeUntil Pattern**:

```typescript
@Component({
  selector: 'app-polling',
  template: `<div>{{ data }}</div>`,
})
export class PollingComponent implements OnInit, OnDestroy {
  data: any;
  private destroy$ = new Subject<void>();

  constructor(private service: DataService) {}

  ngOnInit(): void {
    this.service
      .poll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.data = data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Acceptable: takeUntilDestroyed (Angular 16+)**:

```typescript
@Component({
  selector: 'app-data-loader',
  template: `<div>{{ data }}</div>`,
})
export class DataLoaderComponent {
  data: any;
  private destroyRef = inject(DestroyRef);

  constructor(private service: DataService) {
    this.service
      .getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => (this.data = data));
  }
}
```

### Combining Observables

```typescript
@Component({
  selector: 'app-user-posts',
  template: `
    <div *ngIf="vm$ | async as vm">
      <h2>{{ vm.user.name }}</h2>
      <div *ngFor="let post of vm.posts">{{ post.title }}</div>
    </div>
  `,
})
export class UserPostsComponent {
  vm$ = combineLatest({
    user: this.route.params.pipe(
      switchMap((params) => this.userService.getUser(params['id']))
    ),
    posts: this.route.params.pipe(
      switchMap((params) => this.postService.getUserPosts(params['id']))
    ),
  });

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) {}
}
```

## Signals (Angular 16+)

### Signal Basics

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment(): void {
    this.count.update((value) => value + 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
```

### Signal Inputs (Angular 17+)

```typescript
@Component({
  selector: 'app-user-card',
  template: `<div>{{ user().name }}</div>`,
})
export class UserCardComponent {
  user = input.required<User>();
  theme = input<'light' | 'dark'>('light');

  // Computed from input signal
  initials = computed(() => {
    const name = this.user().name;
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  });
}
```

### Effects

```typescript
@Component({
  selector: 'app-theme-manager',
  template: `<button (click)="toggleTheme()">Toggle</button>`,
})
export class ThemeManagerComponent {
  theme = signal<'light' | 'dark'>('light');

  constructor() {
    // Effect runs whenever theme signal changes
    effect(() => {
      document.body.classList.toggle('dark-theme', this.theme() === 'dark');
      localStorage.setItem('theme', this.theme());
    });
  }

  toggleTheme(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }
}
```

## Performance Optimization

### TrackBy for ngFor

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let user of users; trackBy: trackByUserId">
      {{ user.name }}
    </div>
  `,
})
export class UserListComponent {
  @Input() users: User[] = [];

  // ✅ GOOD: Prevent unnecessary DOM re-renders
  trackByUserId(_index: number, user: User): string {
    return user.id;
  }

  // ❌ BAD: Will re-render all items on every change
  // trackBy: trackByIndex
}
```

### Pure Pipes

```typescript
@Pipe({
  name: 'filter',
  pure: true, // ✅ Default: only recalculates when inputs change
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!searchText) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
```

### Lazy Loading Modules

```typescript
const routes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canLoad: [AdminGuard],
  },
];
```

### Virtual Scrolling

```typescript
@Component({
  selector: 'app-large-list',
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `,
})
export class LargeListComponent {
  items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));
}
```

## State Management Patterns

### Component State (Simple)

```typescript
@Component({
  selector: 'app-simple-state',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">{{ error }}</div>
    <div *ngIf="data">{{ data.name }}</div>
  `,
})
export class SimpleStateComponent implements OnInit {
  loading = false;
  error: string | null = null;
  data: User | null = null;

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.loading = true;
    this.service
      .getUser()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => (this.data = data),
        error: (err) => (this.error = err.message),
      });
  }
}
```

### Service State (Medium Complexity)

```typescript
@Injectable({ providedIn: 'root' })
export class UserStateService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.loadingSubject.next(true);
    this.http
      .get<User[]>('/api/users')
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe((users) => this.usersSubject.next(users));
  }

  addUser(user: User): void {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }
}
```

### NgRx Store (Complex Applications)

```typescript
// Actions
export const UserActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),
  },
});

// Reducer
export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

// Selectors
export const selectUsersState = createFeatureSelector<UserState>('users');
export const selectAllUsers = createSelector(
  selectUsersState,
  (state) => state.users
);
export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);

// Component
@Component({
  selector: 'app-users',
  template: `
    <div *ngIf="loading$ | async">Loading...</div>
    <div *ngFor="let user of users$ | async">{{ user.name }}</div>
  `,
})
export class UsersComponent implements OnInit {
  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectUsersLoading);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUsers());
  }
}
```

## Testing Patterns

### Component Testing

```typescript
describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });

  it('should display user name', () => {
    component.user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('John Doe');
  });

  it('should emit edit event', () => {
    const user = { id: '1', name: 'John', email: 'john@example.com' };
    component.user = user;

    spyOn(component.edit, 'emit');
    component.onEdit();

    expect(component.edit.emit).toHaveBeenCalledWith(user);
  });
});
```

### Service Testing

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: '1', name: 'John' }];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

## Best Practices Checklist

When reviewing or writing Angular code, ensure:

### Architecture

- ✅ Smart components manage state, presentational components display data
- ✅ Use `OnPush` change detection for presentational components
- ✅ Keep components small and focused (< 200 lines)
- ✅ Extract reusable logic into services
- ✅ Use dependency injection for all service dependencies

### Performance

- ✅ Use `trackBy` with `*ngFor`
- ✅ Implement `OnPush` change detection strategy
- ✅ Use pure pipes for transformations
- ✅ Lazy load feature modules
- ✅ Use virtual scrolling for large lists
- ✅ Avoid function calls in templates

### Reactive Programming

- ✅ Prefer `async` pipe over manual subscriptions
- ✅ Use `takeUntil` or `takeUntilDestroyed` for cleanup
- ✅ Unsubscribe in `ngOnDestroy`
- ✅ Use RxJS operators for data transformation
- ✅ Avoid nested subscriptions

### Forms

- ✅ Use Reactive Forms for complex forms
- ✅ Implement custom validators when needed
- ✅ Handle form errors gracefully
- ✅ Disable submit while form is invalid

### Testing

- ✅ Unit test components and services
- ✅ Mock dependencies with `HttpTestingController`
- ✅ Test user interactions and events
- ✅ Aim for >80% code coverage

## Common Anti-Patterns to Avoid

❌ **Don't mutate inputs**

```typescript
// BAD
@Input() user!: User;
updateUser() {
  this.user.name = 'New Name'; // Mutation won't trigger OnPush
}

// GOOD
@Output() userUpdated = new EventEmitter<User>();
updateUser() {
  this.userUpdated.emit({ ...this.user, name: 'New Name' });
}
```

❌ **Don't subscribe in templates**

```typescript
// BAD
get users() {
  return this.service.getUsers(); // Creates new subscription on every change detection
}

// GOOD
users$ = this.service.getUsers(); // Subscribe once with async pipe
```

❌ **Don't forget to unsubscribe**

```typescript
// BAD
ngOnInit() {
  this.service.getData().subscribe(data => this.data = data); // Memory leak
}

// GOOD
ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.data = data);
}
```

## Related Skills

- **TypeScript Expert** - For advanced TypeScript patterns
- **Testing Automation** - For comprehensive test strategies
- **Nx Monorepo Expert** - For monorepo Angular development
- **Accessibility First** - For WCAG-compliant Angular apps

## References

- [Angular Official Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Style Guide](https://angular.io/guide/styleguide)

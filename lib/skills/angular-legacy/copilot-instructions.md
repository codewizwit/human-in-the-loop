---
applyTo: '**/*.ts,**/*.component.ts,**/*.service.ts,**/*.module.ts,**/*.html'
---

# Angular Legacy Development (Pre-Angular 16)

This project uses **traditional Angular patterns** with NgModules, lifecycle hooks, decorators, and RxJS observables. Follow these guidelines:

## Core Principles

1. **Use NgModules** - Organize features with `@NgModule()` declarations
2. **Lifecycle Hooks** - Use `ngOnInit`, `ngOnChanges`, `ngOnDestroy` for component initialization and cleanup
3. **Decorator-Based I/O** - Use `@Input()` and `@Output()` for component communication
4. **Structural Directives** - Use `*ngIf`, `*ngFor`, `*ngSwitch` for template logic
5. **RxJS Observables** - Use subjects and observables for state and async operations
6. **Manual Subscription Management** - Use `takeUntil` pattern for cleanup

## Module Organization

```typescript
// ✅ CORRECT: Feature module with forChild routing
@NgModule({
  declarations: [UsersListComponent, UserDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [UserService],
})
export class UsersModule {}

// ✅ CORRECT: App module with forRoot routing
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

// ❌ WRONG: Declaring component in multiple modules
@NgModule({
  declarations: [SharedComponent], // This component is also in SharedModule
})
export class FeatureModule {}
```

## Component Lifecycle

```typescript
// ✅ CORRECT: Proper lifecycle hook usage
export class UserComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userId!: string;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Initialize component, load data
    this.loadUserData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId']) {
      this.loadUserData();
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.userService
      .getUser(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });
  }
}

// ❌ WRONG: Not cleaning up subscriptions
export class BadUserComponent implements OnInit {
  @Input() userId!: string;

  ngOnInit(): void {
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user; // Memory leak - never unsubscribes
    });
  }
}
```

## Input and Output Decorators

```typescript
// ✅ CORRECT: Using @Input() and @Output()
@Component({
  selector: 'app-user-form',
  template: `...`,
})
export class UserFormComponent {
  @Input({ required: true }) user!: User;
  @Input() showEmail = false;
  @Output() saved = new EventEmitter<User>();
  @Output() cancelled = new EventEmitter<void>();

  onSave(): void {
    this.saved.emit(this.user);
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

// ❌ WRONG: Not using decorators for component communication
export class BadFormComponent {
  user: User = {}; // Should be @Input()
  savedCallback: Function = () => {}; // Should be @Output()
}
```

## Structural Directives Usage

```typescript
// ✅ CORRECT: Using *ngIf for conditional rendering
template: `
  <div *ngIf="isLoggedIn; else notLoggedIn">
    <p>Welcome, {{ username }}!</p>
  </div>
  <ng-template #notLoggedIn>
    <p>Please log in</p>
  </ng-template>

  <!-- ✅ CORRECT: Using *ngFor with trackBy -->
  <ul>
    <li *ngFor="let user of users; trackBy: trackByUserId">
      {{ user.name }}
    </li>
  </ul>

  <!-- ✅ CORRECT: Using *ngSwitch for multiple states -->
  <div [ngSwitch]="status">
    <span *ngSwitchCase="'active'">Active</span>
    <span *ngSwitchCase="'inactive'">Inactive</span>
    <span *ngSwitchDefault>Unknown</span>
  </div>
`;

// ❌ WRONG: Not using trackBy with *ngFor
template: `
  <li *ngFor="let user of users"> <!-- No trackBy - poor performance -->
    {{ user.name }}
  </li>
`;

// ❌ WRONG: Complex logic in templates
template: `
  <li *ngFor="let item of items | filter:searchTerm | sort">
    {{ item.name }}
  </li>
`;
```

## RxJS Observable Patterns

```typescript
// ✅ CORRECT: Observable state management with takeUntil
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="loading$ | async">Loading...</div>
    <ul *ngIf="(users$ | async) as users">
      <li *ngFor="let user of users; trackBy: trackByUserId">
        {{ user.name }}
      </li>
    </ul>
  `,
})
export class UserListComponent implements OnInit, OnDestroy {
  users$!: Observable<User[]>;
  loading$!: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users$ = this.userService.users$;
    this.loading$ = this.userService.loading$;

    // Additional subscriptions with automatic cleanup
    this.userService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notification) => this.handleNotification(notification));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByUserId(_index: number, user: User): string {
    return user.id;
  }

  private handleNotification(notification: Notification): void {
    console.log('Notification:', notification);
  }
}

// ✅ CORRECT: Service-level state with BehaviorSubject
@Injectable({ providedIn: 'root' })
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.loadingSubject.next(true);
    this.http.get<User[]>('/api/users').subscribe({
      next: (users) => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.loadingSubject.next(false);
      },
    });
  }

  addUser(user: User): void {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }
}

// ❌ WRONG: Nested subscriptions (avoid this pattern)
ngOnInit(): void {
  this.userService.getUser(this.userId).subscribe((user) => {
    this.postService.getPosts(user.id).subscribe((posts) => {
      // Nested subscriptions - hard to manage
      this.handleData(user, posts);
    });
  });
}

// ❌ WRONG: Not unsubscribing
ngOnInit(): void {
  this.userService.users$.subscribe((users) => {
    this.users = users; // Memory leak - never unsubscribes
  });
}
```

## Change Detection Strategy

```typescript
// ✅ CORRECT: OnPush for presentational components
@Component({
  selector: 'app-user-card',
  template: `
    <div>{{ user.name }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() edit = new EventEmitter<User>();

  // ✅ GOOD: Immutable updates trigger change detection
  onEdit(): void {
    this.edit.emit({ ...this.user, name: 'Updated' });
  }
}

// ✅ CORRECT: Default change detection for smart components
@Component({
  selector: 'app-user-list',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.loadUsers();
  }
}

// ❌ WRONG: Mutating inputs with OnPush change detection
onEdit(): void {
  this.user.name = 'Updated'; // Won't trigger OnPush
}

// ❌ WRONG: Default change detection everywhere (poor performance)
@Component({
  changeDetection: ChangeDetectionStrategy.Default, // Avoid when possible
})
```

## Avoid These Patterns

❌ **DON'T** declare components in multiple modules:

```typescript
// Bad: UserComponent declared in both UsersModule and SharedModule
@NgModule({
  declarations: [UserComponent], // Already in UsersModule!
})
export class SharedModule {}
```

❌ **DON'T** forget to unsubscribe:

```typescript
ngOnInit(): void {
  this.service.data$.subscribe(data => {
    this.data = data;
  }); // Memory leak!
}
```

❌ **DON'T** use \*ngFor without trackBy:

```typescript
<li *ngFor="let user of users">{{ user.name }}</li>
<!-- Add: trackBy: trackByUserId -->
```

❌ **DON'T** mutate inputs:

```typescript
@Input() user!: User;
updateUser(): void {
  this.user.name = 'New'; // Don't mutate with OnPush
}
```

❌ **DON'T** call lifecycle hooks manually:

```typescript
ngOnInit(); // Never do this!
this.myComponent.ngOnDestroy(); // Angular calls this automatically
```

❌ **DON'T** nest subscriptions:

```typescript
// Use switchMap, combineLatest, or async pipe instead
service1.get().subscribe((data1) => {
  service2.get(data1.id).subscribe((data2) => {
    // Avoid this nesting
  });
});
```

## Best Practices

✅ **DO** use NgModules to organize features
✅ **DO** implement lifecycle hooks for proper initialization and cleanup
✅ **DO** use `@Input()` and `@Output()` for component communication
✅ **DO** use `*ngIf`, `*ngFor`, `*ngSwitch` structural directives
✅ **DO** use RxJS observables for async operations
✅ **DO** use `takeUntil` pattern for subscription cleanup
✅ **DO** use `async` pipe in templates
✅ **DO** use `OnPush` change detection for presentational components
✅ **DO** use `trackBy` with `*ngFor`
✅ **DO** unsubscribe in `ngOnDestroy()`

## Testing Patterns

```typescript
// ✅ CORRECT: Testing components with inputs and outputs
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

  it('should display user data', () => {
    component.user = { id: '1', name: 'John', email: 'john@example.com' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('John');
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

## Key Differences: Legacy vs Modern Angular

| Feature          | Legacy (Pre-16)       | Modern (16+)           |
| ---------------- | --------------------- | ---------------------- |
| Modules          | NgModules             | Standalone components  |
| Inputs           | `@Input()` decorator  | `input()` function     |
| Outputs          | `@Output()` decorator | `output()` function    |
| State            | RxJS Observables      | Signals                |
| Lifecycle        | ngOnInit, ngOnDestroy | Constructor, signals   |
| If/For           | `*ngIf`, `*ngFor`     | `@if`, `@for`          |
| Change Detection | OnPush/Default        | Automatic with signals |

---

**Generated by Human-in-the-Loop AI Hub**
Framework expertise for maintaining Angular legacy applications

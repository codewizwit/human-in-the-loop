---
name: angular-legacy
description: Apply traditional Angular patterns with NgModules, lifecycle hooks, @Input()/@Output() decorators, structural directives (*ngIf, *ngFor, *ngSwitch), RxJS observables for state management, and manual subscription management when maintaining or extending pre-Angular 16 applications.
---

# Angular Legacy Skill

Use this skill when working with **traditional Angular (pre-16)** using NgModules, lifecycle hooks, decorators, and RxJS observables. This represents the established patterns for maintaining and extending legacy Angular applications.

## When to Activate This Skill

Activate automatically when:

- Maintaining or extending Angular applications using NgModules
- Working with `@Input()` and `@Output()` decorators (pre-Angular 17)
- Using traditional lifecycle hooks: `ngOnInit`, `ngOnDestroy`, `ngOnChanges`
- Implementing `*ngIf`, `*ngFor`, `*ngSwitch` structural directives
- Managing state with RxJS observables and subjects
- Working with change detection strategies (Default vs OnPush)
- Using `takeUntil` pattern for subscription cleanup
- Reviewing or updating Angular applications before version 16

## NgModule Architecture

### Feature Module Pattern

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UsersListComponent } from './users-list.component';
import { UserDetailComponent } from './user-detail.component';
import { UserService } from './user.service';

const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: ':id', component: UserDetailComponent },
];

@NgModule({
  declarations: [UsersListComponent, UserDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [UserService],
})
export class UsersModule {}
```

**NgModule Best Practices**:

- ✅ Use feature modules to organize features by domain
- ✅ Use `forChild()` for feature module routes
- ✅ Declare all components, directives, and pipes used in the module
- ✅ Import shared modules for reusable dependencies
- ✅ Provide services at the appropriate level (root or feature)
- ❌ Don't declare components in multiple modules

### App Module Pattern

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Shared Module Pattern

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Shared components
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { ModalComponent } from './modal.component';

// Shared directives
import { HighlightDirective } from './highlight.directive';

// Shared pipes
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ModalComponent,
    HighlightDirective,
    SafePipe,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ModalComponent,
    HighlightDirective,
    SafePipe,
  ],
})
export class SharedModule {}
```

## Lifecycle Hooks

### Complete Lifecycle Hook Pattern

```typescript
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-editor',
  template: `
    <div>
      <h2>{{ user?.name }}</h2>
      <button (click)="save()">Save</button>
    </div>
  `,
})
export class UserEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() user?: { id: string; name: string };
  @Output() saved = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Called once after component initialization
    // ✅ Good: Initialize data, setup subscriptions
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before ngOnInit and whenever inputs change
    if (changes['user']) {
      const { currentValue, previousValue, firstChange } = changes['user'];
      if (!firstChange) {
        console.log('User changed from:', previousValue, 'to:', currentValue);
        this.onUserChange(currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    // Called before component is destroyed
    // ✅ Good: Clean up subscriptions, unsubscribe from observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onUserChange(user: any): void {
    // Handle user changes with automatic unsubscribe
    this.userService
      .validateUser(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isValid) => {
        console.log('User valid:', isValid);
      });
  }

  save(): void {
    if (this.user) {
      this.userService
        .updateUser(this.user)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.saved.emit();
        });
    }
  }
}
```

**Lifecycle Hook Order**:

1. `constructor()` - Dependency injection (no component initialization)
2. `ngOnChanges()` - When inputs change (called before ngOnInit)
3. `ngOnInit()` - Component initialization (called once)
4. `ngDoCheck()` - Custom change detection
5. `ngAfterContentInit()` - After content projection
6. `ngAfterContentChecked()` - After content checked
7. `ngAfterViewInit()` - After view initialization
8. `ngAfterViewChecked()` - After view checked
9. `ngOnDestroy()` - Cleanup before destruction

## @Input() and @Output() Decorators

### Input Decorator Pattern

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <span [class.featured]="featured">⭐</span>
    </div>
  `,
})
export class UserCardComponent {
  // ✅ Required input (Angular 16+)
  @Input({ required: true }) user!: User;

  // ✅ Optional input with default value
  @Input() featured = false;

  // ✅ Input with alias
  @Input('userStatus') status = 'active';

  // ✅ Input with transform (Angular 16+)
  @Input({ transform: booleanAttribute }) highlighted = false;
}
```

**Input Best Practices**:

- ✅ Use `@Input()` decorator to receive data from parent
- ✅ Use `required: true` for mandatory inputs (Angular 16+)
- ✅ Provide default values for optional inputs
- ✅ Use transform functions for type conversion
- ✅ Detect input changes in `ngOnChanges()`
- ❌ Don't mutate input values directly

### Output Decorator Pattern

```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="formData.name" name="name" />
      <button type="submit">Save</button>
      <button type="button" (click)="onCancel()">Cancel</button>
    </form>
  `,
})
export class UserFormComponent {
  // ✅ Output event emitter
  @Output() saved = new EventEmitter<User>();

  // ✅ Output with alias
  @Output('userCreated') created = new EventEmitter<User>();

  // ✅ Output with different event name
  @Output() cancelled = new EventEmitter<void>();

  formData: User = { id: '', name: '', email: '' };

  onSubmit(): void {
    this.saved.emit(this.formData);
    this.created.emit(this.formData);
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
```

**Output Best Practices**:

- ✅ Use `@Output()` decorator to emit events
- ✅ Use descriptive names: saved, deleted, selected
- ✅ Emit data with the event: `.emit(data)`
- ✅ Use `EventEmitter<T>` with specific types
- ✅ Document expected event payloads
- ❌ Don't use outputs for data binding (use inputs instead)

### Two-Way Binding Pattern

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <button (click)="decrement()">-</button>
      <span>{{ value }}</span>
      <button (click)="increment()">+</button>
    </div>
  `,
})
export class CounterComponent {
  // ✅ Two-way binding: [value]="x" (value)="x = $event"
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

## Structural Directives

### \*ngIf - Conditional Rendering

```typescript
@Component({
  selector: 'app-profile',
  template: `
    <!-- Simple if/else -->
    <div *ngIf="isLoggedIn; else notLoggedIn">
      <p>Welcome, {{ username }}!</p>
      <button (click)="logout()">Logout</button>
    </div>

    <ng-template #notLoggedIn>
      <p>Please log in to continue.</p>
      <button (click)="login()">Login</button>
    </ng-template>

    <!-- Multiple conditions -->
    <div *ngIf="isLoading">Loading...</div>
    <div *ngIf="!isLoading && hasError">Error: {{ errorMessage }}</div>
    <div *ngIf="!isLoading && !hasError && data">{{ data | json }}</div>
  `,
})
export class ProfileComponent {
  isLoggedIn = false;
  username = '';
  isLoading = false;
  hasError = false;
  errorMessage = '';
  data: any = null;

  login(): void {
    this.isLoggedIn = true;
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
```

**ngIf Best Practices**:

- ✅ Use for simple boolean conditions
- ✅ Use `else` template for false branch
- ✅ Avoid complex expressions in `*ngIf`
- ✅ Extract conditions to component methods
- ❌ Don't use multiple nested `*ngIf`

### \*ngFor - List Rendering

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <!-- Basic ngFor -->
    <ul>
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>

    <!-- With index and even/odd -->
    <ul>
      <li *ngFor="let user of users; let i = index; let isEven = even">
        {{ i + 1 }}. {{ user.name }} <span *ngIf="isEven">(even)</span>
      </li>
    </ul>

    <!-- With trackBy for performance -->
    <ul>
      <li *ngFor="let user of users; trackBy: trackByUserId">
        {{ user.name }}
      </li>
    </ul>

    <!-- With empty state -->
    <ul *ngIf="users.length > 0; else emptyState">
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>

    <ng-template #emptyState>
      <p>No users found.</p>
    </ng-template>
  `,
})
export class UserListComponent {
  users: User[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ];

  // ✅ GOOD: trackBy prevents unnecessary DOM re-renders
  trackByUserId(_index: number, user: User): string {
    return user.id;
  }

  // ❌ BAD: No trackBy - re-renders all items
  // <li *ngFor="let user of users">{{ user.name }}</li>
}
```

**ngFor Best Practices**:

- ✅ Always use `trackBy` for performance
- ✅ Use index and other local variables as needed
- ✅ Combine with `*ngIf` for empty states
- ✅ Avoid complex expressions in loop
- ✅ Use `let` syntax for readability
- ❌ Don't use array index as trackBy (causes re-renders)
- ❌ Don't use pipe inside ngFor (recalculates on every change)

### \*ngSwitch - Switch Statement

```typescript
@Component({
  selector: 'app-status-badge',
  template: `
    <div [ngSwitch]="status">
      <span *ngSwitchCase="'active'" class="badge-success">Active</span>
      <span *ngSwitchCase="'inactive'" class="badge-warning">Inactive</span>
      <span *ngSwitchCase="'pending'" class="badge-info">Pending</span>
      <span *ngSwitchDefault class="badge-danger">Unknown</span>
    </div>
  `,
})
export class StatusBadgeComponent {
  @Input() status: 'active' | 'inactive' | 'pending' | string = 'active';
}
```

**ngSwitch Best Practices**:

- ✅ Use for multiple mutually exclusive conditions
- ✅ Provide `*ngSwitchDefault` for fallback
- ✅ Keep case logic simple
- ✅ Use for rendering different component states
- ❌ Don't use for simple true/false (use `*ngIf`)
- ❌ Don't nest multiple switch statements

## RxJS Observable Patterns

### Observable State Management

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  // ✅ GOOD: BehaviorSubject for state management
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http.get<User[]>('/api/users').subscribe({
      next: (users) => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.errorSubject.next(error.message);
        this.loadingSubject.next(false);
      },
    });
  }

  addUser(user: User): void {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }

  updateUser(user: User): void {
    const current = this.usersSubject.value;
    const updated = current.map((u) => (u.id === user.id ? user : u));
    this.usersSubject.next(updated);
  }

  deleteUser(id: string): void {
    const current = this.usersSubject.value;
    this.usersSubject.next(current.filter((u) => u.id !== id));
  }
}
```

### takeUntil Pattern for Cleanup

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="user$ | async as user">
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
    </div>
  `,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user$!: Observable<User>;

  // ✅ GOOD: Subject for managing component destruction
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // ✅ GOOD: Use takeUntil pattern for automatic cleanup
    this.user$ = this.userService.currentUser$.pipe(takeUntil(this.destroy$));

    // Multiple subscriptions with same cleanup
    this.userService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notification) => {
        console.log('Notification:', notification);
      });
  }

  ngOnDestroy(): void {
    // ✅ GOOD: Trigger all takeUntil subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**RxJS Best Practices**:

- ✅ Use `BehaviorSubject` for state that components subscribe to
- ✅ Use `Subject` for events without initial value
- ✅ Use `takeUntil()` with destroy subject for cleanup
- ✅ Unsubscribe in `ngOnDestroy()`
- ✅ Use `async` pipe to avoid manual subscriptions
- ✅ Use operators for data transformation
- ❌ Don't forget to unsubscribe (memory leaks)
- ❌ Don't nest subscriptions (subscribe in subscribe)

### Combining Observables

```typescript
import { combineLatest, merge, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-posts',
  template: `
    <div *ngIf="vm$ | async as vm">
      <h2>{{ vm.user.name }}</h2>
      <div *ngFor="let post of vm.posts">{{ post.title }}</div>
    </div>
  `,
})
export class UserPostsComponent implements OnInit {
  vm$!: Observable<{ user: User; posts: Post[] }>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    // ✅ Combine multiple observables
    this.vm$ = combineLatest({
      user: this.route.params.pipe(
        switchMap((params) => this.userService.getUser(params['id']))
      ),
      posts: this.route.params.pipe(
        switchMap((params) => this.postService.getUserPosts(params['id']))
      ),
    });
  }
}
```

## Change Detection Strategies

### OnPush Change Detection

```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button (click)="onEdit()">Edit</button>
    </div>
  `,
  // ✅ GOOD: OnPush for better performance
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() edit = new EventEmitter<User>();

  // ✅ GOOD: Immutable update
  onEdit(): void {
    const updated = { ...this.user, name: 'Updated' };
    this.edit.emit(updated);
  }

  // ❌ BAD: Mutation doesn't trigger OnPush
  // badEdit(): void {
  //   this.user.name = 'Updated'; // Won't detect change
  // }
}
```

### Manual Change Detection

```typescript
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-polling',
  template: `<div>{{ data }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollingComponent implements OnInit, OnDestroy {
  data: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService
      .poll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.data = data;
        // ✅ GOOD: Manually mark for change detection
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Change Detection Best Practices**:

- ✅ Use `OnPush` for presentational components
- ✅ Keep inputs immutable
- ✅ Use `async` pipe for observables
- ✅ Use `markForCheck()` when needed
- ✅ Separate smart and dumb components
- ❌ Don't mutate input values
- ❌ Don't use Default change detection for all components

## Testing Legacy Angular

### Component Testing

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';

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
    component.user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('John Doe');
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
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';

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

    service.loadUsers();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    service.users$.subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });
  });
});
```

## Best Practices Checklist

### Architecture

- ✅ Organize code with feature modules
- ✅ Separate smart and dumb components
- ✅ Use services for business logic and data
- ✅ Use dependency injection for all dependencies
- ✅ Keep components small and focused (< 200 lines)

### Lifecycle & Cleanup

- ✅ Initialize in `ngOnInit()`
- ✅ Detect input changes in `ngOnChanges()`
- ✅ Clean up subscriptions in `ngOnDestroy()`
- ✅ Use `takeUntil` pattern for automatic cleanup
- ✅ Always unsubscribe from observables

### Performance

- ✅ Use `OnPush` change detection for dumb components
- ✅ Use `trackBy` with `*ngFor`
- ✅ Use `async` pipe to avoid manual subscriptions
- ✅ Lazy load feature modules
- ✅ Use virtual scrolling for large lists
- ✅ Avoid function calls in templates

### Reactive Programming

- ✅ Use RxJS observables for async data
- ✅ Use `BehaviorSubject` for state
- ✅ Use operators for data transformation
- ✅ Use `combineLatest` for multiple observables
- ✅ Use `switchMap` for dependent observables

### Forms

- ✅ Use Reactive Forms (FormGroup, FormControl)
- ✅ Implement custom validators
- ✅ Handle form errors gracefully
- ✅ Disable submit while form is invalid

## Anti-Patterns to Avoid

- ❌ Don't call `ngOnInit()` manually
- ❌ Don't forget to unsubscribe (memory leaks)
- ❌ Don't use `*ngFor` without `trackBy`
- ❌ Don't mutate inputs (with OnPush)
- ❌ Don't nest subscriptions (use operators instead)
- ❌ Don't declare components in multiple modules
- ❌ Don't use Default change detection everywhere

## References

- [Angular Official Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Performance Guide](https://angular.io/guide/performance-best-practices)

---

**Human-in-the-Loop by codewizwit**

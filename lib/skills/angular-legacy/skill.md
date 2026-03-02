---
name: angular-legacy
description: >-
  Applies traditional Angular patterns with NgModules, lifecycle hooks,
  decorators, structural directives, and RxJS observables. Use when user asks to
  "maintain legacy Angular", "work with NgModules", "use lifecycle hooks", or
  mentions "pre-Angular 16 patterns".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
  - EnterPlanMode
---

# Angular Legacy Skill

Provides comprehensive guidance for maintaining and extending Angular applications built before Angular 16. Covers traditional patterns including NgModules, lifecycle hooks, @Input()/@Output() decorators, structural directives (*ngIf, *ngFor, \*ngSwitch), RxJS-based state management, change detection strategies, and subscription cleanup.

## When to Activate

- User is maintaining or extending Angular applications using NgModules
- User is working with @Input() and @Output() decorators (pre-Angular 17)
- User is using traditional lifecycle hooks: ngOnInit, ngOnDestroy, ngOnChanges
- User is implementing *ngIf, *ngFor, \*ngSwitch structural directives
- User is managing state with RxJS observables and subjects
- User is working with change detection strategies (Default vs OnPush)
- User is using the takeUntil pattern for subscription cleanup
- User is reviewing or updating Angular applications before version 16

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>What type of Angular legacy work are you doing?</question>
<options>

  <option value="maintain">Maintaining an existing feature</option>
  <option value="extend">Extending with new functionality</option>
  <option value="fix">Fixing a bug in legacy code</option>
  <option value="review">Reviewing legacy code for quality</option>
  <option value="migrate-prep">Preparing for migration to modern Angular</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>What Angular version is the project using?</question>
<options>

  <option value="12">Angular 12 or earlier</option>
  <option value="13">Angular 13</option>
  <option value="14">Angular 14</option>
  <option value="15">Angular 15</option>
  <option value="unknown">Not sure</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

<ask_user_question>
<question>Which areas of legacy Angular do you need help with?</question>
<options>

  <option value="modules">NgModule architecture (feature, shared, core modules)</option>
  <option value="lifecycle">Lifecycle hooks and subscription management</option>
  <option value="io">@Input/@Output and component communication</option>
  <option value="directives">Structural directives (*ngIf, *ngFor, *ngSwitch)</option>
  <option value="rxjs">RxJS state management and observables</option>
  <option value="change-detection">Change detection (OnPush, markForCheck)</option>
  <option value="testing">Testing legacy components and services</option>
  <option value="all">All of the above</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Discovery

1. Use Glob to find Angular module files, component files, and service files
2. Use Read to examine the NgModule structure and component patterns
3. Use Grep to identify subscription management patterns and potential memory leaks

### Step 3: Plan (if complex)

For large refactoring or migration preparation tasks, enter plan mode:

<EnterPlanMode>
<summary>
Outline the scope of legacy Angular work, identify affected modules
and components, and confirm the approach with the user.
</summary>
</EnterPlanMode>

### Step 4: Apply Legacy Patterns

Apply the appropriate patterns from the reference sections below based on the user's needs.

### Step 5: Deliver Results

Provide code following legacy Angular conventions with proper module structure, lifecycle management, and subscription cleanup.

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

- Use feature modules to organize features by domain
- Use `forChild()` for feature module routes
- Declare all components, directives, and pipes used in the module
- Import shared modules for reusable dependencies
- Provide services at the appropriate level (root or feature)
- Never declare components in multiple modules

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

import { LoadingSpinnerComponent } from './loading-spinner.component';
import { ModalComponent } from './modal.component';
import { HighlightDirective } from './highlight.directive';
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
    /* Called once after component initialization */
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      const { currentValue, previousValue, firstChange } = changes['user'];
      if (!firstChange) {
        this.onUserChange(currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onUserChange(user: any): void {
    this.userService
      .validateUser(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isValid) => {
        /* handle validation result */
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
    </div>
  `,
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;

  @Input() featured = false;

  @Input('userStatus') status = 'active';

  @Input({ transform: booleanAttribute }) highlighted = false;
}
```

**Input Best Practices**:

- Use `@Input()` decorator to receive data from parent
- Use `required: true` for mandatory inputs (Angular 16+)
- Provide default values for optional inputs
- Use transform functions for type conversion
- Detect input changes in `ngOnChanges()`
- Never mutate input values directly

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
  @Output() saved = new EventEmitter<User>();

  @Output('userCreated') created = new EventEmitter<User>();

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

- Use `@Output()` decorator to emit events
- Use descriptive names: saved, deleted, selected
- Emit data with the event: `.emit(data)`
- Use `EventEmitter<T>` with specific types
- Document expected event payloads
- Never use outputs for data binding (use inputs instead)

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
```

Usage: `<app-counter [(value)]="count"></app-counter>`

## Structural Directives

### \*ngIf - Conditional Rendering

```typescript
@Component({
  selector: 'app-profile',
  template: `
    <div *ngIf="isLoggedIn; else notLoggedIn">
      <p>Welcome, {{ username }}!</p>
      <button (click)="logout()">Logout</button>
    </div>

    <ng-template #notLoggedIn>
      <p>Please log in to continue.</p>
      <button (click)="login()">Login</button>
    </ng-template>

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

- Use for simple boolean conditions
- Use `else` template for false branch
- Avoid complex expressions in `*ngIf`
- Extract conditions to component methods
- Never use multiple nested `*ngIf`

### \*ngFor - List Rendering

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <ul>
      <li *ngFor="let user of users; let i = index; let isEven = even">
        {{ i + 1 }}. {{ user.name }} <span *ngIf="isEven">(even)</span>
      </li>
    </ul>

    <ul>
      <li *ngFor="let user of users; trackBy: trackByUserId">
        {{ user.name }}
      </li>
    </ul>

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

  trackByUserId(_index: number, user: User): string {
    return user.id;
  }
}
```

**ngFor Best Practices**:

- Always use `trackBy` for performance
- Use index and other local variables as needed
- Combine with `*ngIf` for empty states
- Avoid complex expressions in loop
- Never use array index as trackBy (causes re-renders)
- Never use pipe inside ngFor (recalculates on every change)

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

- Use for multiple mutually exclusive conditions
- Provide `*ngSwitchDefault` for fallback
- Keep case logic simple
- Use for rendering different component states
- Never use for simple true/false (use `*ngIf`)
- Never nest multiple switch statements

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

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user$ = this.userService.currentUser$.pipe(takeUntil(this.destroy$));

    this.userService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notification) => {
        /* handle notification */
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**RxJS Best Practices**:

- Use `BehaviorSubject` for state that components subscribe to
- Use `Subject` for events without initial value
- Use `takeUntil()` with destroy subject for cleanup
- Unsubscribe in `ngOnDestroy()`
- Use `async` pipe to avoid manual subscriptions
- Use operators for data transformation
- Never forget to unsubscribe (memory leaks)
- Never nest subscriptions (subscribe in subscribe)

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() edit = new EventEmitter<User>();

  onEdit(): void {
    const updated = { ...this.user, name: 'Updated' };
    this.edit.emit(updated);
  }
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

- Use `OnPush` for presentational components
- Keep inputs immutable
- Use `async` pipe for observables
- Use `markForCheck()` when needed
- Separate smart and dumb components
- Never mutate input values
- Never use Default change detection for all components

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

## Output Format

<output_format>
When providing legacy Angular code, structure the output as follows:

**Module Structure**
[NgModule declarations, imports, exports, and providers]

**Component Implementation**
[Component class with lifecycle hooks, decorators, and template]

**Service Layer**
[Injectable services with RxJS state management]

**Template Patterns**
[Structural directives and data binding]

**Testing**
[TestBed configuration and test cases]
</output_format>

## Best Practices

- Organize code with feature modules to maintain clear domain boundaries
- Separate smart (container) and dumb (presentational) components
- Use services for business logic and data access
- Use dependency injection for all dependencies
- Keep components small and focused (under 200 lines)
- Initialize in `ngOnInit()`, not the constructor
- Clean up subscriptions in `ngOnDestroy()` using the takeUntil pattern
- Use `OnPush` change detection for presentational components
- Always use `trackBy` with `*ngFor`
- Use `async` pipe to avoid manual subscriptions
- Lazy load feature modules for better performance
- Use Reactive Forms (FormGroup, FormControl) over template-driven forms

## Anti-Patterns

- Do not call `ngOnInit()` manually from other methods
- Do not forget to unsubscribe from observables (causes memory leaks)
- Do not use `*ngFor` without `trackBy` (causes unnecessary DOM re-renders)
- Do not mutate @Input values when using OnPush change detection
- Do not nest subscriptions (use RxJS operators like switchMap instead)
- Do not declare components in multiple modules
- Do not use Default change detection strategy for all components
- Do not put business logic in components (use services)

## Examples

### Example 1: Adding a Feature Module

**Input**: "Create a new users feature module with list and detail views"

**Output**: Complete NgModule with route configuration, component declarations, service provider, and lazy loading setup in the app routing module.

### Example 2: Fixing Memory Leaks

**Input**: "Review this component for memory leaks - it subscribes to multiple observables"

**Output**: Analysis of missing unsubscribe calls, addition of destroy$ Subject with takeUntil pattern, and replacement of manual subscriptions with async pipe where possible.

### Example 3: Implementing OnPush Change Detection

**Input**: "Convert this component to use OnPush change detection"

**Output**: Component refactored with OnPush strategy, immutable input handling, markForCheck() for imperative updates, and async pipe for observable data.

---

**Human-in-the-Loop by codewizwit**

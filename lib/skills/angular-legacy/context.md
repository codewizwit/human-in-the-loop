# Angular Legacy - Detailed Patterns and Conventions

This file contains detailed framework patterns, conventions, and reference material for legacy Angular development (pre-Angular 16). Referenced from [skill.md](skill.md).

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

## Directive Best Practices Reference

### ngIf Best Practices

- Use for simple boolean conditions
- Use `else` template for false branch
- Avoid complex expressions in `*ngIf`
- Extract conditions to component methods
- Never use multiple nested `*ngIf`

### ngFor Best Practices

- Always use `trackBy` for performance
- Use index and other local variables as needed
- Combine with `*ngIf` for empty states
- Avoid complex expressions in loop
- Never use array index as trackBy (causes re-renders)
- Never use pipe inside ngFor (recalculates on every change)

### ngSwitch Best Practices

- Use for multiple mutually exclusive conditions
- Provide `*ngSwitchDefault` for fallback
- Keep case logic simple
- Use for rendering different component states
- Never use for simple true/false (use `*ngIf`)
- Never nest multiple switch statements

## Decorator Best Practices Reference

### Input Best Practices

- Use `@Input()` decorator to receive data from parent
- Use `required: true` for mandatory inputs (Angular 16+)
- Provide default values for optional inputs
- Use transform functions for type conversion
- Detect input changes in `ngOnChanges()`
- Never mutate input values directly

### Output Best Practices

- Use `@Output()` decorator to emit events
- Use descriptive names: saved, deleted, selected
- Emit data with the event: `.emit(data)`
- Use `EventEmitter<T>` with specific types
- Document expected event payloads
- Never use outputs for data binding (use inputs instead)

### Change Detection Best Practices

- Use `OnPush` for presentational components
- Keep inputs immutable
- Use `async` pipe for observables
- Use `markForCheck()` when needed
- Separate smart and dumb components
- Never mutate input values
- Never use Default change detection for all components

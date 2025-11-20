---
name: angular-modern
description: Apply modern Angular patterns with signals, computed, effect, standalone components, and signal-based inputs/outputs when building or reviewing Angular 16+ applications. Use this for new Angular projects using the latest reactive primitives.
---

# Angular Modern Skill

Use this skill when working with **modern Angular (16+)** using signals, computed values, effects, and standalone components. This represents the current and future direction of Angular development.

## When to Activate This Skill

Activate automatically when:

- Building new Angular 16+ applications
- Working with signals, computed, or effect
- Using standalone components (no NgModules)
- Implementing signal-based inputs and outputs
- Discussing modern Angular reactive patterns
- Migrating from RxJS/NgOnInit to signals

## Core Reactive Primitives

### Signals - Writable State

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">+1</button>
      <button (click)="decrement()">-1</button>
      <button (click)="reset()">Reset</button>
    </div>
  `,
})
export class CounterComponent {
  count = signal(0);

  increment() {
    this.count.update((value) => value + 1);
  }

  decrement() {
    this.count.update((value) => value - 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

**Signal Best Practices**:

- ✅ Use `signal()` for writable state
- ✅ Use `.set()` to replace value
- ✅ Use `.update()` for transformations based on current value
- ✅ Call signals as functions to read: `count()`
- ✅ Signals automatically track dependencies

### Computed - Derived State

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  template: `
    <div>
      <h2>Shopping Cart</h2>
      <p>Items: {{ itemCount() }}</p>
      <p>Subtotal: {{ subtotal() | currency }}</p>
      <p>Tax ({{ taxRate() }}%): {{ tax() | currency }}</p>
      <p>
        <strong>Total: {{ total() | currency }}</strong>
      </p>
    </div>
  `,
})
export class ShoppingCartComponent {
  items = signal<CartItem[]>([
    { id: 1, name: 'Widget', price: 29.99, quantity: 2 },
    { id: 2, name: 'Gadget', price: 49.99, quantity: 1 },
  ]);

  taxRate = signal(8.5);

  // ✅ Computed automatically updates when items change
  itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  // ✅ Computed values are cached and only recalculate when dependencies change
  subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  tax = computed(() => this.subtotal() * (this.taxRate() / 100));

  total = computed(() => this.subtotal() + this.tax());
}
```

**Computed Best Practices**:

- ✅ Use `computed()` for derived state
- ✅ Computed values are read-only
- ✅ Automatically recalculates when dependencies change
- ✅ Results are cached (memoized)
- ✅ Can depend on other computed signals

### Effect - Side Effects

```typescript
import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-user-preferences',
  standalone: true,
  template: `
    <div>
      <label>
        Theme:
        <select
          [value]="theme()"
          (change)="theme.set($any($event.target).value)"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label>
        Font Size:
        <input
          type="range"
          min="12"
          max="24"
          [value]="fontSize()"
          (input)="fontSize.set(+$any($event.target).value)"
        />
        {{ fontSize() }}px
      </label>
    </div>
  `,
})
export class UserPreferencesComponent {
  theme = signal<'light' | 'dark'>('light');
  fontSize = signal(16);

  constructor() {
    // ✅ Effect runs when signals change
    effect(() => {
      const currentTheme = this.theme();
      const currentFontSize = this.fontSize();

      // Persist to localStorage
      localStorage.setItem('theme', currentTheme);
      localStorage.setItem('fontSize', currentFontSize.toString());

      // Apply to document
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.documentElement.style.fontSize = `${currentFontSize}px`;

      console.log(`Preferences updated: ${currentTheme}, ${currentFontSize}px`);
    });

    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedTheme) this.theme.set(savedTheme);
    if (savedFontSize) this.fontSize.set(parseInt(savedFontSize));
  }
}
```

**Effect Best Practices**:

- ✅ Use `effect()` for side effects (DOM, localStorage, logging)
- ✅ Effects run automatically when tracked signals change
- ✅ Avoid using effects for derived state (use `computed` instead)
- ✅ Effects run in injection context (constructor, field initializer)
- ❌ Don't use effects to update other signals (creates circular dependencies)

## Signal-Based Inputs and Outputs

### Signal Inputs (Angular 17.1+)

```typescript
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="card" [class.highlighted]="highlighted()">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <p>{{ displayName() }}</p>
      <span *ngIf="highlighted()">⭐ Featured</span>
    </div>
  `,
})
export class UserCardComponent {
  // ✅ Signal-based required input
  user = input.required<User>();

  // ✅ Signal-based optional input with default
  highlighted = input(false);

  // ✅ Computed from signal inputs
  displayName = computed(() => {
    const u = this.user();
    return `${u.name} <${u.email}>`;
  });
}
```

**Usage**:

```typescript
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent],
  template: `
    <app-user-card [user]="currentUser" [highlighted]="true"> </app-user-card>
  `,
})
export class UserListComponent {
  currentUser = { name: 'Jane Doe', email: 'jane@example.com' };
}
```

### Signal Outputs (Angular 17.2+)

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div class="product">
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency }}</p>
      <button (click)="handleAddToCart()">Add to Cart</button>
      <button (click)="handleViewDetails()">View Details</button>
    </div>
  `,
})
export class ProductCardComponent {
  product = input.required<Product>();

  // ✅ Signal-based outputs
  addToCart = output<Product>();
  viewDetails = output<string>();

  handleAddToCart() {
    this.addToCart.emit(this.product());
  }

  handleViewDetails() {
    this.viewDetails.emit(this.product().id);
  }
}
```

**Usage**:

```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <app-product-card
      [product]="product"
      (addToCart)="onAddToCart($event)"
      (viewDetails)="onViewDetails($event)"
    >
    </app-product-card>
  `,
})
export class ProductListComponent {
  product = { id: '1', name: 'Widget', price: 29.99 };

  onAddToCart(product: Product) {
    console.log('Added to cart:', product);
  }

  onViewDetails(productId: string) {
    console.log('View details:', productId);
  }
}
```

## Standalone Components

### Standalone Component Pattern

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    // Import other standalone components directly
  ],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <nav>
        <a routerLink="/home">Home</a>
        <a routerLink="/profile">Profile</a>
      </nav>
    </div>
  `,
})
export class DashboardComponent {}
```

### Standalone Main Application

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Other providers
  ],
});
```

### Lazy Loading with Standalone Components

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
```

## Resource API (Angular 19+)

### Declarative Data Loading

```typescript
import { Component, resource, signal } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div>
      @if (userResource.isLoading()) {
      <p>Loading...</p>
      } @if (userResource.hasValue()) {
      <div>
        <h1>{{ userResource.value().name }}</h1>
        <p>{{ userResource.value().email }}</p>
      </div>
      } @if (userResource.error()) {
      <p class="error">Error: {{ userResource.error() }}</p>
      }

      <button (click)="refreshUser()">Refresh</button>
    </div>
  `,
})
export class UserProfileComponent {
  userId = signal('123');

  // ✅ Resource automatically fetches when userId changes
  userResource = resource({
    request: () => ({ id: this.userId() }),
    loader: async ({ request }) => {
      const response = await fetch(`/api/users/${request.id}`);
      if (!response.ok) throw new Error('Failed to load user');
      return response.json();
    },
  });

  refreshUser() {
    this.userResource.reload();
  }
}
```

**Resource Benefits**:

- ✅ Automatic loading states (`isLoading`, `hasValue`, `error`)
- ✅ Reactive - reloads when request signal changes
- ✅ Built-in error handling
- ✅ Manual refresh with `.reload()`
- ✅ No need for RxJS or manual state management

## Control Flow Syntax (Angular 17+)

### @if - Conditional Rendering

```typescript
@Component({
  template: `
    @if (isLoggedIn()) {
    <p>Welcome, {{ username() }}!</p>
    } @else if (isLoading()) {
    <p>Loading...</p>
    } @else {
    <button (click)="login()">Log In</button>
    }
  `,
})
export class HeaderComponent {
  isLoggedIn = signal(false);
  isLoading = signal(false);
  username = signal('');
}
```

### @for - List Rendering

```typescript
@Component({
  template: `
    <ul>
      @for (user of users(); track user.id) {
      <li>{{ user.name }}</li>
      } @empty {
      <li>No users found</li>
      }
    </ul>
  `,
})
export class UserListComponent {
  users = signal<User[]>([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]);
}
```

### @switch - Switch Statement

```typescript
@Component({
  template: `
    @switch (status()) { @case ('loading') {
    <p>Loading...</p>
    } @case ('success') {
    <p>Success!</p>
    } @case ('error') {
    <p>Error occurred</p>
    } @default {
    <p>Unknown status</p>
    } }
  `,
})
export class StatusComponent {
  status = signal<'loading' | 'success' | 'error' | 'idle'>('idle');
}
```

## State Management with Signals

### Component-Level State

```typescript
import { Component, signal, computed } from '@angular/core';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: `
    <div>
      <input
        #newTodo
        (keyup.enter)="addTodo(newTodo.value); newTodo.value = ''"
      />

      <p>Total: {{ todos().length }} | Completed: {{ completedCount() }}</p>

      <ul>
        @for (todo of todos(); track todo.id) {
        <li>
          <input
            type="checkbox"
            [checked]="todo.completed"
            (change)="toggleTodo(todo.id)"
          />
          {{ todo.text }}
          <button (click)="removeTodo(todo.id)">Delete</button>
        </li>
        }
      </ul>
    </div>
  `,
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);

  completedCount = computed(
    () => this.todos().filter((t) => t.completed).length
  );

  addTodo(text: string) {
    if (!text.trim()) return;

    this.todos.update((todos) => [
      ...todos,
      { id: Date.now(), text, completed: false },
    ]);
  }

  toggleTodo(id: number) {
    this.todos.update((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  removeTodo(id: number) {
    this.todos.update((todos) => todos.filter((t) => t.id !== id));
  }
}
```

### Service-Level State

```typescript
import { Injectable, signal, computed } from '@angular/core';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  // ✅ Expose read-only signals
  readonly allItems = this.items.asReadonly();

  // ✅ Computed values
  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addItem(product: { id: string; name: string; price: number }) {
    this.items.update((items) => {
      const existing = items.find((i) => i.id === product.id);

      if (existing) {
        return items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeItem(id: string) {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }

    this.items.update((items) =>
      items.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }

  clear() {
    this.items.set([]);
  }
}
```

**Usage in Component**:

```typescript
@Component({
  selector: 'app-cart',
  standalone: true,
  template: `
    <div>
      <h2>Shopping Cart ({{ cart.itemCount() }} items)</h2>

      <ul>
        @for (item of cart.allItems(); track item.id) {
        <li>
          {{ item.name }} - {{ item.price | currency }} x {{ item.quantity }}
          <button (click)="cart.removeItem(item.id)">Remove</button>
        </li>
        }
      </ul>

      <p>
        <strong>Total: {{ cart.total() | currency }}</strong>
      </p>
      <button (click)="cart.clear()">Clear Cart</button>
    </div>
  `,
})
export class CartComponent {
  constructor(protected cart: CartService) {}
}
```

## Testing Modern Angular

### Testing Components with Signals

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should increment count', () => {
    expect(component.count()).toBe(0);

    component.increment();
    fixture.detectChanges();

    expect(component.count()).toBe(1);
  });

  it('should update UI when count changes', () => {
    component.count.set(5);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Count: 5');
  });
});
```

### Testing Services with Signals

```typescript
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should add items to cart', () => {
    const product = { id: '1', name: 'Widget', price: 29.99 };

    service.addItem(product);

    expect(service.allItems().length).toBe(1);
    expect(service.itemCount()).toBe(1);
    expect(service.total()).toBe(29.99);
  });

  it('should update quantity for existing items', () => {
    const product = { id: '1', name: 'Widget', price: 29.99 };

    service.addItem(product);
    service.addItem(product);

    expect(service.allItems().length).toBe(1);
    expect(service.itemCount()).toBe(2);
    expect(service.total()).toBe(59.98);
  });
});
```

## Best Practices Checklist

### Modern Angular Patterns

- ✅ Use `signal()` for all component state
- ✅ Use `computed()` for derived values
- ✅ Use `effect()` only for side effects (DOM, localStorage, logging)
- ✅ Use signal-based `input()` and `output()` for component APIs
- ✅ Use `resource()` for async data loading (Angular 19+)
- ✅ Use `@if`, `@for`, `@switch` control flow syntax
- ✅ Make all components `standalone: true`
- ✅ Use `provideRouter`, `provideHttpClient` in `bootstrapApplication`
- ✅ Lazy load with `loadComponent` and `loadChildren`

### Anti-Patterns to Avoid

- ❌ Don't use `ngOnInit` - initialize in constructor or field initializers
- ❌ Don't use RxJS for component state - use signals
- ❌ Don't use `@Input()` / `@Output()` decorators - use `input()` / `output()`
- ❌ Don't create NgModules - use standalone components
- ❌ Don't use `*ngIf`, `*ngFor`, `*ngSwitch` - use `@if`, `@for`, `@switch`
- ❌ Don't manually manage subscriptions - use `resource()` or async pipe if needed
- ❌ Don't use effects to update other signals - use `computed()`

## Migration from Legacy Angular

### NgOnInit → Constructor/Field Initializer

```typescript
// ❌ Legacy
export class UserComponent implements OnInit {
  user?: User;

  ngOnInit() {
    this.user = this.loadUser();
  }
}

// ✅ Modern
export class UserComponent {
  userId = signal('123');

  user = resource({
    request: () => ({ id: this.userId() }),
    loader: async ({ request }) => {
      const response = await fetch(`/api/users/${request.id}`);
      return response.json();
    },
  });
}
```

### @Input/@Output → input()/output()

```typescript
// ❌ Legacy
export class ProductCard {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
}

// ✅ Modern
export class ProductCard {
  product = input.required<Product>();
  addToCart = output<Product>();
}
```

### RxJS Observables → Signals

```typescript
// ❌ Legacy
export class CartComponent {
  total$: Observable<number>;

  constructor(private cart: CartService) {
    this.total$ = this.cart.items$.pipe(
      map((items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0))
    );
  }
}

// ✅ Modern
export class CartComponent {
  constructor(protected cart: CartService) {}
  // Access cart.total() signal directly in template
}
```

## References

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular Standalone Components](https://angular.dev/guide/components/importing)
- [Angular Resource API](https://angular.dev/api/core/resource)
- [Angular Control Flow](https://angular.dev/essentials/conditionals-and-loops)
- [Angular Modern Documentation](https://angular.dev)

---

**Human-in-the-Loop by codewizwit**

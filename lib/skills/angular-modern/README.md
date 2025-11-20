# Angular Modern Skill

Framework-specific expertise for **modern Angular 16+** development using signals, computed values, effects, and standalone components.

## Overview

This skill provides comprehensive guidance for building Angular applications using the latest reactive primitives and patterns introduced in Angular 16+. It focuses exclusively on modern approaches and discourages legacy patterns.

## What's Included

- **Signals** - Reactive state management with `signal()`, `computed()`, `effect()`
- **Standalone Components** - No NgModules, all components standalone
- **Signal-Based I/O** - Modern `input()` and `output()` APIs
- **Control Flow Syntax** - `@if`, `@for`, `@switch` (not structural directives)
- **Resource API** - Declarative data loading (Angular 19+)
- **Modern Testing** - Testing signals and computed values

## Installation

### As Claude Code Skill

```bash
hit install skill/angular-modern --as-skill
```

This copies `skill.md` to `.claude/skills/angular-modern.md` for automatic activation when working with Angular code.

### As GitHub Copilot Custom Instruction

```bash
hit install skill/angular-modern --as-copilot
```

This copies `copilot.md` to `.github/instructions/angular-modern.instructions.md` for GitHub Copilot integration.

### As Documentation

```bash
hit install skill/angular-modern
```

Installs to `~/.claude/tools/skill/angular-modern/` for reference.

## Key Patterns

### State Management with Signals

```typescript
@Component({
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">+1</button>
  `,
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update((v) => v + 1);
  }
}
```

### Signal-Based Inputs/Outputs

```typescript
@Component({
  standalone: true,
  template: `
    <div>
      <h3>{{ product().name }}</h3>
      <button (click)="addToCart.emit(product())">Add to Cart</button>
    </div>
  `,
})
export class ProductCardComponent {
  product = input.required<Product>();
  featured = input(false);
  addToCart = output<Product>();
}
```

### Modern Control Flow

```typescript
@Component({
  standalone: true,
  template: `
    @if (user(); as currentUser) {
    <p>Welcome, {{ currentUser.name }}</p>
    } @else {
    <button>Log In</button>
    } @for (item of items(); track item.id) {
    <div>{{ item.name }}</div>
    } @empty {
    <p>No items found</p>
    }
  `,
})
export class DashboardComponent {
  user = signal<User | null>(null);
  items = signal<Item[]>([]);
}
```

## What's Different from Legacy Angular

### ❌ Legacy Patterns (Don't Use)

- `ngOnInit`, `ngOnDestroy`, `ngOnChanges` lifecycle hooks
- `@Input()` / `@Output()` decorators
- `*ngIf`, `*ngFor`, `*ngSwitch` structural directives
- RxJS subscriptions for component state
- NgModules
- Manual subscription management

### ✅ Modern Patterns (Use These)

- Constructor / field initializers (no lifecycle hooks)
- `input()` / `output()` functions
- `@if`, `@for`, `@switch` control flow
- Signals for component state
- Standalone components
- `resource()` API for data loading

## Migration from Legacy

If migrating from legacy Angular:

1. **Replace lifecycle hooks** with constructor/field initializers
2. **Convert @Input/@Output** to `input()`/`output()`
3. **Replace RxJS state** with signals
4. **Update templates** to use `@if`/`@for`/`@switch`
5. **Make components standalone** (remove NgModules)
6. **Use resource()** for async data

## Testing

```typescript
describe('CounterComponent', () => {
  it('should increment count', () => {
    const component = new CounterComponent();
    component.count.set(0);
    component.increment();
    expect(component.count()).toBe(1);
  });

  it('should compute double', () => {
    const component = new CounterComponent();
    component.count.set(5);
    expect(component.doubleCount()).toBe(10);
  });
});
```

## Prerequisites

- Angular 16.0.0 or higher
- TypeScript 4.9+
- For `resource()` API: Angular 19.0.0+

## Related Skills

- **angular-legacy** - For maintaining pre-Angular 16 applications
- **typescript-expert** - Advanced TypeScript patterns
- **testing-automation** - Comprehensive testing strategies

## References

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Resource API](https://angular.dev/api/core/resource)
- [Control Flow Syntax](https://angular.dev/essentials/conditionals-and-loops)

---

**Human-in-the-Loop by codewizwit**

# Angular Legacy Skill

Framework-specific expertise for **legacy Angular (pre-16)** development using NgModules, lifecycle hooks, RxJS observables, and traditional change detection.

## Overview

This skill provides comprehensive guidance for maintaining Angular applications built before Angular 16. It covers traditional patterns including NgModules, lifecycle hooks, decorators, and RxJS-based state management.

## What's Included

- **NgModules** - Feature modules, app modules, shared modules
- **Lifecycle Hooks** - ngOnInit, ngOnChanges, ngOnDestroy patterns
- **@Input/@Output Decorators** - Component communication
- **Structural Directives** - *ngIf, *ngFor, \*ngSwitch
- **RxJS Observables** - State management with BehaviorSubject
- **Change Detection** - OnPush vs Default strategies
- **Subscription Management** - takeUntil pattern for cleanup

## Installation

### As Claude Code Skill

```bash
hit install skill/angular-legacy --as-skill
```

Copies `claude-skill.md` to `.claude/skills/angular-legacy.md`.

### As GitHub Copilot Custom Instruction

```bash
hit install skill/angular-legacy --as-copilot
```

Copies `copilot-instructions.md` to `.github/instructions/angular-legacy.instructions.md`.

### As Documentation

```bash
hit install skill/angular-legacy
```

Installs to `~/.claude/tools/skill/angular-legacy/`.

## Key Patterns

### NgModule Structure

```typescript
@NgModule({
  declarations: [UserListComponent, UserCardComponent],
  imports: [CommonModule, FormsModule],
  providers: [UserService],
  exports: [UserListComponent],
})
export class UserModule {}
```

### Lifecycle Hooks

```typescript
export class UserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Input/Output Decorators

```typescript
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() featured = false;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart() {
    this.addToCart.emit(this.product);
  }
}
```

### Structural Directives

```typescript
<div *ngIf="isLoggedIn; else loginTemplate">
  <p>Welcome, {{ username }}</p>
</div>
<ng-template #loginTemplate>
  <button>Log In</button>
</ng-template>

<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>
```

## When to Use This Skill

Use this skill when:

- Maintaining pre-Angular 16 applications
- Working with NgModule-based architecture
- Using RxJS observables for state management
- Implementing lifecycle hooks (ngOnInit, ngOnDestroy)
- Working with @Input/@Output decorators

## Upgrade Path

For new Angular 16+ projects, use the **angular-modern** skill which covers:

- Signals instead of RxJS for state
- Standalone components instead of NgModules
- input()/output() instead of decorators
- @if/@for/@switch instead of structural directives

## Prerequisites

- Angular 15.x or lower
- TypeScript 4.8+
- RxJS 7.x

## Related Skills

- **angular-modern** - For Angular 16+ applications
- **typescript-expert** - Advanced TypeScript patterns
- **testing-automation** - Testing strategies

## References

- [Angular Official Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev)
- [NgRx Documentation](https://ngrx.io)

---

**Human-in-the-Loop by codewizwit**

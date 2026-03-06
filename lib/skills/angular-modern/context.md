# Angular Modern - Detailed Patterns and Conventions

This file contains detailed framework patterns, conventions, and reference material for modern Angular (16+) development with signals. Referenced from [skill.md](skill.md).

## Core Reactive Primitives

### Signals - Writable State

Signals are the foundational reactive primitive in modern Angular. Use `signal()` to create writable state that automatically tracks dependencies.

**Signal API**:

- `signal(initialValue)` - create a writable signal
- `.set(value)` - replace the current value
- `.update(fn)` - transform based on current value
- Call as function to read: `count()`
- Signals automatically track dependencies

**Signal Best Practices**:

- Use `signal()` for all writable component state
- Use `.set()` to replace value entirely
- Use `.update()` for transformations based on current value
- Signals are synchronous and glitch-free
- Prefer signals over BehaviorSubject for component state

### Computed - Derived State

Use `computed()` to create read-only derived values that automatically recalculate when their dependencies change.

**Computed API**:

- `computed(() => expression)` - create a derived signal
- Results are cached (memoized) until dependencies change
- Computed values are read-only
- Can depend on other computed signals
- Automatically recalculates when dependencies change

**Computed Best Practices**:

- Use `computed()` for any value derived from other signals
- Never use effects to derive state; use computed instead
- Chain computed values for complex derivations
- Computeds are lazy and only recalculate when read

### Effect - Side Effects

Use `effect()` for operations that should run when signal values change but that produce side effects rather than derived values.

**Effect API**:

- `effect(() => { sideEffectCode })` - run side effects on signal changes
- Effects run in injection context (constructor or field initializer)
- Automatically tracks which signals are read inside the callback
- Re-runs when any tracked signal changes

**Effect Best Practices**:

- Use `effect()` only for side effects (DOM manipulation, localStorage, logging, analytics)
- Effects run automatically when tracked signals change
- Avoid using effects for derived state (use `computed` instead)
- Effects must run in injection context (constructor, field initializer)
- Do not use effects to update other signals (creates circular dependencies)

## Signal-Based Inputs and Outputs

### Signal Inputs (Angular 17.1+)

Signal inputs replace the `@Input()` decorator with a signal-based API that integrates with the reactive graph.

**Input API**:

- `input()` - optional input with default value
- `input.required<T>()` - required input (no default)
- `input(defaultValue)` - optional input with explicit default
- Read input values by calling as function: `this.user()`
- Inputs are read-only signals; cannot be set from inside the component

**Input Best Practices**:

- Use `input.required<T>()` for mandatory component inputs
- Use `input(defaultValue)` for optional inputs with defaults
- Combine with `computed()` to derive values from inputs
- Signal inputs participate in the reactive graph automatically
- Use `input()` instead of `@Input()` decorator in new code

### Signal Outputs (Angular 17.2+)

Signal outputs replace the `@Output()` decorator and EventEmitter pattern.

**Output API**:

- `output<T>()` - create an output that emits values of type T
- `.emit(value)` - emit a value to the parent
- No need for EventEmitter; output() handles it internally

**Output Best Practices**:

- Use `output<T>()` instead of `@Output()` with EventEmitter
- Emit specific types rather than generic objects
- Name outputs as actions: `addToCart`, `deleteItem`, `statusChanged`

## Standalone Components

### Standalone Component Architecture

All new Angular components should be standalone. Standalone components declare their dependencies directly via the `imports` array instead of relying on NgModules.

**Key Principles**:

- Set `standalone: true` on all components, directives, and pipes
- Import dependencies directly in the component `imports` array
- No NgModules needed for new applications
- Use `bootstrapApplication()` instead of `platformBrowserDynamic().bootstrapModule()`
- Use `provideRouter()`, `provideHttpClient()` for application-level configuration

### Lazy Loading with Standalone Components

Standalone components enable fine-grained lazy loading without NgModules.

**Route-Level Lazy Loading**:

- `loadComponent` - lazy load a single standalone component
- `loadChildren` - lazy load a group of routes

### Application Bootstrap

Modern Angular applications bootstrap without NgModules:

- Use `bootstrapApplication(AppComponent, { providers: [...] })`
- Configure providers with `provideRouter(routes)`, `provideHttpClient()`, etc.
- Each `provide*` function replaces what was previously an NgModule import

## Resource API (Angular 19+)

The Resource API provides declarative, signal-based async data loading.

**Resource API**:

- `resource({ request, loader })` - create a resource tied to a signal-based request
- `.value()` - the loaded value
- `.isLoading()` - whether the resource is currently loading
- `.hasValue()` - whether a value has been loaded
- `.error()` - any error that occurred
- `.reload()` - manually trigger a reload

**Resource Benefits**:

- Automatic loading states (`isLoading`, `hasValue`, `error`)
- Reactive: reloads when request signal changes
- Built-in error handling
- Manual refresh with `.reload()`
- No need for RxJS or manual state management for data fetching

## Control Flow Syntax (Angular 17+)

Modern Angular uses built-in control flow syntax instead of structural directives.

### @if - Conditional Rendering

Replaces `*ngIf`. Supports `@else if` and `@else` blocks.

### @for - List Rendering

Replaces `*ngFor`. Requires a `track` expression for performance. Supports `@empty` block for empty collections.

### @switch - Switch Statement

Replaces `*ngSwitch`. Supports `@case`, `@default` blocks.

**Control Flow Best Practices**:

- Always use `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Always provide a `track` expression in `@for` loops (usually `track item.id`)
- Use `@empty` blocks to handle empty collections gracefully
- Control flow blocks support type narrowing within their scope

## State Management with Signals

### Component-Level State

Use signals directly in components for local state management. Combine `signal()` for writable state and `computed()` for derived values.

**Patterns**:

- Define state as signals in class fields
- Use `computed()` for derived state (counts, totals, filtered lists)
- Use `.update()` for immutable state transformations
- Use `.set()` for direct replacements

### Service-Level State

For shared state across components, create injectable services with signal-based state.

**Patterns**:

- Use `private` signals with `.asReadonly()` for encapsulation
- Expose read-only views of state to consumers
- Use `computed()` for derived values (totals, counts, filtered views)
- Provide mutation methods that use `.update()` or `.set()`
- Register with `providedIn: 'root'` for singleton services

## Change Detection

Signals integrate with Angular's change detection for optimal performance.

**Key Points**:

- Signal reads in templates are automatically tracked
- Components only re-render when their tracked signals change
- No need for `OnPush` change detection strategy with signals (it happens automatically)
- `computed()` values are memoized and only recompute when dependencies change
- Effects run outside the template change detection cycle

## Migration from Legacy Angular

### NgOnInit to Constructor/Field Initializer

- Move initialization logic from `ngOnInit` to constructor or field initializers
- Use `resource()` for async data that previously loaded in `ngOnInit`
- Field initializer signals and computed values replace property assignments in `ngOnInit`

### @Input/@Output to input()/output()

- Replace `@Input()` decorator with `input()` or `input.required<T>()`
- Replace `@Output() event = new EventEmitter<T>()` with `output<T>()`
- Signal inputs are read-only; read with function call syntax

### NgModules to Standalone

- Add `standalone: true` to component decorator
- Move needed imports from NgModule to component `imports` array
- Replace `bootstrapModule()` with `bootstrapApplication()`
- Replace module-level `forRoot()` with `provide*()` functions

### RxJS Observables to Signals

- Replace `BehaviorSubject` with `signal()`
- Replace `combineLatest` / `map` pipelines with `computed()`
- Replace `tap` side effects with `effect()`
- Use `toSignal()` to bridge existing observables to signals when needed
- Keep RxJS for complex async streams (websockets, debounced search)

### Structural Directives to Control Flow

- Replace `*ngIf="condition"` with `@if (condition) { ... }`
- Replace `*ngFor="let item of items"` with `@for (item of items; track item.id) { ... }`
- Replace `*ngSwitch` with `@switch (value) { @case ... }`

---
name: angular-modern
description: >-
  Apply modern Angular patterns with signals, computed, effect, standalone
  components, and signal-based inputs/outputs when building or reviewing
  Angular 16+ applications. Use when user asks to "build an Angular app",
  "use Angular signals", or mentions "modern Angular patterns".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion
---

# Angular Modern Skill

Use this skill when working with **modern Angular (16+)** using signals, computed values, effects, and standalone components. This represents the current and future direction of Angular development.

## When to Activate

- Building new Angular 16+ applications
- Working with signals, computed, or effect
- Using standalone components (no NgModules)
- Implementing signal-based inputs and outputs
- Discussing modern Angular reactive patterns
- Migrating from RxJS/NgOnInit to signals

## Interactive Flow

### Step 1: Gather Context

<ask_user_question>
<question>What Angular task would you like help with?</question>
<options>

  <option value="new-component">Build a new component with signals</option>
  <option value="migration">Migrate legacy Angular to modern patterns</option>
  <option value="state-management">Set up state management with signals</option>
  <option value="review">Review existing Angular code for modern patterns</option>
  <option value="other">Something else</option>
</options>
<allow_custom>true</allow_custom>
</ask_user_question>

### Step 2: Analyze Codebase

1. Use Glob to find Angular files (`*.component.ts`, `*.service.ts`, `*.module.ts`)
2. Use Read to examine existing components and services
3. Use Grep to identify legacy patterns (`@Input`, `@Output`, `ngOnInit`, `*ngIf`, `*ngFor`)
4. Determine Angular version from `package.json`

### Step 3: Execute

Apply modern Angular patterns based on the task. For detailed Angular patterns, see [context.md](context.md). For code templates, see [templates.md](templates.md).

## Core Methodology

### Reactive Primitives

- **signal()** - Writable state. Use `.set()` to replace, `.update()` to transform, call as function to read
- **computed()** - Derived read-only state. Cached, auto-recalculates when dependencies change
- **effect()** - Side effects only (DOM, localStorage, logging). Runs in injection context

### Signal-Based Component API

- **input()** / **input.required\<T\>()** - Signal inputs replacing `@Input()` (Angular 17.1+)
- **output\<T\>()** - Signal outputs replacing `@Output()` + EventEmitter (Angular 17.2+)
- **resource()** - Declarative async data loading with built-in states (Angular 19+)

### Standalone Architecture

- All components use `standalone: true`
- Dependencies imported directly in component `imports` array
- No NgModules for new applications
- Bootstrap with `bootstrapApplication()` and `provide*()` functions
- Lazy load with `loadComponent` and `loadChildren`

### Control Flow (Angular 17+)

- `@if` / `@else if` / `@else` replaces `*ngIf`
- `@for (item of items; track item.id)` replaces `*ngFor` (track is required)
- `@switch` / `@case` / `@default` replaces `*ngSwitch`

### State Management

- Component state: signals as class fields with computed for derived values
- Service state: private signals with `.asReadonly()`, mutation methods, computed views
- Use `providedIn: 'root'` for singleton services

For detailed patterns including signal APIs, computed chains, effect usage, standalone setup, Resource API, change detection, and migration strategies, see [context.md](context.md).

For complete code templates including component examples, service patterns, testing templates, and migration examples, see [templates.md](templates.md).

## Output Format

<output_format>

<section name="summary">Brief description of what was built or reviewed</section>
<section name="components">
  <component>
    <file>path/to/component.ts</file>
    <pattern>signal | computed | effect | input | output | resource</pattern>
    <description>What it does and which modern patterns it uses</description>
  </component>
</section>
<section name="migrations">
  <migration>
    <from>Legacy pattern (e.g., @Input decorator, NgModule)</from>
    <to>Modern pattern (e.g., input(), standalone)</to>
    <file>affected file path</file>
  </migration>
</section>
<section name="next-steps">Recommended follow-up actions</section>
</output_format>

## Best Practices

- Use `signal()` for all component state
- Use `computed()` for derived values
- Use `effect()` only for side effects (DOM, localStorage, logging)
- Use signal-based `input()` and `output()` for component APIs
- Use `resource()` for async data loading (Angular 19+)
- Use `@if`, `@for`, `@switch` control flow syntax
- Make all components `standalone: true`
- Use `provideRouter`, `provideHttpClient` in `bootstrapApplication`
- Lazy load with `loadComponent` and `loadChildren`

## Anti-Patterns

- Don't use `ngOnInit` - initialize in constructor or field initializers
- Don't use RxJS for component state - use signals
- Don't use `@Input()` / `@Output()` decorators - use `input()` / `output()`
- Don't create NgModules - use standalone components
- Don't use `*ngIf`, `*ngFor`, `*ngSwitch` - use `@if`, `@for`, `@switch`
- Don't manually manage subscriptions - use `resource()` or async pipe if needed
- Don't use effects to update other signals - use `computed()`

## Examples

**Build a new component:**

> Create an Angular component with signals for a user profile editor

**Migrate legacy code:**

> Convert this NgModule-based component to standalone with signals

**State management:**

> Set up a signal-based cart service for our e-commerce app

## References

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular Standalone Components](https://angular.dev/guide/components/importing)
- [Angular Resource API](https://angular.dev/api/core/resource)
- [Angular Control Flow](https://angular.dev/essentials/conditionals-and-loops)
- [Angular Modern Documentation](https://angular.dev)

---

**Human-in-the-Loop by codewizwit**

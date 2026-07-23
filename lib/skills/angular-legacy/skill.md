---
name: angular-legacy
description: >-
  Applies traditional Angular patterns with NgModules, lifecycle hooks,
  decorators, structural directives, and RxJS observables. Use when user asks to
  "maintain legacy Angular", "work with NgModules", "use lifecycle hooks", or
  mentions "pre-Angular 16 patterns".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion, EnterPlanMode
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

Apply the appropriate patterns based on the user's needs. For detailed patterns and conventions, see [context.md](context.md). For code templates and scaffolding examples, see [templates.md](templates.md).

### Step 5: Deliver Results

Provide code following legacy Angular conventions with proper module structure, lifecycle management, and subscription cleanup.

## Core Methodology

### NgModule Architecture

- Use feature modules to organize features by domain
- Use `forChild()` for feature module routes
- Declare all components, directives, and pipes used in the module
- Import shared modules for reusable dependencies
- Provide services at the appropriate level (root or feature)
- Never declare components in multiple modules

### Lifecycle Hooks

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

### @Input/@Output Communication

- Use `@Input()` decorator to receive data from parent
- Use `@Output()` decorator with EventEmitter to emit events
- Provide default values for optional inputs
- Detect input changes in `ngOnChanges()`
- Never mutate input values directly
- Use the `propertyName` + `propertyNameChange` pattern for two-way binding

### RxJS State Management

- Use `BehaviorSubject` for state that components subscribe to
- Use `Subject` for events without initial value
- Use `takeUntil()` with destroy subject for cleanup
- Unsubscribe in `ngOnDestroy()`
- Use `async` pipe to avoid manual subscriptions
- Never nest subscriptions (use RxJS operators like switchMap instead)

### Change Detection

- Use `OnPush` for presentational components
- Keep inputs immutable
- Use `async` pipe for observables
- Use `markForCheck()` when needed
- Separate smart and dumb components

For detailed code examples of all these patterns, see [context.md](context.md) and [templates.md](templates.md).

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

## References

- [Angular Documentation (v15)](https://v15.angular.io/docs)
- [Angular NgModules](https://v15.angular.io/guide/ngmodules)
- [Angular Lifecycle Hooks](https://v15.angular.io/guide/lifecycle-hooks)
- [RxJS Documentation](https://rxjs.dev/guide/overview)
- [Angular Change Detection](https://v15.angular.io/guide/change-detection)

---

**Human-in-the-Loop by codewizwit**

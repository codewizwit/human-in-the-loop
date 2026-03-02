---
name: learning-path
description: >-
  Creates personalized learning paths for engineers based on current skills,
  career goals, and time constraints. Use when user asks to "create a learning
  path", "build a study plan", "plan my career growth", or mentions
  "skill development" or "career progression".
version: 3.0.0
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
  - EnterPlanMode
---

# Personalized Learning Path Generator

Creates customized learning paths for engineers based on their current skills, career goals, learning preferences, and time constraints. Generates structured curricula organized into phases with resources, practice activities, milestones, progress tracking, and check-in schedules. Supports level progressions, skill acquisition, role transitions, and specialization paths.

## When to Activate

- User asks to create a learning path or study plan
- User wants guidance on career progression or skill development
- User asks for a training curriculum or professional development plan
- User mentions leveling up, career growth, or skill gap analysis
- User wants a structured plan to learn a new technology or domain

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What type of learning path do you need?</question>
<option value="level">Level progression (e.g., junior to mid-level)</option>
<option value="skill">New skill or technology acquisition</option>
<option value="role">Role transition (e.g., backend to full-stack)</option>
<option value="specialization">Specialization deep-dive (e.g., security, ML)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What is your current role and target goal?</question>
<option value="junior-mid">Junior to Mid-Level Engineer</option>
<option value="mid-senior">Mid-Level to Senior Engineer</option>
<option value="senior-staff">Senior to Staff Engineer</option>
<option value="custom">Other (describe your current state and goal)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>How much time can you dedicate weekly to learning?</question>
<option value="light">2-4 hours (skill polish, staying current)</option>
<option value="moderate">5-8 hours (new skill acquisition)</option>
<option value="intensive">10-15 hours (role transition, deep learning)</option>
<option value="immersive">15+ hours (career pivot, intensive growth)</option>
</AskUserQuestion>

<AskUserQuestion>
<question>What is your target timeline?</question>
<option value="3months">3 months</option>
<option value="6months">6 months</option>
<option value="12months">12 months</option>
<option value="custom">Custom timeline</option>
</AskUserQuestion>

### Step 2: Skills Assessment

If the user has a codebase in the workspace, optionally use Glob and Read to examine their existing code and infer current skill levels. Otherwise, gather this through conversation:

- Current technical skills and proficiency levels
- Key skills the user wants to develop
- Specific technologies or domains of interest
- Learning style preferences
- Constraints (work schedule, existing commitments)

### Step 3: Plan

For all learning paths, enter plan mode to align on the curriculum structure:

<EnterPlanMode>
<summary>
Present the skills assessment showing current vs. target levels.
Propose a phased curriculum with timeline, list the focus areas for
each phase, and confirm the weekly time commitment and milestone
cadence with the user.
</summary>
</EnterPlanMode>

### Step 4: Generate Learning Path

Build the learning path with these components:

**Header and Context**

- Current state, target goal, timeline, focus areas, weekly commitment

**Skills Assessment Table**

- Current level vs. target level for each relevant skill
- Levels: None, Beginner, Intermediate, Advanced, Expert
- Identification of leverageable existing skills

**Phased Curriculum**

- Organize into 2-4 week phases for manageability
- Each phase has a clear goal and theme
- Topics presented as checklists for tracking
- Practice activities tied to real-world application
- Concrete milestone at the end of each phase
- Balance of 30% theory and 70% hands-on practice

**Weekly Schedule**

- Realistic time allocation across activity types
- Structured learning, hands-on practice, code review, mentorship

**Success Criteria**

- Concrete, observable indicators of goal achievement
- Behavioral and technical skill demonstrations
- Checklist format for self-assessment

**Check-in Schedule**

- Regular progress reviews (monthly or phase-based)
- Focus areas and discussion topics for each checkpoint
- Adjustment opportunities

### Step 5: Deliver Results

Write the learning path to a markdown file in the workspace.

## Output Format

<output_format>
**Header**
Engineer context, goal, timeline, weekly commitment, and focus areas.

**Skills Assessment**
Table of current skill levels vs. target levels with gap analysis.

**Phased Curriculum**
Multiple phases, each containing: goal statement, weekly topic breakdowns
with checklists, practice activities, and a milestone marker.

**Weekly Schedule**
Table showing activity type and hours per week allocation.

**Success Criteria**
Checklist of concrete indicators that the goal has been achieved.

**Check-in Schedule**
Table with checkpoint dates, focus areas, and discussion topics.
</output_format>

## Best Practices

- Meet engineers where they are with an honest skill assessment
- Connect learning activities to concrete career goals and real work
- Balance theory with hands-on practice using a 30/70 split
- Account for time constraints and avoid overwhelming with too many topics
- Include both technical and soft skills where relevant to the goal
- Build in buffer time for unexpected delays or deeper exploration
- Make milestones concrete and achievable to maintain motivation
- Identify transferable skills from the engineer's background

## Anti-Patterns

- Do not create unrealistic timelines that lead to burnout
- Do not focus exclusively on technical skills when soft skills are needed for the goal
- Do not present a generic curriculum without personalizing to the engineer's context
- Do not skip the skills assessment phase; the path must be grounded in current state
- Do not overload early phases with too many topics before fundamentals are solid
- Do not create check-ins that are just calendar dates without specific discussion topics

## Examples

### Example 1: Junior to Mid-Level Progression

**Input**: "Create a learning path for a junior Angular developer who wants to become mid-level. They know Angular basics, HTML/CSS, and TypeScript fundamentals. They want to focus on RxJS and testing. 6 month timeline."

**Output**: Six-month phased curriculum covering TypeScript deep-dive, RxJS foundations, testing with Jest and Cypress, advanced Angular patterns, and professional skills with weekly schedules, practice activities, and monthly check-ins.

### Example 2: Role Transition

**Input**: "I'm a backend engineer (Node.js, NestJS, 3 years) wanting to learn Angular to become full-stack. 4 month timeline, 10 hours per week."

**Output**: Four-month learning path leveraging existing TypeScript and NestJS knowledge, covering Angular fundamentals, CSS and RxJS mastery, production patterns with state management and testing, and full-stack integration with Nx monorepo deployment.

### Example 3: Staff Engineer Track

**Input**: "Create a learning path for a senior Angular engineer (5 years) pursuing staff level. Strong technically but needs to improve influence, architecture decisions, and cross-team leadership. 12 months."

**Output**: Twelve-month leadership-focused path covering technical authority and platform thinking, cross-team influence and stakeholder communication, technical strategy and design system leadership, and organizational impact with measurable outcomes.

---

**Human-in-the-Loop by codewizwit**

---
name: team-retrospective
description: >-
  Generates structured retrospective agendas and facilitates team reflection
  with actionable improvement plans. Use when user asks to "run a retro",
  "facilitate a retrospective", or mentions "sprint retrospective".
version: 3.0.0
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion, EnterPlanMode
---

# Team Retrospective Facilitator

Generates structured retrospective agendas, facilitates reflection on team
practices, and produces actionable improvement plans. Supports multiple formats
including Start/Stop/Continue, 4Ls (Liked/Learned/Lacked/Longed For), Sailboat,
Mad/Sad/Glad, and Starfish. Adapts to sprint retros, project milestones, and
incident post-mortems. Produces facilitation materials with tables, action items
with owners, team health checks, and follow-up checklists.

## When to Activate

- User asks to run or facilitate a retrospective
- User mentions sprint retro, project retrospective, or team reflection
- User wants to generate a retro agenda or improvement plan
- User asks about retrospective formats or facilitation techniques

## Interactive Flow

### Step 1: Gather Context

<AskUserQuestion>
<question>What are we reflecting on?</question>
<option value="sprint">A sprint (1-2 week cycle)</option>
<option value="project">A completed project or milestone</option>
<option value="incident">An incident or outage</option>
<option value="quarter">A quarterly or longer period</option>
</AskUserQuestion>

<AskUserQuestion>
<question>Which retrospective format would you like?</question>
<option value="ssc">Start / Stop / Continue</option>
<option value="4ls">4Ls (Liked, Learned, Lacked, Longed For)</option>
<option value="sailboat">Sailboat (Wind, Anchors, Rocks, Island)</option>
<option value="mad-sad-glad">Mad / Sad / Glad</option>
<option value="starfish">Starfish (Keep, More, Less, Stop, Start)</option>
<option value="suggest">Suggest the best format for my situation</option>
</AskUserQuestion>

<AskUserQuestion>
<question>How is the team feeling overall?</question>
<option value="positive">Mostly positive, celebrating a win</option>
<option value="mixed">Mixed feelings, some highs and lows</option>
<option value="frustrated">Frustrated or burned out</option>
<option value="neutral">Neutral, routine check-in</option>
</AskUserQuestion>

### Step 2: Plan (if complex)

For project retrospectives or emotionally charged situations, enter plan mode:

<EnterPlanMode>
<summary>
Identify the key themes to explore, select the most appropriate format based
on team sentiment, and outline the facilitation approach including time
allocation and participation techniques.
</summary>
</EnterPlanMode>

### Step 3: Gather Additional Details

Collect supplementary information to enrich the retrospective:

1. Team size and composition
2. Key deliverables or outcomes from the period
3. Specific challenges or incidents to address
4. Previous action items to follow up on
5. Any sensitive topics requiring careful facilitation

If the user has a codebase context, optionally:

1. Use Glob to find recent changelogs or release notes
2. Use Grep to search for incident reports or post-mortems
3. Use Read to examine sprint documentation or project plans

### Step 4: Generate Retrospective

Compose the retrospective with these components:

**Header**

- Date, sprint or project name, team size
- Format being used and estimated time box
- Facilitator notes if applicable

**Pre-Retro Context**

- Summary of what was delivered or worked on
- Team sentiment overview
- Key themes to explore
- Previous action item follow-up status

**Format-Specific Sections**

Generate the appropriate sections based on the chosen format:

Start/Stop/Continue:

- START: New practices to adopt with owner and rationale
- STOP: Practices to eliminate with owner and rationale
- CONTINUE: Practices working well with explanation of impact

4Ls:

- LIKED: What went well with impact description
- LEARNED: New insights with application plan
- LACKED: What was missing with proposed solution
- LONGED FOR: Future wishes with priority and feasibility

Sailboat:

- WIND: Tailwinds pushing the team forward
- ANCHORS: Factors slowing the team down with weight rating
- ROCKS: Risks ahead with likelihood, impact, and mitigation
- ISLAND: Destination and definition of done

**Action Items**

Prioritized table with:

- Priority indicator (High, Medium, Low)
- Specific, measurable action
- Owner (assigned or TBD)
- Due date or timeframe

**Team Health Check**

Optional pulse survey covering:

- Psychological safety
- Workload sustainability
- Collaboration quality
- Learning and growth
- Enjoyment

**Follow-up Checklist**

- Assign owners to action items
- Add items to sprint backlog
- Schedule follow-ups
- Share summary with stakeholders if appropriate
- Set next retro date

### Step 5: Deliver Retrospective

Write the complete retrospective to a markdown file in the workspace.

## Output Format

<output_format>
Write the retrospective to a markdown file in the workspace. Structure as
follows:

**Header**

Date, sprint or project name, team size, format, and time box.

**Pre-Retro Context**

What was delivered, team sentiment, themes to explore, and previous action
item follow-up.

**Format-Specific Sections**

Tables with observations, owners, impact descriptions, and proposed solutions.
Use the structure matching the chosen format (Start/Stop/Continue, 4Ls,
Sailboat, Mad/Sad/Glad, or Starfish).

**Action Items**

Prioritized table with specific actions, owners, and due dates. Limit to
3-5 items to maintain focus.

**Team Health Check** (optional)

Quick pulse survey questions covering safety, workload, collaboration,
learning, and enjoyment.

**Follow-up Checklist**

Checkbox list of next steps to ensure actions are tracked and completed.
</output_format>

## Best Practices

- Create psychological safety by focusing on systems and processes, not individuals
- Balance celebration of wins with constructive discussion of challenges
- Limit action items to 3-5 to ensure focus and follow-through
- Ensure every action item has an owner, even if initially TBD
- Make actions SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- Follow up on previous retro action items to maintain accountability
- Use silent writing time before discussion to hear all voices
- End the retrospective on a positive note with appreciation
- Adapt the format to match the team's emotional state and maturity level

## Anti-Patterns

- Do not allow blame games or finger-pointing at individuals
- Do not create too many action items that never get completed
- Do not accept vague actions like "improve communication" without specifics
- Do not let the same issues appear retro after retro without addressing root causes
- Do not focus exclusively on negatives while ignoring what went well
- Do not skip the retrospective when the team is busy (that is when it is needed most)
- Do not let managers dominate the conversation at the expense of team participation

## Examples

### Example 1: Sprint Start/Stop/Continue

**Input**: "Run a retro for our sprint. We shipped the checkout redesign but had
some deployment issues. Team of 6, two-week sprint."

**Output**: Start/Stop/Continue retrospective with tables for new practices to
adopt (deployment checklist, staging smoke tests), practices to eliminate
(Friday deployments, skipping staging), and practices to continue (async
standups, pair programming). Includes prioritized action items with owners,
team health check survey, and follow-up checklist.

### Example 2: Project 4Ls Retrospective

**Input**: "We just launched our mobile app after 3 months. Team is tired but
proud. Some scope creep. 8 person team. Use 4Ls format."

**Output**: 4Ls retrospective covering what the team liked (design collaboration,
code review quality), learned (scope creep compounds without guardrails),
lacked (clear change approval process, QA resources), and longed for (automated
E2E testing, sustainable pace). Includes quantitative reflection on planned
versus actual timeline and an appreciation circle.

### Example 3: Sailboat Retrospective for Migration

**Input**: "Sailboat retro for our platform team migrating to Kubernetes.
Progress is slow, morale is mixed."

**Output**: Sailboat retrospective with tailwinds (team excitement, exec
support), anchors with weight ratings (learning curve, legacy dependencies),
rocks with risk matrix (production outage, burnout, budget overrun), and
island definition of done. Includes morale check-in addressing both excitement
and frustration with specific support proposals.

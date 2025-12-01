# Team Retrospective Facilitator

Generates structured retrospective agendas, facilitates team reflection, and produces actionable improvement plans.

## What It Does

- **Generates** retrospective agendas for sprints, projects, or incidents
- **Supports** multiple formats (Start/Stop/Continue, 4Ls, Sailboat, and more)
- **Creates** actionable improvement plans with owners and due dates
- **Includes** team health checks and follow-up mechanisms

## Supported Formats

| Format                                       | Best For                                       |
| -------------------------------------------- | ---------------------------------------------- |
| **Start/Stop/Continue**                      | Regular sprint retros, simple and familiar     |
| **4Ls** (Liked, Learned, Lacked, Longed For) | Project retrospectives, learning-focused teams |
| **Sailboat**                                 | Initiative/milestone retros, visual thinkers   |
| **Mad/Sad/Glad**                             | Emotionally charged periods, team health focus |
| **Starfish**                                 | Nuanced discussions, mature teams              |

## Usage Examples

### Example 1: Sprint Retrospective

```
Run a retro for our sprint. We shipped the checkout redesign but had some deployment issues. Team of 6, two-week sprint.
```

**What You Get:**

- Start/Stop/Continue format with tables
- Specific action items with owners
- Team health check questions
- Follow-up checklist

### Example 2: Project Retrospective

```
We just launched our new mobile app after 3 months. Team is tired but proud. Some scope creep issues, good collaboration with design. 8 person team. Can you do a 4Ls format retro?
```

**What You Get:**

- 4Ls format (Liked, Learned, Lacked, Longed For)
- Project metrics reflection
- Appreciation circle prompts
- Prioritized improvement actions

### Example 3: Initiative Checkpoint

```
Do a sailboat retro for our platform team. We're migrating to Kubernetes but progress is slow. Team morale is mixed.
```

**What You Get:**

- Sailboat visual metaphor
- Wind (tailwinds), Anchors (blockers), Rocks (risks), Island (goal)
- Morale check-in with specific questions
- Risk mitigation strategies

## Output Structure

Every retrospective includes:

1. **Header** - Date, project/sprint, team size, format
2. **Pre-Retro Context** - What happened, sentiment, themes to explore
3. **Format-Specific Sections** - Tables with observations and owners
4. **Action Items** - Prioritized with owners and due dates
5. **Team Health Check** - Optional pulse survey questions
6. **Follow-up Checklist** - Next steps to ensure actions happen

## Best Practices Applied

**Creating Safety:**

- Focus on systems, not individuals
- Encourage "I" statements
- All feedback is valid framing

**Driving Action:**

- 3-5 action items max (focus over breadth)
- Every action has an owner
- SMART action items
- Follow-up in next retro

**Managing Time:**

- Timeboxed sections
- Park deep-dives for later
- End with appreciation

## Anti-Patterns Avoided

- Blame games or finger-pointing
- Too many action items
- Vague actions ("improve communication")
- Same issues retro after retro
- Only focusing on negatives

## Related Resources

- [Code Review Empathy](../code-review-empathy) - Empathetic feedback patterns
- [1-on-1 Prep](../1-on-1-prep) - Individual meeting preparation

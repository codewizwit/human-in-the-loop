# Responsible AI Audit

Comprehensive audit framework evaluating AI outputs against accuracy, fairness, transparency, accountability, and safety principles.

## What You'll Be Asked

- **AI system/output** - Tool, model output, or AI-generated content
- **Purpose and context** (optional) - What it does, who uses it, decisions it makes
- **Known concerns** (optional) - Issues already identified

## Usage Examples

### Example 1: Code Review Bot Audit

Audit automated PR comment bot for developer experience, equity, and transparency.

**Expected Output:**

```markdown
### Executive Summary

Risk level: HIGH. Recommendation: Do Not Deploy

### Lens-by-Lens Analysis

**1. Developer Experience & Growth**

- Score: Fail
- No explanations bypass learning opportunities
- No opt-out reduces autonomy

**2. Transparency & Trust**

- Score: Fail
- No indication of how suggestions generated
```

### Example 2: Test Generator Tool Audit

Evaluate AI test generator with human review requirements and clear labeling.

**Expected Output:**

```markdown
### Executive Summary

Risk level: MEDIUM. Recommendation: Deploy with Conditions

**Conditions:**

- Add "Edge cases to consider" prompts
- Document tool limitations
- Pilot with 3-5 developers for 2 weeks

### Monitoring Plan

- Track test coverage and bug escape rates
```

## Related Resources

- [Bias Detection](../bias-detection) - Specific bias analysis
- [Anthropic Responsible Scaling Policy](https://www.anthropic.com/news/anthropics-responsible-scaling-policy) - AI safety framework
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) - Governance standards

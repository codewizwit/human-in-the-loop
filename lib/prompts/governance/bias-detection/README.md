# Bias Detection Analyzer

Analyzes AI-generated content for potential bias across gender, race, age, disability, cultural background, and socioeconomic status.

## What You'll Be Asked

- **Content to analyze** - AI output, text, recommendations, or code
- **Context** (optional) - System purpose, target audience
- **Specific concerns** (optional) - Particular bias types to examine

## Usage Examples

### Example 1: Authentication System Code Review

Detect age and language bias in user validation logic.

**Expected Output:**

```markdown
### Executive Summary

- **Overall Bias Risk**: 🔴 Critical
- **Categories Detected**: Age Bias, Cultural/Linguistic Bias
- **Recommendation**: ❌ Do Not Deploy

### Detailed Findings

**Age Bias - Critical:**
if (user.age > 65) { return { eligible: false } }
```

### Example 2: AI-Generated Content Analysis

Review product recommendations for gender stereotypes and socioeconomic assumptions.

**Expected Output:**

```markdown
**Gender Bias - High:**
"Perfect gift for her: kitchen appliances"
**Why It's Biased:** Assumes gender-based interests

**Alternative:** "Perfect gift: premium kitchen appliances"
```

## Related Resources

- [Responsible AI Audit](../responsible-ai-audit) - Comprehensive AI governance
- [Fairness Indicators](https://www.tensorflow.org/responsible_ai/fairness_indicators/guide) - ML fairness tools
- [Inclusive Design Principles](https://www.microsoft.com/design/inclusive/) - Microsoft's inclusive design guide

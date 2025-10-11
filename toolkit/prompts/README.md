# Prompts

Production-ready Claude prompts for common software development tasks. Each prompt is versioned, well-documented, and includes usage examples.

## Structure

```
prompts/
├── code-review-ts/        # TypeScript code review
│   ├── prompt.yaml
│   └── README.md
├── api-docs-generator/    # API documentation generation
└── test-case-generator/   # Test case creation
```

## What's a Prompt?

A prompt is a reusable template for interacting with Claude. Each prompt defines:
- **Variables**: Input parameters the prompt accepts
- **Template**: The structured prompt text
- **Examples**: Sample inputs and expected outputs
- **Metadata**: Author, version, license, tags

## Usage

### Via CLI

```bash
# Search for prompts
hitl search "code review"

# Install a prompt
hitl install prompt/code-review-ts

# List installed prompts
hitl list
```

### Direct Use

Each prompt is defined in a `prompt.yaml` file:

```yaml
id: my-prompt
name: My Prompt
version: 1.0.0
description: What this prompt does
category: code-review

variables:
  - name: code
    description: The code to analyze
    required: true

template: |
  Review the following code:
  {{code}}

  Provide feedback on...

metadata:
  author: yourname
  license: MIT
  tags: [typescript, code-review]
```

## Available Prompts

### code-review-ts
Comprehensive TypeScript code review covering type safety, best practices, performance, and security.

**Use when**: Reviewing TypeScript code for quality and best practices

[See full documentation →](./code-review-ts/README.md)

## Contributing a New Prompt

1. Create a new directory: `prompts/your-prompt-name/`
2. Add `prompt.yaml` with prompt definition
3. Add `README.md` with:
   - Description
   - Usage examples
   - Expected inputs/outputs
4. Test your prompt thoroughly
5. Submit a pull request

### Prompt Requirements

All prompts must have:
- ✅ Unique ID and semantic version
- ✅ Clear description and category
- ✅ Documented variables with types
- ✅ At least 2 usage examples
- ✅ Author and license in metadata
- ✅ README.md with usage instructions

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

---

**Human-in-the-Loop by codewizwit**

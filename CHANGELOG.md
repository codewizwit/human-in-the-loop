# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.3](https://github.com/codewizwit/human-in-the-loop/compare/v3.0.2...v3.0.3) (2025-12-01)


### Bug Fixes

* use root README for npm package ([e267652](https://github.com/codewizwit/human-in-the-loop/commit/e267652f0690260f74b3f0ab9ddd9eb0071c0dd3))

### [3.0.2](https://github.com/codewizwit/human-in-the-loop/compare/v3.0.1...v3.0.2) (2025-12-01)

### [3.0.1](https://github.com/codewizwit/human-in-the-loop/compare/v3.0.0...v3.0.1) (2025-12-01)

## [3.0.0](https://github.com/codewizwit/human-in-the-loop/compare/v1.3.2...v3.0.0) (2025-12-01)

### ⚠ BREAKING CHANGES

- Prompt file format migrated from YAML frontmatter + XML
  to pure XML structure following Anthropic best practices.

Changes:

- Convert all 12 prompts to pure XML with <prompt><metadata>...</metadata></prompt>
- Update CLI to parse XML and strip metadata/examples before sending to Claude
- Add fast-xml-parser dependency for XML parsing
- Generate 12 concise dev-friendly READMEs (185-233 words each)
- Maintain backward compatibility with YAML and markdown frontmatter formats
- Ensure all outputs explicitly write to markdown files in workspace

Benefits:

- Follows Anthropic XML best practices (no comment pollution)
- Better developer experience with scannable READMEs
- Cleaner separation: XML for Claude, README for humans
- Industry-aligned format without YAML frontmatter pollution

Technical Implementation:

- parsePromptXml() function strips <metadata> and <examples> sections
- Only <context>, <instructions>, <constraints>, <output_format> sent to Claude
- generateXmlCommandContent() creates clean slash commands
- All 21 claude-integration tests pass

All quality checks pass: format, lint, typecheck, build, tests (21/21)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

### Features

- add Claude Code slash command integration ([d42d229](https://github.com/codewizwit/human-in-the-loop/commit/d42d2293a0f0b5ac580908adbe042196abe505f3))
- migrate prompts from YAML to Markdown with frontmatter ([5ade24a](https://github.com/codewizwit/human-in-the-loop/commit/5ade24af809aa0a70485bf881505fe57d6015207))
- refactor prompts to pure XML format with concise READMEs ([8ef001a](https://github.com/codewizwit/human-in-the-loop/commit/8ef001aab587c0d593654c75578373e0a1b438d2))

### Bug Fixes

- add return type to mock function ([7bd6ec1](https://github.com/codewizwit/human-in-the-loop/commit/7bd6ec14c684e08bed8f6d345ed7ade11f0f8eb0))
- add variable documentation to markdown command files ([92fd55b](https://github.com/codewizwit/human-in-the-loop/commit/92fd55be068c4d0fd3034b0006d67b3ec6870a5b))
- add XML parsing support to lib-scanner for pure XML prompts ([86e7ed1](https://github.com/codewizwit/human-in-the-loop/commit/86e7ed128e05f1e3367f3c84b9ebdc94859b0da7))
- complete XML migration and update governance checks ([74e7948](https://github.com/codewizwit/human-in-the-loop/commit/74e79486a496c6776d165b6981c94ff8823a7230))

### Code Refactoring

- make Claude Code integration default for prompts ([6ac9bc8](https://github.com/codewizwit/human-in-the-loop/commit/6ac9bc8bb35833196d7ee49608bbb450e5aaeaeb))
- remove all inline comments from production code ([7fe4283](https://github.com/codewizwit/human-in-the-loop/commit/7fe428386ef119e3fb2f9bb31edcc82b0da486b7))
- simplify update command to update CLI package only ([ae5a60e](https://github.com/codewizwit/human-in-the-loop/commit/ae5a60ef3943c96070bdf6b36a53ce7bb86e149a))

## [2.0.0] - 2025-11-20

### Features

- **XML Template Migration** - Migrate prompts to markdown with XML structure for Claude Code integration
- **Claude Code Integration** - Automatic `/slash-command` creation in Claude Code
- **Tool-Based Workspace Analysis** - Prompts use Read/Grep/Glob tools instead of copy-paste
- **Responsible AI Playbook** - Rebrand from Accountability Framework to Responsible AI Playbook
- **Documentation Refactor** - Developer-friendly README with codewizwit branding and emojis
- **Skills Architecture** - Add Angular Modern and Angular Legacy skills for Claude Code

### Breaking Changes

- Prompt format changed from plain markdown to markdown with YAML frontmatter and XML structure
- ACCOUNTABILITY.md renamed to RESPONSIBLE-AI-PLAYBOOK.md
- All references to "Accountability Framework" updated to "Responsible AI Playbook"

### [1.1.7](https://github.com/codewizwit/human-in-the-loop/compare/v1.1.6...v1.1.7) (2025-10-19)

### [1.1.6](https://github.com/codewizwit/human-in-the-loop/compare/v1.1.5...v1.1.6) (2025-10-17)

### [1.1.5](https://github.com/codewizwit/human-in-the-loop/compare/v1.1.4...v1.1.5) (2025-10-17)

### [1.1.4](https://github.com/codewizwit/human-in-the-loop/compare/v1.1.3...v1.1.4) (2025-10-17)

### [1.1.3](https://github.com/codewizwit/human-in-the-loop/compare/v1.1.2...v1.1.3) (2025-10-17)

### [1.1.2](https://github.com/codewizwit/human-in-the-loop/compare/v1.1.1...v1.1.2) (2025-10-17)

### [1.1.1](https://github.com/codewizwit/human-in-the-loop/compare/v1.1.0...v1.1.1) (2025-10-17)

## [1.1.0](https://github.com/codewizwit/human-in-the-loop/compare/v1.0.10...v1.1.0) (2025-10-17)

### Features

- implement working contribute command with GitHub issue creation ([6dd7d17](https://github.com/codewizwit/human-in-the-loop/commit/6dd7d179f5a1503137b74caa6ffdab038ea87ae6))

### Code Refactoring

- remove inline comments from contribute command ([e33df90](https://github.com/codewizwit/human-in-the-loop/commit/e33df9058b4cead6708d6d3e88767f7d8cb97861))

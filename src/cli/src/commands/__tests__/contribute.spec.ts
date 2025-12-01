/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { contributeCommand } from '../contribute';
import * as fs from 'fs';
import * as childProcess from 'child_process';

jest.mock('fs');
jest.mock('child_process');

const mockFs = fs as jest.Mocked<typeof fs> & {
  readFileSync: jest.Mock;
  existsSync: jest.Mock;
};
const mockChildProcess = childProcess as jest.Mocked<typeof childProcess>;

describe('contributeCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;
  let mockExit: jest.SpiedFunction<typeof process.exit>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();

    mockExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as never);

    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
    mockExit.mockRestore();
  });

  describe('path validation', () => {
    it('should exit with error if path does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);

      await contributeCommand('prompt', 'non-existent-path.md');

      expect(consoleMock.contains('Path does not exist')).toBe(true);
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should continue if path exists', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

- Test input

## Usage Examples

Test example

## Related Resources

- [Link](http://example.com)`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('Path does not exist')).toBe(false);
    });
  });

  describe('Pure XML validation (v2.0.0 format)', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
    });

    it('should pass validation for valid pure XML prompt', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test-prompt</id>
    <name>Test Prompt</name>
    <version>2.0.0</version>
    <description>Test description</description>
    <category>testing</category>
    <author>test-author</author>
    <license>MIT</license>
  </metadata>

  <examples>
    <example>
      <description>Example 1</description>
    </example>
  </examples>

  <context>
Test context
  </context>

  <instructions>
Test instructions
  </instructions>

  <constraints>
Test constraints
  </constraints>

  <output_format>
Test output format
  </output_format>
</prompt>`;
        }
        return `# Test Prompt

## What You'll Be Asked

- Test input

## Usage Examples

### Example 1

Test example

## Related Resources

- [Link](http://example.com)`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('✅ Pure XML validation passed')).toBe(true);
      expect(consoleMock.contains('✅ Documentation validation passed')).toBe(
        true
      );
    });

    it('should fail validation for missing <prompt> root element', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<metadata>
  <id>test</id>
</metadata>`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources

`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('❌ Pure XML validation failed')).toBe(true);
      expect(
        consoleMock.contains('must start with <prompt> root element')
      ).toBe(true);
    });

    it('should fail validation for missing required metadata fields', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
  </metadata>

  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources

`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('❌ Pure XML validation failed')).toBe(true);
      expect(consoleMock.contains('Missing required metadata field')).toBe(
        true
      );
    });

    it('should fail validation for missing required sections', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
</prompt>`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources

`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('❌ Pure XML validation failed')).toBe(true);
      expect(consoleMock.contains('Missing <context> section')).toBe(true);
      expect(consoleMock.contains('Missing <instructions> section')).toBe(true);
      expect(consoleMock.contains('Missing <output_format> section')).toBe(
        true
      );
    });

    it('should warn for missing <constraints> and <examples>', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>

  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources

`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('⚠️  Warnings:')).toBe(true);
      expect(consoleMock.contains('Missing <constraints> section')).toBe(true);
      expect(consoleMock.contains('Missing <examples> section')).toBe(true);
    });

    it('should accept legacy ## Usage format for backwards compatibility', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return '## Usage\n\nLegacy format with enough content to pass the length check for the minimum.';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('✅ Documentation validation passed')).toBe(
        true
      );
    });

    it('should fail validation for file not ending with </prompt>', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
  </metadata>`;
        }
        return '## Usage\n\nContent';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('❌ Pure XML validation failed')).toBe(true);
      expect(consoleMock.contains('must end with </prompt> closing tag')).toBe(
        true
      );
    });

    it('should fail validation for unclosed XML tags in template', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test <unclosed></context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return '## Usage\n\nContent';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('❌ Pure XML validation failed')).toBe(true);
      expect(consoleMock.contains('Unclosed XML tag')).toBe(true);
    });

    it('should fail validation for missing <metadata> section after parsing', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <context>Test</context>
</prompt>`;
        }
        return '## Usage\n\nContent';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('❌ Pure XML validation failed')).toBe(true);
      expect(consoleMock.contains('Missing <metadata> section')).toBe(true);
    });
  });

  describe('documentation validation', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
    });

    it('should fail if README.md is missing', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        throw new Error('File not found');
      });

      mockFs.existsSync.mockImplementation((path: unknown) => {
        return !path?.toString().includes('README.md');
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('Missing README.md file')).toBe(true);
    });

    it('should fail if README missing required sections', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return 'Some README content without required sections';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(
        consoleMock.contains(
          'README.md missing required "## What You\'ll Be Asked" or "## Usage" section'
        )
      ).toBe(true);
    });

    it('should warn if README is too short', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return '## Usage\nShort';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('README.md is very short')).toBe(true);
    });

    it("should fail if v2.0.0 format has What You'll Be Asked but missing Usage Examples", async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

- Test input

## Related Resources

- [Link](http://example.com)`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(
        consoleMock.contains(
          'README.md missing required "## Usage Examples" section (v2.0.0 format)'
        )
      ).toBe(true);
    });

    it("should fail if v2.0.0 format has What You'll Be Asked but missing Related Resources", async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

- Test input

## Usage Examples

Test example`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(
        consoleMock.contains(
          'README.md missing required "## Related Resources" section (v2.0.0 format)'
        )
      ).toBe(true);
    });
  });

  describe('GitHub issue creation', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

- Test input

## Usage Examples

Test example

## Related Resources

- [Link](http://example.com)`;
      });
    });

    it('should create GitHub issue and display URL', async () => {
      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/repo/issues/42'
      );

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('Creating GitHub issue')).toBe(true);
      expect(
        consoleMock.contains('Contribution issue created successfully')
      ).toBe(true);
      expect(
        consoleMock.contains('https://github.com/test/repo/issues/42')
      ).toBe(true);
    });

    it('should handle GitHub CLI errors gracefully', async () => {
      mockChildProcess.execSync.mockImplementation(() => {
        throw new Error('gh not authenticated');
      });

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('Failed to create issue')).toBe(true);
      expect(consoleMock.contains('gh auth login')).toBe(true);
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('legacy YAML validation', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
    });

    it('should validate YAML files for backwards compatibility', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.yaml')) {
          return `id: test-prompt
name: Test Prompt
version: 1.0.0
description: Test description
category: testing
metadata:
  author: test-author
  license: MIT
template: |
  <context>Test template</context>
examples:
  - description: Example 1`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources
`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.yaml');

      expect(consoleMock.contains('✅ YAML validation passed')).toBe(true);
    });

    it('should fail YAML validation for missing required fields', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.yaml')) {
          return `id: test-prompt
name: Test Prompt`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources
`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.yaml');

      expect(consoleMock.contains('❌ YAML validation failed')).toBe(true);
      expect(consoleMock.contains('Missing required field')).toBe(true);
    });

    it('should fail YAML validation for missing metadata section', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.yaml')) {
          return `id: test-prompt
name: Test Prompt
version: 1.0.0
description: Test
category: test`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources
`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.yaml');

      expect(consoleMock.contains('❌ YAML validation failed')).toBe(true);
      expect(consoleMock.contains('Missing metadata section')).toBe(true);
    });

    it('should fail YAML validation for missing template in prompt type', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.yaml')) {
          return `id: test-prompt
name: Test Prompt
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources
`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.yaml');

      expect(consoleMock.contains('❌ YAML validation failed')).toBe(true);
      expect(consoleMock.contains('Prompts must have a template field')).toBe(
        true
      );
    });

    it('should warn when no examples are provided in YAML', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.yaml')) {
          return `id: test-prompt
name: Test Prompt
version: 1.0.0
description: Test description
category: testing
metadata:
  author: test-author
  license: MIT
template: |
  <context>Test template</context>`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources
`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.yaml');

      expect(consoleMock.contains('No examples provided')).toBe(true);
    });

    it('should handle YAML parse errors gracefully', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.yaml')) {
          return `invalid: yaml: [
unclosed bracket`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources
`;
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/prompt.yaml');

      expect(consoleMock.contains('❌ YAML validation failed')).toBe(true);
      expect(consoleMock.contains('Failed to parse YAML')).toBe(true);
    });
  });

  describe('tool type detection', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md') || pathStr.endsWith('agent.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources

`;
      });
      mockChildProcess.execSync.mockReturnValue('https://github.com/test/1');
    });

    it('should detect prompt type from path', async () => {
      await contributeCommand('agent', 'lib/prompts/test/prompt.md');

      expect(consoleMock.contains('Detected type from path: prompt')).toBe(
        true
      );
    });

    it('should detect agent type from path', async () => {
      await contributeCommand('prompt', 'lib/agents/test/agent.md');

      expect(consoleMock.contains('Detected type from path: agent')).toBe(true);
    });

    it('should detect context-pack type from path', async () => {
      await contributeCommand('prompt', 'lib/context-packs/test/config.md');

      expect(
        consoleMock.contains('Detected type from path: context-pack')
      ).toBe(true);
    });
  });

  describe('next steps guidance', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockChildProcess.execSync.mockReturnValue('https://github.com/test/1');
    });

    it('should show PR steps when validation passes', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

- Test input

## Usage Examples

Test example

## Related Resources

- [Link](http://example.com)`;
      });

      await contributeCommand('prompt', 'test/prompt.md');

      expect(
        consoleMock.contains('Create a pull request with your changes')
      ).toBe(true);
      expect(consoleMock.contains('Link the PR to the issue')).toBe(true);
    });

    it('should show fix steps when validation fails', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<metadata>
  <id>test</id>
</metadata>`;
        }
        return 'No required sections';
      });

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('Fix the validation errors')).toBe(true);
      expect(consoleMock.contains('Run validation again')).toBe(true);
    });

    it('should reference CONTRIBUTING.md', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        const pathStr = path?.toString() || '';
        if (pathStr.endsWith('prompt.md')) {
          return `<prompt>
  <metadata>
    <id>test</id>
    <name>Test</name>
    <version>1.0.0</version>
    <description>Test</description>
    <category>test</category>
    <author>test</author>
    <license>MIT</license>
  </metadata>
  <context>Test</context>
  <instructions>Test</instructions>
  <output_format>Test</output_format>
</prompt>`;
        }
        return `## What You'll Be Asked

## Usage Examples

## Related Resources

`;
      });

      await contributeCommand('prompt', 'test/prompt.md');

      expect(consoleMock.contains('CONTRIBUTING.md')).toBe(true);
    });
  });
});

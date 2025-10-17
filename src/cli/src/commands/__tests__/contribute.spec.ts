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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readFileSync: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      await contributeCommand('prompt', 'non-existent-path.yaml');

      expect(consoleMock.contains('Path does not exist')).toBe(true);
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should continue if path exists', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(`
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
examples:
  - example 1
  - example 2
      `);

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test.yaml');

      expect(consoleMock.contains('Path does not exist')).toBe(false);
    });
  });

  describe('YAML validation', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
    });

    it('should pass validation for valid YAML', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test-prompt
name: Test Prompt
version: 1.0.0
description: A test prompt
category: testing
metadata:
  author: test-author
  license: MIT
template: Test template
examples:
  - example 1
  - example 2
          `;
        }
        return '## Usage\n\nSome usage docs here with enough content to pass validation.';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/test.yaml');

      expect(consoleMock.contains('✅ YAML validation passed')).toBe(true);
    });

    it('should fail validation for missing required fields', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test
name: Test
          `;
        }
        return '## Usage\n\nDocs';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/test.yaml');

      expect(consoleMock.contains('❌ YAML validation failed')).toBe(true);
      expect(consoleMock.contains('Missing required field')).toBe(true);
    });

    it('should fail validation if prompt missing template', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
          `;
        }
        return '## Usage\n\nDocs';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/test.yaml');

      expect(consoleMock.contains('Prompts must have a template field')).toBe(
        true
      );
    });

    it('should warn if no examples provided', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
template: Template
          `;
        }
        return '## Usage\n\nSome usage documentation here.';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/test.yaml');

      expect(
        consoleMock.contains('No examples provided (recommended: at least 2)')
      ).toBe(true);
    });
  });

  describe('documentation validation', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
    });

    it('should fail if README.md is missing', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
template: Template
examples: [1, 2]
          `;
        }
        throw new Error('File not found');
      });

      mockFs.existsSync.mockImplementation((path: unknown) => {
        return !path?.toString().includes('README.md');
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/test.yaml');

      expect(consoleMock.contains('Missing README.md file')).toBe(true);
    });

    it('should fail if README missing Usage section', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
template: Template
examples: [1, 2]
          `;
        }
        return 'Some README content without Usage section';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/test.yaml');

      expect(
        consoleMock.contains('README.md missing required "## Usage" section')
      ).toBe(true);
    });

    it('should warn if README is too short', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
template: Template
examples: [1, 2]
          `;
        }
        return '## Usage\nShort';
      });

      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/issues/1'
      );

      await contributeCommand('prompt', 'test/test.yaml');

      expect(consoleMock.contains('README.md is very short')).toBe(true);
    });
  });

  describe('GitHub issue creation', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
template: Template
examples: [1, 2]
          `;
        }
        return '## Usage\n\nSome documentation here with enough content.';
      });
    });

    it('should create GitHub issue and display URL', async () => {
      mockChildProcess.execSync.mockReturnValue(
        'https://github.com/test/repo/issues/42'
      );

      await contributeCommand('prompt', 'test/test.yaml');

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

      await contributeCommand('prompt', 'test/test.yaml');

      expect(consoleMock.contains('Failed to create issue')).toBe(true);
      expect(consoleMock.contains('gh auth login')).toBe(true);
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('tool type detection', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(`
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
examples: [1, 2]
      `);
      mockChildProcess.execSync.mockReturnValue('https://github.com/test/1');
    });

    it('should detect prompt type from path', async () => {
      await contributeCommand('agent', 'lib/prompts/test/prompt.yaml');

      expect(consoleMock.contains('Detected type from path: prompt')).toBe(
        true
      );
    });

    it('should detect agent type from path', async () => {
      await contributeCommand('prompt', 'lib/agents/test/agent.yaml');

      expect(consoleMock.contains('Detected type from path: agent')).toBe(true);
    });

    it('should detect context-pack type from path', async () => {
      await contributeCommand('prompt', 'lib/context-packs/test/config.yaml');

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
        if (path?.toString().endsWith('.yaml')) {
          return `
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
template: Template
examples: [1, 2]
          `;
        }
        return '## Usage\n\nDocumentation content here.';
      });

      await contributeCommand('prompt', 'test/test.yaml');

      expect(
        consoleMock.contains('Create a pull request with your changes')
      ).toBe(true);
      expect(consoleMock.contains('Link the PR to the issue')).toBe(true);
    });

    it('should show fix steps when validation fails', async () => {
      mockFs.readFileSync.mockImplementation((path: unknown) => {
        if (path?.toString().endsWith('.yaml')) {
          return `id: test`;
        }
        return 'No usage section';
      });

      await contributeCommand('prompt', 'test/test.yaml');

      expect(consoleMock.contains('Fix the validation errors')).toBe(true);
      expect(consoleMock.contains('Run validation again')).toBe(true);
    });

    it('should reference CONTRIBUTING.md', async () => {
      mockFs.readFileSync.mockReturnValue(`
id: test
name: Test
version: 1.0.0
description: Test
category: test
metadata:
  author: test
  license: MIT
examples: [1]
      `);

      await contributeCommand('prompt', 'test/test.yaml');

      expect(consoleMock.contains('CONTRIBUTING.md')).toBe(true);
    });
  });
});

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { searchCommand } from '../search';
import * as toolkitScanner from '../../utils/toolkit-scanner';

// Mock toolkit-scanner module
jest.mock('../../utils/toolkit-scanner');

const mockToolkitScanner = toolkitScanner as jest.Mocked<typeof toolkitScanner>;

describe('searchCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
    jest.clearAllMocks();

    // Default mock: return some tools
    mockToolkitScanner.searchTools.mockReturnValue([
      {
        id: 'code-review-ts',
        name: 'Code Review TypeScript',
        version: '1.2.0',
        description: 'TypeScript code review with best practices',
        category: 'code-quality',
        type: 'prompt',
        path: '/toolkit/prompts/code-review-ts',
        metadata: { tags: ['typescript', 'code-review'] },
      },
      {
        id: 'test-generator',
        name: 'Test Generator',
        version: '1.0.0',
        description: 'Generate comprehensive test suites',
        category: 'testing',
        type: 'agent',
        path: '/toolkit/agents/test-generator',
        metadata: { tags: ['testing', 'automation'] },
      },
      {
        id: 'api-docs-generator',
        name: 'API Docs Generator',
        version: '2.1.0',
        description: 'Generate API documentation from code',
        category: 'documentation',
        type: 'prompt',
        path: '/toolkit/prompts/api-docs-generator',
        metadata: { tags: ['docs', 'api'] },
      },
    ]);
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('with query parameter', () => {
    it('should display search query', () => {
      searchCommand('code review');

      expect(consoleMock.contains('Searching for: "code review"')).toBe(true);
      expect(mockToolkitScanner.searchTools).toHaveBeenCalledWith(
        'code review'
      );
    });

    it('should show search icon', () => {
      searchCommand('testing');

      expect(consoleMock.contains('🔍')).toBe(true);
    });

    it('should display search results', () => {
      searchCommand('code');

      const output = consoleMock.getOutput();

      // Should show tools
      expect(output).toContain('prompt/code-review-ts');
      expect(output).toContain('agent/test-generator');
      expect(output).toContain('prompt/api-docs-generator');
    });
  });

  describe('without query parameter', () => {
    it('should show all available tools message', () => {
      searchCommand();

      expect(consoleMock.contains('Showing all available tools')).toBe(true);
      expect(mockToolkitScanner.searchTools).toHaveBeenCalledWith(undefined);
    });

    it('should display all results', () => {
      searchCommand();

      const output = consoleMock.getOutput();

      expect(output).toContain('Found 3 tools');
      expect(output).toContain('prompt/code-review-ts');
    });
  });

  describe('output format', () => {
    it('should display tool name, description, and version', () => {
      searchCommand('test');

      const output = consoleMock.getOutput();

      // Tool name
      expect(output).toContain('agent/test-generator');

      // Description
      expect(output).toContain('Generate comprehensive test suites');

      // Version
      expect(output).toContain('Version: 1.0.0');
    });

    it('should show tags if available', () => {
      searchCommand();

      const output = consoleMock.getOutput();

      expect(output).toContain('Tags: typescript, code-review');
    });

    it('should show install tip at the end', () => {
      searchCommand();

      expect(consoleMock.contains('hitl install <type>/<id>')).toBe(true);
    });

    it('should number the results', () => {
      searchCommand();

      const output = consoleMock.getOutput();

      expect(output).toMatch(/1\./);
      expect(output).toMatch(/2\./);
      expect(output).toMatch(/3\./);
    });
  });

  describe('empty results', () => {
    beforeEach(() => {
      mockToolkitScanner.searchTools.mockReturnValue([]);
    });

    it('should display no tools message with query', () => {
      searchCommand('nonexistent');

      expect(
        consoleMock.contains('No tools found matching "nonexistent"')
      ).toBe(true);
    });

    it('should display no tools message without query', () => {
      searchCommand();

      expect(consoleMock.contains('No tools found in toolkit')).toBe(true);
    });

    it('should not show results section', () => {
      searchCommand('nonexistent');

      expect(consoleMock.contains('Found')).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle toolkit scanning errors', () => {
      mockToolkitScanner.searchTools.mockImplementation(() => {
        throw new Error('Failed to read toolkit');
      });

      searchCommand();

      expect(consoleMock.contains('Error scanning toolkit')).toBe(true);
      expect(consoleMock.contains('Failed to read toolkit')).toBe(true);
    });

    it('should complete without throwing', () => {
      expect(() => searchCommand('code review')).not.toThrow();
    });
  });
});

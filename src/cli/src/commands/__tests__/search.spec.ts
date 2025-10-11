import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { searchCommand } from '../search';

describe('searchCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('with query parameter', () => {
    it('should display search query', async () => {
      await searchCommand('code review');

      expect(consoleMock.contains('Searching for: "code review"')).toBe(true);
    });

    it('should show search icon', async () => {
      await searchCommand('testing');

      expect(consoleMock.contains('🔍')).toBe(true);
    });

    it('should display search results', async () => {
      await searchCommand('code');

      const output = consoleMock.getOutput();

      // Should show tools
      expect(output).toContain('prompt/code-review-ts');
      expect(output).toContain('agent/test-generator');
      expect(output).toContain('prompt/api-docs-generator');
    });
  });

  describe('without query parameter', () => {
    it('should show all available tools message', async () => {
      await searchCommand();

      expect(consoleMock.contains('Showing all available tools')).toBe(true);
    });

    it('should display all results', async () => {
      await searchCommand();

      const output = consoleMock.getOutput();

      expect(output).toContain('Found 3 tools');
      expect(output).toContain('prompt/code-review-ts');
    });
  });

  describe('output format', () => {
    it('should display tool name, description, and version', async () => {
      await searchCommand('test');

      const output = consoleMock.getOutput();

      // Tool name
      expect(output).toContain('agent/test-generator');

      // Description
      expect(output).toContain('Generate comprehensive test suites');

      // Version
      expect(output).toContain('Version: 1.0.0');
    });

    it('should show install tip at the end', async () => {
      await searchCommand();

      expect(consoleMock.contains('hitl install <tool>')).toBe(true);
      expect(consoleMock.contains('💡')).toBe(true);
    });

    it('should number the results', async () => {
      await searchCommand();

      const output = consoleMock.getOutput();

      expect(output).toMatch(/1\./);
      expect(output).toMatch(/2\./);
      expect(output).toMatch(/3\./);
    });
  });

  describe('search functionality', () => {
    it('should complete without errors', async () => {
      await expect(searchCommand('code review')).resolves.not.toThrow();
    });

    it('should handle empty search results gracefully', async () => {
      // Currently shows mock data, but test should not throw
      await expect(searchCommand('nonexistent')).resolves.not.toThrow();
    });
  });
});

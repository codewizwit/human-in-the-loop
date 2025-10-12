import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { statsCommand } from '../stats';

describe('statsCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('overall stats (no tool specified)', () => {
    it('should display overall stats header', async () => {
      await statsCommand({});

      expect(consoleMock.contains('📊 Overall Stats:')).toBe(true);
    });

    it('should show tools installed count', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output).toContain('Tools Installed:');
      expect(output).toContain('5');
    });

    it('should show total uses count', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output).toContain('Total Uses:');
      expect(output).toContain('127');
    });

    it('should show time saved', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output).toContain('Time Saved:');
      expect(output).toContain('~15 hours');
    });

    it('should display most used tools header', async () => {
      await statsCommand({});

      expect(consoleMock.contains('Most Used Tools:')).toBe(true);
    });

    it('should list top 3 most used tools', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();

      // First place
      expect(output).toContain('1.');
      expect(output).toContain('code-review-ts');
      expect(output).toContain('(45 uses)');

      // Second place
      expect(output).toContain('2.');
      expect(output).toContain('test-generator');
      expect(output).toContain('(38 uses)');

      // Third place
      expect(output).toContain('3.');
      expect(output).toContain('api-docs-generator');
      expect(output).toContain('(25 uses)');
    });
  });

  describe('specific tool stats (with tool option)', () => {
    it('should display tool-specific stats header', async () => {
      await statsCommand({ tool: 'code-review-ts' });

      expect(consoleMock.contains('📊 Stats for code-review-ts:')).toBe(true);
    });

    it('should show usage section', async () => {
      await statsCommand({ tool: 'test-generator' });

      expect(consoleMock.contains('Usage:')).toBe(true);
    });

    it('should show total uses for the tool', async () => {
      await statsCommand({ tool: 'my-tool' });

      expect(consoleMock.contains('Total uses: 45')).toBe(true);
    });

    it('should show last used time', async () => {
      await statsCommand({ tool: 'my-tool' });

      expect(consoleMock.contains('Last used: 2 hours ago')).toBe(true);
    });

    it('should show average rating', async () => {
      await statsCommand({ tool: 'my-tool' });

      expect(consoleMock.contains('Average rating: 4.8/5.0')).toBe(true);
    });

    it('should handle different tool names', async () => {
      await statsCommand({ tool: 'agent/test-generator' });

      expect(consoleMock.contains('Stats for agent/test-generator')).toBe(true);
    });
  });

  describe('execution flow', () => {
    it('should complete without errors for overall stats', async () => {
      await expect(statsCommand({})).resolves.not.toThrow();
    });

    it('should complete without errors for specific tool', async () => {
      await expect(
        statsCommand({ tool: 'code-review-ts' })
      ).resolves.not.toThrow();
    });
  });

  describe('output formatting', () => {
    it('should use proper spacing for overall stats', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();

      // Should have multiple lines for all stats
      expect(output.split('\n').length).toBeGreaterThan(6);
    });

    it('should use proper spacing for tool stats', async () => {
      await statsCommand({ tool: 'my-tool' });

      const output = consoleMock.getOutput();

      // Should have multiple lines
      expect(output.split('\n').length).toBeGreaterThan(4);
    });

    it('should highlight important information', async () => {
      await statsCommand({});

      // Stats icon should be present
      expect(consoleMock.contains('📊')).toBe(true);
    });
  });

  describe('conditional logic', () => {
    it('should not show overall stats when tool is specified', async () => {
      await statsCommand({ tool: 'code-review-ts' });

      expect(consoleMock.contains('Overall Stats:')).toBe(false);
      expect(consoleMock.contains('Most Used Tools:')).toBe(false);
    });

    it('should not show tool-specific stats when no tool is specified', async () => {
      await statsCommand({});

      expect(consoleMock.contains('Usage:')).toBe(false);
      expect(consoleMock.contains('Total uses:')).toBe(false);
    });

    it('should handle undefined options', async () => {
      await expect(statsCommand({})).resolves.not.toThrow();
    });
  });
});

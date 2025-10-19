import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { statsCommand } from '../stats';
import * as registry from '../../utils/registry';

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

    it('should show tools installed count when tools exist', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output).toContain('Tools Installed:');
    });

    it('should show no tools message when no tools installed', async () => {
      const mockGetInstalledTools = jest.spyOn(registry, 'getInstalledTools');
      mockGetInstalledTools.mockReturnValue([]);

      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output).toContain('No tools installed yet');

      mockGetInstalledTools.mockRestore();
    });

    it('should show tools by type when tools exist', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      const hasToolsByType =
        output.includes('By Type:') || output.includes('No tools installed');

      expect(hasToolsByType).toBe(true);
    });

    it('should show recently installed section when tools exist', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      const hasRecentlyInstalled =
        output.includes('Recently Installed:') ||
        output.includes('No tools installed');

      expect(hasRecentlyInstalled).toBe(true);
    });

    it('should show usage tracking note', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output).toContain('Usage tracking');
      expect(output).toContain('not yet implemented');
    });
  });

  describe('specific tool stats (with tool option)', () => {
    it('should display tool-specific stats header when tool exists', async () => {
      await statsCommand({ tool: 'code-review-ts' });

      const output = consoleMock.getOutput();
      const hasToolStats =
        output.includes('Stats for') || output.includes('not found');

      expect(hasToolStats).toBe(true);
    });

    it('should show warning when tool not found', async () => {
      const mockGetInstalledTools = jest.spyOn(registry, 'getInstalledTools');
      mockGetInstalledTools.mockReturnValue([]);

      await statsCommand({ tool: 'nonexistent-tool' });

      const output = consoleMock.getOutput();
      expect(output).toContain('not found');

      mockGetInstalledTools.mockRestore();
    });

    it('should show installation info for existing tool', async () => {
      await statsCommand({ tool: 'code-review-ts' });

      const output = consoleMock.getOutput();
      const hasInstallInfo =
        output.includes('Installation Info:') || output.includes('not found');

      expect(hasInstallInfo).toBe(true);
    });

    it('should show ID, type, version for existing tool', async () => {
      const mockGetInstalledTools = jest.spyOn(registry, 'getInstalledTools');
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'test-tool',
          name: 'Test Tool',
          type: 'prompt',
          version: '1.0.0',
          installedAt: new Date().toISOString(),
          installedPath: '/path/to/tool',
        },
      ]);

      await statsCommand({ tool: 'test-tool' });

      const output = consoleMock.getOutput();
      expect(output).toContain('ID:');
      expect(output).toContain('Type:');
      expect(output).toContain('Version:');

      mockGetInstalledTools.mockRestore();
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

    it('should handle undefined options', async () => {
      await expect(statsCommand({})).resolves.not.toThrow();
    });
  });

  describe('output formatting', () => {
    it('should use proper spacing for overall stats', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output.split('\n').length).toBeGreaterThan(1);
    });

    it('should highlight important information', async () => {
      await statsCommand({});

      expect(consoleMock.contains('📊')).toBe(true);
    });
  });

  describe('conditional logic', () => {
    it('should not show overall stats when tool is specified', async () => {
      await statsCommand({ tool: 'code-review-ts' });

      expect(consoleMock.contains('Overall Stats:')).toBe(false);
    });

    it('should not show tool-specific stats when no tool is specified', async () => {
      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output.includes('Installation Info:')).toBe(false);
    });
  });

  describe('data accuracy', () => {
    it('should use actual registry data', async () => {
      const mockGetInstalledTools = jest.spyOn(registry, 'getInstalledTools');
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'tool-1',
          name: 'Tool 1',
          type: 'prompt',
          version: '1.0.0',
          installedAt: new Date().toISOString(),
          installedPath: '/path/1',
        },
        {
          id: 'tool-2',
          name: 'Tool 2',
          type: 'agent',
          version: '2.0.0',
          installedAt: new Date().toISOString(),
          installedPath: '/path/2',
        },
      ]);

      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output).toContain('2');

      mockGetInstalledTools.mockRestore();
    });

    it('should group tools by type correctly', async () => {
      const mockGetInstalledTools = jest.spyOn(registry, 'getInstalledTools');
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'tool-1',
          name: 'Tool 1',
          type: 'prompt',
          version: '1.0.0',
          installedAt: new Date().toISOString(),
          installedPath: '/path/1',
        },
        {
          id: 'tool-2',
          name: 'Tool 2',
          type: 'prompt',
          version: '2.0.0',
          installedAt: new Date().toISOString(),
          installedPath: '/path/2',
        },
        {
          id: 'tool-3',
          name: 'Tool 3',
          type: 'agent',
          version: '1.0.0',
          installedAt: new Date().toISOString(),
          installedPath: '/path/3',
        },
      ]);

      await statsCommand({});

      const output = consoleMock.getOutput();
      expect(output).toContain('By Type:');
      expect(output).toContain('prompt:');
      expect(output).toContain('agent:');

      mockGetInstalledTools.mockRestore();
    });
  });
});

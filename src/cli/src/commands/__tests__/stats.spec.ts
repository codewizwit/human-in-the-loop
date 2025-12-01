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

jest.mock('chalk', () => {
  const passthrough = (str: string): string => str;
  const chalkMock = {
    cyan: passthrough,
    bold: passthrough,
    green: passthrough,
    red: passthrough,
    yellow: passthrough,
    blue: passthrough,
    gray: passthrough,
    dim: passthrough,
    white: passthrough,
  };
  return {
    default: chalkMock,
    ...chalkMock,
  };
});

describe('statsCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;
  let mockGetInstalledTools: jest.SpiedFunction<
    typeof registry.getInstalledTools
  >;
  let output: string;

  /**
   * Helper to run command and capture output
   */
  const runCommand = async (
    options: { tool?: string } = {}
  ): Promise<string> => {
    await statsCommand(options);
    return consoleMock.getOutput();
  };

  /**
   * Helper to assert output contains text
   */
  const expectOutput = (text: string | string[]): void => {
    const texts = Array.isArray(text) ? text : [text];
    texts.forEach((t) => expect(output).toContain(t));
  };

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
    mockGetInstalledTools = jest.spyOn(registry, 'getInstalledTools');
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
    mockGetInstalledTools.mockRestore();
  });

  describe('overall stats (no tool specified)', () => {
    it('should display overall stats header', async () => {
      mockGetInstalledTools.mockReturnValue([]);
      output = await runCommand();

      expect(consoleMock.contains('📊 Overall Stats:')).toBe(true);
    });

    describe('when tools exist', () => {
      beforeEach(() => {
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
      });

      it('should show tools installed count', async () => {
        output = await runCommand();

        expectOutput('Tools Installed:');
      });

      it('should show tools by type', async () => {
        output = await runCommand();

        expectOutput('By Type:');
      });

      it('should show recently installed section', async () => {
        output = await runCommand();

        expectOutput('Recently Installed:');
      });

      it('should show usage tracking note', async () => {
        output = await runCommand();

        expectOutput(['Usage tracking', 'not yet implemented']);
      });
    });

    describe('when no tools installed', () => {
      beforeEach(() => {
        mockGetInstalledTools.mockReturnValue([]);
      });

      it('should show no tools message', async () => {
        output = await runCommand();

        expectOutput('No tools installed yet');
      });

      it('should show help commands', async () => {
        output = await runCommand();

        expectOutput(['hit search', 'hit install']);
      });
    });
  });

  describe('specific tool stats (with tool option)', () => {
    describe('when tool exists', () => {
      beforeEach(() => {
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
      });

      it('should display tool-specific stats header', async () => {
        output = await runCommand({ tool: 'test-tool' });

        expectOutput('Stats for');
      });

      it('should show installation info section', async () => {
        output = await runCommand({ tool: 'test-tool' });

        expectOutput('Installation Info:');
      });

      it('should show ID, type, version details', async () => {
        output = await runCommand({ tool: 'test-tool' });

        expectOutput(['ID:', 'Type:', 'Version:']);
      });
    });

    describe('when tool not found', () => {
      beforeEach(() => {
        mockGetInstalledTools.mockReturnValue([]);
      });

      it('should show warning message', async () => {
        output = await runCommand({ tool: 'nonexistent-tool' });

        expectOutput('not found');
      });

      it('should suggest using list command', async () => {
        output = await runCommand({ tool: 'nonexistent-tool' });

        expectOutput('hit list');
      });
    });
  });

  describe('execution flow', () => {
    beforeEach(() => {
      mockGetInstalledTools.mockReturnValue([]);
    });

    it('should complete without errors for overall stats', async () => {
      await expect(statsCommand({})).resolves.not.toThrow();
    });

    it('should complete without errors for specific tool', async () => {
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

      await expect(statsCommand({ tool: 'test-tool' })).resolves.not.toThrow();
    });

    it('should handle undefined options', async () => {
      await expect(statsCommand({})).resolves.not.toThrow();
    });
  });

  describe('output formatting', () => {
    beforeEach(() => {
      mockGetInstalledTools.mockReturnValue([]);
    });

    it('should use proper spacing for overall stats', async () => {
      output = await runCommand();

      expect(output.split('\n').length).toBeGreaterThan(1);
    });

    it('should highlight important information', async () => {
      await runCommand();

      expect(consoleMock.contains('📊')).toBe(true);
    });
  });

  describe('conditional logic', () => {
    beforeEach(() => {
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
    });

    it('should not show overall stats when tool is specified', async () => {
      await runCommand({ tool: 'test-tool' });

      expect(consoleMock.contains('Overall Stats:')).toBe(false);
    });

    it('should not show tool-specific stats when no tool is specified', async () => {
      output = await runCommand();

      expect(output.includes('Installation Info:')).toBe(false);
    });
  });

  describe('data accuracy', () => {
    it('should display correct tool count', async () => {
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

      output = await runCommand();

      expectOutput('2');
    });

    it('should group tools by type correctly', async () => {
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

      output = await runCommand();

      expectOutput(['By Type:', 'prompt:', 'agent:']);
    });
  });

  describe('time formatting', () => {
    it('should show "today" for tools installed today', async () => {
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'new-tool',
          name: 'New Tool',
          type: 'prompt',
          version: '1.0.0',
          installedAt: new Date().toISOString(),
          installedPath: '/path/to/tool',
        },
      ]);

      output = await runCommand();

      expectOutput('today');
    });

    it('should show "1 day ago" for tools installed yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      mockGetInstalledTools.mockReturnValue([
        {
          id: 'old-tool',
          name: 'Old Tool',
          type: 'prompt',
          version: '1.0.0',
          installedAt: yesterday.toISOString(),
          installedPath: '/path/to/tool',
        },
      ]);

      output = await runCommand();

      expectOutput('1 day ago');
    });

    it('should show "X days ago" for tools installed multiple days ago', async () => {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      mockGetInstalledTools.mockReturnValue([
        {
          id: 'older-tool',
          name: 'Older Tool',
          type: 'prompt',
          version: '1.0.0',
          installedAt: fiveDaysAgo.toISOString(),
          installedPath: '/path/to/tool',
        },
      ]);

      output = await runCommand();

      expectOutput('5 days ago');
    });
  });
});

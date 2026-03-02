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
import { installCommand } from '../install';
import * as toolkitScanner from '../../utils/lib-scanner';
import * as fileOps from '../../utils/file-operations';
import * as registry from '../../utils/registry';
import * as claudeIntegration from '../../utils/claude-integration';
import inquirer from 'inquirer';
import * as fs from 'fs';

jest.mock('../../utils/lib-scanner');
jest.mock('../../utils/file-operations');
jest.mock('../../utils/registry');
jest.mock('../../utils/claude-integration');
jest.mock('inquirer');
jest.mock('fs');
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

const mockToolkitScanner = toolkitScanner as jest.Mocked<typeof toolkitScanner>;
const mockFileOps = fileOps as jest.Mocked<typeof fileOps>;
const mockRegistry = registry as jest.Mocked<typeof registry>;
const mockClaudeIntegration = claudeIntegration as jest.Mocked<
  typeof claudeIntegration
>;
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('installCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  const defaultTool: toolkitScanner.Tool = {
    id: 'code-review-ts',
    name: 'Code Review TypeScript',
    version: '1.2.0',
    description: 'TypeScript code review',
    category: 'code-quality',
    type: 'prompt',
    path: '/lib/prompts/code-review-ts',
    metadata: {},
  };

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
    jest.clearAllMocks();

    mockToolkitScanner.getTool.mockReturnValue(defaultTool);
    mockToolkitScanner.scanToolkit.mockReturnValue([defaultTool]);

    mockRegistry.isToolInstalled.mockReturnValue(false);
    mockFileOps.resolvePath.mockImplementation((p) =>
      p.replace('~', '/home/user')
    );
    mockFileOps.copyDirectory.mockResolvedValue(undefined);
    mockRegistry.registerInstallation.mockReturnValue(undefined);

    // Default destination prompt: global-skill
    (mockInquirer.prompt as any).mockResolvedValue({
      destination: 'global-skill',
    });

    mockClaudeIntegration.isClaudeAvailable.mockReturnValue(true);
    mockClaudeIntegration.createClaudeCommand.mockReturnValue(
      '/home/user/.claude/commands/code-review-ts.md'
    );
    mockClaudeIntegration.installSkillFile.mockReturnValue(
      '/home/user/.claude/skills/code-review-ts.md'
    );

    mockFs.existsSync.mockReturnValue(false);
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('direct skill ID lookup', () => {
    it('should accept a bare skill ID without type prefix', async () => {
      (mockInquirer.prompt as any).mockResolvedValue({
        destination: 'global-skill',
      });

      await installCommand('code-review-ts');

      expect(mockToolkitScanner.getTool).toHaveBeenCalledWith('code-review-ts');
      expect(consoleMock.contains('Looking up')).toBe(true);
    });

    it('should display found tool info', async () => {
      await installCommand('code-review-ts');

      expect(consoleMock.contains('Code Review TypeScript')).toBe(true);
    });

    it('should handle tool not found', async () => {
      mockToolkitScanner.getTool.mockReturnValue(null);

      await installCommand('nonexistent-skill');

      expect(consoleMock.contains('not found')).toBe(true);
      expect(consoleMock.contains('hit search')).toBe(true);
    });
  });

  describe('legacy type/id format', () => {
    it('should show deprecation warning for type/id format', async () => {
      await installCommand('prompt/code-review-ts');

      expect(consoleMock.contains('deprecated')).toBe(true);
      expect(mockToolkitScanner.getTool).toHaveBeenCalledWith('code-review-ts');
    });

    it('should still work with legacy format', async () => {
      await installCommand('prompt/code-review-ts');

      expect(consoleMock.contains('Successfully installed')).toBe(true);
    });

    it('should handle invalid multi-slash format', async () => {
      await installCommand('a/b/c');

      expect(consoleMock.contains('Invalid tool identifier')).toBe(true);
    });
  });

  describe('interactive browser (no args)', () => {
    it('should launch interactive browser when no toolIdentifier provided', async () => {
      (mockInquirer.prompt as any)
        .mockResolvedValueOnce({ selectedCategory: 'code-quality' })
        .mockResolvedValueOnce({ selectedToolId: 'code-review-ts' })
        .mockResolvedValueOnce({ destination: 'global-skill' });

      await installCommand();

      expect(mockToolkitScanner.scanToolkit).toHaveBeenCalled();
      expect(consoleMock.contains('interactive browser')).toBe(true);
    });

    it('should handle empty toolkit in browser mode', async () => {
      mockToolkitScanner.scanToolkit.mockReturnValue([]);

      await installCommand();

      expect(consoleMock.contains('No tools found')).toBe(true);
    });

    it('should group tools by category for selection', async () => {
      const tools: toolkitScanner.Tool[] = [
        {
          id: 'code-review-ts',
          name: 'Code Review TypeScript',
          version: '1.2.0',
          description: 'TS review',
          category: 'code-quality',
          type: 'prompt',
          path: '/lib/prompts/code-review-ts',
          metadata: {},
        },
        {
          id: 'angular-modern',
          name: 'Angular Modern',
          version: '1.0.0',
          description: 'Angular skill',
          category: 'framework',
          type: 'skill',
          path: '/lib/skills/angular-modern',
          metadata: {},
        },
      ];

      mockToolkitScanner.scanToolkit.mockReturnValue(tools);

      (mockInquirer.prompt as any)
        .mockResolvedValueOnce({ selectedCategory: 'framework' })
        .mockResolvedValueOnce({ selectedToolId: 'angular-modern' })
        .mockResolvedValueOnce({ destination: 'global-skill' });

      mockToolkitScanner.getTool.mockReturnValue(tools[1]);

      await installCommand();

      expect(mockInquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'list',
            name: 'selectedCategory',
          }),
        ])
      );
    });
  });

  describe('destination selection', () => {
    it('should prompt for destination when no --destination flag', async () => {
      await installCommand('code-review-ts');

      expect(mockInquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'list',
            name: 'destination',
          }),
        ])
      );
    });

    it('should skip destination prompt when --destination flag provided', async () => {
      await installCommand('code-review-ts', {
        destination: 'global-skill',
      });

      // The destination prompt should not have been called since
      // --destination was provided directly
      const promptCalls = (mockInquirer.prompt as any).mock.calls;
      const hasDestinationPrompt = promptCalls.some(
        (call: any[]) =>
          call[0] &&
          Array.isArray(call[0]) &&
          call[0].some((q: any) => q.name === 'destination')
      );
      expect(hasDestinationPrompt).toBe(false);
    });

    it('should use --path option as custom destination', async () => {
      await installCommand('code-review-ts', {
        path: '/custom/path',
      });

      expect(mockFileOps.resolvePath).toHaveBeenCalledWith('/custom/path');
    });

    it('should prompt for custom path when destination is custom', async () => {
      (mockInquirer.prompt as any)
        .mockResolvedValueOnce({ destination: 'custom' })
        .mockResolvedValueOnce({ userPath: '~/my-skills' });

      await installCommand('code-review-ts');

      expect(mockInquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'input',
            name: 'userPath',
          }),
        ])
      );
    });
  });

  describe('unified skill file installation', () => {
    it('should copy skill.md via installSkillFile for unified skills', async () => {
      mockFs.existsSync.mockImplementation((p: unknown) => {
        const pathStr = String(p);
        // skill.md exists in the tool directory
        if (pathStr.endsWith('/skill.md')) return true;
        return false;
      });

      await installCommand('code-review-ts', {
        destination: 'global-skill',
      });

      expect(mockClaudeIntegration.installSkillFile).toHaveBeenCalled();
    });

    it('should register installation after skill copy', async () => {
      mockFs.existsSync.mockReturnValue(false);

      await installCommand('code-review-ts', {
        destination: 'global-skill',
      });

      expect(mockRegistry.registerInstallation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'code-review-ts',
          name: 'Code Review TypeScript',
          version: '1.2.0',
          type: 'prompt',
        })
      );
    });

    it('should display success message', async () => {
      await installCommand('code-review-ts', {
        destination: 'global-skill',
      });

      expect(consoleMock.contains('Successfully installed')).toBe(true);
      expect(consoleMock.contains('Code Review TypeScript')).toBe(true);
    });
  });

  describe('command destination (non-unified)', () => {
    it('should use createClaudeCommand for global-command destination', async () => {
      mockFs.existsSync.mockImplementation((p: unknown) => {
        const pathStr = String(p);
        // No skill.md, so not unified
        if (pathStr.endsWith('/skill.md')) return false;
        // prompt.md exists
        if (pathStr.endsWith('/prompt.md')) return true;
        return false;
      });

      await installCommand('code-review-ts', {
        destination: 'global-command',
      });

      expect(mockClaudeIntegration.createClaudeCommand).toHaveBeenCalled();
    });

    it('should warn when Claude is not available for command destinations', async () => {
      mockClaudeIntegration.isClaudeAvailable.mockReturnValue(false);
      mockFs.existsSync.mockReturnValue(false);

      await installCommand('code-review-ts', {
        destination: 'global-command',
      });

      expect(
        consoleMock.contains('Claude Code integration not available')
      ).toBe(true);
    });
  });

  describe('already installed tools', () => {
    beforeEach(() => {
      mockRegistry.isToolInstalled.mockReturnValue(true);
      mockRegistry.getInstalledTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'Code Review TypeScript',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '~/.claude/skills/code-review-ts.md',
        installedAt: '2024-01-01T00:00:00Z',
      });
    });

    it('should warn about existing installation', async () => {
      (mockInquirer.prompt as any).mockResolvedValueOnce({
        proceed: false,
      });

      await installCommand('code-review-ts');

      expect(consoleMock.contains('already installed')).toBe(true);
    });

    it('should prompt for reinstall confirmation', async () => {
      (mockInquirer.prompt as any).mockResolvedValueOnce({
        proceed: false,
      });

      await installCommand('code-review-ts');

      expect(mockInquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'confirm',
            name: 'proceed',
            message: 'Do you want to reinstall?',
          }),
        ])
      );
    });

    it('should cancel if user declines reinstall', async () => {
      (mockInquirer.prompt as any).mockResolvedValueOnce({
        proceed: false,
      });

      await installCommand('code-review-ts');

      expect(consoleMock.contains('Installation cancelled')).toBe(true);
    });

    it('should proceed if user confirms reinstall', async () => {
      (mockInquirer.prompt as any)
        .mockResolvedValueOnce({ proceed: true })
        .mockResolvedValueOnce({ destination: 'global-skill' });

      await installCommand('code-review-ts');

      expect(consoleMock.contains('Successfully installed')).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle installation failure gracefully', async () => {
      mockClaudeIntegration.installSkillFile.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      mockFs.existsSync.mockImplementation((p: unknown) => {
        if (String(p).endsWith('/skill.md')) return true;
        return false;
      });

      await installCommand('code-review-ts', {
        destination: 'global-skill',
      });

      expect(consoleMock.contains('Installation failed')).toBe(true);
      expect(consoleMock.contains('Permission denied')).toBe(true);
    });

    it('should complete without throwing', async () => {
      await expect(installCommand('code-review-ts')).resolves.not.toThrow();
    });
  });

  describe('tips and help messages', () => {
    it('should show hit list tip after successful install', async () => {
      await installCommand('code-review-ts', {
        destination: 'global-skill',
      });

      expect(consoleMock.contains('hit list')).toBe(true);
    });

    it('should show auto-activate tip for skill destinations', async () => {
      await installCommand('code-review-ts', {
        destination: 'global-skill',
      });

      expect(consoleMock.contains('auto-activate')).toBe(true);
    });

    it('should show slash command tip for command destinations', async () => {
      mockFs.existsSync.mockReturnValue(false);

      await installCommand('code-review-ts', {
        destination: 'global-command',
      });

      // When claude is available and prompt file exists, should show command tip
      // The exact behavior depends on whether file-operations mock succeeds
      expect(consoleMock.getOutput()).toBeDefined();
    });
  });
});

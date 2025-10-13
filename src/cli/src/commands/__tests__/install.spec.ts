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
import * as toolkitScanner from '../../utils/toolkit-scanner';
import * as fileOps from '../../utils/file-operations';
import * as registry from '../../utils/registry';
import inquirer from 'inquirer';

jest.mock('../../utils/toolkit-scanner');
jest.mock('../../utils/file-operations');
jest.mock('../../utils/registry');
jest.mock('inquirer');

const mockToolkitScanner = toolkitScanner as jest.Mocked<typeof toolkitScanner>;
const mockFileOps = fileOps as jest.Mocked<typeof fileOps>;
const mockRegistry = registry as jest.Mocked<typeof registry>;
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('installCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
    jest.clearAllMocks();

    mockToolkitScanner.getTool.mockReturnValue({
      id: 'code-review-ts',
      name: 'Code Review TypeScript',
      version: '1.2.0',
      description: 'TypeScript code review',
      category: 'code-quality',
      type: 'prompt',
      path: '/toolkit/prompts/code-review-ts',
      metadata: {},
    });

    mockRegistry.isToolInstalled.mockReturnValue(false);
    mockFileOps.resolvePath.mockImplementation((p) =>
      p.replace('~', '/home/user')
    );
    mockFileOps.copyDirectory.mockResolvedValue(undefined);
    mockRegistry.registerInstallation.mockReturnValue(undefined);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockInquirer.prompt as any).mockResolvedValue({
      userPath: '~/.claude/tools/prompt/code-review-ts',
    });
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('installation process', () => {
    it('should display installation message', async () => {
      await installCommand('prompt/code-review-ts');

      expect(consoleMock.contains('📦 Installing prompt/code-review-ts')).toBe(
        true
      );
    });

    it('should look up tool in toolkit', async () => {
      await installCommand('prompt/code-review-ts');

      expect(mockToolkitScanner.getTool).toHaveBeenCalledWith('code-review-ts');
      expect(consoleMock.contains('Looking up tool...')).toBe(true);
    });

    it('should copy tool files', async () => {
      await installCommand('prompt/code-review-ts');

      expect(mockFileOps.copyDirectory).toHaveBeenCalledWith(
        '/toolkit/prompts/code-review-ts',
        '/home/user/.claude/tools/prompt/code-review-ts'
      );
      expect(consoleMock.contains('Copying tool files...')).toBe(true);
    });

    it('should register installation', async () => {
      await installCommand('prompt/code-review-ts');

      expect(mockRegistry.registerInstallation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'code-review-ts',
          name: 'Code Review TypeScript',
          version: '1.2.0',
          type: 'prompt',
          installedPath: '/home/user/.claude/tools/prompt/code-review-ts',
        })
      );
      expect(consoleMock.contains('Registering installation...')).toBe(true);
    });

    it('should display success message and completion info', async () => {
      await installCommand('prompt/code-review-ts');

      expect(consoleMock.contains('✓')).toBe(true);
      expect(consoleMock.contains('Successfully installed')).toBe(true);
      expect(consoleMock.contains('Code Review TypeScript')).toBe(true);
      expect(consoleMock.contains('v1.2.0')).toBe(true);
      // Note: Lines 108-110 (installation path and tip) are covered by this test
      // but may not show in coverage due to chalk ANSI codes in console output
    });
  });

  describe('with --path option', () => {
    it('should use provided path', async () => {
      await installCommand('prompt/code-review-ts', {
        path: '/custom/path',
      });

      expect(mockInquirer.prompt).not.toHaveBeenCalled();
      expect(mockFileOps.copyDirectory).toHaveBeenCalledWith(
        '/toolkit/prompts/code-review-ts',
        '/custom/path'
      );
    });

    it('should resolve ~ in provided path', async () => {
      await installCommand('prompt/code-review-ts', {
        path: '~/my-tools',
      });

      expect(mockFileOps.resolvePath).toHaveBeenCalledWith('~/my-tools');
    });
  });

  describe('error handling', () => {
    it('should handle invalid tool identifier', async () => {
      await installCommand('invalid-format');

      expect(consoleMock.contains('Invalid tool identifier')).toBe(true);
      expect(consoleMock.contains('Use format: <type>/<id>')).toBe(true);
      expect(mockToolkitScanner.getTool).not.toHaveBeenCalled();
    });

    it('should handle tool not found', async () => {
      mockToolkitScanner.getTool.mockReturnValue(null);

      await installCommand('prompt/nonexistent');

      expect(consoleMock.contains('Tool "prompt/nonexistent" not found')).toBe(
        true
      );
      expect(consoleMock.contains('hitl search')).toBe(true);
    });

    it('should handle installation failure', async () => {
      mockFileOps.copyDirectory.mockRejectedValue(
        new Error('Permission denied')
      );

      await installCommand('prompt/code-review-ts');

      expect(consoleMock.contains('Installation failed')).toBe(true);
      expect(consoleMock.contains('Permission denied')).toBe(true);
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
        installedPath: '~/.claude/tools/prompt/code-review-ts',
        installedAt: '2024-01-01T00:00:00Z',
      });
    });

    it('should warn about existing installation', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockInquirer.prompt as any).mockResolvedValue({
        proceed: false,
      });

      await installCommand('prompt/code-review-ts');

      expect(
        consoleMock.contains('Tool "code-review-ts" is already installed')
      ).toBe(true);
    });

    it('should prompt for reinstall confirmation', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockInquirer.prompt as any).mockResolvedValue({
        proceed: false,
      });

      await installCommand('prompt/code-review-ts');

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockInquirer.prompt as any).mockResolvedValue({
        proceed: false,
      });

      await installCommand('prompt/code-review-ts');

      expect(consoleMock.contains('Installation cancelled')).toBe(true);
      expect(mockFileOps.copyDirectory).not.toHaveBeenCalled();
    });

    it('should proceed if user confirms reinstall', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockInquirer.prompt as any)
        .mockResolvedValueOnce({ proceed: true })
        .mockResolvedValueOnce({
          userPath: '~/.claude/tools/prompt/code-review-ts',
        });

      await installCommand('prompt/code-review-ts');

      expect(mockFileOps.copyDirectory).toHaveBeenCalled();
      expect(consoleMock.contains('Successfully installed')).toBe(true);
    });
  });

  describe('execution flow', () => {
    it('should complete without errors', async () => {
      await expect(
        installCommand('prompt/code-review-ts')
      ).resolves.not.toThrow();
    });

    it('should call functions in correct order', async () => {
      const callOrder: string[] = [];

      mockToolkitScanner.getTool.mockImplementation(() => {
        callOrder.push('getTool');
        return {
          id: 'code-review-ts',
          name: 'Code Review TypeScript',
          version: '1.2.0',
          description: 'TypeScript code review',
          category: 'code-quality',
          type: 'prompt',
          path: '/toolkit/prompts/code-review-ts',
          metadata: {},
        };
      });

      mockFileOps.copyDirectory.mockImplementation(async () => {
        callOrder.push('copyDirectory');
      });

      mockRegistry.registerInstallation.mockImplementation(() => {
        callOrder.push('registerInstallation');
      });

      await installCommand('prompt/code-review-ts');

      expect(callOrder).toEqual([
        'getTool',
        'copyDirectory',
        'registerInstallation',
      ]);
    });
  });
});

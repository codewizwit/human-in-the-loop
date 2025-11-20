import { updateCommand, checkForUpdates } from '../update';
import * as libScanner from '../../utils/lib-scanner';
import * as registry from '../../utils/registry';
import * as fileOps from '../../utils/file-operations';
import * as fs from 'fs';
import inquirer from 'inquirer';

jest.mock('../../utils/lib-scanner');
jest.mock('../../utils/registry');
jest.mock('../../utils/file-operations');
jest.mock('fs');
jest.mock('inquirer');

const mockGetTool = libScanner.getTool as jest.MockedFunction<
  typeof libScanner.getTool
>;
const mockGetInstalledTool = registry.getInstalledTool as jest.MockedFunction<
  typeof registry.getInstalledTool
>;
const mockGetInstalledTools = registry.getInstalledTools as jest.MockedFunction<
  typeof registry.getInstalledTools
>;
const mockRegisterInstallation =
  registry.registerInstallation as jest.MockedFunction<
    typeof registry.registerInstallation
  >;
const mockCopyDirectory = fileOps.copyDirectory as jest.MockedFunction<
  typeof fileOps.copyDirectory
>;
const mockExistsSync = fs.existsSync as jest.MockedFunction<
  typeof fs.existsSync
>;
const mockRenameSync = fs.renameSync as jest.MockedFunction<
  typeof fs.renameSync
>;

describe('update command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('checkForUpdates', () => {
    it('should find updates for tools with newer versions', async () => {
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'code-review-ts',
          name: 'TypeScript Code Review',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/path/to/tool',
          installedAt: '2024-01-01T00:00:00.000Z',
        },
      ]);

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      const updates = await checkForUpdates();

      expect(updates).toHaveLength(1);
      expect(updates[0]).toEqual({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        currentVersion: '1.0.0',
        latestVersion: '1.2.0',
        installedPath: '/path/to/tool',
      });
    });

    it('should return empty array when no updates available', async () => {
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'code-review-ts',
          name: 'TypeScript Code Review',
          version: '1.2.0',
          type: 'prompt',
          installedPath: '/path/to/tool',
          installedAt: '2024-01-01T00:00:00.000Z',
        },
      ]);

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      const updates = await checkForUpdates();

      expect(updates).toHaveLength(0);
    });

    it('should check specific tool when toolId provided', async () => {
      mockGetInstalledTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '/path/to/tool',
        installedAt: '2024-01-01T00:00:00.000Z',
      });

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.1.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      const updates = await checkForUpdates('code-review-ts');

      expect(updates).toHaveLength(1);
      expect(mockGetInstalledTool).toHaveBeenCalledWith('code-review-ts');
    });
  });

  describe('updateCommand', () => {
    it('should show error when no tool identifier provided and not using --all', async () => {
      await updateCommand();

      expect(console.log).toHaveBeenCalled();
    });

    it('should show error for invalid tool identifier format', async () => {
      await updateCommand('invalid-format');

      expect(console.log).toHaveBeenCalled();
    });

    it('should show error when tool is not installed', async () => {
      mockGetInstalledTool.mockReturnValue(null);

      await updateCommand('prompt/code-review-ts');

      expect(mockGetInstalledTool).toHaveBeenCalledWith('code-review-ts');
      expect(console.log).toHaveBeenCalled();
    });

    it('should show error when tool not found in toolkit', async () => {
      mockGetInstalledTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '/path/to/tool',
        installedAt: '2024-01-01T00:00:00.000Z',
      });

      mockGetTool.mockReturnValue(null);

      await updateCommand('prompt/code-review-ts');

      expect(console.log).toHaveBeenCalled();
    });

    it('should skip update when already up to date without force flag', async () => {
      mockGetInstalledTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        type: 'prompt',
        installedPath: '/path/to/tool',
        installedAt: '2024-01-01T00:00:00.000Z',
      });

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      await updateCommand('prompt/code-review-ts');

      expect(mockCopyDirectory).not.toHaveBeenCalled();
    });

    it('should perform update when newer version available', async () => {
      mockGetInstalledTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '/path/to/tool',
        installedAt: '2024-01-01T00:00:00.000Z',
      });

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      mockExistsSync.mockReturnValue(true);
      mockCopyDirectory.mockResolvedValue();

      await updateCommand('prompt/code-review-ts');

      expect(mockRenameSync).toHaveBeenCalled();
      expect(mockCopyDirectory).toHaveBeenCalledWith(
        '/lib/path',
        '/path/to/tool'
      );
      expect(mockRegisterInstallation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'code-review-ts',
          version: '1.2.0',
        })
      );
    });

    it('should skip backup when --no-backup flag is set', async () => {
      mockGetInstalledTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '/path/to/tool',
        installedAt: '2024-01-01T00:00:00.000Z',
      });

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      mockExistsSync.mockReturnValue(true);
      mockCopyDirectory.mockResolvedValue();

      await updateCommand('prompt/code-review-ts', { noBackup: true });

      expect(mockRenameSync).not.toHaveBeenCalled();
      expect(mockCopyDirectory).toHaveBeenCalled();
    });

    it('should check for updates with --check flag', async () => {
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'code-review-ts',
          name: 'TypeScript Code Review',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/path/to/tool',
          installedAt: '2024-01-01T00:00:00.000Z',
        },
      ]);

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      await updateCommand(undefined, { check: true });

      expect(mockCopyDirectory).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });

    it('should update all tools with --all flag after confirmation', async () => {
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'code-review-ts',
          name: 'TypeScript Code Review',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/path/to/tool',
          installedAt: '2024-01-01T00:00:00.000Z',
        },
      ]);

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({
        proceed: true,
      });
      mockExistsSync.mockReturnValue(true);
      mockCopyDirectory.mockResolvedValue();

      await updateCommand(undefined, { all: true });

      expect(inquirer.prompt).toHaveBeenCalled();
      expect(mockCopyDirectory).toHaveBeenCalled();
    });

    it('should cancel update when user declines confirmation', async () => {
      mockGetInstalledTools.mockReturnValue([
        {
          id: 'code-review-ts',
          name: 'TypeScript Code Review',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/path/to/tool',
          installedAt: '2024-01-01T00:00:00.000Z',
        },
      ]);

      mockGetTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'TypeScript Code Review',
        version: '1.2.0',
        description: 'A tool',
        category: 'code-review',
        type: 'prompt',
        path: '/lib/path',
      });

      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({
        proceed: false,
      });

      await updateCommand(undefined, { all: true });

      expect(mockCopyDirectory).not.toHaveBeenCalled();
    });
  });
});

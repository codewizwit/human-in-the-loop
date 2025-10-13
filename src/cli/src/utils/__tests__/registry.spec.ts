import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  getRegistryPath,
  loadRegistry,
  saveRegistry,
  registerInstallation,
  unregisterInstallation,
  getInstalledTools,
  isToolInstalled,
  getInstalledTool,
  InstalledTool,
  Registry,
} from '../registry';
import * as fileOps from '../file-operations';

// Mock file-operations module
jest.mock('../file-operations');

const mockFileOps = fileOps as jest.Mocked<typeof fileOps>;

describe('registry', () => {
  const mockHomeDir = '/home/user';
  const mockRegistryPath = '/home/user/.hitl/registry.json';

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileOps.getHomeDirectory.mockReturnValue(mockHomeDir);
  });

  describe('getRegistryPath', () => {
    it('should return registry path in home directory', () => {
      const path = getRegistryPath();

      expect(path).toBe(mockRegistryPath);
      expect(mockFileOps.getHomeDirectory).toHaveBeenCalled();
    });
  });

  describe('loadRegistry', () => {
    it('should load existing registry', () => {
      const existingRegistry: Registry = {
        version: '1.0.0',
        installations: [
          {
            id: 'tool1',
            name: 'Tool 1',
            version: '1.0.0',
            type: 'prompt',
            installedPath: '/path/to/tool1',
            installedAt: '2024-01-01T00:00:00Z',
          },
        ],
      };

      mockFileOps.readJsonFile.mockReturnValue(existingRegistry);

      const registry = loadRegistry();

      expect(registry).toEqual(existingRegistry);
      expect(mockFileOps.readJsonFile).toHaveBeenCalledWith(mockRegistryPath);
    });

    it('should return empty registry if file does not exist', () => {
      mockFileOps.readJsonFile.mockReturnValue(null);

      const registry = loadRegistry();

      expect(registry).toEqual({
        version: '1.0.0',
        installations: [],
      });
    });

    it('should handle corrupted registry file', () => {
      mockFileOps.readJsonFile.mockReturnValue(null);

      const registry = loadRegistry();

      expect(registry.installations).toEqual([]);
    });
  });

  describe('saveRegistry', () => {
    it('should save registry to file', () => {
      const registry: Registry = {
        version: '1.0.0',
        installations: [],
      };

      saveRegistry(registry);

      expect(mockFileOps.ensureDirectory).toHaveBeenCalledWith(
        '/home/user/.hitl'
      );
      expect(mockFileOps.writeJsonFile).toHaveBeenCalledWith(
        mockRegistryPath,
        registry
      );
    });

    it('should create directory before saving', () => {
      const registry: Registry = {
        version: '1.0.0',
        installations: [],
      };

      saveRegistry(registry);

      expect(mockFileOps.ensureDirectory).toHaveBeenCalled();
    });
  });

  describe('registerInstallation', () => {
    it('should add new installation to registry', () => {
      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: [],
      });

      const tool: InstalledTool = {
        id: 'new-tool',
        name: 'New Tool',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '/path/to/tool',
        installedAt: '2024-01-01T00:00:00Z',
      };

      registerInstallation(tool);

      expect(mockFileOps.writeJsonFile).toHaveBeenCalledWith(
        mockRegistryPath,
        expect.objectContaining({
          installations: [tool],
        })
      );
    });

    it('should replace existing installation with same id', () => {
      const existingTool: InstalledTool = {
        id: 'tool1',
        name: 'Tool 1',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '/old/path',
        installedAt: '2024-01-01T00:00:00Z',
      };

      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: [existingTool],
      });

      const updatedTool: InstalledTool = {
        id: 'tool1',
        name: 'Tool 1',
        version: '2.0.0',
        type: 'prompt',
        installedPath: '/new/path',
        installedAt: '2024-02-01T00:00:00Z',
      };

      registerInstallation(updatedTool);

      expect(mockFileOps.writeJsonFile).toHaveBeenCalledWith(
        mockRegistryPath,
        expect.objectContaining({
          installations: [updatedTool],
        })
      );
    });

    it('should preserve other installations when updating', () => {
      const tool1: InstalledTool = {
        id: 'tool1',
        name: 'Tool 1',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '/path/to/tool1',
        installedAt: '2024-01-01T00:00:00Z',
      };

      const tool2: InstalledTool = {
        id: 'tool2',
        name: 'Tool 2',
        version: '1.0.0',
        type: 'agent',
        installedPath: '/path/to/tool2',
        installedAt: '2024-01-02T00:00:00Z',
      };

      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: [tool1],
      });

      registerInstallation(tool2);

      expect(mockFileOps.writeJsonFile).toHaveBeenCalledWith(
        mockRegistryPath,
        expect.objectContaining({
          installations: expect.arrayContaining([tool1, tool2]),
        })
      );
    });
  });

  describe('unregisterInstallation', () => {
    it('should remove installation from registry', () => {
      const tool1: InstalledTool = {
        id: 'tool1',
        name: 'Tool 1',
        version: '1.0.0',
        type: 'prompt',
        installedPath: '/path/to/tool1',
        installedAt: '2024-01-01T00:00:00Z',
      };

      const tool2: InstalledTool = {
        id: 'tool2',
        name: 'Tool 2',
        version: '1.0.0',
        type: 'agent',
        installedPath: '/path/to/tool2',
        installedAt: '2024-01-02T00:00:00Z',
      };

      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: [tool1, tool2],
      });

      unregisterInstallation('tool1');

      expect(mockFileOps.writeJsonFile).toHaveBeenCalledWith(
        mockRegistryPath,
        expect.objectContaining({
          installations: [tool2],
        })
      );
    });

    it('should handle removing non-existent tool', () => {
      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: [],
      });

      unregisterInstallation('nonexistent');

      expect(mockFileOps.writeJsonFile).toHaveBeenCalledWith(
        mockRegistryPath,
        expect.objectContaining({
          installations: [],
        })
      );
    });
  });

  describe('getInstalledTools', () => {
    it('should return all installed tools', () => {
      const tools: InstalledTool[] = [
        {
          id: 'tool1',
          name: 'Tool 1',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/path/to/tool1',
          installedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'tool2',
          name: 'Tool 2',
          version: '1.0.0',
          type: 'agent',
          installedPath: '/path/to/tool2',
          installedAt: '2024-01-02T00:00:00Z',
        },
      ];

      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: tools,
      });

      const result = getInstalledTools();

      expect(result).toEqual(tools);
    });

    it('should return empty array when no tools installed', () => {
      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: [],
      });

      const result = getInstalledTools();

      expect(result).toEqual([]);
    });
  });

  describe('isToolInstalled', () => {
    beforeEach(() => {
      const tools: InstalledTool[] = [
        {
          id: 'tool1',
          name: 'Tool 1',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/path/to/tool1',
          installedAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: tools,
      });
    });

    it('should return true if tool is installed', () => {
      expect(isToolInstalled('tool1')).toBe(true);
    });

    it('should return false if tool is not installed', () => {
      expect(isToolInstalled('tool2')).toBe(false);
    });
  });

  describe('getInstalledTool', () => {
    const tool1: InstalledTool = {
      id: 'tool1',
      name: 'Tool 1',
      version: '1.0.0',
      type: 'prompt',
      installedPath: '/path/to/tool1',
      installedAt: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
      mockFileOps.readJsonFile.mockReturnValue({
        version: '1.0.0',
        installations: [tool1],
      });
    });

    it('should return tool if installed', () => {
      const result = getInstalledTool('tool1');

      expect(result).toEqual(tool1);
    });

    it('should return null if tool not installed', () => {
      const result = getInstalledTool('tool2');

      expect(result).toBeNull();
    });
  });
});

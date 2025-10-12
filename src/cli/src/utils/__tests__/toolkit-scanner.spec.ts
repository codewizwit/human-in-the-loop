import { describe, it, expect, beforeEach } from '@jest/globals';
import { scanToolkit, searchTools, getTool } from '../toolkit-scanner';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('toolkit-scanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup path mocks to return expected values
    mockPath.join.mockImplementation((...args: string[]) => args.join('/'));
    mockPath.resolve.mockImplementation((...args: string[]) => args.join('/'));
  });

  describe('scanToolkit', () => {
    it('should return empty array when toolkit directory does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const tools = await scanToolkit('/mock/toolkit');

      expect(tools).toEqual([]);
    });

    it('should handle empty directories gracefully', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([] as any);

      const tools = await scanToolkit('/mock/toolkit');

      expect(tools).toEqual([]);
    });
  });

  describe('searchTools', () => {
    it('should call scanToolkit and return results', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([] as any);

      const tools = await searchTools();

      expect(tools).toEqual([]);
    });

    it('should handle search with query', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([] as any);

      const tools = await searchTools('test');

      expect(tools).toEqual([]);
    });
  });

  describe('getTool', () => {
    it('should return null when no tools found', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([] as any);

      const tool = await getTool('nonexistent');

      expect(tool).toBeNull();
    });
  });
});

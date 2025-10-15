/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { scanToolkit, searchTools, getTool } from '../lib-scanner';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('lib-scanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup path mocks to return expected values
    mockPath.join.mockImplementation((...args: string[]) => args.join('/'));
    mockPath.resolve.mockImplementation((...args: string[]) => args.join('/'));
  });

  describe('scanToolkit', () => {
    it('should return empty array when toolkit directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      const tools = scanToolkit('/mock/toolkit');

      expect(tools).toEqual([]);
    });

    it('should handle empty directories gracefully', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([] as any);

      const tools = scanToolkit('/mock/toolkit');

      expect(tools).toEqual([]);
    });
  });

  describe('searchTools', () => {
    it('should call scanToolkit and return results', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([] as any);

      const tools = searchTools();

      expect(tools).toEqual([]);
    });

    it('should handle search with query', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([] as any);

      const tools = searchTools('test');

      expect(tools).toEqual([]);
    });
  });

  describe('getTool', () => {
    it('should return null when no tools found', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([] as any);

      const tool = getTool('nonexistent');

      expect(tool).toBeNull();
    });
  });
});

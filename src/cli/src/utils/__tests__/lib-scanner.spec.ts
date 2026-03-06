/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { scanToolkit, searchTools, getTool } from '../lib-scanner';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('lib-scanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

  describe('findConfigFile priority: skill.md before prompt.md', () => {
    it('should find skill.md and parse frontmatter', () => {
      mockFs.existsSync.mockImplementation((p: unknown) => {
        const pathStr = String(p);
        if (pathStr === '/mock/toolkit') return true;
        if (pathStr.endsWith('/skills')) return true;
        if (pathStr.endsWith('/skill.md')) return true;
        return false;
      });

      mockFs.readdirSync.mockImplementation(((
        dirPath: unknown
      ): fs.Dirent[] => {
        const dirStr = String(dirPath);
        if (dirStr.endsWith('/skills')) {
          return [{ name: 'angular-modern', isDirectory: () => true }] as any;
        }
        return [] as any;
      }) as any);

      mockFs.readFileSync.mockImplementation(((filePath: unknown): string => {
        const fileStr = String(filePath);
        if (fileStr.endsWith('/skill.md')) {
          return `---
name: angular-modern
description: Angular Modern skill
version: 1.0.0
allowed-tools:
  - Read
  - Glob
---

## When to Activate
Use for Angular projects.

## Output Format
Standard output.`;
        }
        return '';
      }) as any);

      const tools = scanToolkit('/mock/toolkit');

      expect(tools.length).toBe(1);
      expect(tools[0].id).toBe('angular-modern');
      expect(tools[0].type).toBe('skill');
    });

    it('should skip directories without skill.md', () => {
      mockFs.existsSync.mockImplementation((p: unknown) => {
        const pathStr = String(p);
        if (pathStr === '/mock/toolkit') return true;
        if (pathStr.endsWith('/skills')) return true;
        if (pathStr.endsWith('/angular-legacy/skill.md')) return false;
        return false;
      });

      mockFs.readdirSync.mockImplementation(((
        dirPath: unknown
      ): fs.Dirent[] => {
        const dirStr = String(dirPath);
        if (dirStr.endsWith('/skills')) {
          return [{ name: 'angular-legacy', isDirectory: () => true }] as any;
        }
        return [] as any;
      }) as any);

      const tools = scanToolkit('/mock/toolkit');

      expect(tools.length).toBe(0);
    });
  });

  describe('name used as tool ID when no id field', () => {
    it('should use name as tool ID when frontmatter has name but no id', () => {
      mockFs.existsSync.mockImplementation((p: unknown) => {
        const pathStr = String(p);
        if (pathStr === '/mock/toolkit') return true;
        if (pathStr.endsWith('/skills')) return true;
        if (pathStr.endsWith('/skill.md')) return true;
        return false;
      });

      mockFs.readdirSync.mockImplementation(((
        dirPath: unknown
      ): fs.Dirent[] => {
        const dirStr = String(dirPath);
        if (dirStr.endsWith('/skills')) {
          return [{ name: 'test-skill', isDirectory: () => true }] as any;
        }
        return [] as any;
      }) as any);

      mockFs.readFileSync.mockImplementation(((): string => {
        return `---
name: test-skill
version: 1.0.0
description: A test skill
---

Content here`;
      }) as any);

      const tools = scanToolkit('/mock/toolkit');

      expect(tools.length).toBe(1);
      expect(tools[0].id).toBe('test-skill');
      expect(tools[0].name).toBe('test-skill');
    });
  });
});

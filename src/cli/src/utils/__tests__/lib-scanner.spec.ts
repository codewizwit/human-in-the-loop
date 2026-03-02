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
    it('should find skill.md when both skill.md and metadata.json exist', () => {
      // Setup: toolkit with skills directory containing a tool
      mockFs.existsSync.mockImplementation((p: unknown) => {
        const pathStr = String(p);
        if (pathStr === '/mock/toolkit') return true;
        if (pathStr.endsWith('/skills')) return true;
        if (
          pathStr.endsWith('/prompts') ||
          pathStr.endsWith('/agents') ||
          pathStr.endsWith('/evaluators') ||
          pathStr.endsWith('/guardrails') ||
          pathStr.endsWith('/context-packs')
        )
          return false;
        // skill.md is found first in the possibleFiles list
        if (pathStr.endsWith('/skill.md')) return true;
        if (pathStr.endsWith('/metadata.json')) return true;
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

      // skill.md is now checked first in findConfigFile, so the tool
      // should be discovered from skill.md rather than metadata.json
      expect(tools.length).toBe(1);
      expect(tools[0].id).toBe('angular-modern');
      expect(tools[0].type).toBe('skill');
    });

    it('should fall back to metadata.json when skill.md does not exist', () => {
      mockFs.existsSync.mockImplementation((p: unknown) => {
        const pathStr = String(p);
        if (pathStr === '/mock/toolkit') return true;
        if (pathStr.endsWith('/skills')) return true;
        if (
          pathStr.endsWith('/prompts') ||
          pathStr.endsWith('/agents') ||
          pathStr.endsWith('/evaluators') ||
          pathStr.endsWith('/guardrails') ||
          pathStr.endsWith('/context-packs')
        )
          return false;
        // skill.md does NOT exist
        if (pathStr.endsWith('/skill.md')) return false;
        // prompt.md doesn't exist either
        if (pathStr.endsWith('/prompt.md')) return false;
        if (pathStr.endsWith('/prompt.yaml')) return false;
        if (pathStr.endsWith('/prompt.yml')) return false;
        if (pathStr.endsWith('/agent.yaml')) return false;
        if (pathStr.endsWith('/agent.yml')) return false;
        if (pathStr.endsWith('/config.yaml')) return false;
        if (pathStr.endsWith('/config.yml')) return false;
        // metadata.json exists
        if (pathStr.endsWith('/metadata.json')) return true;
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

      mockFs.readFileSync.mockImplementation(((filePath: unknown): string => {
        const fileStr = String(filePath);
        if (fileStr.endsWith('/metadata.json')) {
          return JSON.stringify({
            id: 'angular-legacy',
            name: 'Angular Legacy',
            version: '1.0.0',
            description: 'Legacy Angular skill',
          });
        }
        return '';
      }) as any);

      const tools = scanToolkit('/mock/toolkit');

      expect(tools.length).toBe(1);
      expect(tools[0].id).toBe('angular-legacy');
    });
  });

  describe('name used as tool ID when no id field', () => {
    it('should use name as tool ID when frontmatter has name but no id', () => {
      mockFs.existsSync.mockImplementation((p: unknown) => {
        const pathStr = String(p);
        if (pathStr === '/mock/toolkit') return true;
        if (pathStr.endsWith('/skills')) return true;
        if (
          pathStr.endsWith('/prompts') ||
          pathStr.endsWith('/agents') ||
          pathStr.endsWith('/evaluators') ||
          pathStr.endsWith('/guardrails') ||
          pathStr.endsWith('/context-packs')
        )
          return false;
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

      // parseToolConfig now accepts name-only configs: toolId = name || id
      expect(tools.length).toBe(1);
      expect(tools[0].id).toBe('test-skill');
      expect(tools[0].name).toBe('test-skill');
    });
  });
});

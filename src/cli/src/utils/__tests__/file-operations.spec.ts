import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import {
  ensureDirectory,
  pathExists,
  readJsonFile,
  writeJsonFile,
  getHomeDirectory,
  resolvePath,
} from '../file-operations';
import * as fs from 'fs';

// Mock fs module
jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('file-operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureDirectory', () => {
    it('should create directory if it does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      ensureDirectory('/some/dir');

      expect(mockFs.mkdirSync).toHaveBeenCalledWith('/some/dir', {
        recursive: true,
      });
    });

    it('should not create directory if it exists', () => {
      mockFs.existsSync.mockReturnValue(true);

      ensureDirectory('/some/dir');

      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('pathExists', () => {
    it('should return true if path exists', () => {
      mockFs.existsSync.mockReturnValue(true);

      expect(pathExists('/some/path')).toBe(true);
    });

    it('should return false if path does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      expect(pathExists('/some/path')).toBe(false);
    });
  });

  describe('readJsonFile', () => {
    it('should read and parse JSON file', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('{"key": "value"}');

      const result = readJsonFile<{ key: string }>('/file.json');

      expect(result).toEqual({ key: 'value' });
      expect(mockFs.readFileSync).toHaveBeenCalledWith('/file.json', 'utf-8');
    });

    it('should return null if file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = readJsonFile('/file.json');

      expect(result).toBeNull();
    });

    it('should return null if JSON parsing fails', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid json');

      const result = readJsonFile('/file.json');

      expect(result).toBeNull();
    });
  });

  describe('writeJsonFile', () => {
    it('should write JSON file with proper formatting', () => {
      mockFs.existsSync.mockReturnValue(false);

      const data = { key: 'value', nested: { foo: 'bar' } };
      writeJsonFile('/file.json', data);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/file.json',
        JSON.stringify(data, null, 2),
        'utf-8'
      );
    });

    it('should create parent directory if needed', () => {
      mockFs.existsSync.mockReturnValue(false);

      writeJsonFile('/some/nested/file.json', { key: 'value' });

      expect(mockFs.mkdirSync).toHaveBeenCalled();
    });
  });

  describe('getHomeDirectory', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return HOME environment variable on Unix', () => {
      process.env.HOME = '/home/user';
      delete process.env.USERPROFILE;

      expect(getHomeDirectory()).toBe('/home/user');
    });

    it('should return USERPROFILE on Windows', () => {
      delete process.env.HOME;
      process.env.USERPROFILE = 'C:\\Users\\user';

      expect(getHomeDirectory()).toBe('C:\\Users\\user');
    });

    it('should return / as fallback', () => {
      delete process.env.HOME;
      delete process.env.USERPROFILE;

      expect(getHomeDirectory()).toBe('/');
    });
  });

  describe('resolvePath', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      process.env.HOME = '/home/user';
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should expand ~ to home directory', () => {
      const result = resolvePath('~/Documents');

      expect(result).toContain('Documents');
      expect(result).toContain('/home/user');
    });

    it('should handle ~ alone', () => {
      const result = resolvePath('~');

      expect(result).toBe('/home/user');
    });

    it('should resolve absolute paths', () => {
      const result = resolvePath('/absolute/path');

      expect(result).toContain('/absolute/path');
    });
  });
});

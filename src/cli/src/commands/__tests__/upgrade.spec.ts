import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { upgradeCommand } from '../upgrade';
import * as registry from '../../utils/registry';
import * as libScanner from '../../utils/lib-scanner';
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  statSync,
  rmSync,
} from 'fs';

jest.mock('../../utils/registry');
jest.mock('../../utils/lib-scanner');
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

const mockRegistry = registry as jest.Mocked<typeof registry>;
const mockLibScanner = libScanner as jest.Mocked<typeof libScanner>;
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<
  typeof readFileSync
>;
const mockWriteFileSync = writeFileSync as jest.MockedFunction<
  typeof writeFileSync
>;
const mockMkdirSync = mkdirSync as jest.MockedFunction<typeof mkdirSync>;
const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;
const mockRmSync = rmSync as jest.MockedFunction<typeof rmSync>;

const SKILL_CONTENT_V2 =
  '---\nname: code-review-ts\ndescription: Review code\nversion: 2.0.0\n---\n# Code Review';
const SKILL_CONTENT_V3 =
  '---\nname: code-review-ts\ndescription: Review code\nversion: 3.0.0\n---\n# Code Review';

describe('upgradeCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
    jest.clearAllMocks();

    mockLibScanner.scanToolkit.mockReturnValue([]);
    mockMkdirSync.mockReturnValue(undefined);
    mockWriteFileSync.mockReturnValue(undefined);
    mockRmSync.mockReturnValue(undefined);
    mockStatSync.mockReturnValue({
      isFile: () => true,
      isDirectory: () => false,
    } as never);
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('no installed skills', () => {
    it('should show message when no skills are installed', async () => {
      mockRegistry.getInstalledTools.mockReturnValue([]);

      await upgradeCommand({});

      expect(consoleMock.contains('No skills installed yet')).toBe(true);
      expect(consoleMock.contains('hit search')).toBe(true);
    });
  });

  describe('upgrading skills', () => {
    const installedTool: registry.InstalledTool = {
      id: 'code-review-ts',
      name: 'Code Review TypeScript',
      version: '2.0.0',
      type: 'skill',
      installedPath: '/home/user/.claude/skills/code-review-ts.md',
      installedAt: '2025-01-01T00:00:00.000Z',
    };

    beforeEach(() => {
      mockRegistry.getInstalledTools.mockReturnValue([installedTool]);
    });

    it('should upgrade when bundled version is newer', async () => {
      mockLibScanner.getTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'Code Review TypeScript',
        version: '3.0.0',
        description: 'Review code',
        category: 'code-quality',
        type: 'skill',
        path: '/lib/skills/code-review-ts',
        metadata: {},
      });

      mockExistsSync.mockImplementation((p) => {
        if (String(p).includes('skill.md')) return true;
        if (String(p).includes('.claude/skills')) return true;
        return false;
      });

      mockReadFileSync.mockImplementation((p) => {
        if (String(p).includes('/lib/skills/'))
          return SKILL_CONTENT_V3 as never;
        return SKILL_CONTENT_V2 as never;
      });

      await upgradeCommand({});

      expect(mockWriteFileSync).toHaveBeenCalled();
      expect(mockRegistry.registerInstallation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'code-review-ts',
          version: '3.0.0',
        })
      );
      expect(consoleMock.contains('Upgraded')).toBe(true);
      expect(consoleMock.contains('code-review-ts')).toBe(true);
    });

    it('should skip when already up to date', async () => {
      const currentTool: registry.InstalledTool = {
        ...installedTool,
        version: '3.0.0',
      };
      mockRegistry.getInstalledTools.mockReturnValue([currentTool]);

      mockLibScanner.getTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'Code Review TypeScript',
        version: '3.0.0',
        description: 'Review code',
        category: 'code-quality',
        type: 'skill',
        path: '/lib/skills/code-review-ts',
        metadata: {},
      });

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(SKILL_CONTENT_V3 as never);

      await upgradeCommand({});

      expect(mockWriteFileSync).not.toHaveBeenCalled();
      expect(consoleMock.contains('up to date')).toBe(true);
    });

    it('should warn when skill is not found in toolkit', async () => {
      mockLibScanner.getTool.mockReturnValue(null);

      await upgradeCommand({});

      expect(consoleMock.contains('Not found in toolkit')).toBe(true);
      expect(consoleMock.contains('code-review-ts')).toBe(true);
    });
  });

  describe('--skill option', () => {
    it('should only upgrade the specified skill', async () => {
      const tools: registry.InstalledTool[] = [
        {
          id: 'code-review-ts',
          name: 'Code Review',
          version: '2.0.0',
          type: 'skill',
          installedPath: '/home/user/.claude/skills/code-review-ts.md',
          installedAt: '2025-01-01T00:00:00.000Z',
        },
        {
          id: 'e2e-strategy',
          name: 'E2E Strategy',
          version: '2.0.0',
          type: 'skill',
          installedPath: '/home/user/.claude/skills/e2e-strategy.md',
          installedAt: '2025-01-01T00:00:00.000Z',
        },
      ];
      mockRegistry.getInstalledTools.mockReturnValue(tools);

      mockLibScanner.getTool.mockReturnValue({
        id: 'code-review-ts',
        name: 'Code Review',
        version: '3.0.0',
        description: 'Review code',
        category: 'code-quality',
        type: 'skill',
        path: '/lib/skills/code-review-ts',
        metadata: {},
      });

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation((p) => {
        if (String(p).includes('/lib/skills/'))
          return SKILL_CONTENT_V3 as never;
        return SKILL_CONTENT_V2 as never;
      });

      await upgradeCommand({ skill: 'code-review-ts' });

      expect(mockLibScanner.getTool).toHaveBeenCalledWith('code-review-ts');
      expect(mockLibScanner.getTool).not.toHaveBeenCalledWith('e2e-strategy');
    });

    it('should error when specified skill is not installed', async () => {
      mockRegistry.getInstalledTools.mockReturnValue([
        {
          id: 'other-skill',
          name: 'Other Skill',
          version: '1.0.0',
          type: 'skill',
          installedPath: '/home/user/.claude/skills/other-skill.md',
          installedAt: '2025-01-01T00:00:00.000Z',
        },
      ]);

      await upgradeCommand({ skill: 'nonexistent' });

      expect(consoleMock.contains('not installed')).toBe(true);
      expect(consoleMock.contains('hit list')).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should report errors for individual skills without stopping', async () => {
      const tools: registry.InstalledTool[] = [
        {
          id: 'failing-skill',
          name: 'Failing Skill',
          version: '1.0.0',
          type: 'skill',
          installedPath: '/home/user/.claude/skills/failing-skill.md',
          installedAt: '2025-01-01T00:00:00.000Z',
        },
      ];
      mockRegistry.getInstalledTools.mockReturnValue(tools);

      mockLibScanner.getTool.mockReturnValue({
        id: 'failing-skill',
        name: 'Failing Skill',
        version: '2.0.0',
        description: 'A skill',
        category: 'test',
        type: 'skill',
        path: '/lib/skills/failing-skill',
        metadata: {},
      });

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation((p) => {
        if (String(p).endsWith('skill.md')) {
          return '---\nname: failing-skill\nversion: 2.0.0\n---\n# Fail' as never;
        }
        return '---\nname: failing-skill\nversion: 1.0.0\n---\n# Fail' as never;
      });

      mockWriteFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      await upgradeCommand({});

      expect(consoleMock.contains('Errors')).toBe(true);
      expect(consoleMock.contains('Permission denied')).toBe(true);
    });
  });

  describe('summary output', () => {
    it('should show upgrade count when skills were upgraded', async () => {
      const tools: registry.InstalledTool[] = [
        {
          id: 'skill-a',
          name: 'Skill A',
          version: '1.0.0',
          type: 'skill',
          installedPath: '/home/user/.claude/skills/skill-a.md',
          installedAt: '2025-01-01T00:00:00.000Z',
        },
      ];
      mockRegistry.getInstalledTools.mockReturnValue(tools);

      mockLibScanner.getTool.mockReturnValue({
        id: 'skill-a',
        name: 'Skill A',
        version: '2.0.0',
        description: 'A skill',
        category: 'test',
        type: 'skill',
        path: '/lib/skills/skill-a',
        metadata: {},
      });

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation((p) => {
        if (String(p).includes('/lib/skills/')) {
          return '---\nname: skill-a\nversion: 2.0.0\n---\n# A' as never;
        }
        return '---\nname: skill-a\nversion: 1.0.0\n---\n# A' as never;
      });

      await upgradeCommand({});

      expect(consoleMock.contains('Upgraded 1 skill')).toBe(true);
    });

    it('should migrate old directory-format installs to single file', async () => {
      const tools: registry.InstalledTool[] = [
        {
          id: 'e2e-strategy',
          name: 'E2E Strategy',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/home/user/.claude/tools/prompt/e2e-strategy',
          installedAt: '2025-01-01T00:00:00.000Z',
        },
      ];
      mockRegistry.getInstalledTools.mockReturnValue(tools);

      mockLibScanner.getTool.mockReturnValue({
        id: 'e2e-strategy',
        name: 'E2E Strategy',
        version: '3.0.0',
        description: 'E2E testing',
        category: 'testing',
        type: 'skill',
        path: '/lib/skills/e2e-strategy',
        metadata: {},
      });

      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockImplementation((p) => {
        if (String(p) === '/home/user/.claude/tools/prompt/e2e-strategy') {
          return { isFile: () => false, isDirectory: () => true } as never;
        }
        return { isFile: () => true, isDirectory: () => false } as never;
      });
      mockReadFileSync.mockImplementation((p) => {
        if (String(p).includes('/lib/skills/')) {
          return '---\nname: e2e-strategy\nversion: 3.0.0\n---\n# E2E' as never;
        }
        return '---\nname: e2e-strategy\nversion: 1.0.0\n---\n# E2E' as never;
      });

      await upgradeCommand({});

      expect(mockRmSync).toHaveBeenCalledWith(
        '/home/user/.claude/tools/prompt/e2e-strategy',
        { recursive: true }
      );
      expect(mockRegistry.registerInstallation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'e2e-strategy',
          version: '3.0.0',
          installedPath: '/home/user/.claude/tools/prompt/e2e-strategy.md',
        })
      );
      expect(consoleMock.contains('Upgraded')).toBe(true);
    });

    it('should use plural when multiple skills upgraded', async () => {
      const tools: registry.InstalledTool[] = [
        {
          id: 'skill-a',
          name: 'Skill A',
          version: '1.0.0',
          type: 'skill',
          installedPath: '/home/user/.claude/skills/skill-a.md',
          installedAt: '2025-01-01T00:00:00.000Z',
        },
        {
          id: 'skill-b',
          name: 'Skill B',
          version: '1.0.0',
          type: 'skill',
          installedPath: '/home/user/.claude/skills/skill-b.md',
          installedAt: '2025-01-01T00:00:00.000Z',
        },
      ];
      mockRegistry.getInstalledTools.mockReturnValue(tools);

      mockLibScanner.getTool.mockImplementation((id) => ({
        id: id || 'unknown',
        name: id || 'Unknown',
        version: '2.0.0',
        description: 'A skill',
        category: 'test',
        type: 'skill',
        path: `/lib/skills/${id}`,
        metadata: {},
      }));

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation((p) => {
        const pathStr = String(p);
        if (pathStr.includes('/lib/skills/')) {
          const name = pathStr.includes('skill-a') ? 'skill-a' : 'skill-b';
          return `---\nname: ${name}\nversion: 2.0.0\n---\n# Content` as never;
        }
        const name = pathStr.includes('skill-a') ? 'skill-a' : 'skill-b';
        return `---\nname: ${name}\nversion: 1.0.0\n---\n# Content` as never;
      });

      await upgradeCommand({});

      expect(consoleMock.contains('Upgraded 2 skills')).toBe(true);
    });
  });
});

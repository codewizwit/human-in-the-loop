import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { doctorCommand } from '../doctor';

jest.mock('child_process', () => {
  return {
    execSync: jest.fn(),
  };
});

jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
  };
});

describe('doctorCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;
  let execSync: jest.Mock;
  let existsSync: jest.Mock;
  let output: string;

  /**
   * Helper to run command and capture output
   */
  const runCommand = async (): Promise<string> => {
    await doctorCommand();
    return consoleMock.getOutput();
  };

  /**
   * Helper to assert output contains text
   */
  const expectOutput = (text: string | string[]): void => {
    const texts = Array.isArray(text) ? text : [text];
    texts.forEach((t) => expect(output).toContain(t));
  };

  beforeEach(async () => {
    const childProcess = await import('child_process');
    const fs = await import('fs');

    execSync = childProcess.execSync as jest.Mock;
    existsSync = fs.existsSync as jest.Mock;

    jest.clearAllMocks();
    execSync.mockReturnValue('1.0.0');
    existsSync.mockReturnValue(true);

    consoleMock = createConsoleMock();
    consoleMock.start();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('diagnostic checks', () => {
    beforeEach(async () => {
      output = await runCommand();
    });

    it('should display diagnostic message', () => {
      expect(consoleMock.contains('🔍 Running diagnostic checks')).toBe(true);
    });

    it('should show environment section', () => {
      expect(consoleMock.contains('Environment:')).toBe(true);
    });

    it('should show version control section', () => {
      expect(consoleMock.contains('Version Control:')).toBe(true);
    });

    it('should show installation paths section', () => {
      expect(consoleMock.contains('Installation Paths:')).toBe(true);
    });
  });

  describe('environment checks', () => {
    describe('when tools are installed', () => {
      it('should display Node.js version', async () => {
        execSync.mockReturnValue('v20.10.0');
        output = await runCommand();

        expectOutput(['Node.js', '20.10.0']);
      });

      it('should display npm version', async () => {
        execSync.mockReturnValue('10.2.0');
        output = await runCommand();

        expectOutput('npm');
      });

      it('should display pnpm version', async () => {
        execSync.mockReturnValue('9.0.0');
        output = await runCommand();

        expectOutput('pnpm');
      });
    });

    describe('when tools are missing', () => {
      beforeEach(() => {
        execSync.mockImplementation(() => {
          throw new Error('Command not found');
        });
        existsSync.mockReturnValue(false);
      });

      it('should handle missing commands gracefully', async () => {
        output = await runCommand();

        expectOutput(['Node.js', 'npm', 'pnpm']);
      });
    });
  });

  describe('version control checks', () => {
    describe('when tools are installed', () => {
      it('should display git version', async () => {
        execSync.mockReturnValue('git version 2.42.0');
        output = await runCommand();

        expectOutput('git');
      });

      it('should display GitHub CLI version', async () => {
        execSync.mockReturnValue('gh version 2.40.0');
        output = await runCommand();

        expectOutput('GitHub CLI');
      });
    });

    describe('when tools are missing', () => {
      beforeEach(() => {
        execSync.mockImplementation((cmd: unknown) => {
          if (String(cmd).includes('git') || String(cmd).includes('gh')) {
            throw new Error('Command not found');
          }
          return '1.0.0';
        });
      });

      it('should handle missing version control tools gracefully', async () => {
        output = await runCommand();

        expectOutput(['git', 'GitHub CLI']);
      });
    });
  });

  describe('installation path checks', () => {
    describe('when directories exist', () => {
      beforeEach(async () => {
        output = await runCommand();
      });

      it('should check for .claude directory', () => {
        expectOutput('.claude directory');
      });

      it('should check for tools directory', () => {
        expectOutput('tools directory');
      });

      it('should check for registry.json', () => {
        expectOutput('registry.json');
      });
    });

    describe('when directories are missing', () => {
      beforeEach(() => {
        existsSync.mockReturnValue(false);
      });

      it('should show creation message for missing directories', async () => {
        output = await runCommand();

        expectOutput(['.claude directory', 'will be created']);
      });
    });
  });

  describe('execution flow', () => {
    it('should complete without errors', async () => {
      await expect(doctorCommand()).resolves.not.toThrow();
    });

    it('should show sections in correct order', async () => {
      await doctorCommand();

      const lines = consoleMock.getLines();
      const indices = {
        env: lines.findIndex((l) => l.includes('Environment:')),
        versionControl: lines.findIndex((l) => l.includes('Version Control:')),
        paths: lines.findIndex((l) => l.includes('Installation Paths:')),
      };

      expect(indices.env).toBeGreaterThan(-1);
      expect(indices.versionControl).toBeGreaterThan(indices.env);
      expect(indices.paths).toBeGreaterThan(indices.versionControl);
    });
  });

  describe('output formatting', () => {
    beforeEach(async () => {
      output = await runCommand();
    });

    it('should use proper spacing', () => {
      expect(output.split('\n').length).toBeGreaterThan(10);
    });

    it('should highlight important information with icons', () => {
      expect(consoleMock.contains('🔍')).toBe(true);
    });
  });

  describe('status messages', () => {
    it('should show success when all checks pass', async () => {
      output = await runCommand();

      expectOutput('All checks passed');
    });

    it('should show warning when optional tools are missing', async () => {
      execSync.mockImplementation((cmd: unknown) => {
        const cmdStr = String(cmd);
        if (
          cmdStr.includes('pnpm') ||
          cmdStr.includes('git') ||
          cmdStr.includes('gh')
        ) {
          throw new Error('Command not found');
        }
        return '1.0.0';
      });

      output = await runCommand();

      expectOutput('some optional tools are missing');
    });

    it('should show error when critical tools are missing', async () => {
      execSync.mockImplementation((cmd: unknown) => {
        const cmdStr = String(cmd);
        if (cmdStr.includes('node') || cmdStr.includes('npm')) {
          throw new Error('Command not found');
        }
        return '1.0.0';
      });

      output = await runCommand();

      expectOutput('critical checks failed');
    });
  });
});

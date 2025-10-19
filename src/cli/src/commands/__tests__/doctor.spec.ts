import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { doctorCommand } from '../doctor';

describe('doctorCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('diagnostic checks', () => {
    it('should display diagnostic message', async () => {
      await doctorCommand();

      expect(consoleMock.contains('🔍 Running diagnostic checks')).toBe(true);
    });

    it('should show environment section', async () => {
      await doctorCommand();

      expect(consoleMock.contains('Environment:')).toBe(true);
    });

    it('should show version control section', async () => {
      await doctorCommand();

      expect(consoleMock.contains('Version Control:')).toBe(true);
    });

    it('should show installation paths section', async () => {
      await doctorCommand();

      expect(consoleMock.contains('Installation Paths:')).toBe(true);
    });
  });

  describe('environment checks', () => {
    it('should check Node.js version', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('Node.js');
    });

    it('should check npm version', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('npm');
    });

    it('should check pnpm version (optional)', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('pnpm');
    });
  });

  describe('version control checks', () => {
    it('should check git version', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('git');
    });

    it('should check GitHub CLI version', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('GitHub CLI');
    });
  });

  describe('installation path checks', () => {
    it('should check for .claude directory', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('.claude directory');
    });

    it('should check for tools directory', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('tools directory');
    });

    it('should check for registry.json', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('registry.json');
    });
  });

  describe('execution flow', () => {
    it('should complete without errors', async () => {
      await expect(doctorCommand()).resolves.not.toThrow();
    });

    it('should show sections in order', async () => {
      await doctorCommand();

      const lines = consoleMock.getLines();
      const envIndex = lines.findIndex((l) => l.includes('Environment:'));
      const versionControlIndex = lines.findIndex((l) =>
        l.includes('Version Control:')
      );
      const pathsIndex = lines.findIndex((l) =>
        l.includes('Installation Paths:')
      );

      expect(envIndex).toBeGreaterThan(-1);
      expect(versionControlIndex).toBeGreaterThan(envIndex);
      expect(pathsIndex).toBeGreaterThan(versionControlIndex);
    });
  });

  describe('output formatting', () => {
    it('should use proper spacing', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();

      expect(output.split('\n').length).toBeGreaterThan(10);
    });

    it('should highlight important information', async () => {
      await doctorCommand();

      expect(consoleMock.contains('🔍')).toBe(true);
    });
  });

  describe('status messages', () => {
    it('should show success, warning, or error status at the end', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();

      const hasStatusMessage =
        output.includes('All checks passed') ||
        output.includes('some optional tools are missing') ||
        output.includes('critical checks failed');

      expect(hasStatusMessage).toBe(true);
    });
  });
});

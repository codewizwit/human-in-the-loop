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

    it('should show dependencies section', async () => {
      await doctorCommand();

      expect(consoleMock.contains('Dependencies:')).toBe(true);
    });

    it('should show configuration section', async () => {
      await doctorCommand();

      expect(consoleMock.contains('Configuration:')).toBe(true);
    });

    it('should display success message', async () => {
      await doctorCommand();

      expect(
        consoleMock.contains('All checks passed! Your environment is ready.')
      ).toBe(true);
    });
  });

  describe('environment checks', () => {
    it('should check Node.js version', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('Node.js');
      expect(output).toContain('v20.11.0');
    });

    it('should check TypeScript version', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('TypeScript');
      expect(output).toContain('v5.9.3');
    });

    it('should check pnpm version', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('pnpm');
      expect(output).toContain('v10.18.2');
    });

    it('should show checkmarks for all environment checks', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      const lines = output.split('\n');
      const envSection = lines.filter(
        (l) =>
          l.includes('Node.js') ||
          l.includes('TypeScript') ||
          l.includes('pnpm')
      );

      expect(envSection.length).toBe(3);
      envSection.forEach((line) => {
        expect(line).toContain('✓');
      });
    });
  });

  describe('dependency checks', () => {
    it('should check commander dependency', async () => {
      await doctorCommand();

      expect(consoleMock.contains('commander')).toBe(true);
    });

    it('should check chalk dependency', async () => {
      await doctorCommand();

      expect(consoleMock.contains('chalk')).toBe(true);
    });

    it('should check zod dependency', async () => {
      await doctorCommand();

      expect(consoleMock.contains('zod')).toBe(true);
    });

    it('should show checkmarks for all dependencies', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      const lines = output.split('\n');
      const depSection = lines.filter(
        (l) =>
          l.includes('commander') || l.includes('chalk') || l.includes('zod')
      );

      expect(depSection.length).toBe(3);
      depSection.forEach((line) => {
        expect(line).toContain('✓');
      });
    });
  });

  describe('configuration checks', () => {
    it('should check for .hitlrc.json', async () => {
      await doctorCommand();

      expect(consoleMock.contains('.hitlrc.json found')).toBe(true);
    });

    it('should check for .claude directory', async () => {
      await doctorCommand();

      expect(consoleMock.contains('.claude directory exists')).toBe(true);
    });

    it('should show checkmarks for configuration', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();
      const lines = output.split('\n');
      const configSection = lines.filter(
        (l) => l.includes('.hitlrc.json') || l.includes('.claude directory')
      );

      expect(configSection.length).toBe(2);
      configSection.forEach((line) => {
        expect(line).toContain('✓');
      });
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
      const depsIndex = lines.findIndex((l) => l.includes('Dependencies:'));
      const configIndex = lines.findIndex((l) => l.includes('Configuration:'));
      const successIndex = lines.findIndex((l) =>
        l.includes('All checks passed')
      );

      expect(envIndex).toBeGreaterThan(-1);
      expect(depsIndex).toBeGreaterThan(envIndex);
      expect(configIndex).toBeGreaterThan(depsIndex);
      expect(successIndex).toBeGreaterThan(configIndex);
    });
  });

  describe('output formatting', () => {
    it('should use proper spacing', async () => {
      await doctorCommand();

      const output = consoleMock.getOutput();

      // Should have multiple lines for all checks
      expect(output.split('\n').length).toBeGreaterThan(10);
    });

    it('should highlight important information', async () => {
      await doctorCommand();

      // Diagnostic icon should be present
      expect(consoleMock.contains('🔍')).toBe(true);
    });
  });
});

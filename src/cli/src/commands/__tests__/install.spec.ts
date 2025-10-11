import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { installCommand } from '../install';

describe('installCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('installation process', () => {
    it('should display installation message', async () => {
      await installCommand('prompt/code-review-ts');

      expect(consoleMock.contains('📦 Installing prompt/code-review-ts')).toBe(
        true
      );
    });

    it('should show progress steps', async () => {
      await installCommand('agent/test-generator');

      const output = consoleMock.getOutput();

      expect(output).toContain('Downloading tool...');
      expect(output).toContain('Installing dependencies...');
      expect(output).toContain('Caching for offline use...');
    });

    it('should display success message', async () => {
      await installCommand('prompt/api-docs');

      expect(consoleMock.contains('✓')).toBe(true);
      expect(consoleMock.contains('Successfully installed')).toBe(true);
    });

    it('should show installation path', async () => {
      await installCommand('prompt/code-review-ts');

      expect(
        consoleMock.contains('Installed to: .claude/tools/prompt/code-review-ts')
      ).toBe(true);
    });

    it('should provide usage tip', async () => {
      await installCommand('agent/refactor');

      expect(consoleMock.contains('💡')).toBe(true);
      expect(consoleMock.contains('hitl list')).toBe(true);
    });
  });

  describe('with different tool types', () => {
    it('should handle prompt installation', async () => {
      await installCommand('prompt/test-prompt');

      expect(consoleMock.contains('prompt/test-prompt')).toBe(true);
    });

    it('should handle agent installation', async () => {
      await installCommand('agent/test-agent');

      expect(consoleMock.contains('agent/test-agent')).toBe(true);
    });

    it('should handle evaluator installation', async () => {
      await installCommand('evaluator/test-eval');

      expect(consoleMock.contains('evaluator/test-eval')).toBe(true);
    });
  });

  describe('execution flow', () => {
    it('should complete without errors', async () => {
      await expect(
        installCommand('prompt/code-review-ts')
      ).resolves.not.toThrow();
    });

    it('should show all steps in order', async () => {
      await installCommand('prompt/test');

      const lines = consoleMock.getLines();
      const downloadIndex = lines.findIndex((l) =>
        l.includes('Downloading tool')
      );
      const depsIndex = lines.findIndex((l) =>
        l.includes('Installing dependencies')
      );
      const cacheIndex = lines.findIndex((l) =>
        l.includes('Caching for offline use')
      );
      const successIndex = lines.findIndex((l) =>
        l.includes('Successfully installed')
      );

      // Verify order
      expect(downloadIndex).toBeGreaterThan(-1);
      expect(depsIndex).toBeGreaterThan(downloadIndex);
      expect(cacheIndex).toBeGreaterThan(depsIndex);
      expect(successIndex).toBeGreaterThan(cacheIndex);
    });
  });

  describe('output formatting', () => {
    it('should use proper spacing', async () => {
      await installCommand('prompt/test');

      const output = consoleMock.getOutput();

      // Should have blank lines for readability
      expect(output.split('\n').length).toBeGreaterThan(5);
    });

    it('should highlight important information', async () => {
      await installCommand('prompt/code-review-ts');

      // Success marker should be present
      expect(consoleMock.contains('✓')).toBe(true);

      // Tip marker should be present
      expect(consoleMock.contains('💡')).toBe(true);
    });
  });
});

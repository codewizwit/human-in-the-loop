import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { listCommand } from '../list';

describe('listCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('display installed tools', () => {
    it('should display installed tools header', async () => {
      await listCommand();

      expect(consoleMock.contains('📋 Installed tools:')).toBe(true);
    });

    it('should show prompts section', async () => {
      await listCommand();

      expect(consoleMock.contains('Prompts:')).toBe(true);
    });

    it('should show agents section', async () => {
      await listCommand();

      expect(consoleMock.contains('Agents:')).toBe(true);
    });

    it('should show context packs section', async () => {
      await listCommand();

      expect(consoleMock.contains('Context Packs:')).toBe(true);
    });

    it('should display total count', async () => {
      await listCommand();

      expect(consoleMock.contains('Total: 5 tools installed')).toBe(true);
    });
  });

  describe('prompts listing', () => {
    it('should list code-review-ts prompt with version', async () => {
      await listCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('code-review-ts');
      expect(output).toContain('v1.2.0');
    });

    it('should list api-docs-generator prompt with version', async () => {
      await listCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('api-docs-generator');
      expect(output).toContain('v2.1.0');
    });
  });

  describe('agents listing', () => {
    it('should list test-generator agent with version', async () => {
      await listCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('test-generator');
      expect(output).toContain('v1.0.0');
    });
  });

  describe('context packs listing', () => {
    it('should list angular context pack with version', async () => {
      await listCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('angular');
      expect(output).toContain('v3.0.0');
    });

    it('should list nestjs context pack with version', async () => {
      await listCommand();

      const output = consoleMock.getOutput();
      expect(output).toContain('nestjs');
      expect(output).toContain('v2.5.0');
    });
  });

  describe('execution flow', () => {
    it('should complete without errors', async () => {
      await expect(listCommand()).resolves.not.toThrow();
    });

    it('should show sections in order', async () => {
      await listCommand();

      const lines = consoleMock.getLines();
      const promptsIndex = lines.findIndex((l) => l.includes('Prompts:'));
      const agentsIndex = lines.findIndex((l) => l.includes('Agents:'));
      const contextsIndex = lines.findIndex((l) =>
        l.includes('Context Packs:')
      );
      const totalIndex = lines.findIndex((l) => l.includes('Total:'));

      expect(promptsIndex).toBeGreaterThan(-1);
      expect(agentsIndex).toBeGreaterThan(promptsIndex);
      expect(contextsIndex).toBeGreaterThan(agentsIndex);
      expect(totalIndex).toBeGreaterThan(contextsIndex);
    });
  });

  describe('output formatting', () => {
    it('should use proper spacing', async () => {
      await listCommand();

      const output = consoleMock.getOutput();

      // Should have multiple lines for all sections
      expect(output.split('\n').length).toBeGreaterThan(8);
    });

    it('should highlight important information', async () => {
      await listCommand();

      // List icon should be present
      expect(consoleMock.contains('📋')).toBe(true);
    });

    it('should display all 5 tools', async () => {
      await listCommand();

      const output = consoleMock.getOutput();

      // Count all tools mentioned
      expect(output).toContain('code-review-ts');
      expect(output).toContain('api-docs-generator');
      expect(output).toContain('test-generator');
      expect(output).toContain('angular');
      expect(output).toContain('nestjs');
    });
  });
});

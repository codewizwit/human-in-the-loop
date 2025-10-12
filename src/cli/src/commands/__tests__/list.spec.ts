import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { listCommand } from '../list';
import * as registry from '../../utils/registry';

// Mock registry module
jest.mock('../../utils/registry');

const mockRegistry = registry as jest.Mocked<typeof registry>;

describe('listCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('with installed tools', () => {
    beforeEach(() => {
      mockRegistry.getInstalledTools.mockReturnValue([
        {
          id: 'code-review-ts',
          name: 'Code Review TypeScript',
          version: '1.2.0',
          type: 'prompt',
          installedPath: '~/.claude/tools/prompt/code-review-ts',
          installedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'api-docs',
          name: 'API Docs Generator',
          version: '2.1.0',
          type: 'prompt',
          installedPath: '~/.claude/tools/prompt/api-docs',
          installedAt: '2024-01-02T00:00:00Z',
        },
        {
          id: 'test-generator',
          name: 'Test Generator',
          version: '1.0.0',
          type: 'agent',
          installedPath: '~/.claude/tools/agent/test-generator',
          installedAt: '2024-01-03T00:00:00Z',
        },
        {
          id: 'angular',
          name: 'Angular Context Pack',
          version: '3.0.0',
          type: 'context-pack',
          installedPath: '~/.claude/tools/context-pack/angular',
          installedAt: '2024-01-04T00:00:00Z',
        },
      ]);
    });

    it('should display installed tools header', async () => {
      await listCommand();

      expect(consoleMock.contains('📋 Installed tools:')).toBe(true);
    });

    it('should show prompts section with tools', async () => {
      await listCommand();

      expect(consoleMock.contains('Prompts:')).toBe(true);
      expect(consoleMock.contains('code-review-ts')).toBe(true);
      expect(consoleMock.contains('v1.2.0')).toBe(true);
      expect(consoleMock.contains('api-docs')).toBe(true);
      expect(consoleMock.contains('v2.1.0')).toBe(true);
    });

    it('should show agents section with tools', async () => {
      await listCommand();

      expect(consoleMock.contains('Agents:')).toBe(true);
      expect(consoleMock.contains('test-generator')).toBe(true);
      expect(consoleMock.contains('v1.0.0')).toBe(true);
    });

    it('should show context packs section with tools', async () => {
      await listCommand();

      expect(consoleMock.contains('Context Packs:')).toBe(true);
      expect(consoleMock.contains('angular')).toBe(true);
      expect(consoleMock.contains('v3.0.0')).toBe(true);
    });

    it('should display installation paths', async () => {
      await listCommand();

      expect(
        consoleMock.contains('~/.claude/tools/prompt/code-review-ts')
      ).toBe(true);
      expect(consoleMock.contains('~/.claude/tools/agent/test-generator')).toBe(
        true
      );
    });

    it('should display total count', async () => {
      await listCommand();

      expect(consoleMock.contains('Total: 4 tools installed')).toBe(true);
    });

    it('should use plural for multiple tools', async () => {
      await listCommand();

      expect(consoleMock.contains('4 tools installed')).toBe(true);
    });
  });

  describe('with single installed tool', () => {
    beforeEach(() => {
      mockRegistry.getInstalledTools.mockReturnValue([
        {
          id: 'single-tool',
          name: 'Single Tool',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '~/.claude/tools/prompt/single-tool',
          installedAt: '2024-01-01T00:00:00Z',
        },
      ]);
    });

    it('should use singular for single tool', async () => {
      await listCommand();

      expect(consoleMock.contains('Total: 1 tool installed')).toBe(true);
    });

    it('should display the tool', async () => {
      await listCommand();

      expect(consoleMock.contains('single-tool')).toBe(true);
      expect(consoleMock.contains('v1.0.0')).toBe(true);
    });
  });

  describe('with no installed tools', () => {
    beforeEach(() => {
      mockRegistry.getInstalledTools.mockReturnValue([]);
    });

    it('should display no tools message', async () => {
      await listCommand();

      expect(consoleMock.contains('No tools installed yet')).toBe(true);
    });

    it('should not display section headers', async () => {
      await listCommand();

      expect(consoleMock.contains('Prompts:')).toBe(false);
      expect(consoleMock.contains('Agents:')).toBe(false);
    });

    it('should provide helpful tips', async () => {
      await listCommand();

      expect(consoleMock.contains('hitl search')).toBe(true);
      expect(consoleMock.contains('hitl install')).toBe(true);
    });

    it('should not display total count', async () => {
      await listCommand();

      expect(consoleMock.contains('Total:')).toBe(false);
    });
  });

  describe('with evaluators and guardrails', () => {
    beforeEach(() => {
      mockRegistry.getInstalledTools.mockReturnValue([
        {
          id: 'code-quality',
          name: 'Code Quality Evaluator',
          version: '1.0.0',
          type: 'evaluator',
          installedPath: '~/.claude/tools/evaluator/code-quality',
          installedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'pii-detector',
          name: 'PII Detector',
          version: '2.0.0',
          type: 'guardrail',
          installedPath: '~/.claude/tools/guardrail/pii-detector',
          installedAt: '2024-01-02T00:00:00Z',
        },
      ]);
    });

    it('should show evaluators section', async () => {
      await listCommand();

      expect(consoleMock.contains('Evaluators:')).toBe(true);
      expect(consoleMock.contains('code-quality')).toBe(true);
      expect(consoleMock.contains('v1.0.0')).toBe(true);
    });

    it('should show guardrails section', async () => {
      await listCommand();

      expect(consoleMock.contains('Guardrails:')).toBe(true);
      expect(consoleMock.contains('pii-detector')).toBe(true);
      expect(consoleMock.contains('v2.0.0')).toBe(true);
    });
  });

  describe('execution flow', () => {
    beforeEach(() => {
      mockRegistry.getInstalledTools.mockReturnValue([
        {
          id: 'tool1',
          name: 'Tool 1',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/path/to/tool1',
          installedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'tool2',
          name: 'Tool 2',
          version: '1.0.0',
          type: 'agent',
          installedPath: '/path/to/tool2',
          installedAt: '2024-01-02T00:00:00Z',
        },
      ]);
    });

    it('should complete without errors', async () => {
      await expect(listCommand()).resolves.not.toThrow();
    });

    it('should call getInstalledTools', async () => {
      await listCommand();

      expect(mockRegistry.getInstalledTools).toHaveBeenCalled();
    });
  });

  describe('output formatting', () => {
    beforeEach(() => {
      mockRegistry.getInstalledTools.mockReturnValue([
        {
          id: 'tool1',
          name: 'Tool 1',
          version: '1.0.0',
          type: 'prompt',
          installedPath: '/path/to/tool1',
          installedAt: '2024-01-01T00:00:00Z',
        },
      ]);
    });

    it('should use proper spacing', async () => {
      await listCommand();

      const output = consoleMock.getOutput();

      // Should have multiple lines
      expect(output.split('\n').length).toBeGreaterThan(3);
    });

    it('should highlight important information', async () => {
      await listCommand();

      // List icon should be present
      expect(consoleMock.contains('📋')).toBe(true);
    });
  });
});

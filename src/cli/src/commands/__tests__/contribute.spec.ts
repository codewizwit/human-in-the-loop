import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import { contributeCommand } from '../contribute';

describe('contributeCommand', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('submission process', () => {
    it('should display submission message with type', async () => {
      await contributeCommand('prompt', 'toolkit/prompts/my-prompt');

      expect(consoleMock.contains('📤 Submitting prompt for review')).toBe(
        true
      );
    });

    it('should show validation step', async () => {
      await contributeCommand('agent', 'toolkit/agents/my-agent');

      expect(consoleMock.contains('Validating toolkit/agents/my-agent')).toBe(
        true
      );
    });

    it('should show quality checks step', async () => {
      await contributeCommand('prompt', 'test-path');

      expect(consoleMock.contains('Running quality checks')).toBe(true);
    });

    it('should show creating submission step', async () => {
      await contributeCommand('evaluator', 'test-path');

      expect(consoleMock.contains('Creating submission')).toBe(true);
    });

    it('should display success message', async () => {
      await contributeCommand('prompt', 'test-path');

      expect(consoleMock.contains('Submission created successfully!')).toBe(
        true
      );
      expect(
        consoleMock.contains('Your contribution has been submitted for review')
      ).toBe(true);
    });
  });

  describe('next steps guidance', () => {
    it('should display next steps header', async () => {
      await contributeCommand('prompt', 'test-path');

      expect(consoleMock.contains('Next steps:')).toBe(true);
    });

    it('should list all next steps', async () => {
      await contributeCommand('agent', 'test-path');

      const output = consoleMock.getOutput();

      expect(output).toContain('Create a pull request with your changes');
      expect(output).toContain('Wait for peer review');
      expect(output).toContain('Address any feedback');
      expect(output).toContain('Approval and merge');
    });

    it('should reference CONTRIBUTING.md', async () => {
      await contributeCommand('prompt', 'test-path');

      expect(consoleMock.contains('CONTRIBUTING.md')).toBe(true);
    });
  });

  describe('with different tool types', () => {
    it('should handle prompt submission', async () => {
      await contributeCommand('prompt', 'toolkit/prompts/test');

      expect(consoleMock.contains('Submitting prompt')).toBe(true);
    });

    it('should handle agent submission', async () => {
      await contributeCommand('agent', 'toolkit/agents/test');

      expect(consoleMock.contains('Submitting agent')).toBe(true);
    });

    it('should handle evaluator submission', async () => {
      await contributeCommand('evaluator', 'toolkit/evaluators/test');

      expect(consoleMock.contains('Submitting evaluator')).toBe(true);
    });

    it('should handle guardrail submission', async () => {
      await contributeCommand('guardrail', 'toolkit/guardrails/test');

      expect(consoleMock.contains('Submitting guardrail')).toBe(true);
    });
  });

  describe('execution flow', () => {
    it('should complete without errors', async () => {
      await expect(
        contributeCommand('prompt', 'test-path')
      ).resolves.not.toThrow();
    });

    it('should show all steps in order', async () => {
      await contributeCommand('prompt', 'test-path');

      const lines = consoleMock.getLines();
      const validationIndex = lines.findIndex((l) => l.includes('Validating'));
      const qualityIndex = lines.findIndex((l) =>
        l.includes('Running quality checks')
      );
      const submissionIndex = lines.findIndex((l) =>
        l.includes('Creating submission')
      );
      const successIndex = lines.findIndex((l) =>
        l.includes('Submission created successfully')
      );

      // Verify order
      expect(validationIndex).toBeGreaterThan(-1);
      expect(qualityIndex).toBeGreaterThan(validationIndex);
      expect(submissionIndex).toBeGreaterThan(qualityIndex);
      expect(successIndex).toBeGreaterThan(submissionIndex);
    });
  });

  describe('output formatting', () => {
    it('should use proper spacing', async () => {
      await contributeCommand('prompt', 'test-path');

      const output = consoleMock.getOutput();

      // Should have blank lines for readability
      expect(output.split('\n').length).toBeGreaterThan(8);
    });

    it('should highlight important information', async () => {
      await contributeCommand('prompt', 'test-path');

      // Submission icon should be present
      expect(consoleMock.contains('📤')).toBe(true);
    });
  });
});

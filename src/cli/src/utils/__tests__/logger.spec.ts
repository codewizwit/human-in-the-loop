import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createConsoleMock } from '../../test-utils';
import {
  logSuccess,
  logError,
  logInfo,
  logWarning,
  logStep,
  logTip,
  logHeader,
  logListItem,
  log,
  logNewLine,
} from '../logger';

describe('logger', () => {
  let consoleMock: ReturnType<typeof createConsoleMock>;

  beforeEach(() => {
    consoleMock = createConsoleMock();
    consoleMock.start();
  });

  afterEach(() => {
    consoleMock.stop();
    consoleMock.clear();
  });

  describe('logSuccess', () => {
    it('should log success message with checkmark', () => {
      logSuccess('Operation completed');

      expect(consoleMock.contains('✓')).toBe(true);
      expect(consoleMock.contains('Operation completed')).toBe(true);
    });
  });

  describe('logError', () => {
    it('should log error message with X', () => {
      logError('Something went wrong');

      expect(consoleMock.contains('✗')).toBe(true);
      expect(consoleMock.contains('Something went wrong')).toBe(true);
    });
  });

  describe('logInfo', () => {
    it('should log info message', () => {
      logInfo('Processing request...');

      expect(consoleMock.contains('Processing request...')).toBe(true);
    });
  });

  describe('logWarning', () => {
    it('should log warning message with icon', () => {
      logWarning('Deprecated feature');

      expect(consoleMock.contains('⚠')).toBe(true);
      expect(consoleMock.contains('Deprecated feature')).toBe(true);
    });
  });

  describe('logStep', () => {
    it('should log step message with arrow', () => {
      logStep('Installing dependencies...');

      expect(consoleMock.contains('→')).toBe(true);
      expect(consoleMock.contains('Installing dependencies...')).toBe(true);
    });
  });

  describe('logTip', () => {
    it('should log tip message with lightbulb', () => {
      logTip('Use --help for more info');

      expect(consoleMock.contains('💡')).toBe(true);
      expect(consoleMock.contains('Use --help for more info')).toBe(true);
    });
  });

  describe('logHeader', () => {
    it('should log header message', () => {
      logHeader('Available Commands');

      expect(consoleMock.contains('Available Commands')).toBe(true);
    });
  });

  describe('logListItem', () => {
    it('should log list item with bullet', () => {
      logListItem('First item');

      expect(consoleMock.contains('•')).toBe(true);
      expect(consoleMock.contains('First item')).toBe(true);
    });
  });

  describe('log', () => {
    it('should log plain message', () => {
      log('Plain text');

      expect(consoleMock.contains('Plain text')).toBe(true);
    });
  });

  describe('logNewLine', () => {
    it('should log empty line', () => {
      const linesBefore = consoleMock.getLines().length;
      logNewLine();
      const linesAfter = consoleMock.getLines().length;

      expect(linesAfter).toBe(linesBefore + 1);
    });
  });

  describe('output formatting', () => {
    it('should maintain proper visual hierarchy', () => {
      logHeader('Installation');
      logStep('Downloading...');
      logSuccess('Downloaded');
      logNewLine();
      logTip('Run hitl --help for more info');

      const output = consoleMock.getOutput();

      // Verify all components are present
      expect(output).toContain('Installation');
      expect(output).toContain('Downloading...');
      expect(output).toContain('Downloaded');
      expect(output).toContain('Run hitl --help');
    });
  });
});

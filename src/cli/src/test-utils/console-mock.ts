/**
 * Mock console for testing CLI output
 */
export class ConsoleMock {
  private logs: string[] = [];
  private originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
  };

  /**
   * Start capturing console output
   */
  start(): void {
    console.log = (...args: unknown[]): void => {
      this.logs.push(args.map(String).join(' '));
    };
    console.error = (...args: unknown[]): void => {
      this.logs.push('[ERROR] ' + args.map(String).join(' '));
    };
    console.warn = (...args: unknown[]): void => {
      this.logs.push('[WARN] ' + args.map(String).join(' '));
    };
  }

  /**
   * Stop capturing and restore original console
   */
  stop(): void {
    console.log = this.originalConsole.log;
    console.error = this.originalConsole.error;
    console.warn = this.originalConsole.warn;
  }

  /**
   * Get all captured output
   */
  getOutput(): string {
    return this.logs.join('\n');
  }

  /**
   * Get captured output as array
   */
  getLines(): string[] {
    return [...this.logs];
  }

  /**
   * Clear captured output
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Check if output contains text
   */
  contains(text: string): boolean {
    return this.logs.some((line) => line.includes(text));
  }

  /**
   * Check if output matches pattern
   */
  matches(pattern: RegExp): boolean {
    return this.logs.some((line) => pattern.test(line));
  }
}

/**
 * Creates a new console mock for a test
 */
export function createConsoleMock(): ConsoleMock {
  return new ConsoleMock();
}

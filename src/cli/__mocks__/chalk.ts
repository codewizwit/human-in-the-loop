/**
 * Mock for chalk to avoid ESM issues in Jest
 */
const mockChalk = {
  green: (str: string) => str,
  red: (str: string) => str,
  blue: (str: string) => str,
  yellow: (str: string) => str,
  gray: (str: string) => str,
  white: (str: string) => str,
  bold: (str: string) => str,
  dim: (str: string) => str,
};

export default mockChalk;

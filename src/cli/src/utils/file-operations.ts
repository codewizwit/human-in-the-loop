import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively copies a directory from source to destination
 */
export async function copyDirectory(
  source: string,
  destination: string
): Promise<void> {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 */
export function ensureDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Checks if a path exists
 */
export function pathExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Reads a JSON file and returns its contents
 */
export function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Writes data to a JSON file
 */
export function writeJsonFile<T>(filePath: string, data: T): void {
  const dirPath = path.dirname(filePath);
  ensureDirectory(dirPath);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Gets the home directory path
 */
export function getHomeDirectory(): string {
  return process.env.HOME || process.env.USERPROFILE || '/';
}

/**
 * Resolves a path, expanding ~ to home directory
 */
export function resolvePath(inputPath: string): string {
  if (inputPath.startsWith('~/') || inputPath === '~') {
    return path.join(getHomeDirectory(), inputPath.slice(1));
  }

  return path.resolve(inputPath);
}

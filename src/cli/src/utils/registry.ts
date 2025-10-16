import * as path from 'path';
import {
  readJsonFile,
  writeJsonFile,
  getHomeDirectory,
  ensureDirectory,
} from './file-operations';

/**
 * Represents an installed tool in the registry
 */
export interface InstalledTool {
  id: string;
  name: string;
  version: string;
  type: string;
  installedPath: string;
  installedAt: string;
}

/**
 * Registry structure
 */
export interface Registry {
  version: string;
  installations: InstalledTool[];
}

/**
 * Gets the registry file path
 */
export function getRegistryPath(): string {
  const homeDir = getHomeDirectory();
  return path.join(homeDir, '.hit', 'registry.json');
}

/**
 * Loads the registry from disk
 */
export function loadRegistry(): Registry {
  const registryPath = getRegistryPath();
  const registry = readJsonFile<Registry>(registryPath);

  if (!registry) {
    return {
      version: '1.0.0',
      installations: [],
    };
  }

  return registry;
}

/**
 * Saves the registry to disk
 */
export function saveRegistry(registry: Registry): void {
  const registryPath = getRegistryPath();
  const registryDir = path.dirname(registryPath);

  ensureDirectory(registryDir);
  writeJsonFile(registryPath, registry);
}

/**
 * Adds a tool installation to the registry
 */
export function registerInstallation(tool: InstalledTool): void {
  const registry = loadRegistry();

  registry.installations = registry.installations.filter(
    (t) => t.id !== tool.id
  );

  registry.installations.push(tool);

  saveRegistry(registry);
}

/**
 * Removes a tool installation from the registry
 */
export function unregisterInstallation(toolId: string): void {
  const registry = loadRegistry();

  registry.installations = registry.installations.filter(
    (t) => t.id !== toolId
  );

  saveRegistry(registry);
}

/**
 * Gets all installed tools from the registry
 */
export function getInstalledTools(): InstalledTool[] {
  const registry = loadRegistry();
  return registry.installations;
}

/**
 * Checks if a tool is already installed
 */
export function isToolInstalled(toolId: string): boolean {
  const registry = loadRegistry();
  return registry.installations.some((t) => t.id === toolId);
}

/**
 * Gets a specific installed tool
 */
export function getInstalledTool(toolId: string): InstalledTool | null {
  const registry = loadRegistry();
  return registry.installations.find((t) => t.id === toolId) || null;
}

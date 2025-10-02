import { type Location } from './detector.js';
import { detectGlobal } from './global.js';
import { detectRoot } from './root.js';

/**
 * Locates a package by checking local and global installations.
 * @param name - Name of the package to locate.
 * @returns Promise resolving to a Location object with the package's installation details, prioritizing local over global.
 */
export const locatePackage = async (name: string): Promise<Location> => {
  const local = await detectRoot(name);
  if (local.isInstalled) return local;

  const global = await detectGlobal(name);
  if (global.isInstalled) return global;

  return local;
};

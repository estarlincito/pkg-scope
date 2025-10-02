import { type Location, PackageDetector } from './detector.js';

/**
 * Detects the global installation location of a package.
 * @param name - Name of the package to detect.
 * @returns Promise resolving to a Location object with the package's global installation details.
 */
export const detectGlobal = async (name: string): Promise<Location> =>
  new PackageDetector()
    .name(name)
    .command('npm', 'npm root -g')
    .command('pnpm', 'pnpm root -g')
    .command('yarn', 'yarn global dir')
    .location();

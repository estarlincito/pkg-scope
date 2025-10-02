import { type Location, PackageDetector } from './detector.js';

/**
 * Detects the local installation location of a package in the current working directory.
 * @param name - Name of the package to detect.
 * @returns Promise resolving to a Location object with the package's local installation details.
 */
export const detectRoot = async (name: string): Promise<Location> =>
  new PackageDetector()
    .name(name)
    .localOnly()
    .command('npm', 'node dist/scripts/cwd.js')
    .command('pnpm', 'node dist/scripts/cwd.js')
    .command('yarn', 'node dist/scripts/cwd.js')
    .location();

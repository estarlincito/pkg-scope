/* eslint-disable security/detect-non-literal-fs-filename */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { handleError } from '@/utils/error.js';
import { execSilent } from '@/utils/exec.js';

/** Supported package managers. */
export type PackageManager = 'yarn' | 'pnpm' | 'npm';

/**
 * Detects available package managers by checking lock files or version commands.
 * @param localOnly - If true, only checks for lock files in the current directory. Defaults to false.
 * @returns Promise resolving to an array of detected package managers.
 * @throws Error if no package managers are found.
 */
export const detectPackageManager = async (
  localOnly = false,
): Promise<PackageManager[]> => {
  const managers: readonly { lockFileName: string; pm: PackageManager }[] = [
    { lockFileName: 'pnpm-lock.yaml', pm: 'pnpm' },
    { lockFileName: 'yarn.lock', pm: 'yarn' },
    { lockFileName: 'package-lock.json', pm: 'npm' },
  ];

  const detected = await Promise.all(
    managers.map(async ({ pm, lockFileName }) => {
      try {
        if (localOnly) {
          if (existsSync(join(process.cwd(), lockFileName))) {
            return pm;
          }
          return null;
        }

        await execSilent(`${pm} --version`);
        return pm;
      } catch {
        return null;
      }
    }),
  );

  const result = detected.filter((pm): pm is PackageManager => pm !== null);

  if (result.length === 0) {
    throw handleError('No package manager found');
  }

  return result;
};

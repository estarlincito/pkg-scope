/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { askConfirm } from 'askzen';
import { error, log, warn } from 'lumilog';
import { spawnStream } from 'spawnix';

import { locatePackage } from './locate.js';

const installCommands = {
  '-d': {
    npm: ['install'],
    pnpm: ['add'],
    yarn: ['add'],
  },
  '-D': {
    npm: ['install', '--save-dev'],
    pnpm: ['add', '--save-dev'],
    yarn: ['add', '--dev'],
  },
  '-g': {
    npm: ['install', '-g'],
    pnpm: ['add', '-g'],
    yarn: ['global', 'add'],
  },
  '-w': {
    npm: ['install', '--workspace'],
    pnpm: ['add', '-w'],
    yarn: ['workspace'],
  },
};

/** Supported installation flags for package managers. */
export type Flag = keyof typeof installCommands;

/**
 * Prompts to install a package if not already installed, using the detected package manager.
 * @param name - Name of the package to install.
 * @param flag - Installation flag (e.g., '-d' for default, '-D' for dev). Defaults to '-d'.
 * @returns Promise resolving to a Location object with the package's installation details.
 */
export const askInstall = async (name: string, flag: Flag = '-d') => {
  const located = await locatePackage(name);

  if (!located.isInstalled) {
    const confirm = await askConfirm(
      `? Install ${located.name} with ${located.packageManager}? [y/N]: `,
    );

    if (confirm) {
      try {
        const args = [
          ...installCommands[flag][located.packageManager],
          located.name,
        ];
        log(located.packageManager, ...args);
        await spawnStream(located.packageManager, args);
        return { ...located, flag, isInstalled: true };
      } catch (err: any) {
        error(`Failed to install ${located.name}: ${err.message}`);
      }
    }
    warn('Skipped installation.');
  }

  return { ...located, flag };
};

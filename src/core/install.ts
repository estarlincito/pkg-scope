/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { askConfirm } from 'askzen';
import { error, log, success } from 'lumilog';

import { execSilent } from '@/utils/exec.js';

import { locatePackage } from './locate.js';

const installCommands = {
  '-d': {
    npm: 'npm install',
    pnpm: 'pnpm add',
    yarn: 'yarn add',
  },
  '-D': {
    npm: 'npm install --save-dev',
    pnpm: 'pnpm add --save-dev',
    yarn: 'yarn add --dev',
  },
  '-g': {
    npm: 'npm install -g',
    pnpm: 'pnpm add -g',
    yarn: 'yarn global add',
  },
  '-w': {
    npm: 'npm install --workspace',
    pnpm: 'pnpm add -w',
    yarn: 'yarn workspace',
  },
};

/** Supported installation flags for package managers. */
export type Flag = keyof typeof installCommands;

/**
 * Prompts to install a package if not already installed, using the detected package manager.
 * @param name - Name of the package to install.
 * @param flag - Installation flag (e.g., '-d' for default, '-D' for dev). Defaults to '-d'.
 * @returns Promise that resolves when the operation completes (no value returned).
 */
export const askInstall = async (name: string, flag: Flag = '-d') => {
  const located = await locatePackage(name);

  if (!located.isInstalled) {
    const confirm = await askConfirm(
      `Would you like to install '${located.name}' using ${located.packageManager}? (y/n): `,
    );

    if (confirm) {
      log(
        `Starting installation of ${located.name} with ${located.packageManager}...`,
      );

      try {
        const cmd = `${installCommands[flag][located.packageManager]} ${located.name}`;
        await execSilent(cmd);
        success(`${located.name} installed successfully!`);
      } catch (err: any) {
        error(`Failed to install ${located.name}: ${err.message}`);
      }
    }
  }
};

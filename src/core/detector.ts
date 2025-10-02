/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-await-in-loop */

import fs from 'node:fs';
import path from 'node:path';

import { handleError } from '@/utils/error.js';
import { execSilent } from '@/utils/exec.js';

import { detectPackageManager, type PackageManager } from './pm.js';

/** Interface defining the result of a package location check. */
export interface Location {
  /** Whether the package is installed. */
  isInstalled: boolean;
  /** Path to the package, if installed. */
  path?: string;
  /** Error message, if the package is not found. */
  error?: string;
  /** Package manager used for detection. */
  packageManager: PackageManager;
  /** Name of the package. */
  name: string;
}

/**
 * Detects the location of a package using specified package managers.
 */
export class PackageDetector {
  #localOnly: boolean = false;
  #name: string = '';
  readonly #commands: Map<string, string> = new Map<string, string>();

  /**
   * Sets the package name to detect.
   * @param name - Name of the package.
   * @returns This instance for chaining.
   */
  name(name: string) {
    this.#name = name;
    return this;
  }

  /**
   * Sets the command to execute for a package manager.
   * @param packageManager - The package manager (e.g., npm, yarn).
   * @param cmd - Command to locate the package.
   * @returns This instance for chaining.
   */
  command(packageManager: PackageManager, cmd: string) {
    this.#commands.set(packageManager, cmd);
    return this;
  }

  /**
   * Restricts detection to local package managers only.
   * @returns This instance for chaining.
   */
  localOnly() {
    this.#localOnly = true;
    return this;
  }

  /**
   * Retrieves the current configuration.
   * @returns Object containing the commands, localOnly flag, and package name.
   */
  getDefinitions() {
    return {
      commands: this.#commands,
      localOnly: this.#localOnly,
      name: this.#name,
    };
  }

  /**
   * Detects the location of the package.
   * @returns Promise resolving to a Location object with detection results.
   * @throws Error if package name is not set.
   */
  async location() {
    if (!this.#name) {
      throw handleError('Package name and version are required');
    }

    const packageManagers = await detectPackageManager(this.#localOnly);

    for (const packageManager of packageManagers) {
      const cmd = this.#commands.get(packageManager);
      if (!cmd) continue;

      const stdout = await execSilent(cmd);
      if (!stdout) continue;

      const dir = path.join(
        stdout.endsWith('node_modules') ? stdout : `${stdout}/node_modules`,
        this.#name,
      );

      if (!fs.existsSync(dir)) continue;

      return {
        isInstalled: true,
        name: this.#name,
        packageManager,
        path: dir,
      };
    }

    return {
      error: `${this.#name} is not installed`,
      isInstalled: false,
      name: this.#name,
      packageManager: packageManagers[0],
    };
  }
}

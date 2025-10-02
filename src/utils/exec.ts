import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export const execSilent = async (cmd: string): Promise<string | null> => {
  try {
    const { stdout } = await execAsync(cmd, {
      encoding: 'utf8',
    });

    return stdout.trim() || null;
  } catch {
    return null;
  }
};

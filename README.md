# pkg-scope 📦

[![NPM version](https://img.shields.io/npm/v/pkg-scope.svg?style=flat)](https://npmjs.org/package/pkg-scope)

> A friendly utility to detect and install packages with npm, pnpm, or yarn! 🚀

---

## Features ✨

- 🔍 Detects if a package is installed locally or globally.
- 🛠️ Supports npm, pnpm, and yarn package managers.
- 🙋 Prompts to install missing packages with a single command.
- ⚙️ Flexible installation options (default, dev, global, workspace).
- 🧩 TypeScript support for a modern development experience.

---

## Installation 📲

Get started in seconds! Install `pkg-scope` with your favorite package manager:

```bash
npm install pkg-scope
# or
pnpm add pkg-scope
# or
yarn add pkg-scope
```

---

## Usage 🎉

Use `pkg-scope` to check and install packages effortlessly.

### API

- **`locatePackage(name: string): Promise<Location>`**  
  🔎 Checks if a package is installed locally or globally.  
  Returns a `Location` object with details (e.g., `isInstalled`, `path`, `packageManager`).

  ```typescript
  import { locatePackage } from 'pkg-scope';

  const result = await locatePackage('lodash');
  console.log(result); // { isInstalled: true, path: '/path/to/node_modules/lodash', ... }
  ```

- **`askInstall(name: string, flag: '-d' | '-D' | '-g' | '-w'): Promise<void>`**  
  🙋 Prompts to install a package if not found, using the detected package manager.  
  Supports flags: `-d` (default), `-D` (dev), `-g` (global), `-w` (workspace).

  ```typescript
  import { askInstall } from 'pkg-scope';

  await askInstall('typescript', '-D'); // Prompts to install typescript as a dev dependency
  ```

---

## License 📄

MIT License – see [LICENSE](LICENSE).
**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))

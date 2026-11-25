# How myRequire Works

### 1. Resolve

First, `myRequire` resolves the requested file path into an absolute filename. It checks whether the exact path exists and then tries `.js`, `.json`, and folder resolution.

### 2. Create Module

After finding the file, `myRequire` creates a module object with three properties: `exports`, `filename`, and `loaded`. The `exports` object stores the values that the module shares with other files.

### 3. Wrap

For JavaScript files, the loader reads the source code and wraps it in a function using `vm.compileFunction()`. The wrapper receives five parameters: `exports`, `require`, `module`, `__filename`, and `__dirname`.

### 4. Run

The loader executes the wrapped function with `module.exports` as `this`. Each module gets its own `require` function, which resolves paths relative to that module's directory.

### 5. Cache and Return

Before executing the module code, `myRequire` stores the module object in the cache using its absolute filename as the key. After execution, it sets `module.loaded` to `true` and returns `module.exports`. If the module is already cached, it returns the cached exports instead of executing the code again.

## Resolution Order

The loader searches for a module in the following order:

1. **Exact path** – Checks if the requested path exists as a file.
2. **`.js` extension** – Tries the requested path with `.js` added.
3. **`.json` extension** – Tries the requested path with `.json` added.
4. **Folder resolution** – If the path is a directory:
   - Checks `package.json` for a `"main"` field and loads the specified file.
   - If there is no `"main"` field, loads `index.js`.

If no matching file is found, the loader throws an error with the code `MODULE_NOT_FOUND`.

## Why Is the Cache Filled Before Execution?

The module is added to the cache before its code is executed. This is important for handling circular dependencies.

A circular dependency happens when two modules require each other. For example, module `a.js` requires `b.js`, and `b.js` requires `a.js`.

When `b.js` requires `a.js`, the loader finds `a.js` in the cache and returns its current exports instead of loading it again. At that moment, `a.js` may not have finished executing, so `b.js` receives its partially initialized exports.

This prevents infinite loading loops and allows circular dependencies to work similarly to Node.js.

## Limitations Compared to Node.js

This implementation supports the main CommonJS loading features required by the project, but it does not implement every feature of Node.js `require()`.

Some limitations are:

1. **Built-in modules:** It does not support loading Node.js built-in modules such as `fs`, `path`, or `http` through `myRequire()`.
2. **`node_modules` lookup:** It does not search parent directories for packages inside `node_modules`.
3. **Advanced resolution:** It does not fully support all Node.js resolution rules, such as every possible `package.json` configuration.

These features are handled by the real Node.js module system but are outside the scope of this implementation.

## What I Learned

One thing I learned is that a module must be added to the cache before its code finishes executing. I initially thought caching happened only after loading was complete. However, the circular dependency example showed me why this is important: it allows modules to require each other without creating an infinite loading loop.

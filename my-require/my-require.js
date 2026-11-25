const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function resolveFilename(request, fromDir) {
  const filename = path.resolve(fromDir, request);

  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    return filename;
  }

  if (fs.existsSync(filename + ".js")) {
    return filename + ".js";
  }
  if (fs.existsSync(filename + ".json")) {
    return filename + ".json";
  }
  if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) {
    const packagePath = path.join(filename, "package.json");

    if (fs.existsSync(packagePath)) {
      const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));

      if (packageData.main) {
        const mainPath = path.resolve(filename, packageData.main);

        if (fs.existsSync(mainPath)) {
          return mainPath;
        }

        if (fs.existsSync(mainPath + ".js")) {
          return mainPath + ".js";
        }
      }
    }
    const indexPath = path.join(filename, "index.js");

    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  const error = new Error(`Cannot find module '${request}'`);
  error.code = "MODULE_NOT_FOUND";
  throw error;
}

function loadModule(filename, module) {
  const code = fs.readFileSync(filename, "utf8");
  if (path.extname(filename) === ".json") {
    module.exports = JSON.parse(fs.readFileSync(filename, "utf8"));
    module.loaded = true;
    return module.exports;
  }

  const wrapper = vm.compileFunction(
    code,
    ["exports", "require", "module", "__filename", "__dirname"],
    { filename },
  );

  const localRequire = (request) => {
    return myRequire(request, path.dirname(filename));
  };
  wrapper.call(
    module.exports,
    module.exports,
    localRequire,
    module,
    filename,
    path.dirname(filename),
  );
  module.loaded = true;
  return module.exports;
}

const myCache = {};

function myRequire(request, fromDir = process.cwd()) {
  const filename = resolveFilename(request, fromDir);

  if (myCache[filename]) {
    return myCache[filename].exports;
  }
  const module = {
    exports: {},
    filename,
    loaded: false,
  };

  myCache[filename] = module;

  loadModule(filename, module);

  return module.exports;
}

myRequire.cache = myCache;

module.exports = myRequire;

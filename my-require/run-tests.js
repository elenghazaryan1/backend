const path = require("node:path");
const myRequire = require("./my-require");

myRequire("./main", path.join(__dirname, "test-app"));

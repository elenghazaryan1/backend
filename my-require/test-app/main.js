const math = require("./math");
console.log("1. add:", math.add(2, 3));

const c1 = require("./counter");
const c2 = require("./counter");
c1.increment();
console.log("2. same object:", c1 === c2, "count:", c2.increment());

const config = require("./config");
console.log("3. json:", config.appName);

const utils = require("./utils");
console.log("4. folder index:", utils.upper("hello"));

console.log("5. package main:", require("./lib-pkg"));

try {
  require("./nope");
} catch (e) {
  console.log("6. error:", e.code, "-", e.message);
}

require("./cycle/a");

console.log("7. __dirname ends with test-app:", __dirname.endsWith("test-app"));

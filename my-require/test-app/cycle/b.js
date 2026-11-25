exports.done = false;

const a = require("./a");

console.log("in b, a.done =", a.done);

exports.done = true;

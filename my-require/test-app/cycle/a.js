exports.done = false;

const b = require("./b");

console.log("in a, b.done =", b.done);

exports.done = true;

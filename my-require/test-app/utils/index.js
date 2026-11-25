const log = require("../shared/logger");

exports.upper = (s) => {
  log("upper called");
  return s.toUpperCase();
};

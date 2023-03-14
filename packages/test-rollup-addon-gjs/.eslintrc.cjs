"use strict";

const { configs } = require("@nullvoxpopuli/eslint-configs");

// accommodates: JS, TS, ESM, and CJS
let config = configs.node();

module.exports = {
  overrides: [...config.overrides],
};

"use strict";

const { configs } = require("@nullvoxpopuli/eslint-configs");

let config = configs.ember();

module.exports = {
  overrides: [...config.overrides],
};

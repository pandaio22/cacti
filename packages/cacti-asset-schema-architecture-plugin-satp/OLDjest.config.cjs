//ADDED TO TROUBLESHOOT
const { createDefaultEsmPreset } = require("ts-jest");

const defaultEsmPreset = createDefaultEsmPreset();

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  // [... whatever else you want to configure]
  ...defaultEsmPreset,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
////////////////////////////////////////////////
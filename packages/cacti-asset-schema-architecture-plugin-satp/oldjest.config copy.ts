import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";
// https://kulshekhar.github.io/ts-jest/docs/getting-started/options
const config: Config = {
  // [...]
  ...createDefaultPreset(),
  //ADDED AFTER TO TEST...................
  preset: "ts-jest/presets/default-esm",

  extensionsToTreatAsEsm: [".ts"],

  //globals: {
  //  "ts-jest": {
  //    useESM: true,
  //  },
  //},

  // Modern ts-jest configuration (replaces globals)
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  transformIgnorePatterns: [
    "node_modules/(?!(@digitalbazaar/.*|@digitalbazaar/vc/lib/index.js|@veramo/core/.*|did-resolver|ethr-did-resolver|web-did-resolver))",
  ],

  testEnvironment: "node",

  // Add module name mapping to handle .js extensions in imports
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  //.............................................
};
/*
const config2: Config = {
  preset: "ts-jest/presets/default-esm", // ESM preset
  extensionsToTreatAsEsm: [".ts"], // treat TS files as ESM
  testEnvironment: "node",

  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },

  // Transform ESM packages from node_modules
  transformIgnorePatterns: ["node_modules/(?!(@digitalbazaar/.*))"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Needed if imports have .js extensions
  },

  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};*/

export default config;

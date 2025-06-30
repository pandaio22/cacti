import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";
// https://kulshekhar.github.io/ts-jest/docs/getting-started/options
const config: Config = {
  // [...]
  ...createDefaultPreset(),
};

export default config;

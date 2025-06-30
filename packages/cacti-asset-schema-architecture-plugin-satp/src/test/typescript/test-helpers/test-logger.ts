// src/test/typescript/test-helpers/test-logger.ts

import {
  LoggerProvider,
  LogLevelDesc,
  Logger,
} from "@hyperledger/cactus-common";

// You can override via environment variable for easy CI debugging
const logLevel: LogLevelDesc =
  (process.env.TEST_LOG_LEVEL as LogLevelDesc) || "INFO";

/**
 * Creates a logger for test files, with optional label.
 * @param label The label to associate with the logger (usually the test file or schema name)
 * @returns Logger instance
 */
export function createTestLogger(label: string): Logger {
  return LoggerProvider.getOrCreate({
    level: logLevel,
    label: label,
  });
}

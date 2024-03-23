/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  logHeapUsage: true,
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.jsx?$": "$1",
  },
  modulePathIgnorePatterns: ["./weaver/core"],
  maxWorkers: 1,
  maxConcurrency: 1,
  setupFilesAfterEnv: ["jest-extended/all", "./jest.setup.console.logs.js"],
  testTimeout: 60 * 60 * 1000,
  moduleNameMapper: {
    "^(.+)/(.+)_pb\\.js$": "$1/$2_pb",
  },
  testMatch: [
    `**/cactus-*/src/test/typescript/{unit,integration,benchmark}/**/*.test.ts`,
    `**/cacti-*/src/test/typescript/{unit,integration,benchmark}/**/*.test.ts`,
  ],
  // Ignore the tests that are still using tap/tape for as their test runner
  testPathIgnorePatterns: [
    `./packages/cactus-plugin-ledger-connector-ethereum/src/test/typescript/manual/geth-alchemy-integration-manual-check.test.ts`,
    `./packages/cactus-plugin-keychain-aws-sm/src/test/typescript/integration/plugin-factory-keychain.test.ts`,
    `./packages/cactus-plugin-keychain-aws-sm/src/test/typescript/integration/plugin-factory-keychain.test.ts`,
    `./packages/cactus-plugin-keychain-azure-kv/src/test/typescript/integration/plugin-keychain-azure-kv.test.ts`,
    `./packages/cactus-test-plugin-htlc-eth-besu-erc20/src/test/typescript/integration/plugin-htlc-eth-besu-erc20/openapi/openapi-validation.test.ts`,
    `./packages/cactus-plugin-ledger-connector-corda/src/test/typescript/integration/openapi/openapi-validation.test.ts`,
    `./packages/cactus-plugin-ledger-connector-corda/src/test/typescript/integration/flow-database-access-v4.8.test.ts`,
    `./packages/cactus-test-plugin-consortium-manual/src/test/typescript/integration/plugin-consortium-manual/openapi/openapi-validation.test.ts`,
    `./packages/cactus-plugin-ledger-connector-besu/src/test/typescript/integration/plugin-ledger-connector-besu/deploy-contract/v21-get-record-locator.test.ts`,
    `./packages/cactus-plugin-ledger-connector-besu/src/test/typescript/integration/plugin-ledger-connector-besu/deploy-contract/private-deploy-contract-from-json-web3-eea.test.ts`,
    `./packages/cactus-plugin-ledger-connector-xdai/src/test/typescript/integration/deploy-contract-from-json-xdai-json-object.test.ts`,
    `./packages/cactus-plugin-ledger-connector-xdai/src/test/typescript/integration/invoke-contract-xdai-json-object.test.ts`,
    `./packages/cactus-plugin-ledger-connector-xdai/src/test/typescript/integration/openapi/openapi-validation.test.ts`,
    `./packages/cactus-plugin-ledger-connector-xdai/src/test/typescript/integration/openapi/openapi-validation-no-keychain.test.ts`,
    `./packages/cactus-test-plugin-ledger-connector-besu/src/test/typescript/integration/plugin-validator-besu/v21-sign-transaction-endpoint.test.ts`,
    `./packages/cactus-plugin-keychain-vault/src/test/typescript/integration/cactus-keychain-vault-server.test.ts`,
    `./packages/cactus-plugin-keychain-vault/src/test/typescript/integration/plugin-keychain-vault.test.ts`,
    `./packages/cactus-plugin-keychain-vault/src/test/typescript/integration/openapi/openapi-validation.test.ts`,
    `./packages/cactus-test-tooling/src/test/typescript/integration/fabric/fabric-test-ledger-v1/constructor-validates-options.test.ts`,
    `./packages/cactus-test-tooling/src/test/typescript/integration/substrate/substrate-test-ledger-constructor.test.ts`,
    `./packages/cactus-test-tooling/src/test/typescript/integration/substrate/substrate-test-ledger-multiple-concurrent.test.ts`,
    `./packages/cactus-test-tooling/src/test/typescript/integration/besu/besu-test-ledger/constructor-validates-options.test.ts`,
    `./packages/cactus-test-plugin-htlc-eth-besu/src/test/typescript/integration/plugin-htlc-eth-besu/get-single-status-endpoint.test.ts`,
    `./packages/cactus-test-plugin-htlc-eth-besu/src/test/typescript/integration/plugin-htlc-eth-besu/get--status-endpoint-invalid.test.ts`,
    `./packages/cactus-test-plugin-htlc-eth-besu/src/test/typescript/integration/plugin-htlc-eth-besu/openapi/openapi-validation.test.ts`,
    `./packages/cactus-cmd-api-server/src/test/typescript/unit/plugins/install-basic-plugin-ledger-connector-fabric-0-7-0.test.ts`,
    `./packages/cactus-cmd-api-server/src/test/typescript/unit/config/self-signed-certificate-generator/generates-working-certificates.test.ts`,
    `./packages/cactus-cmd-api-server/src/test/typescript/unit/config/self-signed-certificate-generator/certificates-work-for-mutual-tls.test.ts`,
    `./packages/cactus-cmd-api-server/src/test/typescript/unit/grpc-js-proto-loader-client-healthcheck.test.ts`,
    `./packages/cactus-cmd-api-server/src/test/typescript/unit/grpc-proto-gen-ts-client-m-tls-enabled.test.ts`,
    `./extensions/cactus-plugin-object-store-ipfs/src/test/typescript/integration/plugin-object-store-ipfs.test.ts`,
    `./extensions/cactus-plugin-object-store-ipfs/src/test/typescript/unit/plugin-object-store-ipfs.test.ts`,
    `./examples/cactus-example-carbon-accounting-backend/src/test/typescript/integration/admin-enroll-v1-endpoint.test.ts`,
    `./examples/cactus-example-supply-chain-backend/src/test/typescript/integration/supply-chain-backend-api-calls.test.ts`,
    `./examples/cactus-example-supply-chain-backend/src/test/typescript/integration/supply-chain-cli-via-npm-script.test.ts`,
  ],
};

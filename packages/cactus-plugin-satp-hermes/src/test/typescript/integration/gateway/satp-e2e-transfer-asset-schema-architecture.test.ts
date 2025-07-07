/*
import "jest-extended";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { v4 as uuidv4 } from "uuid";
import {
  pruneDockerAllIfGithubAction,
  Containers,
} from "@hyperledger/cactus-test-tooling";
import {
  SATPGatewayConfig,
  SATPGateway,
  PluginFactorySATPGateway,
  TransactionApi,
  Configuration,
  GetApproveAddressApi,
  TokenType,
} from "../../../../main/typescript";
import {
  Address,
  GatewayIdentity,
} from "../../../../main/typescript/core/types";
import {
  IPluginFactoryOptions,
  PluginImportType,
} from "@hyperledger/cactus-core-api";
import { ClaimFormat } from "../../../../main/typescript/generated/proto/cacti/satp/v02/common/message_pb";
import {
  BesuTestEnvironment,
  FabricTestEnvironment,
  getTransactRequest,
  getChangedTransactRequest,
} from "../../test-utils";
import {
  SATP_ARCHITECTURE_VERSION,
  SATP_CORE_VERSION,
  SATP_CRASH_VERSION,
} from "../../../../main/typescript/core/constants";
import { Knex, knex } from "knex";
import { ApiServer } from "@hyperledger/cactus-cmd-api-server";
import { PluginRegistry } from "@hyperledger/cactus-core";
import path from "path";
import { createMigrationSource } from "../../../../main/typescript/database/knex-migration-source";
import { knexRemoteInstance } from "../../../../main/typescript/database/knexfile-remote";
import { knexLocalInstance } from "../../../../main/typescript/database/knexfile";

const logLevel: LogLevelDesc = "DEBUG";
const log = LoggerProvider.getOrCreate({
  level: logLevel,
  label: "SATP - Hermes",
});

const mockBesuEnv = {
  network: "besu-network",
  createBesuConfig: jest.fn().mockReturnValue({ mock: "besuConfig" }),
  getTestContractName: jest.fn().mockReturnValue("MockContract"),
  getTestContractAddress: jest.fn().mockReturnValue("0x123"),
  getTestContractAbi: jest.fn().mockReturnValue([]),
  getTestOwnerAccount: jest.fn().mockReturnValue("0xabc"),
  getTestOwnerSigningCredential: jest.fn().mockReturnValue({}),
  giveRoleToBridge: jest.fn().mockResolvedValue(true),
  approveAmount: jest.fn().mockResolvedValue(true),
  checkBalance: jest.fn().mockResolvedValue(true),
};

const mockFabricEnv = {
  network: "fabric-network",
  createFabricConfig: jest.fn().mockReturnValue({ mock: "fabricConfig" }),
  getTestContractName: jest.fn().mockReturnValue("MockContract"),
  getTestChannelName: jest.fn().mockReturnValue("mychannel"),
  getTestOwnerAccount: jest.fn().mockReturnValue("Org2MSP"),
  getTestOwnerSigningCredential: jest.fn().mockReturnValue({}),
  giveRoleToBridge: jest.fn().mockResolvedValue(true),
  checkBalance: jest.fn().mockResolvedValue(true),
};

// Shared variables
let knexSourceRemoteClient: Knex;
let knexLocalClient: Knex;
let besuEnv: BesuTestEnvironment;
let fabricEnv: FabricTestEnvironment;
let gateway: SATPGateway;

const TIMEOUT = 900000; // 15 minutes
afterAll(async () => {
  await besuEnv.tearDown();
  await fabricEnv.tearDown();

  await pruneDockerAllIfGithubAction({ logLevel })
    .then(() => {
      log.info("Pruning throw OK");
    })
    .catch(async () => {
      await Containers.logDiagnostics({ logLevel });
      fail("Pruning didn't throw OK");
    });
}, TIMEOUT);

afterEach(async () => {
  jest.clearAllMocks();

  if (gateway) {
    await gateway.shutdown();
  }
  if (knexLocalClient) {
    await knexLocalClient.destroy();
  }
  if (knexSourceRemoteClient) {
    await knexSourceRemoteClient.destroy();
  }
}, TIMEOUT);

beforeAll(async () => {
  pruneDockerAllIfGithubAction({ logLevel })
    .then(() => {
      log.info("Pruning throw OK");
    })
    .catch(async () => {
      await Containers.logDiagnostics({ logLevel });
      fail("Pruning didn't throw OK");
    });

  {
    const satpContractName = "satp-contract";
    fabricEnv = await FabricTestEnvironment.setupTestEnvironment({
      contractName: satpContractName,
      claimFormat: ClaimFormat.BUNGEE,
      logLevel,
    });
    log.info("Fabric Ledger started successfully");

    await fabricEnv.deployAndSetupContracts();
  }
  {
    const erc20TokenContract = "SATPContract";
    besuEnv = await BesuTestEnvironment.setupTestEnvironment({
      contractName: erc20TokenContract,
      logLevel,
    });
    log.info("Besu Ledger started successfully");

    await besuEnv.deployAndSetupContracts(ClaimFormat.BUNGEE);
  }
}, TIMEOUT);

describe("SATPGateway sending a token from Besu to Fabric", () => {
  jest.setTimeout(TIMEOUT);
  it("Transfer test: Given a TransactRequest and an Available Gateway, When Calling Transact, Then Return Success response and Assert Token in Source and Destination Networks", async () => {});
  it("should mint 100 tokens to the owner account", async () => {
    await besuEnv.mintTokens("100");
    await besuEnv.checkBalance(
      besuEnv.getTestContractName(),
      besuEnv.getTestContractAddress(),
      besuEnv.getTestContractAbi(),
      besuEnv.getTestOwnerAccount(),
      "100",
      besuEnv.getTestOwnerSigningCredential(),
    );
  });
  it("should realize a transfer", async () => {
    //Setup SATP Gateway
    const factoryOptions: IPluginFactoryOptions = {
      pluginImportType: PluginImportType.Local,
    };
    const factory = new PluginFactorySATPGateway(factoryOptions);

    const gatewayIdentity = {
      id: "mockID",
      name: "CustomGateway",
      version: [
        {
          Core: SATP_CORE_VERSION,
          Architecture: SATP_ARCHITECTURE_VERSION,
          Crash: SATP_CRASH_VERSION,
        },
      ],
      proofID: "mockProofID10",
      address: "http://localhost" as Address,
    } as GatewayIdentity;

    const migrationSource = await createMigrationSource();
    knexLocalClient = knex({
      ...knexLocalInstance.default,
      migrations: {
        migrationSource: migrationSource,
      },
    });
    knexSourceRemoteClient = knex({
      ...knexRemoteInstance.default,
      migrations: {
        migrationSource: migrationSource,
      },
    });
    await knexSourceRemoteClient.migrate.latest();

    const fabricNetworkOptions = mockFabricEnv.createFabricConfig();
    const besuNetworkOptions = mockBesuEnv.createBesuConfig();

    const ontologiesPath = path.join(__dirname, "../../../ontologies");

    const options: SATPGatewayConfig = {
      instanceId: uuidv4(),
      logLevel: "DEBUG",
      gid: gatewayIdentity,
      ccConfig: {
        bridgeConfig: [fabricNetworkOptions, besuNetworkOptions],
      },
      localRepository: knexLocalInstance.default,
      remoteRepository: knexRemoteInstance.default,
      pluginRegistry: new PluginRegistry({
        plugins: [],
      }),
      ontologyPath: ontologiesPath,
    };
    gateway = await factory.create(options);
    expect(gateway).toBeInstanceOf(SATPGateway);
    await gateway.onPluginInit();

    const identity = gateway.Identity;
    // default servers
    expect(identity.gatewayServerPort).toBe(3010);
    expect(identity.gatewayClientPort).toBe(3011);
    expect(identity.gatewayOapiPort).toBe(4010);
    expect(identity.address).toBe("http://localhost");

    const apiServer = await gateway.getOrCreateHttpServer();
    expect(apiServer).toBeInstanceOf(ApiServer);

    const approveAddressApi = new GetApproveAddressApi(
      new Configuration({ basePath: gateway.getAddressOApiAddress() }),
    );

    const reqApproveBesuAddress = await approveAddressApi.getApproveAddress(
      mockBesuEnv.network,
      TokenType.NonstandardFungible,
    );

    if (!reqApproveBesuAddress?.data.approveAddress) {
      throw new Error("Approve address is undefined");
    }

    expect(reqApproveBesuAddress?.data.approveAddress).toBeDefined();

    await mockBesuEnv.giveRoleToBridge(
      reqApproveBesuAddress?.data.approveAddress,
    );

    if (reqApproveBesuAddress?.data.approveAddress) {
      await mockBesuEnv.approveAmount(
        reqApproveBesuAddress.data.approveAddress,
        "100",
      );
    } else {
      throw new Error("Approve address is undefined");
    }
    log.debug("Approved 100 amout to the Besu Bridge Address");

    const reqApproveFabricAddress = await approveAddressApi.getApproveAddress(
      mockFabricEnv.network,
      TokenType.NonstandardFungible,
    );
    expect(reqApproveFabricAddress?.data.approveAddress).toBeDefined();

    if (!reqApproveFabricAddress?.data.approveAddress) {
      throw new Error("Approve address is undefined");
    }

    await mockFabricEnv.giveRoleToBridge("Org2MSP");

    const satpApi = new TransactionApi(
      new Configuration({ basePath: gateway.getAddressOApiAddress() }),
    );

    const req = getChangedTransactRequest(
      "mockContext",
      mockBesuEnv,
      mockFabricEnv,
      "100",
      "100",
    );

    //When
    const res = await satpApi.transact(req);

    //Then
    log.info(res?.status);
    log.info(res.data.statusResponse);
    expect(res?.status).toBe(200);

    await mockBesuEnv.checkBalance(
      mockBesuEnv.getTestContractName(),
      mockBesuEnv.getTestContractAddress(),
      mockBesuEnv.getTestContractAbi(),
      mockBesuEnv.getTestOwnerAccount(),
      "0",
      mockBesuEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly from the Owner account");

    await mockBesuEnv.checkBalance(
      mockBesuEnv.getTestContractName(),
      mockBesuEnv.getTestContractAddress(),
      mockBesuEnv.getTestContractAbi(),
      reqApproveBesuAddress?.data.approveAddress,
      "0",
      mockBesuEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly to the Wrapper account");

    await mockFabricEnv.checkBalance(
      mockFabricEnv.getTestContractName(),
      mockFabricEnv.getTestChannelName(),
      reqApproveFabricAddress?.data.approveAddress,
      "0",
      mockFabricEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly from the Bridge account");

    await mockFabricEnv.checkBalance(
      mockFabricEnv.getTestContractName(),
      mockFabricEnv.getTestChannelName(),
      mockFabricEnv.getTestOwnerAccount(),
      "100",
      mockFabricEnv.getTestOwnerSigningCredential(),
    );
    log.info("Amount was transfer correctly to the Owner account");

    await gateway.shutdown();
  });
});
*/
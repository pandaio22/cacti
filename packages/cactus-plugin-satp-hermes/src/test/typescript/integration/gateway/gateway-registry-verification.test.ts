import "jest-extended";
import {
  JsObjectSigner,
  type LogLevelDesc,
  Secp256k1Keys,
} from "@hyperledger/cactus-common";
import {
  type ISATPServiceOptions,
  type SATPService,
  SATPServiceType,
} from "../../../../main/typescript/core/stage-services/satp-service";
import { SATPSession } from "../../../../main/typescript/core/satp-session";
import { SATP_VERSION } from "../../../../main/typescript/core/constants";
import { AssetSchema } from "../../../../main/typescript/generated/proto/cacti/satp/v02/common/message_pb";
import {
  SessionData,
  State as SessionState,
} from "../../../../main/typescript/generated/proto/cacti/satp/v02/session/session_pb";
import { Stage0ClientService } from "../../../../main/typescript/core/stage-services/client/stage0-client-service";
import { Stage0ServerService } from "../../../../main/typescript/core/stage-services/server/stage0-server-service";
import {
  PreTransferVerificationRequest,
  PreTransferVerificationResponse,
  STATUS,
} from "../../../../main/typescript/generated/proto/cacti/satp/v02/service/stage_0_pb";
import { TokenType } from "../../../../main/typescript/generated/proto/cacti/satp/v02/common/message_pb";
import { SATPLogger } from "../../../../main/typescript/logging";
import { BridgeManager } from "../../../../main/typescript/cross-chain-mechanisms/bridge/bridge-manager";
import { BridgeManagerClientInterface } from "../../../../main/typescript/cross-chain-mechanisms/bridge/interfaces/bridge-manager-client-interface";
import { createMigrationSource } from "../../../../main/typescript/database/knex-migration-source";
import { Knex, knex } from "knex";
import { knexLocalInstance } from "../../../../main/typescript/database/knexfile";
import { knexRemoteInstance } from "../../../../main/typescript/database/knexfile-remote";
import { KnexLocalLogRepository as LocalLogRepository } from "../../../../main/typescript/database/repository/knex-local-log-repository";
import { KnexRemoteLogRepository as RemoteLogRepository } from "../../../../main/typescript/database/repository/knex-remote-log-repository";
import {
  ILocalLogRepository,
  IRemoteLogRepository,
} from "../../../../main/typescript/database/repository/interfaces/repository";

import {
  AssetMissing,
  SignatureVerificationError,
} from "../../../../main/typescript/core/errors/satp-service-errors";

import { Configuration } from "@hyperledger/cactus-core-api";
import { RegistryApi } from "@hyperledger/cacti-asset-schema-architecture-plugin-satp/src/main/typescript/public-api";
import { SessionError } from "../../../../main/typescript/core/errors/satp-service-errors";

describe("Test registryVerification", () => {
  const TIMEOUT: number = 50000000;
  const logLevel: LogLevelDesc = "DEBUG";

  const serviceClasses = [Stage0ClientService, Stage0ServerService];

  const keyPairs = Secp256k1Keys.generateKeyPairsBuffer();

  const signer = new JsObjectSigner({
    privateKey: keyPairs.privateKey,
  });

  let mockSession: SATPSession;
  let satpClientService0: Stage0ClientService;
  let satpServerService0: Stage0ServerService;

  let knexInstanceClient: Knex; // test as a client
  let knexInstanceRemote: Knex;
  let localRepository: ILocalLogRepository;
  let remoteRepository: IRemoteLogRepository;
  let dbLogger: SATPLogger;
  let bridgeManager: BridgeManagerClientInterface;
  const sessionIDs: string[] = [];

  beforeAll(async () => {
    bridgeManager = new BridgeManager({
      logLevel: logLevel,
    });

    const migrationSource = await createMigrationSource();
    knexInstanceClient = knex({
      ...knexLocalInstance.default,
      migrations: {
        migrationSource: migrationSource,
      },
    });
    await knexInstanceClient.migrate.latest();

    knexInstanceRemote = knex({
      ...knexRemoteInstance.default,
      migrations: {
        migrationSource: migrationSource,
      },
    });
    await knexInstanceRemote.migrate.latest();

    localRepository = new LocalLogRepository(knexLocalInstance.default);
    remoteRepository = new RemoteLogRepository(knexRemoteInstance.default);
    dbLogger = new SATPLogger({
      localRepository,
      remoteRepository,
      signer,
      pubKey: Buffer.from(keyPairs.publicKey).toString("hex"),
    });
  });

  beforeEach(async () => {
    mockSession = new SATPSession({
      contextID: "MOCK_CONTEXT_ID",
      server: false,
      client: true,
    });

    sessionIDs.push(mockSession.getSessionId());

    const serviceOptions = initializeServiceOptions(
      serviceClasses,
      logLevel,
      "SATPService",
    );

    for (const service of initializeServices(serviceClasses, serviceOptions)) {
      switch (service.constructor) {
        case Stage0ClientService:
          satpClientService0 = service as Stage0ClientService;
          break;
        case Stage0ServerService:
          satpServerService0 = service as Stage0ServerService;
          break;
        default:
          break;
      }
    }
  }, TIMEOUT);

  afterEach(async () => {}, TIMEOUT);

  afterAll(async () => {
    const services = [satpClientService0, satpServerService0];

    for (const service of services) {
      await service.dbLogger.localRepository.destroy();
      await service.dbLogger.remoteRepository!.destroy();
    }

    if (knexInstanceClient) {
      await knexInstanceClient.destroy();
    }
    if (knexInstanceRemote) {
      await knexInstanceRemote.destroy();
    }
  });

  it(
    "Given a valid PreTransferVerificationRequest and Session, When calling registryVerification(), Then return verification success",
    async () => {
      //Given
      const request: PreTransferVerificationRequest =
        await satpClientService0.preTransferVerificationRequest(mockSession);

      //When
      const result = satpServerService0.registryVerification(
        request,
        mockSession,
      );

      //Then
      expect(result).toBe(true);
    },
    TIMEOUT,
  );

  it(
    "Given a valid PreTransferVerificationRequest and Session, When calling registryVerification(), Then throw tokenizedAssetRecord SignatureVerificationError",
    async () => {
      //Given
      const request: PreTransferVerificationRequest =
        await satpClientService0.preTransferVerificationRequest(mockSession);

      //When and Then
      expect(() =>
        satpServerService0.registryVerification(request, mockSession),
      ).toThrowError(SignatureVerificationError);
    },
    TIMEOUT,
  );

  it(
    "Given a valid PreTransferVerificationRequest and Session, When calling registryVerification(), Then throw schemaProfile SignatureVerificationError",
    async () => {
      //Given
      const request: PreTransferVerificationRequest =
        await satpClientService0.preTransferVerificationRequest(mockSession);

      //When and Then
      expect(() =>
        satpServerService0.registryVerification(request, mockSession),
      ).toThrowError(SignatureVerificationError);
    },
    TIMEOUT,
  );

  it(
    "Given a invalid PreTransferVerificationRequest and Session, When calling validateTokenizedAssetRecord(), Then throw AssetMissing",
    async () => {
      ///Given
      const invalidRequest: PreTransferVerificationRequest =
        await satpClientService0.preTransferVerificationRequest(mockSession);
      const config = new Configuration({
        basePath: "http://localhost:3002",
      });

      const registryApi = new RegistryApi(config);

      //When and Then
      expect(() =>
        satpServerService0.validateSchemaProfile(
          invalidRequest,
          mockSession,
          registryApi,
        ),
      ).toThrowError(AssetMissing);
    },
    TIMEOUT,
  );

  it(
    "Given a valid PreTransferVerificationRequest and invalid Session, When calling validateTokenizedAssetRecord(), Then throw SessionError",
    async () => {
      ///Given
      const request: PreTransferVerificationRequest =
        await satpClientService0.preTransferVerificationRequest(mockSession);
      const config = new Configuration({
        basePath: "http://localhost:3002",
      });

      const registryApi = new RegistryApi(config);

      //When and Then
      expect(() =>
        satpServerService0.validateSchemaProfile(
          request,
          mockSession,
          registryApi,
        ),
      ).toThrowError(SessionError);
    },
    TIMEOUT,
  );

  it(
    "Given a invalid PreTransferVerificationRequest and Session, When calling validateSchemaProfile(), Then throw AssetMissing",
    async () => {
      ///Given
      const invalidRequest: PreTransferVerificationRequest =
        await satpClientService0.preTransferVerificationRequest(mockSession);
      const config = new Configuration({
        basePath: "http://localhost:3002",
      });

      const registryApi = new RegistryApi(config);

      //When and Then
      expect(() =>
        satpServerService0.validateSchemaProfile(
          invalidRequest,
          mockSession,
          registryApi,
        ),
      ).toThrowError(AssetMissing);
    },
    TIMEOUT,
  );

  it(
    "Given a valid PreTransferVerificationRequest and invalid Session, When calling validateSchemaProfile(), Then throw SessionError",
    async () => {
      ///Given
      const request: PreTransferVerificationRequest =
        await satpClientService0.preTransferVerificationRequest(mockSession);

      const config = new Configuration({
        basePath: "http://localhost:3002",
      });

      const registryApi = new RegistryApi(config);

      //When and Then
      expect(() =>
        satpServerService0.validateSchemaProfile(
          request,
          mockSession,
          registryApi,
        ),
      ).toThrowError(AssetMissing);
    },
    TIMEOUT,
  );

  function initializeServiceOptions(
    serviceClasses: (new (options: ISATPServiceOptions) => SATPService)[],
    logLevel: LogLevelDesc,
    label: string,
  ): ISATPServiceOptions[] {
    return serviceClasses.map((_, index) => ({
      signer: signer,
      stage: index.toString() as "0" | "1" | "2" | "3",
      loggerOptions: { level: logLevel, label },
      serviceName: `Service-${index}`,
      serviceType:
        index % 2 === 0 ? SATPServiceType.Server : SATPServiceType.Client,
      bridgeManager: bridgeManager,
      dbLogger: dbLogger,
    }));
  }

  function initializeServices(
    serviceClasses: (new (options: ISATPServiceOptions) => SATPService)[],
    serviceOptions: ISATPServiceOptions[],
  ): SATPService[] {
    return serviceClasses.map(
      (ServiceClass, index) => new ServiceClass(serviceOptions[index]),
    );
  }
});

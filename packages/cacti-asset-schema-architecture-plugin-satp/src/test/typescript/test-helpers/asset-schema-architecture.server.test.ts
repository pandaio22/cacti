import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../main/typescript/plugin-asset-schema-architecture";
import { AssetSchemaAuthorityApi } from "../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { v4 as uuidv4 } from "uuid";
import {
  ASSET_SCHEMA_AUTHORITY_API_SERVER,
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
} from "../constants/constants";
import { db } from "../../../main/typescript/entities/registry/modules/database/knex/db-connection";

describe("Run Server", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });
  const TIMEOUT: number = 50000000;

  beforeAll(async () => {
    // Placeholder
  });

  beforeEach(async () => {
    pluginAssetSchemaArchitectureOptions = {
      pluginRegistry,
      instanceId: uuidv4(),
      logLevel: "DEBUG",
    };

    pluginAssetSchemaArchitecture = new PluginAssetSchemaArchitecture(
      pluginAssetSchemaArchitectureOptions,
    );

    await pluginAssetSchemaArchitecture.startup();
  }, TIMEOUT);

  afterEach(async () => {
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    // Placeholder
  });

  it(
    "Run the server until manually terminated",
    async () => {
      //Given
      while (true) {
        // Wait indefinitely
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    },
    TIMEOUT,
  );
});

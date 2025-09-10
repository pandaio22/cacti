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

describe("Scenario #1 - Commission Asset Schema", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });
  const TIMEOUT: number = 50000000;
  const config = new Configuration({
    basePath: ASSET_SCHEMA_AUTHORITY_API_SERVER,
  });
  let assetSchemaAuthorityApi: AssetSchemaAuthorityApi;

  beforeAll(async () => {
    // Create tables for testing
    await db.schema.dropTableIfExists("asset_schemas");
    await db.schema.createTable("asset_schemas", (table) => {
      table.string("did").primary();
      table.text("asset_schema");
      table.text("asset_schema_did_document");
      table.text("asset_schema_vc");
    });
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

    assetSchemaAuthorityApi = new AssetSchemaAuthorityApi(config);
  }, TIMEOUT);

  afterEach(async () => {
    await db("asset_schemas").del();
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    await db.destroy();
  });

  it(
    "Scenario #1 - Test Case 1 - PASS: Given an Asset Schema, When Commissioning an Asset Schema, Then Return Success response and a Commissioned Asset Schema.",
    async () => {
      //Given
      const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
      const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;

      //When
      const assetSchemaCertificationEndpoint =
        await assetSchemaAuthorityApi.assetSchemaCertification({
          assetSchema: assetSchema,
          assetSchemaDidDocument: assetSchemaDidDocument,
        });

      //Then
      expect(assetSchemaCertificationEndpoint.status).toEqual(200);
      expect(assetSchemaCertificationEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
  it(
    "Scenario #1 - Test Case 2 - FAIL: Given an Asset Schema, When Commissioning the same Asset Schema twice, Then throw exception and an Error Response.",
    async () => {
      //Given
      const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
      const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;

      //When
      const assetSchemaCertificationEndpoint1 =
        await assetSchemaAuthorityApi.assetSchemaCertification({
          assetSchema: assetSchema,
          assetSchemaDidDocument: assetSchemaDidDocument,
        });

      const assetSchemaCertificationEndpoint2 = await assetSchemaAuthorityApi
        .assetSchemaCertification({
          assetSchema: assetSchema,
          assetSchemaDidDocument: assetSchemaDidDocument,
        })
        .catch((err) => err.response);

      //Then
      expect(assetSchemaCertificationEndpoint1.status).toEqual(200);
      expect(assetSchemaCertificationEndpoint1.data).toBeDefined();

      expect(assetSchemaCertificationEndpoint2.status).toEqual(500);
      expect(assetSchemaCertificationEndpoint2.data).toBeDefined();
      expect(assetSchemaCertificationEndpoint2.data.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Scenario #1 - Test Case 3 - FAIL: Given an Invalid Asset Schema, When Commissioning the invalid Asset Schema, Then throw exception and an Error Response.",
    async () => {
      // Given
      const invalidAssetSchema = {
        ...VALID_ASSET_SCHEMA_EXAMPLE,
        name: null,
      };

      const invalidDidDocument = {
        ...VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
        id: null,
      } as any;

      // When
      const assetSchemaCertificationEndpoint = await assetSchemaAuthorityApi
        .assetSchemaCertification({
          assetSchema: invalidAssetSchema,
          assetSchemaDidDocument: invalidDidDocument,
        })
        .catch((err) => err.response);

      // Then
      expect(assetSchemaCertificationEndpoint).toBeDefined();
      expect(assetSchemaCertificationEndpoint.status).toEqual(500);
      expect(assetSchemaCertificationEndpoint.data.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Scenario #1 - Test Case 4 - FAIL: Given a valid Asset Schema and an Unavailable Asset Schema Authority, When Commissioning an Asset Schema, Then throw exception and an Error Response.",
    async () => {
      try {
        //Given
        const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
        const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;

        const unavailableAssetSchemaAuthorityApi = new AssetSchemaAuthorityApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        //When
        await unavailableAssetSchemaAuthorityApi.assetSchemaCertification({
          assetSchema: assetSchema,
          assetSchemaDidDocument: assetSchemaDidDocument,
        });

        //If service unexpectedly responds
        fail(
          "Expected network error due to unavailable Asset Schema Authority",
        );
      } catch (error: any) {
        //Then
        expect(error).toBeDefined();
        expect([
          "ECONNREFUSED",
          "EAI_AGAIN",
          "ENOTFOUND",
          "ETIMEDOUT",
        ]).toContain(error.code);
        expect(error.message).toMatch(
          /connect|refused|timeout|not found|getaddrinfo/i,
        );
        expect(error.response).toBeUndefined();
      }
    },
    TIMEOUT,
  );
});

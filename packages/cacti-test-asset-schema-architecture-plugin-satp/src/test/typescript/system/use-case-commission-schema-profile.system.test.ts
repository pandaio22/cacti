/*import { LogLevelDesc } from "@hyperledger/cactus-common";
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
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
} from "../constants/constants";
import { db } from "../../../main/typescript/entities/registry/modules/database/knex/db-connection";

describe("Scenario #2 - Commission Schema Profile", () => {
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
    await db.schema.dropTableIfExists("schema_profiles");
    await db.schema.createTable("schema_profiles", (table) => {
      table.string("did").primary();
      table.text("schema_profile");
      table.text("schema_profile_did_document");
      table.text("schema_profile_vc");
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
    await db("schema_profiles").del();
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    await db.destroy();
  });

  it(
    "Scenario #2 - Test Case 1 - PASS: Given an Schema Profile, When Commissioning an Schema Profile, Then Return Success response and a Commissioned Schema Profile.",
    async () => {
      //Given
      const schemaProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
      const schemaProfileDidDocument =
        VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;

      //When
      const schemaProfileCertificationEndpoint =
        await assetSchemaAuthorityApi.schemaProfileCertification({
          schemaProfile: schemaProfile,
          schemaProfileDidDocument: schemaProfileDidDocument,
        });

      //Then
      expect(schemaProfileCertificationEndpoint.status).toEqual(200);
      expect(schemaProfileCertificationEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
  it(
    "Scenario #2 - Test Case 2 - FAIL: Given an Schema Profile, When Commissioning the same Schema Profile twice, Then throw exception and an Error Response.",
    async () => {
      //Given
      const schemaProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
      const schemaProfileDidDocument =
        VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;

      //When
      const schemaProfileCertificationEndpoint1 =
        await assetSchemaAuthorityApi.schemaProfileCertification({
          schemaProfile: schemaProfile,
          schemaProfileDidDocument: schemaProfileDidDocument,
        });

      const schemaProfileCertificationEndpoint2 = await assetSchemaAuthorityApi
        .schemaProfileCertification({
          schemaProfile: schemaProfile,
          schemaProfileDidDocument: schemaProfileDidDocument,
        })
        .catch((err) => err.response);

      //Then
      expect(schemaProfileCertificationEndpoint1.status).toEqual(200);
      expect(schemaProfileCertificationEndpoint1.data).toBeDefined();

      expect(schemaProfileCertificationEndpoint2.status).toEqual(500);
      expect(schemaProfileCertificationEndpoint2.data).toBeDefined();
      expect(schemaProfileCertificationEndpoint2.data.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Scenario #2 - Test Case 3 - FAIL: Given an Invalid Schema Profile, When Commissioning the invalid Schema Profile, Then throw exception and an Error Response.",
    async () => {
      // Given
      const invalidAssetSchema = {
        ...VALID_SCHEMA_PROFILE_EXAMPLE,
        name: null,
      };

      const invalidDidDocument = {
        ...VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
        id: null,
      } as any;

      // When
      const schemaProfileCertificationEndpoint = await assetSchemaAuthorityApi
        .schemaProfileCertification({
          schemaProfile: invalidAssetSchema,
          schemaProfileDidDocument: invalidDidDocument,
        })
        .catch((err) => err.response);

      // Then
      expect(schemaProfileCertificationEndpoint).toBeDefined();
      expect(schemaProfileCertificationEndpoint.status).toEqual(500);
      expect(schemaProfileCertificationEndpoint.data.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );

  it(
    "Scenario #2 - Test Case 4 - FAIL: Given a valid Schema Profile an Unavailable Asset Schema Authority, When Commissioning a Schema Profile, Then throw exception and an Error Response.",
    async () => {
      try {
        //Given
        const schemaProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
        const schemaProfileDidDocument =
          VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;

        const unavailableAssetSchemaAuthorityApi = new AssetSchemaAuthorityApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        //When
        await unavailableAssetSchemaAuthorityApi.schemaProfileCertification({
          schemaProfile: schemaProfile,
          schemaProfileDidDocument: schemaProfileDidDocument,
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
*/
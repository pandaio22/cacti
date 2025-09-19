import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../../../main/typescript/plugin-asset-schema-architecture";
import { AssetSchemaAuthorityApi } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { v4 as uuidv4 } from "uuid";
import {
  ASSET_SCHEMA_AUTHORITY_API_SERVER,
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
} from "../../../constants/constants";
import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";

describe("Asset Schema Authority (ASA) API Integration Tests", () => {
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
    await db.schema.dropTableIfExists("schema_profiles");
    await db.schema.createTable("schema_profiles", (table) => {
      table.string("did").primary();
      table.text("schema_profile");
      table.text("schema_profile_did_document");
      table.text("schema_profile_vc");
    });
    await db.schema.dropTableIfExists("token_issuance_authorizations");
    await db.schema.createTable("token_issuance_authorizations", (table) => {
      table.string("id").primary();
      table.text("token_issuance_authorization");
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
    await db("schema_profiles").del();
    await db("token_issuance_authorizations").del();
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    await db.destroy();
  });

  it(
    "Tests POST /token-issuance-authorization-request: Given a Valid Token Issuance Authorization Request (TIAR), When calling the endpoint, Then returns a Token Issuance Authorization",
    async () => {
      //Given & When
      const tokenIssuanceAuthorizationRequestEndpoint =
        await assetSchemaAuthorityApi.requestTokenIssuanceAuthorization(
          VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
        );

      //Then
      expect(tokenIssuanceAuthorizationRequestEndpoint.status).toEqual(200);
      expect(tokenIssuanceAuthorizationRequestEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );

  it(
    "Tests POST /token-issuance-authorization-request: Given an Invalid Token Issuance Authorization Request (TIAR), When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidTokenIssuanceAuthorizationRequest = {
        ...VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
        id: null, // invalid field
      } as any;

      // When
      const tokenIssuanceAuthorizationEndpoint = await assetSchemaAuthorityApi
        .requestTokenIssuanceAuthorization(
          invalidTokenIssuanceAuthorizationRequest,
        )
        .catch((err) => err.response);

      // Then
      expect(tokenIssuanceAuthorizationEndpoint).toBeDefined();
      expect(tokenIssuanceAuthorizationEndpoint?.status).toEqual(500);
      expect(tokenIssuanceAuthorizationEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );

  it(
    "Tests POST /asset-schema-certification: Given a Valid Asset Schema, When calling the endpoint, Then returns a certified Asset Schema",
    async () => {
      //Given & When
      const assetSchemaCertificationEndpoint =
        await assetSchemaAuthorityApi.assetSchemaCertification({
          assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
          assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
        });

      //Then
      expect(assetSchemaCertificationEndpoint.status).toEqual(200);
      expect(assetSchemaCertificationEndpoint.data).toBeDefined();
      console.log(
        "Certified Asset Schema:",
        assetSchemaCertificationEndpoint.data,
      );
    },
    TIMEOUT,
  );
  it(
    "Tests POST /asset-schema-certification: Given an Invalid Input, When calling the endpoint, Then throw exception",
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
    "Tests POST /schema-profile-certification: Given a Valid Schema Profile, When calling the endpoint, Then returns a certified Schema Profile",
    async () => {
      //Given & When
      const schemaProfileCertificationEndpoint =
        await assetSchemaAuthorityApi.schemaProfileCertification({
          schemaProfile: VALID_SCHEMA_PROFILE_EXAMPLE,
          schemaProfileDidDocument: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
        });

      //Then
      expect(schemaProfileCertificationEndpoint.status).toEqual(200);
      expect(schemaProfileCertificationEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
  it(
    "Tests POST /schema-profile-certification: Given an Invalid Input, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidSchemaProfile = {
        ...VALID_SCHEMA_PROFILE_EXAMPLE,
        name: null, // invalid field
      };

      const invalidDidDocument = {
        ...VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
        id: null, // invalid DID
      } as any;

      // When
      const schemaProfileCertificationEndpoint = await assetSchemaAuthorityApi
        .schemaProfileCertification({
          schemaProfile: invalidSchemaProfile,
          schemaProfileDidDocument: invalidDidDocument,
        })
        .catch((err) => err.response);

      // Then
      console.log(
        "Error Response Data:",
        schemaProfileCertificationEndpoint?.data,
      );

      expect(schemaProfileCertificationEndpoint).toBeDefined();

      expect(schemaProfileCertificationEndpoint?.status).toEqual(500);

      expect(schemaProfileCertificationEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
});

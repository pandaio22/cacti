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
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
} from "../../../../../main/typescript/constants/constants";

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
    //Placeholder
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
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    //Placeholder
  });

  it(
    "Tests POST /token-issuance-authorization-request: Given a Valid Token Issuance Authorization Request (TIAR), When calling the endpoint, Then returns a Token Issuance Authorization",
    async () => {
      //Given & When
      const tokenIssuanceAuthorizationRequestEndpoint =
        await assetSchemaAuthorityApi.requestTokenIssuanceAuthorization(
          VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
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
      //Given
      //When
      //Then
    },
    TIMEOUT,
  );
  it(
    "Tests POST /token-issuance-authorization-request: Given a Valid Token Issuance Authorization Request (TIAR) and an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      //Given
      //When
      //Then
    },
    TIMEOUT,
  );

  it(
    "Tests POST /asset-schema-certification: Given a Valid Asset Schema, When calling the endpoint, Then returns a certified Asset Schema",
    async () => {
      //Given & When
      const assetSchemaCertificationEndpoint =
        await assetSchemaAuthorityApi.assetSchemaCertification(
          VALID_ASSET_SCHEMA_EXAMPLE,
        );

      //Then
      expect(assetSchemaCertificationEndpoint.status).toEqual(200);
      expect(assetSchemaCertificationEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
  it(
    "Tests POST /asset-schema-certification: Given an Invalid Asset Schema, When calling the endpoint, Then throw exception",
    async () => {
      //Given
      //When
      //Then
    },
    TIMEOUT,
  );
  it(
    "Tests POST /asset-schema-certification: Given a Valid Asset Schema and an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      //Given
      //When
      //Then
    },
    TIMEOUT,
  );
  it(
    "Tests POST /schema-profile-certification: Given a Valid Schema Profile, When calling the endpoint, Then returns a certified Schema Profile",
    async () => {
      //Given & When
      const schemaProfileCertificationEndpoint =
        await assetSchemaAuthorityApi.schemaProfileCertification(
          VALID_SCHEMA_PROFILE_EXAMPLE,
        );

      //Then
      expect(schemaProfileCertificationEndpoint.status).toEqual(200);
      expect(schemaProfileCertificationEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
  it(
    "Tests POST /asset-schema-certification: Given an Invalid Asset Schema, When calling the endpoint, Then throw exception",
    async () => {
      //Given
      //When
      //Then
    },
    TIMEOUT,
  );
  it(
    "Tests POST /asset-schema-certification: Given a Valid Asset Schema and an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      //Given
      //When
      //Then
    },
    TIMEOUT,
  );
});

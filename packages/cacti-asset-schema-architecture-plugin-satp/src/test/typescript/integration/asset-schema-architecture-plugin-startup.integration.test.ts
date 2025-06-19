import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../main/typescript/plugin-asset-schema-architecture";
import { DefaultApi as AssetSchemaArchitectureApi } from "../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { v4 as uuidv4 } from "uuid";

describe("Asset Schema Architecture Plugin Startup test", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });
  const TIMEOUT: number = 50000000;

  beforeEach(async () => {
    // Given
    pluginAssetSchemaArchitectureOptions = {
      pluginRegistry,
      instanceId: uuidv4(),
      logLevel: "DEBUG",
    };
    // When
    pluginAssetSchemaArchitecture = new PluginAssetSchemaArchitecture(
      pluginAssetSchemaArchitectureOptions,
    );
    await pluginAssetSchemaArchitecture.startup();
  });

  afterEach(async () => {
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);
    await pluginAssetSchemaArchitecture.shutdown();
  });

  afterAll(async () => {
    //Placeholder
  });

  it(
    "Starts up the Asset Schema Architecture Plugin: Given plugin options, When starting the plugin, Then the package name is defined",
    async () => {
      // Then
      expect(pluginAssetSchemaArchitecture.getPackageName()).toBeDefined();
      expect(pluginAssetSchemaArchitecture.getPackageName()).toBe(
        "@hyperledger/cacti-asset-schema-architecture-plugin-satp",
      );
    },
    TIMEOUT,
  );
  it(
    "Starts up the Asset Schema Architecture Plugin: Given plugin options, When starting the plugin, Then publish API endpoints for the Registry, the Asset Schema Authority and the Asset Provider",
    async () => {
      // Then
      console.log(
        "API Endpoints;",
        pluginAssetSchemaArchitecture.getWebServices(),
      );
      expect(pluginAssetSchemaArchitecture.getWebServices()).toBeDefined();
    },
    TIMEOUT,
  );
  it(
    "Starts up the Asset Schema Architecture Plugin: Given plugin options, When starting the plugin, Then create servers for the Registry, the Asset Schema Authority and the Asset Provider",
    async () => {
      // Then
      console.log("Web Servers", pluginAssetSchemaArchitecture.getWebServers());
      expect(pluginAssetSchemaArchitecture.getWebServers().size).toBe(3);
    },
    TIMEOUT,
  );
  it(
    "Sends a resquest to the ASA",
    async () => {
      // Given
      const assetSchemaAuthorityPath = `http://localhost:3010`;
      const config = new Configuration({ basePath: assetSchemaAuthorityPath });
      const assetSchemaArchitectureApi = new AssetSchemaArchitectureApi(config);

      // When
      const testTokenIssuanceAuthorizationRequestEndpoint =
        await assetSchemaArchitectureApi.requestTokenIssuanceAuthorization({
          "@context":
            "https://example.org/context/token-issuance-authorization",
          asset_provider: {
            name: "Acme Asset Provider",
            id: "https://example.org/asset-providers/acme",
            organization_key: {
              public_key: "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEp...xyz",
              issued: "2025-06-14T10:20:30.000Z",
            },
          },
          schema_profile:
            "https://example.org/schema-profiles/standard-profile",
          network_id: "testnet-12345",
          proof: {
            type: "JwsSignature2020",
            created: "2025-06-14T12:34:56.789Z",
            proofPurpose: "assertionMethod",
            verificationMethod: "https://example.org/keys/asset-provider-key",
            jws: "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..abc123",
          },
        });

      //Then
      expect(testTokenIssuanceAuthorizationRequestEndpoint.status).toEqual(200);
    },
    TIMEOUT,
  );

  it(
    "Sends a resquest to the Registry",
    async () => {
      // Given
      const assetSchemaAuthorityPath = `http://localhost:3000`;
      const config = new Configuration({ basePath: assetSchemaAuthorityPath });
      const assetSchemaArchitectureApi = new AssetSchemaArchitectureApi(config);

      // When
      const testRegisterTokenIssuanceAuthorizationEndpoint =
        await assetSchemaArchitectureApi.registerTokenIssuanceAuthorization({
          token_issuance_authorization_request: {
            "@context":
              "https://example.org/context/token-issuance-authorization",
            asset_provider: {
              name: "Acme Asset Provider",
              id: "https://example.org/asset-providers/acme",
              organization_key: {
                public_key: "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEp...xyz",
                issued: "2025-06-14T10:20:30.000Z",
              },
            },
            schema_profile:
              "https://example.org/schema-profiles/standard-profile",
            network_id: "testnet-12345",
            proof: {
              type: "JwsSignature2020",
              created: "2025-06-14T12:34:56.789Z",
              proofPurpose: "assertionMethod",
              verificationMethod: "https://example.org/keys/asset-provider-key",
              jws: "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..abc123",
            },
          },
          proof: {
            type: "JwsSignature2020",
            created: "2025-06-14T12:34:56.789Z",
            proofPurpose: "assertionMethod",
            verificationMethod: "https://example.org/keys/asset-provider-key",
            jws: "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..abc123",
          },
        });

      console.log(
        "Registered with ID:",
        testRegisterTokenIssuanceAuthorizationEndpoint.data,
      );

      //Then
      expect(testRegisterTokenIssuanceAuthorizationEndpoint.status).toEqual(
        200,
      );
      expect(testRegisterTokenIssuanceAuthorizationEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
});

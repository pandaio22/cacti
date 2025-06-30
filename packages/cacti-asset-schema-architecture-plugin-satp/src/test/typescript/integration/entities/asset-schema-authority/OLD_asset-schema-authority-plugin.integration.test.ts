import {
  IListenOptions,
  LogLevelDesc,
  Servers,
} from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../../../main/typescript/plugin-asset-schema-architecture";
import { AssetSchemaAuthorityApi } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { v4 as uuidv4 } from "uuid";
import http, { Server } from "http";
import bodyParser from "body-parser";
import express from "express";
import { AddressInfo } from "net";

describe.skip("AssetSchemaAuthorityPlugin API test", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  let assetSchemaAuthorityServer: Server;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });

  beforeEach(async () => {
    //Given
    pluginAssetSchemaArchitectureOptions = {
      pluginRegistry,
      instanceId: uuidv4(),
    };
    pluginAssetSchemaArchitecture = new PluginAssetSchemaArchitecture(
      pluginAssetSchemaArchitectureOptions,
    );
  });

  afterEach(async () => {
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);
  });

  afterAll(async () => {
    await Servers.shutdown(assetSchemaAuthorityServer);
  });

  it.skip("Adds the Asset Schema Architecture plugin to the Plugin Registry", async () => {
    // When
    pluginRegistry.add(pluginAssetSchemaArchitecture);
    //Then
    expect(pluginRegistry).toBeDefined();
  });
  it("Publishes the Asset Schema Architecture API endpoints", async () => {
    // Given
    pluginRegistry.add(pluginAssetSchemaArchitecture);
    const expressApp = express();
    expressApp.use(
      bodyParser.json({
        type: ["application/json", "application/ld+json"],
        limit: "250mb",
      }),
    );
    assetSchemaAuthorityServer = http.createServer(expressApp);
    const listenOptions: IListenOptions = {
      hostname: "localhost",
      port: 3010,
      server: assetSchemaAuthorityServer,
    };

    await pluginAssetSchemaArchitecture.getOrCreateWebServices();
    await pluginAssetSchemaArchitecture.registerWebServices(expressApp);

    const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
    const { address, port } = addressInfo;

    const assetSchemaAuthorityPath = `http://${address}:${port}`;
    const config = new Configuration({ basePath: assetSchemaAuthorityPath });
    const assetSchemaAuthorityApi = new AssetSchemaAuthorityApi(config);

    // When
    const testTokenIssuanceAuthorizationRequestEndpoint =
      await assetSchemaAuthorityApi.requestTokenIssuanceAuthorization({
        "@context": "https://example.org/context/token-issuance-authorization",
        asset_provider: {
          name: "Acme Asset Provider",
          id: "https://example.org/asset-providers/acme",
          organization_key: {
            public_key: "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEp...xyz",
            issued: "2025-06-14T10:20:30.000Z",
          },
        },
        schema_profile: "https://example.org/schema-profiles/standard-profile",
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
  }, 50000000);
});

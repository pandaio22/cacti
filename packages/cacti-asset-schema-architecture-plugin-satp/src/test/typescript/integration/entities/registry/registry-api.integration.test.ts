import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../../../main/typescript/plugin-asset-schema-architecture";
import { RegistryApi } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";
import {
  REGISTRY_API_SERVER,
  VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
} from "../../../../../main/typescript/constants/constants";

describe("Registry API Integration Tests", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });
  const TIMEOUT: number = 50000000;

  beforeAll(async () => {
    try {
      console.log("Starting IPFS container...");
      execSync("docker run -d --rm --name ipfs -p 5001:5001 ipfs/kubo", {
        stdio: "inherit",
      });

      // Optional: wait a bit to ensure IPFS is fully started
      console.log("Waiting for IPFS to initialize...");
      execSync("sleep 5");
    } catch (err) {
      console.error("Failed to start IPFS container:", err);
      throw err;
    }
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
    try {
      console.log("Stopping IPFS container...");
      execSync("docker stop ipfs", { stdio: "inherit" });
    } catch (err) {
      console.error("Failed to stop IPFS container:", err);
      // Don't rethrow; allow cleanup to finish
    }
  });

  /*POST /commission-asset-schema*/
  it("Tests POST /commission-asset-schema: Given a Valid Asset Schema to an Available service, When calling the endpoint, Then registers Asset Schema successfully and returns a DID", async () => {
    //Given
    const config = new Configuration({
      basePath: REGISTRY_API_SERVER,
    });
    const registryApi = new RegistryApi(config);

    //When
    const commissionAssetSchemaEndpoint =
      await registryApi.commissionAssetSchema(
        VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
      );

    //Then
    expect(commissionAssetSchemaEndpoint.status).toBe(200);
    expect(commissionAssetSchemaEndpoint.data).toBeDefined();
  });
  it("Tests POST /commission-asset-schema: Given an Invalid Asset Schema to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /commission-asset-schema: Given an Valid Asset Schema to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*POST /commission-schema-profile*/
  it("Tests POST /commission-schema-profile: Given a Valid Schema Profile to an Available service, When calling the endpoint, Then registers Schema Profile successfully and returns a DID", async () => {});
  it("Tests POST /commission-schema-profile: Given an Invalid Schema Profile to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /commission-schema-profile: Given a Valid Schema Profile to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*POST /tokenized-asset-record*/
  it("Tests POST /tokenized-asset-record: Given a Valid Tokenized Asset Record to an Available service, When calling the endpoint, Then registers the TAR successfully and returns a DID", async () => {});
  it("Tests POST /tokenized-asset-record: Given an Invalid Tokenized Asset Record to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /tokenized-asset-record: Given a Valid Tokenized Asset Record to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*POST /register-asset-schema-authority*/
  it("Tests POST /register-asset-schema-authority: Given a Valid Asset Schema Authority Certificate to an Available service, When calling the endpoint, Then registers the authority successfully and returns a DID", async () => {});
  it("Tests POST /register-asset-schema-authority: Given an Invalid Asset Schema Authority Certificate to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /register-asset-schema-authority: Given a Valid Asset Schema Authority Certificate to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*POST /register-asset-provider*/
  it("Tests POST /register-asset-provider: Given a Valid Asset Provider Certificate to an Available service, When calling the endpoint, Then registers the provider successfully and returns a DID", async () => {});
  it("Tests POST /register-asset-provider: Given an Invalid Asset Provider Certificate to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /register-asset-provider: Given a Valid Asset Provider Certificate to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*GET /get-asset-schema/{uid}*/
  it("Tests GET /get-asset-schema/{uid}: Given a valid UID and Available service, When calling the endpoint, Then returns the Asset Schema", async () => {});
  it("Tests GET /get-asset-schema/{uid}: Given an invalid UID and Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests GET /get-asset-schema/{uid}: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*GET /get-schema-profile/{uid}*/
  it("Tests GET /get-schema-profile/{uid}: Given a valid UID and Available service, When calling the endpoint, Then returns the Schema Profile", async () => {});
  it("Tests GET /get-schema-profile/{uid}: Given an invalid UID and Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests GET /get-schema-profile/{uid}: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*GET /get-tokenized-asset-record/{uid}*/
  it("Tests GET /get-tokenized-asset-record/{uid}: Given a valid UID and Available service, When calling the endpoint, Then returns the Tokenized Asset Record", async () => {});
  it("Tests GET /get-tokenized-asset-record/{uid}: Given an invalid UID and Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests GET /get-tokenized-asset-record/{uid}: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*GET /get-asset-schema-authority/{uid}*/
  it("Tests GET /get-asset-schema-authority/{uid}: Given a valid UID and Available service, When calling the endpoint, Then returns the Asset Schema Authority certificate", async () => {});
  it("Tests GET /get-asset-schema-authority/{uid}: Given an invalid UID and Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests GET /get-asset-schema-authority/{uid}: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*GET /get-asset-provider/{uid}*/
  it("Tests GET /get-asset-provider/{uid}: Given a valid UID and Available service, When calling the endpoint, Then returns the Asset Provider certificate", async () => {});
  it("Tests GET /get-asset-provider/{uid}: Given an invalid UID and Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests GET /get-asset-provider/{uid}: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception", async () => {});
});

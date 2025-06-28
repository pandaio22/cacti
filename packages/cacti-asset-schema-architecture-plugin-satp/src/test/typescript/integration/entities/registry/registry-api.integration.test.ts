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
  VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
  VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_CERTIFICATE_EXAMPLE,
  VALID_ASSET_PROVIDER_CERTIFICATE_EXAMPLE,
} from "../../../../../main/typescript/constants/constants";

describe("Registry API Integration Tests", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });
  const TIMEOUT: number = 50000000;
  const config = new Configuration({
    basePath: REGISTRY_API_SERVER,
  });
  let registryApi: RegistryApi;

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

    registryApi = new RegistryApi(config);
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
    //Given & When
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
  it("Tests POST /commission-schema-profile: Given a Valid Schema Profile to an Available service, When calling the endpoint, Then registers Schema Profile successfully and returns a DID", async () => {
    //Given & When
    const commissionSchemaProfileEndpoint =
      await registryApi.commissionSchemaProfile(
        VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
      );

    //Then
    expect(commissionSchemaProfileEndpoint.status).toBe(200);
    expect(commissionSchemaProfileEndpoint.data).toBeDefined();
  });
  it("Tests POST /commission-schema-profile: Given an Invalid Schema Profile to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /commission-schema-profile: Given a Valid Schema Profile to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*POST /commission-tokenized-asset-record*/
  it("Tests POST /commission-tokenized-asset-record: Given a Valid Tokenized Asset Record to an Available service, When calling the endpoint, Then registers the TAR successfully and returns a DID", async () => {
    //Given & When
    const commissionTokenizedAssetRecordEndpoint =
      await registryApi.commissionTokenizedAssetRecord(
        VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
      );

    //Then
    expect(commissionTokenizedAssetRecordEndpoint.status).toBe(200);
    expect(commissionTokenizedAssetRecordEndpoint.data).toBeDefined();
  });
  it("Tests POST /commission-tokenized-asset-record: Given an Invalid Tokenized Asset Record to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /commission-tokenized-asset-record: Given a Valid Tokenized Asset Record to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*POST /register-asset-schema-authority*/
  it("Tests POST /register-asset-schema-authority: Given a Valid Asset Schema Authority Certificate to an Available service, When calling the endpoint, Then registers the authority successfully and returns a DID", async () => {
    //Given & When
    const registerAssetSchemaAuthorityEndpoint =
      await registryApi.registerAssetSchemaAuthority(
        VALID_ASSET_SCHEMA_AUTHORITY_CERTIFICATE_EXAMPLE,
      );

    //Then
    expect(registerAssetSchemaAuthorityEndpoint.status).toBe(200);
    expect(registerAssetSchemaAuthorityEndpoint.data).toBeDefined();
  });
  it("Tests POST /register-asset-schema-authority: Given an Invalid Asset Schema Authority Certificate to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /register-asset-schema-authority: Given a Valid Asset Schema Authority Certificate to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*POST /register-asset-provider*/
  it("Tests POST /register-asset-provider: Given a Valid Asset Provider Certificate to an Available service, When calling the endpoint, Then registers the provider successfully and returns a DID", async () => {
    //Given & When
    const registerAssetProviderEndpoint =
      await registryApi.registerAssetProvider(
        VALID_ASSET_PROVIDER_CERTIFICATE_EXAMPLE,
      );

    //Then
    expect(registerAssetProviderEndpoint.status).toBe(200);
    expect(registerAssetProviderEndpoint.data).toBeDefined();
  });
  it("Tests POST /register-asset-provider: Given an Invalid Asset Provider Certificate to an Available service, When calling the endpoint, Then throw exception", async () => {});
  it("Tests POST /register-asset-provider: Given a Valid Asset Provider Certificate to an Unavailable service, When calling the endpoint, Then throw exception", async () => {});

  /*GET /get-asset-schema*/
  it(
    "Tests GET /get-asset-schema: Given a valid UID and Available service, When calling the endpoint, Then returns the Asset Schema",
    async () => {
      //Given
      const commissionAssetSchemaEndpoint =
        await registryApi.commissionAssetSchema(
          VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
        );
      const uid: string = commissionAssetSchemaEndpoint.data.id;

      //When
      const getAssetSchemaEndpoint = await registryApi.getAssetSchema(uid);

      //Then
      expect(getAssetSchemaEndpoint.status).toBe(200);
      expect(getAssetSchemaEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
  it("Tests GET /get-asset-schema: Given an invalid UID and Available service, When calling the endpoint, Then throw exception", async () => {});
  it(
    "Tests GET /get-asset-schema: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        //Given
        const commissionAssetSchemaEndpoint =
          await registryApi.commissionAssetSchema(
            VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
          );
        const uid: string = commissionAssetSchemaEndpoint.data.id;

        const badRegistryApi = new RegistryApi(
          new Configuration({
            basePath: "http://badlocalhost//:666",
          }),
        );

        //When
        await badRegistryApi.getAssetSchema(uid);

        //Then
        fail("Expected network error due to unavailable service");
      } catch (error: any) {
        console.log(error);
        expect(error).toBeDefined();
        expect([
          "ECONNREFUSED",
          "EAI_AGAIN",
          "ENOTFOUND",
          "ETIMEDOUT",
          "ECONNRESET",
        ]).toContain(error.code);
        expect(error.message).toMatch(
          /connect|refused|timeout|not found|getaddrinfo/i,
        );
        expect(error.response).toBeUndefined();
      }
    },
    TIMEOUT,
  );

  /*GET /get-schema-profile*/
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

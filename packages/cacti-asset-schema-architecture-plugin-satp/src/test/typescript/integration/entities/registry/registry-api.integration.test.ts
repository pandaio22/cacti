import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../../../main/typescript/plugin-asset-schema-architecture";
import { RegistryApi } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { v4 as uuidv4 } from "uuid";
import {
  REGISTRY_API_SERVER,
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
  VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
  VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
  VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
  VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION,
} from "../../../constants/constants";
import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";

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
    /*try {
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
    }*/

    // Create table for testing
    await db.schema.dropTableIfExists("asset_providers");
    await db.schema.createTable("asset_providers", (table) => {
      table.string("did").primary();
      table.text("asset_provider");
    });
    await db.schema.dropTableIfExists("asset_schema_authorities");
    await db.schema.createTable("asset_schema_authorities", (table) => {
      table.string("did").primary();
      table.text("asset_schema_authority");
    });
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
    await db.schema.dropTableIfExists("tokenized_asset_records");
    await db.schema.createTable("tokenized_asset_records", (table) => {
      table.string("did").primary();
      table.text("tokenized_asset_record");
      table.text("tokenized_asset_record_did_document");
      table.text("tokenized_asset_record_vc");
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

    registryApi = new RegistryApi(config);
  }, TIMEOUT);

  afterEach(async () => {
    await db("asset_schemas").del();
    await db("asset_providers").del(); // clear table
    await db("schema_profiles").del();
    await db("tokenized_asset_records").del();
    await db("token_issuance_authorizations").del();
    await db("asset_schema_authorities").del();

    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    /*try {
      console.log("Stopping IPFS container...");
      execSync("docker stop ipfs", { stdio: "inherit" });
    } catch (err) {
      console.error("Failed to stop IPFS container:", err);
      // Don't rethrow; allow cleanup to finish
    }*/
    await db.destroy();
  });

  /*POST /commission-asset-schema*/
  it(
    "Tests POST /commission-asset-schema: Given a Valid Asset Schema to an Available service, When calling the endpoint, Then registers Asset Schema successfully and returns a DID",
    async () => {
      //Given & When
      const reqBody = {
        did: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id,
        assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
        assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
        assetSchemaVerifiableCredential:
          VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
      };
      const commissionAssetSchemaEndpoint =
        await registryApi.commissionAssetSchema(reqBody);

      //Then
      expect(commissionAssetSchemaEndpoint.status).toBe(200);
      expect(commissionAssetSchemaEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
  it(
    "Tests POST /commission-asset-schema: Given an Invalid Asset Schema, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidReqBody = {
        ...VALID_ASSET_SCHEMA_EXAMPLE,
        did: null, // invalid field
      } as any;

      // When
      const commissionAssetSchemaEndpoint = await registryApi
        .commissionAssetSchema(invalidReqBody)
        .catch((err) => err.response);

      // Then
      console.log("Error Response Data:", commissionAssetSchemaEndpoint?.data);

      expect(commissionAssetSchemaEndpoint).toBeDefined();

      // HTTP status
      expect(commissionAssetSchemaEndpoint?.status).toEqual(500);

      // Outer error message
      expect(commissionAssetSchemaEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );

  it(
    "Tests POST /commission-asset-schema: Given a Valid Asset Schema to an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        // Given: A valid asset schema request body
        const reqBody = {
          did: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id,
          assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
          assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
          assetSchemaVerifiableCredential:
            VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
        };

        // Create an API client pointing to an unreachable service
        const badRegistryApi = new RegistryApi(
          new Configuration({
            basePath: "http://badlocalhost:666", // intentionally unreachable
          }),
        );

        // When: Attempt to commission the asset schema
        await badRegistryApi.commissionAssetSchema(reqBody);

        // Then: This line should not be reached
        fail("Expected network error due to unavailable service");
      } catch (error: any) {
        console.log("Caught error:", error);

        // Ensure an error was thrown
        expect(error).toBeDefined();

        // Check for common network error codes
        expect([
          "ECONNREFUSED",
          "EAI_AGAIN",
          "ENOTFOUND",
          "ETIMEDOUT",
          "ECONNRESET",
        ]).toContain(error.code);

        // Ensure the error message indicates a connection issue
        expect(error.message).toMatch(
          /connect|refused|timeout|not found|getaddrinfo/i,
        );

        // Ensure no HTTP response was received
        expect(error.response).toBeUndefined();
      }
    },
    TIMEOUT,
  );

  /*POST /commission-schema-profile*/
  it(
    "Tests POST /commission-schema-profile: Given a Valid Schema Profile to an Available service, When calling the endpoint, Then registers Schema Profile successfully and returns a DID",
    async () => {
      //Given & When
      const reqBody = {
        did: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE.id,
        schemaProfile: VALID_SCHEMA_PROFILE_EXAMPLE,
        schemaProfileDidDocument: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
        schemaProfileVerifiableCredential:
          VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
      };
      const commissionAssetSchemaEndpoint =
        await registryApi.commissionSchemaProfile(reqBody);

      //Then
      expect(commissionAssetSchemaEndpoint.status).toBe(200);
      expect(commissionAssetSchemaEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );
  it(
    "Tests POST /commission-schema-profile: Given an Invalid Schema Profile, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidReqBody = {
        ...VALID_SCHEMA_PROFILE_EXAMPLE,
        did: null, // invalid field
      } as any;

      // When
      const commissionSchemaProfileEndpoint = await registryApi
        .commissionSchemaProfile(invalidReqBody)
        .catch((err) => err.response);

      // Then
      console.log(
        "Error Response Data:",
        commissionSchemaProfileEndpoint?.data,
      );

      expect(commissionSchemaProfileEndpoint).toBeDefined();

      // HTTP status
      expect(commissionSchemaProfileEndpoint?.status).toEqual(500);

      // Outer error message
      expect(commissionSchemaProfileEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Tests POST /commission-schema-profile: Given a Valid Schema Profile to an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        const reqBody = {
          did: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE.id,
          schemaProfile: VALID_SCHEMA_PROFILE_EXAMPLE,
          schemaProfileDidDocument: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
          schemaProfileVerifiableCredential:
            VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
        };

        const badRegistryApi = new RegistryApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        await badRegistryApi.commissionSchemaProfile(reqBody);
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

  /*POST /commission-tokenized-asset-record*/
  it("Tests POST /commission-tokenized-asset-record: Given a Valid Tokenized Asset Record to an Available service, When calling the endpoint, Then registers the TAR successfully and returns a DID", async () => {
    //Given & When
    const reqBody = {
      did: VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT.id,
      tokenizedAssetRecord: VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
      tokenizedAssetRecordDidDocument:
        VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
      tokenizedAssetRecordVerifiableCredential:
        VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
    };
    const commissionTokenizedAssetRecordEndpoint =
      await registryApi.commissionTokenizedAssetRecord(reqBody);

    //Then
    expect(commissionTokenizedAssetRecordEndpoint.status).toBe(200);
    expect(commissionTokenizedAssetRecordEndpoint.data).toBeDefined();
  });
  it(
    "Tests POST /commission-tokenized-asset-record: Given an Invalid Tokenized Asset Record, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidReqBody = {
        ...VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
        did: null, // invalid field
      } as any;

      // When
      const commissionTokenizedAssetRecordEndpoint = await registryApi
        .commissionTokenizedAssetRecord(invalidReqBody)
        .catch((err) => err.response);

      // Then
      console.log(
        "Error Response Data:",
        commissionTokenizedAssetRecordEndpoint?.data,
      );

      expect(commissionTokenizedAssetRecordEndpoint).toBeDefined();

      // HTTP status
      expect(commissionTokenizedAssetRecordEndpoint?.status).toEqual(500);

      // Outer error message
      expect(commissionTokenizedAssetRecordEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Tests POST /commission-tokenized-asset-record: Given a Valid Tokenized Asset Record to an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        const reqBody = {
          did: VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT.id,
          tokenizedAssetRecord: VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
          tokenizedAssetRecordDidDocument:
            VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
          tokenizedAssetRecordVerifiableCredential:
            VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
        };

        const badRegistryApi = new RegistryApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        await badRegistryApi.commissionTokenizedAssetRecord(reqBody);
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

  /*POST /register-asset-schema-authority*/
  it("Tests POST /register-asset-schema-authority: Given a Valid Asset Schema Authority Certificate to an Available service, When calling the endpoint, Then registers the authority successfully and returns a DID", async () => {
    //Given & When
    const reqBody = VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE;
    const registerAssetSchemaAuthorityEndpoint =
      await registryApi.registerAssetSchemaAuthority(reqBody);

    //Then
    expect(registerAssetSchemaAuthorityEndpoint.status).toBe(200);
    expect(registerAssetSchemaAuthorityEndpoint.data).toBeDefined();
  });
  it(
    "Tests POST /register-asset-schema-authority: Given an Invalid Asset Schema Authority Certificate, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidReqBody = {
        ...VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
        id: null, // invalid field
      } as any;

      // When
      const registerAssetSchemaAuthorityEndpoint = await registryApi
        .registerAssetSchemaAuthority(invalidReqBody)
        .catch((err) => err.response);

      // Then
      console.log(
        "Error Response Data:",
        registerAssetSchemaAuthorityEndpoint?.data,
      );

      expect(registerAssetSchemaAuthorityEndpoint).toBeDefined();

      // HTTP status
      expect(registerAssetSchemaAuthorityEndpoint?.status).toEqual(500);

      // Outer error message
      expect(registerAssetSchemaAuthorityEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Tests POST /register-asset-schema-authority: Given a Valid Asset Schema Authority Certificate to an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        const reqBody = VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE;

        const badRegistryApi = new RegistryApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        await badRegistryApi.registerAssetSchemaAuthority(reqBody);
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

  /*POST /register-asset-provider*/
  it("Tests POST /register-asset-provider: Given a Valid Asset Provider Certificate to an Available service, When calling the endpoint, Then registers the provider successfully and returns a DID", async () => {
    //Given & When
    const registerAssetProviderEndpoint =
      await registryApi.registerAssetProvider(
        VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
      );

    //Then
    expect(registerAssetProviderEndpoint.status).toBe(200);
    expect(registerAssetProviderEndpoint.data).toBeDefined();
  });
  it(
    "Tests POST /register-asset-provider: Given an Invalid Asset Provider Certificate, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidReqBody = {
        ...VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
        id: null, // invalid field
      } as any;

      // When
      const registerAssetProviderEndpoint = await registryApi
        .registerAssetProvider(invalidReqBody)
        .catch((err) => err.response);

      // Then
      console.log("Error Response Data:", registerAssetProviderEndpoint?.data);

      expect(registerAssetProviderEndpoint).toBeDefined();

      // HTTP status
      expect(registerAssetProviderEndpoint?.status).toEqual(500);

      // Outer error message
      expect(registerAssetProviderEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Tests POST /register-asset-provider: Given a Valid Asset Provider Certificate to an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        const reqBody = VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE;

        const badRegistryApi = new RegistryApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        await badRegistryApi.registerAssetProvider(reqBody);
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

  /*POST /register-token-issuance-authorization*/
  it("Tests POST /register-token-issuance-authorization: Given a Valid Token Issuance Authorization to an Available service, When calling the endpoint, Then registers the TIA successfully and returns an ID", async () => {
    //Given & When
    const registerTokenIssuanceAuthorizationEndpoint =
      await registryApi.registerTokenIssuanceAuthorization(
        VALID_TOKEN_ISSUANCE_AUTHORIZATION,
      );

    //Then
    expect(registerTokenIssuanceAuthorizationEndpoint.status).toBe(200);
    expect(registerTokenIssuanceAuthorizationEndpoint.data).toBeDefined();
  });
  it(
    "Tests POST /register-token-issuance-authorization: Given an Invalid Token Issuance Authorization, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidReqBody = {
        ...VALID_TOKEN_ISSUANCE_AUTHORIZATION,
        id: null, // invalid field
      } as any;

      // When
      const registerTokenIssuanceAuthorizationEndpoint = await registryApi
        .registerTokenIssuanceAuthorization(invalidReqBody)
        .catch((err) => err.response);

      // Then
      console.log(
        "Error Response Data:",
        registerTokenIssuanceAuthorizationEndpoint?.data,
      );

      expect(registerTokenIssuanceAuthorizationEndpoint).toBeDefined();

      // HTTP status
      expect(registerTokenIssuanceAuthorizationEndpoint?.status).toEqual(500);

      // Outer error message
      expect(registerTokenIssuanceAuthorizationEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Tests POST /register-token-issuance-authorization: Given a Valid Token Issuance Authorization to an Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        const reqBody = VALID_TOKEN_ISSUANCE_AUTHORIZATION;

        const badRegistryApi = new RegistryApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        await badRegistryApi.registerTokenIssuanceAuthorization(reqBody);
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

  /*GET /get-asset-schema*/
  it(
    "Tests GET /get-asset-schema: Given a valid UID and Available service, When calling the endpoint, Then returns the Asset Schema",
    async () => {
      //Given
      const reqBody = {
        did: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id,
        assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
        assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
        assetSchemaVerifiableCredential:
          VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
      };
      await registryApi.commissionAssetSchema(reqBody);

      const did: string = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id;

      //When
      const getAssetSchemaEndpoint = await registryApi.getAssetSchema(did);

      console.log("Get Asset Schema Response:", getAssetSchemaEndpoint.data);
      //Then
      expect(getAssetSchemaEndpoint.status).toBe(200);
      expect(getAssetSchemaEndpoint.data).toBeDefined();
      expect(getAssetSchemaEndpoint.data.did).toBe(did);
      expect(JSON.stringify(getAssetSchemaEndpoint.data.assetSchema)).toBe(
        JSON.stringify(VALID_ASSET_SCHEMA_EXAMPLE),
      );
      expect(
        JSON.stringify(getAssetSchemaEndpoint.data.assetSchemaDidDocument),
      ).toBe(JSON.stringify(VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE));
      expect(
        JSON.stringify(
          getAssetSchemaEndpoint.data.assetSchemaVerifiableCredential,
        ),
      ).toBe(JSON.stringify(VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL));
    },
    TIMEOUT,
  );

  it(
    "Tests GET /get-asset-schema: Given an invalid UID and Available service, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidDid = "did:example:nonexistent12345"; // invalid UID

      // When
      const getAssetSchemaEndpoint = await registryApi
        .getAssetSchema(invalidDid)
        .catch((err) => err.response);

      // Then
      console.log("Error Response Data:", getAssetSchemaEndpoint?.data);

      expect(getAssetSchemaEndpoint).toBeDefined();

      // HTTP status
      expect(getAssetSchemaEndpoint?.status).toEqual(500);

      // Outer error message
      expect(getAssetSchemaEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );

  it(
    "Tests GET /get-asset-schema: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        //Given
        const commissionAssetSchemaEndpoint =
          await registryApi.commissionAssetSchema({
            did: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id,
            assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
            assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
            assetSchemaVerifiableCredential:
              VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
          });
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
  it(
    "Tests GET /get-schema-profile: Given a valid UID and Available service, When calling the endpoint, Then returns the Schema Profile",
    async () => {
      //Given
      const reqBody = {
        did: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE.id,
        schemaProfile: VALID_SCHEMA_PROFILE_EXAMPLE,
        schemaProfileDidDocument: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
        schemaProfileVerifiableCredential:
          VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
      };
      await registryApi.commissionSchemaProfile(reqBody);

      const did: string = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE.id;

      //When
      const getSchemaProfileEndpoint = await registryApi.getSchemaProfile(did);

      console.log(
        "Get Schema Profile Response:",
        getSchemaProfileEndpoint.data,
      );

      //Then
      expect(getSchemaProfileEndpoint.status).toBe(200);
      expect(getSchemaProfileEndpoint.data).toBeDefined();
      expect(getSchemaProfileEndpoint.data.did).toBe(did);
      expect(JSON.stringify(getSchemaProfileEndpoint.data.schemaProfile)).toBe(
        JSON.stringify(VALID_SCHEMA_PROFILE_EXAMPLE),
      );
      expect(
        JSON.stringify(getSchemaProfileEndpoint.data.schemaProfileDidDocument),
      ).toBe(JSON.stringify(VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE));
      expect(
        JSON.stringify(
          getSchemaProfileEndpoint.data.schemaProfileVerifiableCredential,
        ),
      ).toBe(JSON.stringify(VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL));
    },
    TIMEOUT,
  );
  /* GET /get-schema-profile */
  it(
    "Tests GET /get-schema-profile: Given an invalid UID and Available service, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidDid = "did:example:nonexistent-schema-profile-12345"; // invalid UID

      // When
      const getSchemaProfileEndpoint = await registryApi
        .getSchemaProfile(invalidDid)
        .catch((err) => err.response);

      // Then
      console.log("Error Response Data:", getSchemaProfileEndpoint?.data);

      expect(getSchemaProfileEndpoint).toBeDefined();

      // HTTP status
      expect(getSchemaProfileEndpoint?.status).toEqual(500);

      // Outer error message
      expect(getSchemaProfileEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );

  it(
    "Tests GET /get-schema-profile: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        //Given
        const reqBody = {
          did: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE.id,
          schemaProfile: VALID_SCHEMA_PROFILE_EXAMPLE,
          schemaProfileDidDocument: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
          schemaProfileVerifiableCredential:
            VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
        };
        const commissionSchemaProfileEndpoint =
          await registryApi.commissionSchemaProfile(reqBody);

        const uid: string = commissionSchemaProfileEndpoint.data.id;

        const badRegistryApi = new RegistryApi(
          new Configuration({
            basePath: "http://badlocalhost//:666",
          }),
        );

        //When
        await badRegistryApi.getSchemaProfile(uid);

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

  /*GET /get-tokenized-asset-record*/
  it(
    "Tests GET /get-tokenized-asset-record: Given a valid UID and Available service, When calling the endpoint, Then returns the Tokenized Asset Record",
    async () => {
      //Given
      const reqBody = {
        did: VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT.id,
        tokenizedAssetRecord: VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
        tokenizedAssetRecordDidDocument:
          VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
        tokenizedAssetRecordVerifiableCredential:
          VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
      };
      await registryApi.commissionTokenizedAssetRecord(reqBody);

      const did: string = VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT.id;

      //When
      const getTokenizedAssetRecordEndpoint =
        await registryApi.getTokenizedAssetRecord(did);

      //Then
      expect(getTokenizedAssetRecordEndpoint.status).toBe(200);
      expect(getTokenizedAssetRecordEndpoint.data).toBeDefined();
      expect(getTokenizedAssetRecordEndpoint.data.did).toBe(did);
      expect(
        JSON.stringify(
          getTokenizedAssetRecordEndpoint.data.tokenizedAssetRecord,
        ),
      ).toBe(JSON.stringify(VALID_TOKENIZED_ASSET_RECORD_EXAMPLE));
      expect(
        JSON.stringify(
          getTokenizedAssetRecordEndpoint.data.tokenizedAssetRecordDidDocument,
        ),
      ).toBe(JSON.stringify(VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT));
      expect(
        JSON.stringify(
          getTokenizedAssetRecordEndpoint.data
            .tokenizedAssetRecordVerifiableCredential,
        ),
      ).toBe(
        JSON.stringify(VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL),
      );
    },
    TIMEOUT,
  );
  it(
    "Tests GET /get-tokenized-asset-record: Given an invalid UID and Available service, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidDid = "did:example:nonexistent-tokenized-asset-record-12345"; // invalid UID

      // When
      const getTokenizedAssetRecordEndpoint = await registryApi
        .getTokenizedAssetRecord(invalidDid)
        .catch((err) => err.response);

      // Then
      console.log(
        "Error Response Data:",
        getTokenizedAssetRecordEndpoint?.data,
      );

      expect(getTokenizedAssetRecordEndpoint).toBeDefined();

      // HTTP status
      expect(getTokenizedAssetRecordEndpoint?.status).toEqual(500);

      // Outer error message
      expect(getTokenizedAssetRecordEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Tests GET /get-tokenized-asset-record: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        //Given
        const reqBody = {
          did: VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT.id,
          tokenizedAssetRecord: VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
          tokenizedAssetRecordDidDocument:
            VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
          tokenizedAssetRecordVerifiableCredential:
            VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
        };
        const commissionTokenizedAssetRecordEndpoint =
          await registryApi.commissionTokenizedAssetRecord(reqBody);

        const uid: string = commissionTokenizedAssetRecordEndpoint.data.id;

        const badRegistryApi = new RegistryApi(
          new Configuration({
            basePath: "http://badlocalhost//:666",
          }),
        );

        //When
        await badRegistryApi.getTokenizedAssetRecord(uid);

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

  /*GET /get-asset-schema-authority*/
  it(
    "Tests GET /get-asset-schema-authority: Given a valid UID and Available service, When calling the endpoint, Then returns the Asset Schema Authority certificate",
    async () => {
      //Given
      const reqBody = VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE;
      await registryApi.registerAssetSchemaAuthority(reqBody);

      const did: string = VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE.id;

      //When
      const getAssetSchemaAuthorityEndpoint =
        await registryApi.getAssetSchemaAuthority(did);

      //Then
      expect(getAssetSchemaAuthorityEndpoint.status).toBe(200);
      expect(getAssetSchemaAuthorityEndpoint.data).toBeDefined();
      expect(JSON.stringify(getAssetSchemaAuthorityEndpoint.data)).toBe(
        JSON.stringify(VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE),
      );
    },
    TIMEOUT,
  );
  it(
    "Tests GET /get-asset-schema-authority: Given an invalid UID and Available service, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidDid = "did:example:nonexistent-asset-schema-authority-12345"; // invalid UID

      // When
      const getAssetSchemaAuthorityEndpoint = await registryApi
        .getAssetSchemaAuthority(invalidDid)
        .catch((err) => err.response);

      // Then
      console.log(
        "Error Response Data:",
        getAssetSchemaAuthorityEndpoint?.data,
      );

      expect(getAssetSchemaAuthorityEndpoint).toBeDefined();

      // HTTP status
      expect(getAssetSchemaAuthorityEndpoint?.status).toEqual(500);

      // Outer error message
      expect(getAssetSchemaAuthorityEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Tests GET /get-asset-schema-authority: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        //Given
        const registerAssetSchemaAuthorityEndpoint =
          await registryApi.registerAssetSchemaAuthority(
            VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
          );
        const uid: string = registerAssetSchemaAuthorityEndpoint.data["id"];

        const badRegistryApi = new RegistryApi(
          new Configuration({
            basePath: "http://badlocalhost//:666",
          }),
        );
        console.log(uid);
        //When
        await badRegistryApi.getAssetSchemaAuthority(uid);

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

  /*GET /get-asset-provider*/
  it(
    "Tests GET /get-asset-provider: Given a valid UID and Available service, When calling the endpoint, Then returns the Asset Provider certificate",
    async () => {
      //Given
      await registryApi.registerAssetProvider(
        VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
      );
      const did: string = VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE.id;

      //When
      const getAssetProviderEndpoint = await registryApi.getAssetProvider(did);

      //Then
      expect(getAssetProviderEndpoint.status).toBe(200);
      expect(getAssetProviderEndpoint.data).toBeDefined();
      expect(JSON.stringify(getAssetProviderEndpoint.data)).toBe(
        JSON.stringify(VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE),
      );
    },
    TIMEOUT,
  );
  it(
    "Tests GET /get-asset-provider: Given an invalid UID and Available service, When calling the endpoint, Then throw exception",
    async () => {
      // Given
      const invalidDid = "did:example:nonexistent-asset-provider-12345"; // invalid UID

      // When
      const getAssetProviderEndpoint = await registryApi
        .getAssetProvider(invalidDid)
        .catch((err) => err.response);

      // Then
      console.log("Error Response Data:", getAssetProviderEndpoint?.data);

      expect(getAssetProviderEndpoint).toBeDefined();

      // HTTP status
      expect(getAssetProviderEndpoint?.status).toEqual(500);

      // Outer error message
      expect(getAssetProviderEndpoint?.data?.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );
  it(
    "Tests GET /get-asset-provider: Given a valid UID and Unavailable service, When calling the endpoint, Then throw exception",
    async () => {
      try {
        //Given
        const registerAssetProviderEndpoint =
          await registryApi.registerAssetProvider(
            VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
          );
        const uid: string = registerAssetProviderEndpoint.data["id"];

        const badRegistryApi = new RegistryApi(
          new Configuration({
            basePath: "http://badlocalhost//:666",
          }),
        );

        //When
        await badRegistryApi.getAssetProvider(uid);

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
});

import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../main/typescript/plugin-asset-schema-architecture";
import {
  AssetSchemaAuthorityApi,
  RegistryApi,
} from "../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { AssetProviderService } from "../../../main/typescript/entities/asset-provider/modules/services/asset-provider-service/implementations/asset-provider.service";
import { v4 as uuidv4 } from "uuid";
import {
  ASSET_SCHEMA_AUTHORITY_API_SERVER,
  REGISTRY_API_SERVER,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
} from "../constants/constants";
import { db } from "../../../main/typescript/entities/registry/modules/database/knex/db-connection";

describe("Scenario #3 - Commission Tokenized Asset Record", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  let assetProviderService: AssetProviderService;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });
  const TIMEOUT: number = 50000000;
  const configAssetSchemaAuthority = new Configuration({
    basePath: ASSET_SCHEMA_AUTHORITY_API_SERVER,
  });
  const configRegistry = new Configuration({
    basePath: REGISTRY_API_SERVER,
  });
  let assetSchemaAuthorityApi: AssetSchemaAuthorityApi;
  let registryApi: RegistryApi;

  /***********************************************CONTEXT SETUP*/
  const didV1Context = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../json-ld/contexts/did-v1.jsonld"),
      "utf-8",
    ),
  );

  const assetSchemaContext = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../json-ld/contexts/asset-schema.jsonld"),
      "utf-8",
    ),
  );

  const schemaProfileContext = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../json-ld/contexts/schema-profile.jsonld"),
      "utf-8",
    ),
  );

  const schemaProfileVerifiableCredentialContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../json-ld/contexts/schema-profile-verifiable-credential.jsonld",
      ),
      "utf-8",
    ),
  );

  const verifiableCredentialsContextTest = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../json-ld/contexts/test-vc-1.jsonld"),
      "utf-8",
    ),
  );

  const ed255192020 = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../json-ld/contexts/ed25519-2020.jsonld"),
      "utf-8",
    ),
  );
  /***********************************************CONTEXT SETUP*/

  beforeAll(async () => {
    // Create tables for testing
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

    assetSchemaAuthorityApi = new AssetSchemaAuthorityApi(
      configAssetSchemaAuthority,
    );
    registryApi = new RegistryApi(configRegistry);
    assetProviderService = new AssetProviderService();
  }, TIMEOUT);

  afterEach(async () => {
    await db("tokenized_asset_records").del();
    await db("token_issuance_authorizations").del();
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    await db.destroy();
  });

  it(
    "Scenario #3 - Test Case 1 - PASS: Given a Token Issuance Authorization Request, When Creating a Token Issuance Authorization and Commissioning a Tokenized Asset Record, Then Return Success response and a Commissioned Tokenized Asset Record.",
    async () => {
      //Given
      const networkId = "Ethereum";
      const schemaProfileDidDocument =
        VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
      let localContexts: Record<string, any> = {
        "https://www.w3.org/ns/did/v1": didV1Context,
        "https://www.w3.org/2018/credentials/v1":
          verifiableCredentialsContextTest,
        "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
        "https://www.example.org/schema-profile/vc/v1":
          schemaProfileVerifiableCredentialContext,
        "did:example:123456789abcdefghi#": assetSchemaContext,
      };
      assetProviderService = new AssetProviderService(localContexts);

      const tokenIssuanceAuthorizationRequest =
        await assetProviderService.createTokenIssuanceAuthorizationRequest(
          networkId,
          schemaProfileDidDocument,
        );

      //When
      const tokenIssuanceAuthorizationRequestEndpoint =
        await assetSchemaAuthorityApi.requestTokenIssuanceAuthorization(
          tokenIssuanceAuthorizationRequest,
        );

      const tokenIssuanceAuthorization =
        tokenIssuanceAuthorizationRequestEndpoint.data;

      localContexts = {
        "https://www.w3.org/ns/did/v1": didV1Context,
        "https://www.w3.org/2018/credentials/v1":
          verifiableCredentialsContextTest,
        "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
        "https://www.example.org/schema-profile/vc/v1":
          schemaProfileVerifiableCredentialContext,
        "did:example:123456789abcdefghi#": assetSchemaContext,
        "did:example:56745689abcdefghi#": schemaProfileContext,
      };
      assetProviderService = new AssetProviderService(localContexts);

      const {
        tokenizedAssetRecord,
        tokenizedAssetRecordVerifiableCredential,
        tokenizedAssetRecordDidDocument,
      } = await assetProviderService.createTokenizedAssetRecord(
        tokenIssuanceAuthorization,
      );

      const commissionTokenizedAssetRecordEndpoint =
        await registryApi.commissionTokenizedAssetRecord({
          did: tokenizedAssetRecordDidDocument.id,
          tokenizedAssetRecord: tokenizedAssetRecord,
          tokenizedAssetRecordDidDocument: tokenizedAssetRecordDidDocument,
          tokenizedAssetRecordVerifiableCredential:
            tokenizedAssetRecordVerifiableCredential,
        });

      //Then
      expect(tokenIssuanceAuthorizationRequest).toBeDefined();
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("@context");
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("id");
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("type");
      expect(tokenIssuanceAuthorizationRequest.type).toContain(
        "VerifiableCredential",
      );
      expect(tokenIssuanceAuthorizationRequest.type).toContain(
        "TokenIssuanceAuthorizationRequest",
      );
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty(
        "credentialSubject",
      );
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("proof");
      expect(tokenIssuanceAuthorizationRequest.proof).toHaveProperty("type");

      expect(tokenIssuanceAuthorizationRequestEndpoint.status).toEqual(200);
      expect(tokenIssuanceAuthorizationRequest).toBeDefined();

      expect(commissionTokenizedAssetRecordEndpoint.status).toBe(200);
      expect(commissionTokenizedAssetRecordEndpoint.data).toBeDefined();
    },
    TIMEOUT,
  );

  it(
    "Scenario #3 - Test Case 2 - FAIL: Given a Token Issuance Authorization Request, When Creating a Token Issuance Authorization and Commissioning the same Tokenized Asset Record twice, Then throw exception and an Error Response.",
    async () => {
      ///Given
      const networkId = "Ethereum";
      const schemaProfileDidDocument =
        VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
      let localContexts: Record<string, any> = {
        "https://www.w3.org/ns/did/v1": didV1Context,
        "https://www.w3.org/2018/credentials/v1":
          verifiableCredentialsContextTest,
        "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
        "https://www.example.org/schema-profile/vc/v1":
          schemaProfileVerifiableCredentialContext,
        "did:example:123456789abcdefghi#": assetSchemaContext,
      };
      assetProviderService = new AssetProviderService(localContexts);

      const tokenIssuanceAuthorizationRequest =
        await assetProviderService.createTokenIssuanceAuthorizationRequest(
          networkId,
          schemaProfileDidDocument,
        );

      //When
      const tokenIssuanceAuthorizationRequestEndpoint =
        await assetSchemaAuthorityApi.requestTokenIssuanceAuthorization(
          tokenIssuanceAuthorizationRequest,
        );

      const tokenIssuanceAuthorization =
        tokenIssuanceAuthorizationRequestEndpoint.data;

      localContexts = {
        "https://www.w3.org/ns/did/v1": didV1Context,
        "https://www.w3.org/2018/credentials/v1":
          verifiableCredentialsContextTest,
        "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
        "https://www.example.org/schema-profile/vc/v1":
          schemaProfileVerifiableCredentialContext,
        "did:example:123456789abcdefghi#": assetSchemaContext,
        "did:example:56745689abcdefghi#": schemaProfileContext,
      };
      assetProviderService = new AssetProviderService(localContexts);

      const {
        tokenizedAssetRecord,
        tokenizedAssetRecordVerifiableCredential,
        tokenizedAssetRecordDidDocument,
      } = await assetProviderService.createTokenizedAssetRecord(
        tokenIssuanceAuthorization,
      );

      await registryApi.commissionTokenizedAssetRecord({
        did: tokenizedAssetRecordDidDocument.id,
        tokenizedAssetRecord: tokenizedAssetRecord,
        tokenizedAssetRecordDidDocument: tokenizedAssetRecordDidDocument,
        tokenizedAssetRecordVerifiableCredential:
          tokenizedAssetRecordVerifiableCredential,
      });
      const commissionTokenizedAssetRecordEndpoint = await registryApi
        .commissionTokenizedAssetRecord({
          did: tokenizedAssetRecordDidDocument.id,
          tokenizedAssetRecord: tokenizedAssetRecord,
          tokenizedAssetRecordDidDocument: tokenizedAssetRecordDidDocument,
          tokenizedAssetRecordVerifiableCredential:
            tokenizedAssetRecordVerifiableCredential,
        })
        .catch((err) => err.response);

      //Then
      expect(tokenIssuanceAuthorizationRequest).toBeDefined();
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("@context");
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("id");
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("type");
      expect(tokenIssuanceAuthorizationRequest.type).toContain(
        "VerifiableCredential",
      );
      expect(tokenIssuanceAuthorizationRequest.type).toContain(
        "TokenIssuanceAuthorizationRequest",
      );
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty(
        "credentialSubject",
      );
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("proof");
      expect(tokenIssuanceAuthorizationRequest.proof).toHaveProperty("type");

      expect(tokenIssuanceAuthorizationRequestEndpoint.status).toEqual(200);
      expect(tokenIssuanceAuthorizationRequest).toBeDefined();

      expect(commissionTokenizedAssetRecordEndpoint.status).toBe(500);
      expect(commissionTokenizedAssetRecordEndpoint.data).toBeDefined();
      expect(commissionTokenizedAssetRecordEndpoint.data.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );

  it(
    "Scenario #3 - Test Case 3 - FAIL: Given an Invalid Token Issuance Authorization Request, When Creating a Token Issuance Authorization and Commissioning the same Tokenized Asset Record twice, Then throw exception and an Error Response.",
    async () => {
      ///Given
      const networkId = "Ethereum";
      const schemaProfileDidDocument =
        VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
      let localContexts: Record<string, any> = {
        "https://www.w3.org/ns/did/v1": didV1Context,
        "https://www.w3.org/2018/credentials/v1":
          verifiableCredentialsContextTest,
        "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
        "https://www.example.org/schema-profile/vc/v1":
          schemaProfileVerifiableCredentialContext,
        "did:example:123456789abcdefghi#": assetSchemaContext,
      };
      assetProviderService = new AssetProviderService(localContexts);

      const tokenIssuanceAuthorizationRequest =
        await assetProviderService.createTokenIssuanceAuthorizationRequest(
          networkId,
          schemaProfileDidDocument,
        );

      //When
      const invalidTokenIssuanceAuthorizationRequest = {
        ...tokenIssuanceAuthorizationRequest,
        id: null, // invalid field
      } as any;

      const tokenIssuanceAuthorizationRequestEndpoint =
        await assetSchemaAuthorityApi
          .requestTokenIssuanceAuthorization(
            invalidTokenIssuanceAuthorizationRequest,
          )
          .catch((err) => err.response);

      const tokenIssuanceAuthorization =
        tokenIssuanceAuthorizationRequestEndpoint.data;

      localContexts = {
        "https://www.w3.org/ns/did/v1": didV1Context,
        "https://www.w3.org/2018/credentials/v1":
          verifiableCredentialsContextTest,
        "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
        "https://www.example.org/schema-profile/vc/v1":
          schemaProfileVerifiableCredentialContext,
        "did:example:123456789abcdefghi#": assetSchemaContext,
        "did:example:56745689abcdefghi#": schemaProfileContext,
      };
      assetProviderService = new AssetProviderService(localContexts);

      const {
        tokenizedAssetRecord,
        tokenizedAssetRecordVerifiableCredential,
        tokenizedAssetRecordDidDocument,
      } = await assetProviderService
        .createTokenizedAssetRecord(tokenIssuanceAuthorization)
        .catch((err) => err.response);

      await registryApi.commissionTokenizedAssetRecord({
        did: tokenizedAssetRecordDidDocument.id,
        tokenizedAssetRecord: tokenizedAssetRecord,
        tokenizedAssetRecordDidDocument: tokenizedAssetRecordDidDocument,
        tokenizedAssetRecordVerifiableCredential:
          tokenizedAssetRecordVerifiableCredential,
      });
      const commissionTokenizedAssetRecordEndpoint = await registryApi
        .commissionTokenizedAssetRecord({
          did: tokenizedAssetRecordDidDocument.id,
          tokenizedAssetRecord: tokenizedAssetRecord,
          tokenizedAssetRecordDidDocument: tokenizedAssetRecordDidDocument,
          tokenizedAssetRecordVerifiableCredential:
            tokenizedAssetRecordVerifiableCredential,
        })
        .catch((err) => err.response);

      //Then
      expect(tokenIssuanceAuthorizationRequest).toBeDefined();
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("@context");
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("id");
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("type");
      expect(tokenIssuanceAuthorizationRequest.type).toContain(
        "VerifiableCredential",
      );
      expect(tokenIssuanceAuthorizationRequest.type).toContain(
        "TokenIssuanceAuthorizationRequest",
      );
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty(
        "credentialSubject",
      );
      expect(tokenIssuanceAuthorizationRequest).toHaveProperty("proof");
      expect(tokenIssuanceAuthorizationRequest.proof).toHaveProperty("type");

      expect(tokenIssuanceAuthorizationRequestEndpoint.status).toEqual(500);
      expect(tokenIssuanceAuthorizationRequestEndpoint.data).toBeDefined();
      expect(tokenIssuanceAuthorizationRequestEndpoint.data.message).toEqual(
        "InternalServerError",
      );

      expect(commissionTokenizedAssetRecordEndpoint.status).toBe(500);
      expect(commissionTokenizedAssetRecordEndpoint.data).toBeDefined();
      expect(commissionTokenizedAssetRecordEndpoint.data.message).toEqual(
        "InternalServerError",
      );
    },
    TIMEOUT,
  );

  it(
    "Scenario #3 - Test Case 4 - FAIL: Given a Token Issuance Authorization Request to an Unavailable Asset Schema Authority, When Creating a Token Issuance Authorization and Commissioning a Tokenized Asset Record, Then throw exception and an Error Response.",
    async () => {
      try {
        //Given
        const networkId = "Ethereum";
        const schemaProfileDidDocument =
          VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
        let localContexts: Record<string, any> = {
          "https://www.w3.org/ns/did/v1": didV1Context,
          "https://www.w3.org/2018/credentials/v1":
            verifiableCredentialsContextTest,
          "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
          "https://www.example.org/schema-profile/vc/v1":
            schemaProfileVerifiableCredentialContext,
          "did:example:123456789abcdefghi#": assetSchemaContext,
        };
        assetProviderService = new AssetProviderService(localContexts);

        const tokenIssuanceAuthorizationRequest =
          await assetProviderService.createTokenIssuanceAuthorizationRequest(
            networkId,
            schemaProfileDidDocument,
          );
        const unavailableAssetSchemaAuthorityApi = new AssetSchemaAuthorityApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        //When
        const tokenIssuanceAuthorizationRequestEndpoint =
          await unavailableAssetSchemaAuthorityApi.requestTokenIssuanceAuthorization(
            tokenIssuanceAuthorizationRequest,
          );

        const tokenIssuanceAuthorization =
          tokenIssuanceAuthorizationRequestEndpoint.data;

        localContexts = {
          "https://www.w3.org/ns/did/v1": didV1Context,
          "https://www.w3.org/2018/credentials/v1":
            verifiableCredentialsContextTest,
          "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
          "https://www.example.org/schema-profile/vc/v1":
            schemaProfileVerifiableCredentialContext,
          "did:example:123456789abcdefghi#": assetSchemaContext,
          "did:example:56745689abcdefghi#": schemaProfileContext,
        };
        assetProviderService = new AssetProviderService(localContexts);

        const {
          tokenizedAssetRecord,
          tokenizedAssetRecordVerifiableCredential,
          tokenizedAssetRecordDidDocument,
        } = await assetProviderService.createTokenizedAssetRecord(
          tokenIssuanceAuthorization,
        );

        await registryApi.commissionTokenizedAssetRecord({
          did: tokenizedAssetRecordDidDocument.id,
          tokenizedAssetRecord: tokenizedAssetRecord,
          tokenizedAssetRecordDidDocument: tokenizedAssetRecordDidDocument,
          tokenizedAssetRecordVerifiableCredential:
            tokenizedAssetRecordVerifiableCredential,
        });

        fail("Expected network error due to unavailable service");
      } catch (error: any) {
        //Then
        expect(error).toBeDefined();
        expect(["EAI_AGAIN"]).toContain(error.code);
        expect(error.message).toMatch(
          /connect|refused|timeout|not found|getaddrinfo/i,
        );
        expect(error.response).toBeUndefined();
      }
    },
    TIMEOUT,
  );
  it(
    "Scenario #3 - Test Case 5 - FAIL: Given a Token Issuance Authorization Request, When Creating a Token Issuance Authorization and Commissioning to an Unavailable Registry, Then throw exception and an Error Response.",
    async () => {
      try {
        // Given
        const networkId = "Ethereum";
        const schemaProfileDidDocument =
          VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
        let localContexts: Record<string, any> = {
          "https://www.w3.org/ns/did/v1": didV1Context,
          "https://www.w3.org/2018/credentials/v1":
            verifiableCredentialsContextTest,
          "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
          "https://www.example.org/schema-profile/vc/v1":
            schemaProfileVerifiableCredentialContext,
          "did:example:123456789abcdefghi#": assetSchemaContext,
        };
        assetProviderService = new AssetProviderService(localContexts);

        const tokenIssuanceAuthorizationRequest =
          await assetProviderService.createTokenIssuanceAuthorizationRequest(
            networkId,
            schemaProfileDidDocument,
          );
        const unavailableAssetSchemaAuthorityApi = new AssetSchemaAuthorityApi(
          new Configuration({ basePath: "http://badlocalhost:666" }),
        );

        //When
        const tokenIssuanceAuthorizationRequestEndpoint =
          await unavailableAssetSchemaAuthorityApi.requestTokenIssuanceAuthorization(
            tokenIssuanceAuthorizationRequest,
          );

        const tokenIssuanceAuthorization =
          tokenIssuanceAuthorizationRequestEndpoint.data;

        localContexts = {
          "https://www.w3.org/ns/did/v1": didV1Context,
          "https://www.w3.org/2018/credentials/v1":
            verifiableCredentialsContextTest,
          "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
          "https://www.example.org/schema-profile/vc/v1":
            schemaProfileVerifiableCredentialContext,
          "did:example:123456789abcdefghi#": assetSchemaContext,
          "did:example:56745689abcdefghi#": schemaProfileContext,
        };

        assetProviderService = new AssetProviderService(localContexts);

        const {
          tokenizedAssetRecord,
          tokenizedAssetRecordVerifiableCredential,
          tokenizedAssetRecordDidDocument,
        } = await assetProviderService.createTokenizedAssetRecord(
          tokenIssuanceAuthorization,
        );

        // Unavailable Registry API
        const unavailableRegistryApi = new RegistryApi(
          new Configuration({ basePath: "http://badlocalhost:777" }),
        );

        // When
        await unavailableRegistryApi.commissionTokenizedAssetRecord({
          did: tokenizedAssetRecordDidDocument.id,
          tokenizedAssetRecord: tokenizedAssetRecord,
          tokenizedAssetRecordDidDocument: tokenizedAssetRecordDidDocument,
          tokenizedAssetRecordVerifiableCredential:
            tokenizedAssetRecordVerifiableCredential,
        });

        fail("Expected network error due to unavailable registry service");
      } catch (error: any) {
        // Then
        expect(error).toBeDefined();
        expect(["EAI_AGAIN"]).toContain(error.code);
        expect(error.message).toMatch(
          /connect|refused|timeout|not found|getaddrinfo/i,
        );
        expect(error.response).toBeUndefined();
      }
    },
    TIMEOUT,
  );
});

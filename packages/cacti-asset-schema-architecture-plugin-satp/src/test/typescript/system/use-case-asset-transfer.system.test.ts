import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import fs from "fs";
import path from "path";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../main/typescript/plugin-asset-schema-architecture";
import { AssetSchemaAuthorityApi } from "../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { RegistryApi } from "../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { AssetProviderService } from "../../../main/typescript/entities/asset-provider/modules/services/asset-provider-service/implementations/asset-provider.service";
import { v4 as uuidv4 } from "uuid";
import {
  ASSET_SCHEMA_AUTHORITY_API_SERVER,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
} from "../constants/constants";
import { REGISTRY_API_SERVER } from "../constants/constants";
import { db } from "../../../main/typescript/entities/registry/modules/database/knex/db-connection";

describe("Scenario #4 - SATP Asset Transfer", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  let assetProviderService: AssetProviderService;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });
  const TIMEOUT: number = 50000000;
  const config = new Configuration({
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
    await db.schema.dropTableIfExists("schema_profiles");
    await db.schema.createTable("schema_profiles", (table) => {
      table.string("did").primary();
      table.text("schema_profile");
      table.text("schema_profile_did_document");
      table.text("schema_profile_vc");
    });
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

    assetSchemaAuthorityApi = new AssetSchemaAuthorityApi(config);
    registryApi = new RegistryApi(configRegistry);
    //assetProviderService = new AssetProviderService();
  }, TIMEOUT);

  afterEach(async () => {
    await db("schema_profiles").del();
    await db("tokenized_asset_records").del();
    await db("token_issuance_authorizations").del();
    pluginRegistry.deleteByPackageName(pluginAssetSchemaArchitecture.className);

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    await db.destroy();
  });

  it(
    "Scenario #4 - Test Case 1 - PASS: Used to commission a schema profile and a tokenized asset record and keeping the web server up.",
    async () => {
      //Given
      const schemaProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
      let schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;

      //When
      console.log(
        "Schema Profile being sent:",
        JSON.stringify(schemaProfile, null, 2),
      );
      const schemaProfileCertificationEndpoint =
        await assetSchemaAuthorityApi.schemaProfileCertification({
          schemaProfile: schemaProfile,
          schemaProfileDidDocument: schemaProfileDidDocument,
        });

      //Given
      const networkId = "Ethereum";
      schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
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
      await new Promise((resolve) => setTimeout(resolve, 15 * 60 * 1000)); // 5 minutes
      //Then
      expect(schemaProfileCertificationEndpoint.status).toEqual(200);
      expect(schemaProfileCertificationEndpoint.data).toBeDefined();

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
});

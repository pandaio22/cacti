import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { v4 as uuidv4 } from "uuid";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "../../../../../main/typescript/plugin-asset-schema-architecture";
import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
} from "../../../constants/constants";
import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";

import { AssetSchemaAuthorityService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/asset-schema-authority-service/implementations/asset-schema-authority-service";

describe("Asset Schema Authority Service", () => {
  let pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions;
  let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;
  const logLevel: LogLevelDesc = "INFO";
  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });
  const TIMEOUT: number = 50000000;
  let assetSchemaAuthorityService: AssetSchemaAuthorityService;

  /***********************************************CONTEXT SETUP*/
  const didV1Context = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/did-v1.jsonld"),
      "utf-8",
    ),
  );
  const didV1ContextAssetSchema = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/asset-schema-did-document-added.jsonld",
      ),
      "utf-8",
    ),
  );

  const assetSchemaContext = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/asset-schema.jsonld"),
      "utf-8",
    ),
  );

  const assetSchemaVerifiableCredentialContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/asset-schema-verifiable-credential.jsonld",
      ),
      "utf-8",
    ),
  );

  const schemaProfileVerifiableCredentialContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/schema-profile-verifiable-credential.jsonld",
      ),
      "utf-8",
    ),
  );

  const verifiableCredentialsContextTest = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/test-vc-1.jsonld"),
      "utf-8",
    ),
  );

  const ed255192020 = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/ed25519-2020.jsonld"),
      "utf-8",
    ),
  );

  /***************************************************************/
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

    assetSchemaAuthorityService = new AssetSchemaAuthorityService();
  }, TIMEOUT);

  afterEach(async () => {
    await db("asset_schemas").del();
    await db("schema_profiles").del();
    await db("token_issuance_authorizations").del();

    await pluginAssetSchemaArchitecture.shutdown();
  }, TIMEOUT);

  afterAll(async () => {
    await db.destroy();
  });

  // ------------------------
  // certifyAssetSchema
  // ------------------------
  it("should certify an Asset Schema: Given a valid Asset Schema and DID Document, When executing certifyAssetSchema, Then return a valid CommissionedAssetSchema", async () => {
    // Given
    const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;

    const localContextsMap: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.example.org/ns/did/v1/asset-schema": didV1ContextAssetSchema,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      //"https://www.w3.org/ns/credentials/v2": verifiableCredentialsContext,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      //"did:example:123456789abcdefghi#": assetSchemaContext,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };
    assetSchemaAuthorityService = new AssetSchemaAuthorityService(
      localContextsMap,
    );

    // When
    const commissionedAssetSchema =
      await assetSchemaAuthorityService.certifyAssetSchema(
        assetSchema,
        assetSchemaDidDocument,
      );

    // Then
    expect(commissionedAssetSchema).toBeDefined();

    expect(commissionedAssetSchema).toHaveProperty("@context");
    expect(commissionedAssetSchema).toHaveProperty("id");
    expect(commissionedAssetSchema).toHaveProperty("type");
    expect(commissionedAssetSchema.type).toContain("VerifiableCredential");
    expect(commissionedAssetSchema.type).toContain(
      "AssetSchemaVerifiableCredential",
    );
    expect(commissionedAssetSchema).toHaveProperty("issuer");
    expect(commissionedAssetSchema).toHaveProperty("issuanceDate");

    expect(commissionedAssetSchema).toHaveProperty("credentialSubject");

    expect(commissionedAssetSchema).toHaveProperty("proof");
    expect(commissionedAssetSchema.proof).toHaveProperty("type");
    expect(commissionedAssetSchema.proof).toHaveProperty("verificationMethod");
    expect(commissionedAssetSchema.proof).toHaveProperty("created");
    expect(commissionedAssetSchema.proof).toHaveProperty("proofPurpose");
    expect(commissionedAssetSchema.proof).toHaveProperty("proofValue");
  });

  it("should fail to certify an Asset Schema: Given invalid inputs, When executing certifyAssetSchema, Then should throw ValidationErrorDetail", async () => {
    // Given
    const invalidAssetSchema = { ...VALID_ASSET_SCHEMA_EXAMPLE, name: null };
    const invalidDidDocument = {
      ...VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      id: null,
    };

    // When & Then
    await expect(
      assetSchemaAuthorityService.certifyAssetSchema(
        invalidAssetSchema as any,
        invalidDidDocument as any,
      ),
    ).rejects.toMatchObject({
      type: "CERTIFY_ASSET_SCHEMA_ERROR",
    });
  });

  // ------------------------
  // certifySchemaProfile
  // ------------------------
  it("should certify an Schema Profile: Given a valid Schema Profile and DID Document, When executing certifySchemaProfile, Then return a valid CommissionedSchemaProfile", async () => {
    // Given
    const schemaProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;

    const localContextsMap: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityService = new AssetSchemaAuthorityService(
      localContextsMap,
    );

    // When
    const commissionedSchemaProfile =
      await assetSchemaAuthorityService.certifySchemaProfile(
        schemaProfile,
        schemaProfileDidDocument,
      );

    // Then
    expect(commissionedSchemaProfile).toBeDefined();

    expect(commissionedSchemaProfile).toHaveProperty("@context");
    expect(commissionedSchemaProfile).toHaveProperty("id");
    expect(commissionedSchemaProfile).toHaveProperty("type");
    expect(commissionedSchemaProfile.type).toContain("VerifiableCredential");
    expect(commissionedSchemaProfile.type).toContain(
      "SchemaProfileVerifiableCredential",
    );
    expect(commissionedSchemaProfile).toHaveProperty("issuer");
    expect(commissionedSchemaProfile).toHaveProperty("issuanceDate");

    expect(commissionedSchemaProfile).toHaveProperty("credentialSubject");

    expect(commissionedSchemaProfile).toHaveProperty("proof");
    expect(commissionedSchemaProfile.proof).toHaveProperty("type");
    expect(commissionedSchemaProfile.proof).toHaveProperty(
      "verificationMethod",
    );
    expect(commissionedSchemaProfile.proof).toHaveProperty("created");
    expect(commissionedSchemaProfile.proof).toHaveProperty("proofPurpose");
    expect(commissionedSchemaProfile.proof).toHaveProperty("proofValue");
  });

  it("should fail to certify an Schema Profile: Given invalid inputs, When executing certifySchemaProfile, Then should throw ValidationErrorDetail", async () => {
    // Given
    const invalidSchemaProfile = {
      ...VALID_SCHEMA_PROFILE_EXAMPLE,
      name: null,
    };
    const invalidDidDocument = {
      ...VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
      id: null,
    };

    // When & Then
    await expect(
      assetSchemaAuthorityService.certifySchemaProfile(
        invalidSchemaProfile as any,
        invalidDidDocument as any,
      ),
    ).rejects.toMatchObject({
      type: "CERTIFY_SCHEMA_PROFILE_ERROR",
    });
  });

  // ---------------------------------
  // requestTokenIssuanceAuthorization
  // ---------------------------------
  it("should create a Token Issuance Authorization: Given a valid TokenIssuanceAuthorizationRequest, When executing requestTokenIssuanceAuthorization, Then return a valid TokenIssuanceAuthorization", async () => {
    // Given
    const tokenIssuanceAuthorizationRequest =
      VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityService = new AssetSchemaAuthorityService(
      localContexts,
    );

    // When
    const tokenIssuanceAuthorization =
      await assetSchemaAuthorityService.requestTokenIssuanceAuthorization(
        tokenIssuanceAuthorizationRequest,
      );

    // Then
    expect(tokenIssuanceAuthorization).toBeDefined();
    expect(tokenIssuanceAuthorization).toHaveProperty("@context");
    expect(tokenIssuanceAuthorization).toHaveProperty("id");
    expect(tokenIssuanceAuthorization).toHaveProperty("type");
    expect(tokenIssuanceAuthorization.type).toContain("VerifiableCredential");
    expect(tokenIssuanceAuthorization.type).toContain(
      "TokenIssuanceAuthorization",
    );
    expect(tokenIssuanceAuthorization.credentialSubject).toHaveProperty(
      "tokenIssuanceAuthorizationRequest",
    );
    expect(tokenIssuanceAuthorization).toHaveProperty("proof");
    expect(tokenIssuanceAuthorization.proof).toHaveProperty("type");
  });
  it("should fail to create a Token Issuance Authorization: Given invalid inputs, When executing requestTokenIssuanceAuthorization, Then should throw ValidationErrorDetail", async () => {
    // Given
    const invalidTokenIssuanceAuthorizationRequest = {
      ...VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
      id: null,
    };

    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };

    assetSchemaAuthorityService = new AssetSchemaAuthorityService(
      localContexts,
    );

    // When & Then
    await expect(
      assetSchemaAuthorityService.requestTokenIssuanceAuthorization(
        invalidTokenIssuanceAuthorizationRequest as any,
      ),
    ).rejects.toMatchObject({
      type: "REQUEST_TOKEN_ISSUANCE_AUTHORIZATION_ERROR",
    });
  });
});

//import { describe, it, expect, beforeEach } from "vitest";

import {
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

import { RegistryService } from "../../../../../main/typescript/entities/registry/modules/services/registry-service/implementations/registry-service";
import { RegisteredAssetSchemaDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-schema";
import { RegisteredSchemaProfileDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-schema-profile";
import { RegisteredTokenizedAssetRecordDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-tokenized-asset-record";
import { AssetSchemaAuthorityCertificateDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-schema-authority";
import { AssetProviderCertificateDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-provider";
import { TokenIssuanceAuthorizationDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-token-issuance-authorization";
import { DidResolverService } from "../../../../../main/typescript/entities/registry/modules/services/did-resolver-service/implementations/did-resolver-service";

describe("Registry Service", () => {
  let registryService: RegistryService;
  let assetSchemaDao: RegisteredAssetSchemaDao;
  let schemaProfileDao: RegisteredSchemaProfileDao;
  let tokenizedAssetRecordDao: RegisteredTokenizedAssetRecordDao;
  let assetSchemaAuthorityDao: AssetSchemaAuthorityCertificateDao;
  let assetProviderDao: AssetProviderCertificateDao;
  let tokenIssuanceAuthorizationDao: TokenIssuanceAuthorizationDao;
  let didResolver: DidResolverService;

  beforeAll(async () => {
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

  afterAll(async () => {
    await db.destroy();
  });

  afterEach(async () => {
    await db("asset_schemas").del();
    await db("asset_providers").del(); // clear table
    await db("schema_profiles").del();
    await db("tokenized_asset_records").del();
    await db("token_issuance_authorizations").del();
    await db("asset_schema_authorities").del();
  });

  beforeEach(() => {
    assetSchemaDao = new RegisteredAssetSchemaDao();
    schemaProfileDao = new RegisteredSchemaProfileDao();
    tokenizedAssetRecordDao = new RegisteredTokenizedAssetRecordDao();
    assetSchemaAuthorityDao = new AssetSchemaAuthorityCertificateDao();
    assetProviderDao = new AssetProviderCertificateDao();
    tokenIssuanceAuthorizationDao = new TokenIssuanceAuthorizationDao();

    didResolver = new DidResolverService(
      new RegisteredAssetSchemaDao(),
      new RegisteredSchemaProfileDao(),
      new RegisteredTokenizedAssetRecordDao(),
    );

    registryService = new RegistryService(
      assetSchemaDao,
      schemaProfileDao,
      tokenizedAssetRecordDao,
      assetSchemaAuthorityDao,
      assetProviderDao,
      tokenIssuanceAuthorizationDao,
      didResolver,
    );
  });

  it("should register an Asset Schema successfully: Given valid Asset Schema, AssetSchemaDidDocument and AssetSchemaVerifiableCredential, When executing commissionAssetSchema, Then store successfully", async () => {
    // Given
    /**
     * VALID_ASSET_SCHEMA_EXAMPLE,
     * VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
     * VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
     */

    // When
    const result = await registryService.commissionAssetSchema(
      VALID_ASSET_SCHEMA_EXAMPLE,
      VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
    );

    // Then
    expect(result).toBeDefined();
  });

  it("should fetch an Asset Schema by DID: Given a valid DID, When executing getAssetSchema, Then return Asset Schema", async () => {
    // Given
    await registryService.commissionAssetSchema(
      VALID_ASSET_SCHEMA_EXAMPLE,
      VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
    );

    const did = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id;

    // When
    const result = await registryService.getAssetSchema(did);

    console.log(result);

    expect(result).toBeDefined();
    //expect(result?.did).toBe(did);
    expect(result?.assetSchema).toEqual(VALID_ASSET_SCHEMA_EXAMPLE);
  });

  it("should register a Schema Profile successfully: Given valid SchemaProfile, SchemaProfileDidDocument and SchemaProfileVerifiableCredential, When executing commissionSchemaProfile, Then store successfully", async () => {
    // Given
    /**
     * VALID_SCHEMA_PROFILE_EXAMPLE,
     * VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
     * VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
     */

    // When
    const result = await registryService.commissionSchemaProfile(
      VALID_SCHEMA_PROFILE_EXAMPLE,
      VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
      VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
    );

    // Then
    expect(result).toBeDefined();
  });

  it("should fetch a Schema Profile by DID: Given a valid DID, When executing getSchemaProfile, Then return Schema Profile", async () => {
    // Given
    await registryService.commissionSchemaProfile(
      VALID_SCHEMA_PROFILE_EXAMPLE,
      VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
      VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
    );
    const did = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE.id;

    // When
    const result = await registryService.getSchemaProfile(did);

    console.log(result);

    // Then
    expect(result).toBeDefined();
    expect(result?.schemaProfileDidDocument.id).toBe(did);
    expect(result?.schemaProfile).toEqual(VALID_SCHEMA_PROFILE_EXAMPLE);
  });

  it("should register a Tokenized Asset Record successfully: Given valid TokenizedAssetRecord, TokenizedAssetRecordDidDocument and TokenizedAssetRecordVerifiableCredential, When executing commissionTokenizedAssetRecord, Then store successfully", async () => {
    // Given
    /**
     * VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
     * VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT_EXAMPLE,
     * VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
     */

    // When
    const result = await registryService.commissionTokenizedAssetRecord(
      VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
      VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
      VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
    );

    // Then
    expect(result).toBeDefined();
  });

  it("should fetch a Tokenized Asset Record by DID: Given a valid DID, When executing getTokenizedAssetRecord, Then return Tokenized Asset Record", async () => {
    // Given
    await registryService.commissionTokenizedAssetRecord(
      VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
      VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
      VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
    );
    const did = VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT.id;

    // When
    const result = await registryService.getTokenizedAssetRecord(did);

    console.log(result);

    // Then
    expect(result).toBeDefined();
    expect(result?.tokenizedAssetRecordDidDocument.id).toBe(did);
    expect(result?.tokenizedAssetRecord).toEqual(
      VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
    );
  });

  it("should register and fetch an Asset Schema Authority: Given a valid certificate, When calling getAssetSchemaAuthority, Then return the correct certificate", async () => {
    // Given
    await assetSchemaAuthorityDao.create({
      id: VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE.id,
      assetSchemaAuthorityCertificate:
        VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
    });
    const did = VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE.id;

    // When
    const result = await registryService.getAssetSchemaAuthority(did);

    // Then
    expect(result).toBeDefined();
    expect(result).toEqual(VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE);
  });

  it("should throw if Asset Schema Authority not found: Given a DID that does not exist, When calling getAssetSchemaAuthority, Then throw an error", async () => {
    const nonExistentDid = "did:web:notfound";

    await expect(
      registryService.getAssetSchemaAuthority(nonExistentDid),
    ).rejects.toThrow(
      `Asset Schema Authority with DID ${nonExistentDid} not found`,
    );
  });

  it("should register and fetch an Asset Provider: Given a valid certificate, When calling getAssetProvider, Then return the correct certificate", async () => {
    // Given
    await assetProviderDao.create({
      id: VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE.id,
      assetProviderCertificate: VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
    });
    const did = VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE.id;

    // When
    const result = await registryService.getAssetProvider(did);

    // Then
    expect(result).toBeDefined();
    expect(result).toEqual(VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE);
  });

  it("should throw if Asset Provider not found: Given a DID that does not exist, When calling getAssetProvider, Then throw an error", async () => {
    const nonExistentDid = "did:web:notfound";

    await expect(
      registryService.getAssetProvider(nonExistentDid),
    ).rejects.toThrow(`Asset Provider with DID ${nonExistentDid} not found`);
  });

  it("should register a Token Issuance Authorization: Given a valid authorization, When calling registerTokenIssuanceAuthorization, Then return its ID", async () => {
    // Given
    const authorization = VALID_TOKEN_ISSUANCE_AUTHORIZATION;

    // When
    const result =
      await registryService.registerTokenIssuanceAuthorization(authorization);

    // Then
    expect(result).toBeDefined();
    expect(result).toEqual({
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: authorization.id,
      type: "CommissionedTokenIssuanceAuthorizationID",
    });
  });

  it("should throw if Token Issuance Authorization has no ID: Given an invalid authorization, When calling registerTokenIssuanceAuthorization, Then throw an error", async () => {
    // Given
    const invalidAuth = {
      ...VALID_TOKEN_ISSUANCE_AUTHORIZATION,
      id: undefined,
    };

    // When/Then
    await expect(
      registryService.registerTokenIssuanceAuthorization(invalidAuth as any),
    ).rejects.toThrow(
      "Invalid Input: Token Issuance Authorization Request is invalid.",
    );
  });

  it("should register an Asset Schema Authority: Given a valid certificate, When calling registerAssetSchemaAuthority, Then return its ID", async () => {
    // Given
    const certificate = VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE;

    // When
    const result =
      await registryService.registerAssetSchemaAuthority(certificate);

    // Then
    expect(result).toBeDefined();
    expect(result).toEqual({
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: certificate.id,
      type: "RegisteredAssetSchemaAuthorityID",
    });
  });

  it("should throw if Asset Schema Authority has no ID: Given an invalid certificate, When calling registerAssetSchemaAuthority, Then throw an error", async () => {
    // Given
    const invalidCertificate = {
      ...VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
      id: undefined,
    };

    // When/Then
    await expect(
      registryService.registerAssetSchemaAuthority(invalidCertificate as any),
    ).rejects.toThrow(
      "Invalid Input: Asset Schema Authority Certificate is invalid.",
    );
  });

  it("should register an Asset Provider: Given a valid certificate, When calling registerAssetProvider, Then return its ID", async () => {
    // Given
    const certificate = VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE;

    // When
    const result = await registryService.registerAssetProvider(certificate);

    // Then
    expect(result).toBeDefined();
    expect(result).toEqual({
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: certificate.id,
      type: "RegisteredAssetProviderID",
    });
  });

  it("should throw if Asset Provider has no ID: Given an invalid certificate, When calling registerAssetProvider, Then throw an error", async () => {
    // Given
    const invalidCertificate = {
      ...VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
      id: undefined,
    };

    // When/Then
    await expect(
      registryService.registerAssetProvider(invalidCertificate as any),
    ).rejects.toThrow("Invalid Input: Asset Provider Certificate is invalid.");
  });

  it("should return null if Asset Schema not found: Given a DID that does not exist, When calling getAssetSchema, Then an error should be thrown", async () => {
    await expect(
      registryService.getAssetSchema("did:web:notfound"),
    ).rejects.toThrow();
  });

  it("should throw if required inputs are missing: Given missing inputs, When calling commissionAssetSchema, Then an error should be thrown", async () => {
    await expect(
      registryService.commissionAssetSchema(
        null as any,
        VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
        VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
      ),
    ).rejects.toThrow();

    await expect(
      registryService.commissionAssetSchema(
        VALID_ASSET_SCHEMA_EXAMPLE,
        null as any,
        VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
      ),
    ).rejects.toThrow();
  });

  it("should throw if DID already exists: Given an existing Asset Schema DID, When calling commissionAssetSchema with the same DID, Then an error should be thrown", async () => {
    // Given
    await registryService.commissionAssetSchema(
      VALID_ASSET_SCHEMA_EXAMPLE,
      VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
    );

    // When / Then
    await expect(
      registryService.commissionAssetSchema(
        VALID_ASSET_SCHEMA_EXAMPLE,
        VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
        VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
      ),
    ).rejects.toThrow(
      new RegExp(
        `Asset Schema with DID ${VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id} already exists`,
      ),
    );
  });
});

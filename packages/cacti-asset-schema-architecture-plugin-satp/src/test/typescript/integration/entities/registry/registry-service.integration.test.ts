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
} from "../../../constants/constants";

import { RegistryService } from "../../../../../main/typescript/entities/registry/modules/services/registry-service/implementations/registry-service";
import { RegisteredAssetSchemaDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-schema";
import { RegisteredSchemaProfileDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-schema-profile";
import { RegisteredTokenizedAssetRecordDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-tokenized-asset-record";
import { DidResolverService } from "../../../../../main/typescript/entities/registry/modules/services/did-resolver-service/implementations/did-resolver-service";

describe("Registry Service", () => {
  let registryService: RegistryService;
  let assetSchemaDao: RegisteredAssetSchemaDao;
  let schemaProfileDao: RegisteredSchemaProfileDao;
  let tokenizedAssetRecordDao: RegisteredTokenizedAssetRecordDao;
  let didResolver: DidResolverService;

  // Mock DAO and DID Resolver
  beforeEach(() => {
    assetSchemaDao = new RegisteredAssetSchemaDao();
    schemaProfileDao = new RegisteredSchemaProfileDao();
    tokenizedAssetRecordDao = new RegisteredTokenizedAssetRecordDao();

    didResolver = new DidResolverService(
      new RegisteredAssetSchemaDao(),
      new RegisteredSchemaProfileDao(),
      new RegisteredTokenizedAssetRecordDao(),
    );

    registryService = new RegistryService(
      assetSchemaDao,
      schemaProfileDao,
      tokenizedAssetRecordDao,
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
    const did = "did:web:example.com:asset-schema";

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
    const did = "did:web:example.com:schema-profile";

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
    const did = "did:web:example.com:tokenized-asset-record";

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

  it("should return null if Asset Schema not found", async () => {
    (assetSchemaDao.getByDid as unknown as any).mockResolvedValue(null);

    const result = await registryService.getAssetSchema("did:web:notfound");
    expect(result).toBeNull();
  });

  it("should throw if required inputs are missing", async () => {
    await expect(
      registryService.commissionAssetSchema(
        null as any,
        VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
        VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
      ),
    ).rejects.toThrowError(/Missing required inputs/);

    await expect(
      registryService.commissionAssetSchema(
        VALID_ASSET_SCHEMA_EXAMPLE,
        null as any,
        VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
      ),
    ).rejects.toThrowError(/Missing required inputs/);
  });

  it("should throw if DID already exists", async () => {
    (didResolver.resolve as unknown as any).mockResolvedValue({
      did: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id,
    });

    await expect(
      registryService.commissionAssetSchema(
        VALID_ASSET_SCHEMA_EXAMPLE,
        VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
        VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
      ),
    ).rejects.toThrowError(
      new RegExp(
        `Asset Schema with DID ${VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE.id} already exists`,
      ),
    );
  });
});

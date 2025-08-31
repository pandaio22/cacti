import { describe, it, expect, beforeEach } from "vitest";

import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
} from "../../../constants/constants";

import { RegistryService } from "../../../../../main/typescript/entities/registry/modules/services/registry-service/implementations/registry-service";
import { RegisteredAssetSchemaDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-schema";
import { DidResolverService } from "../../../../../main/typescript/entities/registry/modules/services/did-resolver-service/implementations/did-resolver-service";

describe("Registry Service", () => {
  let registryService: RegistryService;
  let assetSchemaDao: RegisteredAssetSchemaDao;
  let didResolver: DidResolverService;

  // Mock DAO and DID Resolver
  beforeEach(() => {
    assetSchemaDao = new RegisteredAssetSchemaDao();

    didResolver = new DidResolverService(
      new RegisteredAssetSchemaDao(),
      {} as any,
      {} as any,
    );

    registryService = new RegistryService(assetSchemaDao);
  });

  it("should register an Asset Schema successfully", async () => {
    // Given

    // When
    const result = await registryService.commissionAssetSchema(
      VALID_ASSET_SCHEMA_EXAMPLE,
      VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
    );

    // Then
    expect(result).toBeDefined();
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

  it("should fetch an Asset Schema by DID", async () => {
    // Given
    const did = "did:web:example.com:asset-schema";

    // When
    const result = await registryService.getAssetSchema(did);

    console.log(result);

    expect(result).toBeDefined();
    expect(result?.did).toBe(did);
    expect(result?.assetSchema).toEqual(VALID_ASSET_SCHEMA_EXAMPLE);
  });

  it("should return null if Asset Schema not found", async () => {
    (assetSchemaDao.getByDid as unknown as any).mockResolvedValue(null);

    const result = await registryService.getAssetSchema("did:web:notfound");
    expect(result).toBeNull();
  });
});

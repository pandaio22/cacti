import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { DidResolverService } from "../../../../../main/typescript/entities/registry/modules/services/did-resolver-service/implementations/did-resolver-service";
import { RegisteredAssetSchemaDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-schema";
import { RegisteredSchemaProfileDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-schema-profile";
import { RegisteredTokenizedAssetRecordDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-tokenized-asset-record";
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
describe("DidResolverService", () => {
  let assetSchemaDao: jest.Mocked<RegisteredAssetSchemaDao>;
  let schemaProfileDao: jest.Mocked<RegisteredSchemaProfileDao>;
  let tokenizedAssetRecordDao: jest.Mocked<RegisteredTokenizedAssetRecordDao>;
  let service: DidResolverService;

  const sampleDid = "did:web:test.com:123";

  beforeEach(() => {
    /*assetSchemaDao = {
      getByDid: jest.fn(),
    } as any;

    schemaProfileDao = {
      getByDid: jest.fn(),
    } as any;

    tokenizedAssetRecordDao = {
      getByDid: jest.fn(),
    } as any;*/

    assetSchemaDao = { getByDid: vi.fn() } as any;
    schemaProfileDao = { getByDid: vi.fn() } as any;
    tokenizedAssetRecordDao = { getByDid: vi.fn() } as any;

    service = new DidResolverService(
      assetSchemaDao,
      schemaProfileDao,
      tokenizedAssetRecordDao,
    );
  });

  afterEach(() => {
    //jest.clearAllMocks();
    vi.clearAllMocks();
  });

  it("should resolve a DID Document from assetSchemaDao", async () => {
    assetSchemaDao.getByDid.mockResolvedValue({
      did: "did:web:test.com:123",
      assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
      assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      assetSchemaVerifiableCredential: VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
    });

    const result = await service.resolve(sampleDid, { type: "didDocument" });

    expect(result).toEqual(VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE);
    expect(assetSchemaDao.getByDid).toHaveBeenCalledWith(sampleDid);
  });

  it("should resolve a Schema Document from schemaProfileDao", async () => {
    schemaProfileDao.getByDid.mockResolvedValue({
      did: "did:web:test.com:123",
      schemaProfile: VALID_SCHEMA_PROFILE_EXAMPLE,
      schemaProfileDidDocument: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
      schemaProfileVerifiableCredential:
        VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
    });

    const result = await service.resolve(sampleDid, { type: "schemaDocument" });

    expect(result).toEqual(VALID_SCHEMA_PROFILE_EXAMPLE);
    expect(schemaProfileDao.getByDid).toHaveBeenCalledWith(sampleDid);
  });

  it("should resolve a Verifiable Credential from tokenizedAssetRecordDao", async () => {
    tokenizedAssetRecordDao.getByDid.mockResolvedValue({
      did: "did:web:test.com:123",
      tokenizedAssetRecord: VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
      tokenizedAssetRecordDidDocument:
        VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
      tokenizedAssetRecordVerifiableCredential:
        VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
    });

    const result = await service.resolve(sampleDid, {
      type: "verifiableCredential",
    });

    expect(result).toEqual(VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL);
    expect(tokenizedAssetRecordDao.getByDid).toHaveBeenCalledWith(sampleDid);
  });

  it("should resolve all fields from assetSchemaDao when type=all", async () => {
    assetSchemaDao.getByDid.mockResolvedValue({
      did: "did:web:test.com:123",
      assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
      assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      assetSchemaVerifiableCredential: VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
    });

    const result = await service.resolve(sampleDid, { type: "all" });

    expect(result).toEqual({
      did: "did:web:test.com:123",
      assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
      assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      assetSchemaVerifiableCredential: VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
    });
  });

  it("should return null if no local or external resolution is found", async () => {
    const result = await service.resolve("did:web:test.com:not-found", {
      type: "didDocument",
    });

    expect(result).toBeNull();
  });

  it("should fallback to external resolution if not found locally", async () => {
    const spy = vi.spyOn<any, any>(service as any, "resolveExternally");
    spy.mockResolvedValue({ external: true });

    const result = await service.resolve(sampleDid, { type: "all" });

    expect(spy).toHaveBeenCalledWith(sampleDid, "all");
    expect(result).toEqual({ external: true });
  });
});

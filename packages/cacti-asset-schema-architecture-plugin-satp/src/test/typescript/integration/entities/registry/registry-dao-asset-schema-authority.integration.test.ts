import { AssetSchemaAuthorityCertificateDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-schema-authority";
import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";
import { RegisteredAssetSchemaAuthorityCertificate } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE } from "../../../constants/constants";
describe("AssetSchemaAuthorityCertificateDao", () => {
  const dao = new AssetSchemaAuthorityCertificateDao();

  const sampleAuthority: RegisteredAssetSchemaAuthorityCertificate = {
    id: "did:web:test.com:authority-1",
    assetSchemaAuthorityCertificate:
      VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  };

  beforeAll(async () => {
    // Create table for testing
    await db.schema.dropTableIfExists("asset_schema_authorities");
    await db.schema.createTable("asset_schema_authorities", (table) => {
      table.string("did").primary();
      table.text("asset_schema_authority");
    });
  });

  afterAll(async () => {
    await db.destroy();
  });

  afterEach(async () => {
    await db("asset_schema_authorities").del(); // clear table
  });

  it("should create a new asset schema authority: Given a valid certificate, When creating it, Then it should be persisted in the database", async () => {
    // Given
    const authority = sampleAuthority;

    // When
    await expect(dao.create(authority)).resolves.toBeUndefined();

    // Then
    const row = await db("asset_schema_authorities")
      .where({ did: authority.id })
      .first();
    expect(row).toBeDefined();
    expect(JSON.parse(row.asset_schema_authority)).toEqual(authority);
  });

  it("should throw error on duplicate DID: Given a certificate already exists, When creating it again with the same DID, Then an error should be thrown", async () => {
    // Given
    await dao.create(sampleAuthority);

    // When / Then
    await expect(dao.create(sampleAuthority)).rejects.toThrow(
      `Asset Schema Authority with DID ${sampleAuthority.id} already exists`,
    );
  });

  it("should retrieve an authority by DID: Given an existing certificate, When retrieving it by DID, Then the correct certificate should be returned", async () => {
    // Given
    await dao.create(sampleAuthority);

    // When
    const result = await dao.getByDid(sampleAuthority.id);

    // Then
    expect(result).toBeDefined();
    expect(result?.id).toBe(sampleAuthority.id);
    expect(result?.assetSchemaAuthorityCertificate).toEqual(
      sampleAuthority.assetSchemaAuthorityCertificate,
    );
  });

  it("should return null if DID not found: Given no certificate exists for a DID, When retrieving it, Then the result should be null", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When
    const result = await dao.getByDid(nonExistentDid);

    // Then
    expect(result).toBeNull();
  });

  it("should update an existing authority: Given an existing certificate, When updating it, Then the changes should persist", async () => {
    // Given
    await dao.create(sampleAuthority);

    const updated = {
      ...sampleAuthority,
      assetSchemaAuthorityCertificate: {
        ...sampleAuthority.assetSchemaAuthorityCertificate,
        signature: "updated-signature",
      },
    };
    console.log("Updated object:", updated);

    // When
    await dao.update(updated);

    // Then
    const row = await dao.getByDid(updated.id);
    expect(row?.assetSchemaAuthorityCertificate.signature).toBe(
      "updated-signature",
    );
  });

  it("should throw error on updating non-existent authority: Given no certificate exists, When attempting to update, Then an error should be thrown", async () => {
    // Given
    const nonExistent = {
      ...sampleAuthority,
      id: "did:web:test.com:does-not-exist",
    };

    // When / Then
    await expect(dao.update(nonExistent)).rejects.toThrow(
      `DAO error: failed to update asset schema authority for DID=${nonExistent.id}`,
    );
  });

  it("should delete an authority: Given an existing certificate, When deleting it, Then it should no longer be retrievable", async () => {
    // Given
    await dao.create(sampleAuthority);

    // When
    await dao.delete(sampleAuthority.id);

    // Then
    const row = await dao.getByDid(sampleAuthority.id);
    expect(row).toBeNull();
  });

  it("should throw error on deleting non-existent authority: Given no certificate exists, When attempting to delete, Then an error should be thrown", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When / Then
    await expect(dao.delete(nonExistentDid)).rejects.toThrow(
      `DAO error: failed to delete asset schema authority for DID=${nonExistentDid}`,
    );
  });
});

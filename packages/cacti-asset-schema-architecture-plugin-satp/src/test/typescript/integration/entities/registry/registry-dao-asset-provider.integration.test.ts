import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";
import { AssetProviderCertificateDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-provider";
import { RegisteredAssetProviderCertificate } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE } from "../../../constants/constants";

describe("AssetProviderDao", () => {
  const dao = new AssetProviderCertificateDao();

  const sampleProvider: RegisteredAssetProviderCertificate = {
    id: "did:web:test.com:provider-1",
    assetProviderCertificate: VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
  };

  beforeAll(async () => {
    // Create table for testing
    await db.schema.dropTableIfExists("asset_providers");
    await db.schema.createTable("asset_providers", (table) => {
      table.string("did").primary();
      table.text("asset_provider");
    });
  });

  afterAll(async () => {
    await db.destroy();
  });

  afterEach(async () => {
    await db("asset_providers").del(); // clear table
  });

  it("should create a new asset provider: Given a valid certificate, When creating it, Then it should be persisted in the database", async () => {
    // Given
    const provider = sampleProvider;

    // When
    await expect(dao.create(provider)).resolves.toBeUndefined();

    // Then
    const row = await db("asset_providers").where({ did: provider.id }).first();
    expect(row).toBeDefined();
    expect(JSON.parse(row.asset_provider)).toEqual(
      provider.assetProviderCertificate,
    );
  });

  it("should throw error on duplicate DID: Given a certificate already exists, When creating it again with the same DID, Then an error should be thrown", async () => {
    // Given
    await dao.create(sampleProvider);

    // When / Then
    await expect(dao.create(sampleProvider)).rejects.toThrow(
      `Asset Provider with DID ${sampleProvider.id} already exists`,
    );
  });

  it("should retrieve a provider by DID: Given an existing certificate, When retrieving it by DID, Then the correct certificate should be returned", async () => {
    // Given
    await dao.create(sampleProvider);

    // When
    const result = await dao.getByDid(sampleProvider.id);

    // Then
    expect(result).toBeDefined();
    expect(result?.id).toBe(sampleProvider.id);
    expect(result?.assetProviderCertificate).toEqual(
      sampleProvider.assetProviderCertificate,
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

  it("should update an existing provider: Given an existing certificate, When updating it, Then the changes should persist", async () => {
    // Given
    await dao.create(sampleProvider);

    const updated = {
      ...sampleProvider,
      assetProviderCertificate: {
        ...sampleProvider.assetProviderCertificate,
        name: "Updated Provider",
      },
    };

    // When
    await dao.update(updated);

    // Then
    const row = await dao.getByDid(updated.id);
    expect(row?.assetProviderCertificate.name).toBe("Updated Provider");
  });

  it("should throw error on updating non-existent provider: Given no certificate exists, When attempting to update, Then an error should be thrown", async () => {
    // Given
    const nonExistent = {
      ...sampleProvider,
      id: "did:web:test.com:does-not-exist",
    };

    // When / Then
    await expect(dao.update(nonExistent)).rejects.toThrow(
      `DAO error: failed to update asset provider for DID=${nonExistent.id}`,
    );
  });

  it("should delete a provider: Given an existing certificate, When deleting it, Then it should no longer be retrievable", async () => {
    // Given
    await dao.create(sampleProvider);

    // When
    await dao.delete(sampleProvider.id);

    // Then
    const row = await dao.getByDid(sampleProvider.id);
    expect(row).toBeNull();
  });

  it("should throw error on deleting non-existent provider: Given no certificate exists, When attempting to delete, Then an error should be thrown", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When / Then
    await expect(dao.delete(nonExistentDid)).rejects.toThrow(
      `DAO error: failed to delete asset provider for DID=${nonExistentDid}`,
    );
  });
});

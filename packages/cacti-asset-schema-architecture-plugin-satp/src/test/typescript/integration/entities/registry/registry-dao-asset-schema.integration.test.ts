import { RegisteredAssetSchemaDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-asset-schema";
import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";
import { RegisteredAssetSchema } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
} from "../../../constants/constants";

describe("RegisteredAssetSchemaDao", () => {
  const dao = new RegisteredAssetSchemaDao();

  const sampleAssetSchema: RegisteredAssetSchema = {
    did: "did:web:test.com:asset-schema",
    assetSchema: VALID_ASSET_SCHEMA_EXAMPLE,
    assetSchemaDidDocument: VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
    assetSchemaVerifiableCredential: VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
  };

  beforeAll(async () => {
    // Create table for testing
    await db.schema.dropTableIfExists("asset_schemas");
    await db.schema.createTable("asset_schemas", (table) => {
      table.string("did").primary();
      table.text("asset_schema");
      table.text("asset_schema_did_document");
      table.text("asset_schema_vc");
    });
  });

  afterAll(async () => {
    await db.destroy();
  });

  afterEach(async () => {
    await db("asset_schemas").del(); // clear table between tests
  });

  it("should create a new asset schema: Given a valid asset schema, When creating it, Then it should be persisted in the database", async () => {
    // Given
    const schema = sampleAssetSchema;

    // When
    await expect(dao.create(schema)).resolves.toBeUndefined();

    // Then
    const row = await db("asset_schemas").where({ did: schema.did }).first();
    expect(row).toBeDefined();
    expect(JSON.parse(row.asset_schema)).toEqual(schema.assetSchema);
  });

  it("should throw error on duplicate DID: Given an asset schema already exists, When creating it again with the same DID, Then an error should be thrown", async () => {
    // Given
    await dao.create(sampleAssetSchema);

    // When / Then
    await expect(dao.create(sampleAssetSchema)).rejects.toThrow(
      `Asset Schema with DID ${sampleAssetSchema.did} already exists`,
    );
  });

  it("should retrieve asset schema by DID: Given an existing asset schema, When retrieving it by DID, Then the correct asset schema should be returned", async () => {
    // Given
    await dao.create(sampleAssetSchema);

    // When
    const result = await dao.getByDid("did:web:test.com:asset-schema");

    // Then
    expect(result).toBeDefined();
    expect(result?.did).toBe(sampleAssetSchema.did);
    expect(result?.assetSchema).toEqual(sampleAssetSchema.assetSchema);
  });

  it("should return null if DID not found: Given no asset schema exists for a DID, When retrieving it by DID, Then the result should be null", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When
    const result = await dao.getByDid(nonExistentDid);

    // Then
    expect(result).toBeNull();
  });

  it("should update an existing asset schema: Given an existing asset schema, When updating it, Then the update should persist the changes", async () => {
    // Given
    await dao.create(sampleAssetSchema);

    const updated = {
      ...sampleAssetSchema,
      assetSchema: { ...VALID_ASSET_SCHEMA_EXAMPLE, fungible: true },
    };

    // When
    await dao.update(updated);

    // Then
    const row = await dao.getByDid(updated.did);
    expect(row?.assetSchema.fungible).toBe(true);
  });

  it("Given a non-existent asset schema, When attempting to update it, Then an error should be thrown", async () => {
    // Given
    const nonExistent = {
      ...sampleAssetSchema,
      did: "did:web:test.com:does-not-exist",
    };

    // When / Then
    await expect(dao.update(nonExistent)).rejects.toThrow(
      `DAO error: failed to update asset schema for DID=${nonExistent.did}`,
    );
  });

  it("should delete an asset schema: Given an existing asset schema, When deleting it, Then it should no longer be retrievable", async () => {
    // Given
    await dao.create(sampleAssetSchema);

    // When
    await dao.delete(sampleAssetSchema.did);

    // Then
    const row = await dao.getByDid(sampleAssetSchema.did);
    expect(row).toBeNull();
  });

  it("Given a non-existent asset schema, When attempting to delete it, Then an error should be thrown", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When / Then
    await expect(dao.delete(nonExistentDid)).rejects.toThrow(
      `DAO error: failed to delete asset schema for DID=${nonExistentDid}`,
    );
  });
});

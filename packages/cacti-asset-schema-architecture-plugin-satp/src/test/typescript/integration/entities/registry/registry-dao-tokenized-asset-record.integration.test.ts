import { RegisteredTokenizedAssetRecordDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-tokenized-asset-record";
import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";
import { RegisteredTokenizedAssetRecord } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import {
  VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
  VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
  VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
} from "../../../constants/constants";

describe("RegisteredTokenizedAssetRecordDao", () => {
  const dao = new RegisteredTokenizedAssetRecordDao();

  const sampleRecord: RegisteredTokenizedAssetRecord = {
    did: "did:web:test.com:tokenized-asset-record",
    tokenizedAssetRecord: VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
    tokenizedAssetRecordDidDocument: VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
    tokenizedAssetRecordVerifiableCredential:
      VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
  };

  beforeAll(async () => {
    // Create table for testing
    await db.schema.dropTableIfExists("tokenized_asset_records");
    await db.schema.createTable("tokenized_asset_records", (table) => {
      table.string("did").primary();
      table.text("tokenized_asset_record");
      table.text("tokenized_asset_record_did_document");
      table.text("tokenized_asset_record_vc");
    });
  });

  afterAll(async () => {
    await db.destroy();
  });

  afterEach(async () => {
    await db("tokenized_asset_records").del(); // clear table between tests
  });

  it("should create a new tokenized asset record: Given a valid tokenized asset record, When creating it, Then it should be persisted in the database", async () => {
    // Given
    const record = sampleRecord;

    // When
    await expect(dao.create(record)).resolves.toBeUndefined();

    // Then
    const row = await db("tokenized_asset_records")
      .where({ did: record.did })
      .first();
    expect(row).toBeDefined();
    expect(JSON.parse(row.tokenized_asset_record)).toEqual(
      record.tokenizedAssetRecord,
    );
  });

  it("should throw error on duplicate DID: Given a tokenized asset record already exists, When creating it again with the same DID, Then an error should be thrown", async () => {
    // Given
    await dao.create(sampleRecord);

    // When / Then
    await expect(dao.create(sampleRecord)).rejects.toThrow(
      `TokenizedAssetRecord with DID ${sampleRecord.did} already exists`,
    );
  });

  it("should retrieve tokenized asset record by DID: Given an existing tokenized asset record, When retrieving it by DID, Then the correct record should be returned", async () => {
    // Given
    await dao.create(sampleRecord);

    // When
    const result = await dao.getByDid(sampleRecord.did);

    // Then
    expect(result).toBeDefined();
    expect(result?.did).toBe(sampleRecord.did);
    expect(result?.tokenizedAssetRecord).toEqual(
      sampleRecord.tokenizedAssetRecord,
    );
  });

  it("should return null if DID not found: Given no tokenized asset record exists for a DID, When retrieving it by DID, Then the result should be null", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When
    const result = await dao.getByDid(nonExistentDid);

    // Then
    expect(result).toBeNull();
  });

  it("should update an existing tokenized asset record: Given an existing tokenized asset record, When updating it, Then the update should persist the changes", async () => {
    // Given
    await dao.create(sampleRecord);

    const updated = {
      ...sampleRecord,
      tokenizedAssetRecord: {
        ...VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
        updatedField: "new-value",
      },
    };

    // When
    await dao.update(updated);

    // Then
    const row = await dao.getByDid(updated.did);
    expect(row?.tokenizedAssetRecord.updatedField).toBe("new-value");
  });

  it("Given a non-existent tokenized asset record, When attempting to update it, Then an error should be thrown", async () => {
    // Given
    const nonExistent = {
      ...sampleRecord,
      did: "did:web:test.com:does-not-exist",
    };

    // When / Then
    await expect(dao.update(nonExistent)).rejects.toThrow(
      `DAO error: failed to update tokenized asset record for DID=${nonExistent.did}`,
    );
  });

  it("should delete a tokenized asset record: Given an existing tokenized asset record, When deleting it, Then it should no longer be retrievable", async () => {
    // Given
    await dao.create(sampleRecord);

    // When
    await dao.delete(sampleRecord.did);

    // Then
    const row = await dao.getByDid(sampleRecord.did);
    expect(row).toBeNull();
  });

  it("Given a non-existent tokenized asset record, When attempting to delete it, Then an error should be thrown", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When / Then
    await expect(dao.delete(nonExistentDid)).rejects.toThrow(
      `DAO error: failed to delete tokenized asset record for DID=${nonExistentDid}`,
    );
  });
});

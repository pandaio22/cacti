import { RegisteredSchemaProfileDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-schema-profile";
import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";
import { RegisteredSchemaProfile } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import {
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
} from "../../../constants/constants";

describe("RegisteredSchemaProfileDao", () => {
  const dao = new RegisteredSchemaProfileDao();

  const sampleSchemaProfile: RegisteredSchemaProfile = {
    did: "did:web:test.com:schema-profile",
    schemaProfile: VALID_SCHEMA_PROFILE_EXAMPLE,
    schemaProfileDidDocument: VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
    schemaProfileVerifiableCredential:
      VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
  };

  beforeAll(async () => {
    // Create table for testing
    await db.schema.dropTableIfExists("schema_profiles");
    await db.schema.createTable("schema_profiles", (table) => {
      table.string("did").primary();
      table.text("schema_profile");
      table.text("schema_profile_did_document");
      table.text("schema_profile_vc");
    });
  });

  afterAll(async () => {
    await db.destroy();
  });

  afterEach(async () => {
    await db("schema_profiles").del(); // clear table between tests
  });

  it("should create a new schema profile: Given a valid schema profile, When creating it, Then it should be persisted in the database", async () => {
    // Given
    const schema = sampleSchemaProfile;

    // When
    await expect(dao.create(schema)).resolves.toBeUndefined();

    // Then
    const row = await db("schema_profiles").where({ did: schema.did }).first();
    expect(row).toBeDefined();
    expect(JSON.parse(row.schema_profile)).toEqual(schema.schemaProfile);
  });

  it("should throw error on duplicate DID: Given a schema profile already exists, When creating it again with the same DID, Then an error should be thrown", async () => {
    // Given
    await dao.create(sampleSchemaProfile);

    // When / Then
    await expect(dao.create(sampleSchemaProfile)).rejects.toThrow(
      `Schema Profile with DID ${sampleSchemaProfile.did} already exists`,
    );
  });

  it("should retrieve schema profile by DID: Given an existing schema profile, When retrieving it by DID, Then the correct schema profile should be returned", async () => {
    // Given
    await dao.create(sampleSchemaProfile);

    // When
    const result = await dao.getByDid("did:web:test.com:schema-profile");

    // Then
    expect(result).toBeDefined();
    expect(result?.did).toBe(sampleSchemaProfile.did);
    expect(result?.schemaProfile).toEqual(sampleSchemaProfile.schemaProfile);
  });

  it("should return null if DID not found: Given no schema profile exists for a DID, When retrieving it by DID, Then the result should be null", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When
    const result = await dao.getByDid(nonExistentDid);

    // Then
    expect(result).toBeNull();
  });

  it("should update an existing schema profile: Given an existing schema profile, When updating it, Then the update should persist the changes", async () => {
    // Given
    await dao.create(sampleSchemaProfile);

    const updated = {
      ...sampleSchemaProfile,
      schemaProfile: { ...VALID_SCHEMA_PROFILE_EXAMPLE, version: "2.0" },
    };

    // When
    await dao.update(updated);

    // Then
    const row = await dao.getByDid(updated.did);
    expect(row?.schemaProfile.version).toBe("2.0");
  });

  it("Given a non-existent schema profile, When attempting to update it, Then an error should be thrown", async () => {
    // Given
    const nonExistent = {
      ...sampleSchemaProfile,
      did: "did:web:test.com:does-not-exist",
    };

    // When / Then
    await expect(dao.update(nonExistent)).rejects.toThrow(
      `DAO error: failed to update schema profile for DID=${nonExistent.did}`,
    );
  });

  it("should delete a schema profile: Given an existing schema profile, When deleting it, Then it should no longer be retrievable", async () => {
    // Given
    await dao.create(sampleSchemaProfile);

    // When
    await dao.delete(sampleSchemaProfile.did);

    // Then
    const row = await dao.getByDid(sampleSchemaProfile.did);
    expect(row).toBeNull();
  });

  it("Given a non-existent schema profile, When attempting to delete it, Then an error should be thrown", async () => {
    // Given
    const nonExistentDid = "did:web:test.com:does-not-exist";

    // When / Then
    await expect(dao.delete(nonExistentDid)).rejects.toThrow(
      `DAO error: failed to delete schema profile for DID=${nonExistentDid}`,
    );
  });
});

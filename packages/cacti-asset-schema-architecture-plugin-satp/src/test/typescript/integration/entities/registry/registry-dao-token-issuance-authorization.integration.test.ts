import { TokenIssuanceAuthorizationDao } from "../../../../../main/typescript/entities/registry/modules/dao/dao-token-issuance-authorization";
import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection";
import { RegisteredTokenIssuanceAuthorization } from "../../../../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { VALID_TOKEN_ISSUANCE_AUTHORIZATION } from "../../../constants/constants";

describe("TokenIssuanceAuthorizationDao", () => {
  const dao = new TokenIssuanceAuthorizationDao();

  const sampleAuthorization: RegisteredTokenIssuanceAuthorization = {
    id: VALID_TOKEN_ISSUANCE_AUTHORIZATION.id,
    tokenIssuanceAuthorization: VALID_TOKEN_ISSUANCE_AUTHORIZATION,
  };

  beforeAll(async () => {
    // Create table for testing
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
    await db("token_issuance_authorizations").del(); // clear table
  });

  it("should create a new token issuance authorization: Given a valid authorization, When creating it, Then it should be persisted in the database", async () => {
    // Given
    const authorization = sampleAuthorization;
    console.log("Sample Authorization:", authorization);

    // When
    await expect(dao.create(authorization)).resolves.toBeUndefined();

    // Then
    const row = await db("token_issuance_authorizations")
      .where({ id: authorization.id })
      .first();
    expect(row).toBeDefined();
    expect(JSON.parse(row.token_issuance_authorization)).toEqual(
      authorization.tokenIssuanceAuthorization,
    );
  });

  it("should throw error on duplicate ID: Given an authorization already exists, When creating it again with the same ID, Then an error should be thrown", async () => {
    // Given
    await dao.create(sampleAuthorization);

    // When / Then
    await expect(dao.create(sampleAuthorization)).rejects.toThrow(
      `Token Issuance Authorization with ID ${sampleAuthorization.id} already exists`,
    );
  });

  it("should retrieve an authorization by ID: Given an existing authorization, When retrieving it by ID, Then the correct authorization should be returned", async () => {
    // Given
    await dao.create(sampleAuthorization);

    // When
    const result = await dao.getById(sampleAuthorization.id);

    // Then
    expect(result).toBeDefined();
    expect(result?.id).toBe(sampleAuthorization.id);
    expect(result?.tokenIssuanceAuthorization).toEqual(
      sampleAuthorization.tokenIssuanceAuthorization,
    );
  });

  it("should return null if ID not found: Given no authorization exists for an ID, When retrieving it, Then the result should be null", async () => {
    // Given
    const nonExistentId = "does-not-exist";

    // When
    const result = await dao.getById(nonExistentId);

    // Then
    expect(result).toBeNull();
  });

  it("should update an existing authorization: Given an existing authorization, When updating it, Then the changes should persist", async () => {
    // Given
    await dao.create(sampleAuthorization);

    const updated = {
      ...sampleAuthorization,
      tokenIssuanceAuthorization: {
        ...sampleAuthorization.tokenIssuanceAuthorization,
        issuer: "updated-issuer",
      },
    };

    // When
    await dao.update(updated);

    // Then
    const row = await dao.getById(updated.id);
    expect(row?.tokenIssuanceAuthorization.issuer).toBe("updated-issuer");
  });

  it("should throw error on updating non-existent authorization: Given no authorization exists, When attempting to update, Then an error should be thrown", async () => {
    // Given
    const nonExistent = {
      ...sampleAuthorization,
      id: "does-not-exist",
    };

    // When / Then
    await expect(dao.update(nonExistent)).rejects.toThrow(
      `DAO error: failed to update asset provider for ID=${nonExistent.id}`,
    );
  });

  it("should delete an authorization: Given an existing authorization, When deleting it, Then it should no longer be retrievable", async () => {
    // Given
    await dao.create(sampleAuthorization);

    // When
    await dao.delete(sampleAuthorization.id);

    // Then
    const row = await dao.getById(sampleAuthorization.id);
    expect(row).toBeNull();
  });

  it("should throw error on deleting non-existent authorization: Given no authorization exists, When attempting to delete, Then an error should be thrown", async () => {
    // Given
    const nonExistentId = "does-not-exist";

    // When / Then
    await expect(dao.delete(nonExistentId)).rejects.toThrow(
      `DAO error: failed to delete asset provider for ID=${nonExistentId}`,
    );
  });
});

import { TokenIssuanceAuthorizationSchema } from "../../../../main/typescript/data-model/token-issuance-authorization";
import { createTestLogger } from "../../test-helpers/test-logger";

describe("TokenIssuanceAuthorizationSchema", () => {
  const log = createTestLogger("TokenIssuanceAuthorizationSchemaTest");

  it("should validate a correct Token Issuance Authorization", () => {
    // Given: a valid Token Issuance Authorization
    const validAuthorization = {
      token_issuance_authorization_request: {
        "@context": "https://example.org/context/token-issuance-authorization",
        asset_provider: {
          name: "Acme Asset Provider",
          id: "https://example.org/asset-providers/acme",
          organization_key: {
            public_key: "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEp...xyz",
            issued: "2025-06-14T10:20:30.000Z",
          },
        },
        schema_profile: "https://example.org/schema-profiles/standard-profile",
        network_id: "testnet-12345",
        proof: {
          type: "JwsSignature2020",
          created: "2025-06-14T12:34:56.789Z",
          proofPurpose: "assertionMethod",
          verificationMethod: "https://example.org/keys/asset-provider-key",
          jws: "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..abc123",
        },
      },
      proof: {
        type: "JwsSignature2020",
        created: "2025-06-14T15:00:00.000Z",
        proofPurpose: "assertionMethod",
        verificationMethod: "https://example.org/keys/authorization-proof-key",
        jws: "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..xyz456",
      },
    };

    log.info(
      "📋 Given: Valid token issuance authorization",
      validAuthorization,
    );

    // When: validating the authorization
    const result =
      TokenIssuanceAuthorizationSchema.safeParse(validAuthorization);

    // Then: it should be valid
    if (result.success) {
      log.info("✅ Then: Validation passed");
      log.debug("🎯 Parsed Data:", result.data);
    } else {
      log.error("❌ Then: Validation failed unexpectedly");
      log.error("Errors:", result.error.format());
    }

    expect(result.success).toBe(true);
  });

  it("should fail validation for an invalid Token Issuance Authorization", () => {
    // Given: an invalid Token Issuance Authorization (missing required proof)
    const invalidAuthorization = {
      token_issuance_authorization_request: {
        "@context": "not-a-url",
        asset_provider: {
          name: "Acme Asset Provider",
          id: "invalid-url",
          organization_key: {
            public_key: "invalid-public-key",
            issued: "not-a-date",
          },
        },
        schema_profile: "invalid-url",
        network_id: "testnet-12345",
        proof: {
          type: "JwsSignature2020",
          created: "invalid-date",
          proofPurpose: "assertionMethod",
          verificationMethod: "not-a-url",
          jws: "invalid-jws",
        },
      },
      // Missing outer proof
    };

    log.info(
      "📋 Given: Invalid token issuance authorization",
      invalidAuthorization,
    );

    // When: validating the authorization
    const result =
      TokenIssuanceAuthorizationSchema.safeParse(invalidAuthorization);

    // Then: it should fail
    if (result.success) {
      log.error("❌ Then: Unexpected validation success");
      log.debug("🎯 Parsed Data:", result.data);
    } else {
      log.info("✅ Then: Expected validation failure");
      log.debug("Errors:", result.error.format());
    }

    expect(result.success).toBe(false);
  });
});

// src/test/typescript/schema/token-issuance-authorization-request-schema.test.ts

import { TokenIssuanceAuthorizationRequestSchema } from "../../../../main/typescript/data-model/token-issuance-authorization-request";
import { createTestLogger } from "../../test-helpers/test-logger";

describe("TokenIssuanceAuthorizationRequestSchema", () => {
  const log = createTestLogger("TokenIssuanceAuthorizationRequestSchemaTest");

  it("should validate a correct Token Issuance Authorization Request", () => {
    // Given: a valid Token Issuance Authorization Request
    const sampleRequest = {
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
    };

    log.info("📋 Given: Sample request", sampleRequest);

    // When: validating the request
    const result = TokenIssuanceAuthorizationRequestSchema.safeParse(sampleRequest);

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

  it("should fail validation for an invalid request", () => {
    // Given: an invalid Token Issuance Authorization Request
    const invalidRequest = {
      "@context": "not-a-url",
      asset_provider: {
        name: "Acme Asset Provider",
        id: "invalid-url",
        organization_key: {
          public_key: "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEp...xyz",
          issued: "not-a-datetime",
        },
      },
      schema_profile: "still-invalid-url",
      network_id: "testnet-12345",
      // Missing 'proof'
    };

    log.info("📋 Given: Invalid request", invalidRequest);

    // When: validating the request
    const result = TokenIssuanceAuthorizationRequestSchema.safeParse(invalidRequest);

    // Then: it should fail
    if (result.success) {
      log.error("❌ Then: Unexpected success");
      log.debug("🎯 Parsed Data:", result.data);
    } else {
      log.info("✅ Then: Expected validation failure");
      log.debug("Errors:", result.error.format());
    }

    expect(result.success).toBe(false);
  });
});

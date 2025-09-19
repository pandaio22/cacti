import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
  //VALID_TOKEN_ISSUANCE_AUTHORIZATION,
  //VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
} from "../../../constants/constants";
import { ValidationErrorType } from "../../../../../main/typescript/types/asset-schema-architecture-types.type";

import { VerifiableCredentialService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/verifiable-credential-service/implementations/verifiable-credential-service";

describe("Verifiable Credential Service", () => {
  const TIMEOUT: number = 50000000;
  let assetSchemaAuthorityVerifiableCredentialService: VerifiableCredentialService;

  /***********************************************CONTEXT SETUP*/
  const didV1Context = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/did-v1.jsonld"),
      "utf-8",
    ),
  );

  const assetSchemaContext = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/asset-schema.jsonld"),
      "utf-8",
    ),
  );

  const assetSchemaVerifiableCredentialContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/asset-schema-verifiable-credential.jsonld",
      ),
      "utf-8",
    ),
  );

  const schemaProfileContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/schema-profile.jsonld",
      ),
      "utf-8",
    ),
  );

  const schemaProfileVerifiableCredentialContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/schema-profile-verifiable-credential.jsonld",
      ),
      "utf-8",
    ),
  );

  const verifiableCredentialsContextTest = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/test-vc-1.jsonld"),
      "utf-8",
    ),
  );

  const verifiableCredentialsContextV1 = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/verifiable-credentials-v1.jsonld",
      ),
      "utf-8",
    ),
  );

  const verifiableCredentialsContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/verifiable-credentials-v2.jsonld",
      ),
      "utf-8",
    ),
  );

  const ed255192020 = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/ed25519-2020.jsonld"),
      "utf-8",
    ),
  );

  const tokenIssuanceAuthorizationContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/token-issuance-authorization.jsonld",
      ),
      "utf-8",
    ),
  );
  /***************************************************************/

  beforeAll(async () => {
    //Placeholder
  });

  beforeEach(async () => {
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService();
  }, TIMEOUT);

  afterEach(async () => {
    //placeholder
  }, TIMEOUT);

  afterAll(async () => {
    //Placeholder
  });

  it("Test for VC library", async () => {
    // Given
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService();
    // When
    await assetSchemaAuthorityVerifiableCredentialService.vcIssueAndVerifyTest();
    // Then
    expect(true).toBe(true); // Placeholder for actual test logic
  });

  // ------------------------
  // Asset Schema VC
  // ------------------------
  it("should create an Asset Schema VC: Given a valid Asset Schema and Asset Schema DID Document, When executing createAsssetSchemaVerifiableCredential, Then return a valid AssetSchemaVerifiableCredential", async () => {
    // Given
    console.log("Starting Asset Schema VC creation test...");
    const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;
    //const contexts: Record<string, any> = {
    //  "https://www.w3.org/ns/did/v1": didV1Context,
    //  "https://www.w3.org/2018/credentials/v2": verifiableCredentialsContext,
    //};
    const localContexts: Record<string, any> = {
      //"https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      //"https://www.w3.org/ns/credentials/v2": verifiableCredentialsContext,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      //"did:example:123456789abcdefghi#": assetSchemaContext,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };

    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When
    const assetSchemaVerifiableCredential =
      await assetSchemaAuthorityVerifiableCredentialService.createAssetSchemaVerifiableCredential(
        assetSchema,
        assetSchemaDidDocument,
      );

    // Then
    expect(assetSchemaVerifiableCredential).toBeDefined();
    expect(assetSchemaVerifiableCredential).toHaveProperty("@context");
    expect(assetSchemaVerifiableCredential).toHaveProperty("id");
    expect(assetSchemaVerifiableCredential).toHaveProperty("type");
    expect(assetSchemaVerifiableCredential.type).toContain(
      "VerifiableCredential",
    );
    expect(assetSchemaVerifiableCredential.type).toContain(
      "AssetSchemaVerifiableCredential",
    );
    expect(assetSchemaVerifiableCredential).toHaveProperty("credentialSubject");
    expect(assetSchemaVerifiableCredential).toHaveProperty("proof");
    expect(assetSchemaVerifiableCredential.proof).toHaveProperty("type");
  });

  it("should fail to create an Asset Schema VC: Given an invalid Asset Schema and Asset Schema DID Document, When executing createAsssetSchemaVerifiableCredential, Then should throw an exception", async () => {
    // Given
    const invalidAssetSchema = { ...VALID_ASSET_SCHEMA_EXAMPLE, name: null };
    const invalidDidDocument = {
      ...VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      id: null,
    };
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };

    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When & Then
    await expect(
      assetSchemaAuthorityVerifiableCredentialService.createAssetSchemaVerifiableCredential(
        invalidAssetSchema as any,
        invalidDidDocument as any,
      ),
    ).rejects.toThrowError(/Missing Required Inputs|Invalid/); // match the relevant error message
  });

  it("should verify an Asset Schema VC: Given a valid Asset Schema VC, When executing verifyAssetSchemaVerifiableCredential, Then return a valid ValidationResult", async () => {
    // Given
    const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);
    const assetSchemaVerifiableCredential =
      await assetSchemaAuthorityVerifiableCredentialService.createAssetSchemaVerifiableCredential(
        assetSchema,
        assetSchemaDidDocument,
      );

    localContexts[assetSchemaDidDocument.id] = assetSchemaDidDocument;
    console.debug("Context Map:\n", localContexts);

    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When
    const result =
      await assetSchemaAuthorityVerifiableCredentialService.verifyAssetSchemaVerifiableCredential(
        assetSchemaVerifiableCredential,
      );

    // Then
    expect(result.valid).toBe(true);
  });

  it("should fail to verify an Asset Schema VC: Given a tampered Asset Schema VC, When executing verifyAssetSchemaVerifiableCredential, Then return an invalid ValidationResult", async () => {
    // Given
    const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);
    const assetSchemaVerifiableCredential =
      await assetSchemaAuthorityVerifiableCredentialService.createAssetSchemaVerifiableCredential(
        assetSchema,
        assetSchemaDidDocument,
      );

    const tamperedVC = {
      ...assetSchemaVerifiableCredential,
      credentialSubject: {
        ...assetSchemaVerifiableCredential.credentialSubject,
        name: "HACKED-NAME",
      },
    };
    console.debug("Tampered VC:\n", tamperedVC);

    localContexts[assetSchemaDidDocument.id] = assetSchemaDidDocument;
    console.debug("Context Map:\n", localContexts);

    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When & Then
    await expect(
      assetSchemaAuthorityVerifiableCredentialService.verifyAssetSchemaVerifiableCredential(
        tamperedVC,
      ),
    ).rejects.toMatchObject({
      type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
      message: expect.stringMatching(
        /invalid signature|proof verification failed/i,
      ),
    });
  });

  /*
  it("should revoke an Asset Schema VC: Given a valid Asset Schema VC, When executing revokeAssetSchemaVerifiableCredential, Then the VC should be revoked successfully", async () => {
    // Given
    // When
    // Then
    expect(true).toBe(false); // Placeholder for actual test logic
  });

  it("should fail to revoke an Asset Schema VC: Given a non-existent Asset Schema VC, When executing revokeAssetSchemaVerifiableCredential, Then should throw an exception", async () => {
    // Given
    // When
    // Then
    expect(true).toBe(false); // Placeholder for actual test logic
  });
  */

  // ------------------------
  // Schema Profile VC
  // ------------------------
  it("should create a Schema Profile VC: Given a valid Schema Profile, When executing createSchemaProfileVerifiableCredential, Then return a valid SchemaProfileVerifiableCredential", async () => {
    // Given
    const schemProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
    const schemProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When
    const schemProfileVerifiableCredential =
      await assetSchemaAuthorityVerifiableCredentialService.createSchemaProfileVerifiableCredential(
        schemProfile,
        schemProfileDidDocument,
      );

    // Then
    expect(schemProfileVerifiableCredential).toBeDefined();
    expect(schemProfileVerifiableCredential).toHaveProperty("@context");
    expect(schemProfileVerifiableCredential).toHaveProperty("id");
    expect(schemProfileVerifiableCredential).toHaveProperty("type");
    expect(schemProfileVerifiableCredential.type).toContain(
      "VerifiableCredential",
    );
    expect(schemProfileVerifiableCredential).toHaveProperty(
      "credentialSubject",
    );
    expect(schemProfileVerifiableCredential).toHaveProperty("proof");
    expect(schemProfileVerifiableCredential.proof).toHaveProperty("type");
  });

  it("should fail to create a Schema Profile VC: Given an invalid Schema Profile, When executing createSchemaProfileVerifiableCredential, Then should throw an exception", async () => {
    // Given
    const invalidSchemaProfile = {
      ...VALID_SCHEMA_PROFILE_EXAMPLE,
      name: null,
    };
    const invalidDidDocument = {
      ...VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
      id: null,
    };
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };

    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When & Then
    await expect(
      assetSchemaAuthorityVerifiableCredentialService.createSchemaProfileVerifiableCredential(
        invalidSchemaProfile as any,
        invalidDidDocument as any,
      ),
    ).rejects.toThrowError(/Missing Required Inputs|Invalid/); // match the relevant error message
  });

  it("should verify a Schema Profile VC: Given a valid Schema Profile VC, When executing verifySchemaProfileVerifiableCredential, Then return a valid ValidationResult", async () => {
    // Given
    const schemaProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);
    const schemaProfileVerifiableCredential =
      await assetSchemaAuthorityVerifiableCredentialService.createSchemaProfileVerifiableCredential(
        schemaProfile,
        schemaProfileDidDocument,
      );

    localContexts[schemaProfileDidDocument.id] = schemaProfileDidDocument;
    console.debug("Context Map:\n", localContexts);

    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When
    const result =
      await assetSchemaAuthorityVerifiableCredentialService.verifySchemaProfileVerifiableCredential(
        schemaProfileVerifiableCredential,
      );

    // Then
    expect(result.valid).toBe(true);
  });

  it("should fail to verify a Schema Profile VC: Given a tampered Schema Profile VC, When executing verifySchemaProfileVerifiableCredential, Then return an invalid ValidationResult", async () => {
    // Given
    const schemaProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);
    const schemaProfileVerifiableCredential =
      await assetSchemaAuthorityVerifiableCredentialService.createSchemaProfileVerifiableCredential(
        schemaProfile,
        schemaProfileDidDocument,
      );

    const tamperedVC = {
      ...schemaProfileVerifiableCredential,
      credentialSubject: {
        ...schemaProfileVerifiableCredential.credentialSubject,
        name: "HACKED-NAME",
      },
    };
    console.debug("Tampered VC:\n", tamperedVC);

    localContexts[schemaProfileDidDocument.id] = schemaProfileDidDocument;
    console.debug("Context Map:\n", localContexts);

    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When & Then
    await expect(
      assetSchemaAuthorityVerifiableCredentialService.verifySchemaProfileVerifiableCredential(
        tamperedVC,
      ),
    ).rejects.toMatchObject({
      type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
      message: expect.stringMatching(
        /invalid signature|proof verification failed/i,
      ),
    });
  });
  /*
  it("should revoke a Schema Profile VC: Given a valid Schema Profile VC, When executing revokeSchemaProfileVerifiableCredential, Then the VC should be revoked successfully", async () => {
    // Given
    // When
    // Then
    expect(true).toBe(false); // Placeholder for actual test logic
  });

  it("should fail to revoke a Schema Profile VC: Given a non-existent Schema Profile VC, When executing revokeSchemaProfileVerifiableCredential, Then should throw an exception", async () => {
    // Given
    // When
    // Then
    expect(true).toBe(false); // Placeholder for actual test logic
  });
  */
  // ------------------------
  // Token Issuance Authorization VC
  // ------------------------
  it("should create a Token Issuance Authorization: Given a valid request, When executing createTokenIssuanceAuthorization, Then return a valid TokenIssuanceAuthorization VC", async () => {
    // Given
    const tokenIssuanceAuthorizationRequest =
      VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When
    const tokenIssuanceAuthorization =
      await assetSchemaAuthorityVerifiableCredentialService.createTokenIssuanceAuthorization(
        tokenIssuanceAuthorizationRequest,
      );

    // Then
    expect(tokenIssuanceAuthorization).toBeDefined();
    expect(tokenIssuanceAuthorization).toHaveProperty("@context");
    expect(tokenIssuanceAuthorization).toHaveProperty("id");
    expect(tokenIssuanceAuthorization).toHaveProperty("type");
    expect(tokenIssuanceAuthorization.type).toContain("VerifiableCredential");
    expect(tokenIssuanceAuthorization.type).toContain(
      "TokenIssuanceAuthorization",
    );
    expect(tokenIssuanceAuthorization.credentialSubject).toHaveProperty(
      "tokenIssuanceAuthorizationRequest",
    );
    expect(tokenIssuanceAuthorization).toHaveProperty("proof");
    expect(tokenIssuanceAuthorization.proof).toHaveProperty("type");
  });

  it("should fail to create a Token Issuance Authorization: Given an invalid request, When executing createTokenIssuanceAuthorization, Then should throw an exception", async () => {
    // Given
    const invalidTokenIssuanceAuthorizationRequest = {
      ...VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
      // invalidate by removing a required field (e.g., issuer or verifiableCredential)
      id: null,
    };
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);

    // When & Then
    await expect(
      assetSchemaAuthorityVerifiableCredentialService.createTokenIssuanceAuthorization(
        invalidTokenIssuanceAuthorizationRequest as any,
      ),
    ).rejects.toThrowError(/Missing Required Inputs|Invalid/); // match your error handling
  });

  it("should verify a Token Issuance Authorization: Given a valid Token Issuance Authorization VC, When executing verifyTokenIssuanceAuthorization, Then return a valid ValidationResult", async () => {
    // Given
    const tokenIssuanceAuthorizationRequest =
      VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);
    const tokenIssuanceAuthorization =
      await assetSchemaAuthorityVerifiableCredentialService.createTokenIssuanceAuthorization(
        tokenIssuanceAuthorizationRequest,
      );

    // When
    const result =
      await assetSchemaAuthorityVerifiableCredentialService.verifyTokenIssuanceAuthorization(
        tokenIssuanceAuthorization,
      );

    // Then
    expect(result.valid).toBe(true);
  });

  it("should fail to verify a Token Issuance Authorization: Given a tampered Token Issuance Authorization VC, When executing verifyTokenIssuanceAuthorization, Then return an invalid ValidationResult", async () => {
    // Given
    const tokenIssuanceAuthorizationRequest =
      VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContexts);
    const tokenIssuanceAuthorization =
      await assetSchemaAuthorityVerifiableCredentialService.createTokenIssuanceAuthorization(
        tokenIssuanceAuthorizationRequest,
      );

    const tamperedVC = {
      ...tokenIssuanceAuthorization,
      credentialSubject: {
        ...tokenIssuanceAuthorization.credentialSubject,
        name: "HACKED-NAME",
      },
    };
    console.debug("Tampered VC:\n", tamperedVC);

    // When & Then
    await expect(
      assetSchemaAuthorityVerifiableCredentialService.verifyTokenIssuanceAuthorization(
        tamperedVC,
      ),
    ).rejects.toMatchObject({
      type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
      message: expect.stringMatching(
        /invalid signature|proof verification failed/i,
      ),
    });
  });

  /*it("should revoke a Token Issuance Authorization: Given a valid Token Issuance Authorization VC, When executing revokeTokenIssuanceAuthorization, Then the VC should be revoked successfully", async () => {
    // Given
    // When
    // Then
    expect(true).toBe(false); // Placeholder for actual test logic
  });

  it("should fail to revoke a Token Issuance Authorization: Given a non-existent Token Issuance Authorization VC, When executing revokeTokenIssuanceAuthorization, Then should throw an exception", async () => {
    // Given
    // When
    // Then
    expect(true).toBe(false); // Placeholder for actual test logic
  });
  */
});

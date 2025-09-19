import fs from "fs";
import path from "path";

import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
} from "../../../constants/constants";
import { ValidationService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/validation-service/implementations/validation-service";

describe("Asset Schema Authority Validation Service", () => {
  const TIMEOUT: number = 50000000;
  let assetSchemaAuthorityValidationService: ValidationService;

  /*CONTEXT SETUP*/
  const didV1Context = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/did-v1.jsonld"),
      "utf-8",
    ),
  );
  const assetSchemaAuthorityCertificateContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/asset-schema-authority-certificate.jsonld",
      ),
      "utf-8",
    ),
  );
  const assetSchemaContext = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/asset-schema.jsonld"),
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
  const verifiableCredentialsContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/verifiable-credentials-v2.jsonld",
      ),
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

  beforeEach(async () => {
    assetSchemaAuthorityValidationService = new ValidationService();
  }, TIMEOUT);

  it("should validate Asset Schema: Given a valid signed Asset Schema, When executing validateAssetSchema, Then return Valid", async () => {
    //Given
    assetSchemaAuthorityValidationService = new ValidationService();

    //When
    const result =
      await assetSchemaAuthorityValidationService.validateAssetSchema(
        VALID_ASSET_SCHEMA_EXAMPLE,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Asset Schema validation: Given an invalid signed Asset Schema, When executing validateAssetSchema, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://example.org/AssetSchemaAuthority":
        assetSchemaAuthorityCertificateContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };
    assetSchemaAuthorityValidationService = new ValidationService(contexts);

    //When
    const result =
      await assetSchemaAuthorityValidationService.validateAssetSchema(
        null as unknown as typeof VALID_ASSET_SCHEMA_EXAMPLE,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Schema Profile: Given a valid signed Schema Profile, When executing validateSchemaProfile, Then return Valid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "did:example:123456789abcdefghi#": assetSchemaContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };

    assetSchemaAuthorityValidationService = new ValidationService(contexts);

    //When
    const result =
      await assetSchemaAuthorityValidationService.validateSchemaProfile(
        VALID_SCHEMA_PROFILE_EXAMPLE,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Schema Profile validation: Given an invalid signed Schema Profile, When executing validateSchemaProfile, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "did:example:123456789abcdefghi#": assetSchemaContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };

    assetSchemaAuthorityValidationService = new ValidationService(contexts);

    //When
    const result =
      await assetSchemaAuthorityValidationService.validateSchemaProfile(
        null as unknown as typeof VALID_SCHEMA_PROFILE_EXAMPLE,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Token Issuance Authorization: Given a valid Token Issuance Authorization, When executing validateTokenIssuanceAuthorization, Then return Valid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v2": verifiableCredentialsContext,
      "https://example.org/contexts/token-issuance-authorization/v1":
        tokenIssuanceAuthorizationContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };

    assetSchemaAuthorityValidationService = new ValidationService(contexts);

    //When
    const result =
      await assetSchemaAuthorityValidationService.validateTokenIssuanceAuthorization(
        VALID_TOKEN_ISSUANCE_AUTHORIZATION,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Token Issuance Authorization validation: Given an invalid Token Issuance Authorization, When executing validateTokenIssuanceAuthorization, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v2": verifiableCredentialsContext,
      "https://example.org/contexts/token-issuance-authorization/v1":
        tokenIssuanceAuthorizationContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };

    assetSchemaAuthorityValidationService = new ValidationService(contexts);

    //When
    const result =
      await assetSchemaAuthorityValidationService.validateTokenIssuanceAuthorization(
        null as unknown as typeof VALID_TOKEN_ISSUANCE_AUTHORIZATION,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Token Issuance Authorization Request: Given a valid Token Issuance Authorization Request, When executing validateTokenIssuanceAuthorizationRequest, Then return Valid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v2": verifiableCredentialsContext,
      "https://example.org/contexts/token-issuance-authorization/v1":
        tokenIssuanceAuthorizationContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };

    assetSchemaAuthorityValidationService = new ValidationService(contexts);

    //When
    const result =
      await assetSchemaAuthorityValidationService.validateTokenIssuanceAuthorizationRequest(
        VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Token Issuance Authorization Request validation: Given an invalid Token Issuance Authorization, When executing validateTokenIssuanceAuthorizationRequest, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v2": verifiableCredentialsContext,
      "https://example.org/contexts/token-issuance-authorization/v1":
        tokenIssuanceAuthorizationContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };

    assetSchemaAuthorityValidationService = new ValidationService(contexts);

    //When
    const result =
      await assetSchemaAuthorityValidationService.validateTokenIssuanceAuthorizationRequest(
        null as unknown as typeof VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate DID Document: Given a valid DID Document, When executing validateDidDocument, Then return Valid", async () => {
    // Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
    };
    const validDidDocument = {
      "@context": ["https://www.w3.org/ns/did/v1"],
      id: "did:example:123456789abcdefghi",
      verificationMethod: [
        {
          id: "did:example:123456789abcdefghi#key-1",
          type: "Ed25519VerificationKey2020",
          controller: "did:example:123456789abcdefghi",
          publicKeyMultibase: "H3C2AVvLMf2pX...",
        },
      ],
      authentication: ["did:example:123456789abcdefghi#key-1"],
      assertionMethod: ["did:example:123456789abcdefghi#key-1"],
    };

    assetSchemaAuthorityValidationService = new ValidationService(contexts);

    // When
    const result =
      await assetSchemaAuthorityValidationService.validateDidDocument(
        validDidDocument,
      );
    console.log(result);
    // Then
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toContain("semantics are valid");
  });

  it("should fail DID Document validation: Given an invalid DID Document, When executing validateDidDocument, Then return Invalid", async () => {
    // Given
    const invalidDidDocument = {
      "@context": ["https://www.w3.org/ns/did/v1"],
      id: "", // Invalid DID
      type: "WrongType", // Incorrect type
      verificationMethod: [
        {
          id: "", // Missing required id
          type: "", // Missing type
          controller: "", // Missing controller
        },
      ],
    };

    // When
    const result =
      await assetSchemaAuthorityValidationService.validateDidDocument(
        invalidDidDocument,
      );

    // Then
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors![0].message).toMatch(/Invalid|Missing/);
    expect(result.details).toContain("Validation error");
  });
});

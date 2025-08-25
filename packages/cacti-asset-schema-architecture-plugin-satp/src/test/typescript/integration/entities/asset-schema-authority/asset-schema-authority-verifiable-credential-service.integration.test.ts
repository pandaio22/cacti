import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  //VALID_SCHEMA_PROFILE_EXAMPLE,
  //VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  //VALID_TOKEN_ISSUANCE_AUTHORIZATION,
  //VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
} from "../../../constants/constants";

import { VerifiableCredentialService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/verifiable-credential-service/implementations/verifiable-credential-service";

describe("Verifiable Credential Service", () => {
  const TIMEOUT: number = 50000000;
  let assetSchemaAuthorityVerifiableCredentialService: VerifiableCredentialService;

  /*CONTEXT SETUP*/
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

  const schemaProfileContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/schema-profile.jsonld",
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

  // ------------------------
  // Asset Schema VC
  // ------------------------
  /*it("MOCKshould create an Asset Schema VC: Given a valid Asset Schema and Asset Schema DID Document, When executing createAsssetSchemaVerifiableCredential, Then return a valid AssetSchemaVerifiableCredential", async () => {
    // Given
    console.log("Starting Asset Schema VC creation test...");
    const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;
    //const contexts: Record<string, any> = {
    //  "https://www.w3.org/ns/did/v1": didV1Context,
    //  "https://www.w3.org/2018/credentials/v2": verifiableCredentialsContext,
    //};
    const localContextsMap = new Map(
      Object.entries({
        "https://www.w3.org/ns/did/v1": didV1Context,
        "https://www.w3.org/2018/credentials/v2": verifiableCredentialsContext,
        "did:example:123456789abcdefghi#": assetSchemaContext,
      }),
    );
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContextsMap);

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
    expect(assetSchemaVerifiableCredential).toHaveProperty("credentialSubject");
    expect(assetSchemaVerifiableCredential).toHaveProperty("proof");
    expect(assetSchemaVerifiableCredential.proof).toHaveProperty("type");
  });*/
  it("Test for VC library", async () => {
    // Given
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService();
    // When
    await assetSchemaAuthorityVerifiableCredentialService.vcIssueAndVerifyTest();
    // Then
    expect(true).toBe(true); // Placeholder for actual test logic
  });

  it("should create an Asset Schema VC: Given a valid Asset Schema and Asset Schema DID Document, When executing createAsssetSchemaVerifiableCredential, Then return a valid AssetSchemaVerifiableCredential", async () => {
    // Given
    console.log("Starting Asset Schema VC creation test...");
    const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;
    //const contexts: Record<string, any> = {
    //  "https://www.w3.org/ns/did/v1": didV1Context,
    //  "https://www.w3.org/2018/credentials/v2": verifiableCredentialsContext,
    //};
    const localContextsMap = new Map(
      Object.entries({
        //"https://www.w3.org/ns/did/v1": didV1Context,
        "https://www.w3.org/2018/credentials/v1":
          verifiableCredentialsContextTest,
        //"https://www.w3.org/ns/credentials/v2": verifiableCredentialsContext,
        "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
        //"did:example:123456789abcdefghi#": assetSchemaContext,
      }),
    );
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContextsMap);

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
    expect(assetSchemaVerifiableCredential).toHaveProperty("credentialSubject");
    expect(assetSchemaVerifiableCredential).toHaveProperty("proof");
    expect(assetSchemaVerifiableCredential.proof).toHaveProperty("type");
  });

  it("should fail to create an Asset Schema VC: Given an invalid Asset Schema and Asset Schema DID Document, When executing createAsssetSchemaVerifiableCredential, Then should throw an exception", async () => {
    // Given
    // When
    // Then
  });

  it("should verify an Asset Schema VC: Given a valid Asset Schema VC, When executing verifyAssetSchemaVerifiableCredential, Then return a valid ValidationResult", async () => {
    // Given
    const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;
    const localContextsMap = new Map(
      Object.entries({
        "https://www.w3.org/2018/credentials/v1":
          verifiableCredentialsContextTest,
        "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      }),
    );
    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContextsMap);
    const assetSchemaVerifiableCredential =
      await assetSchemaAuthorityVerifiableCredentialService.createAssetSchemaVerifiableCredential(
        assetSchema,
        assetSchemaDidDocument,
      );

    localContextsMap.set(assetSchemaDidDocument.id, assetSchemaDidDocument);
    console.debug("Context Map:\n", localContextsMap);

    assetSchemaAuthorityVerifiableCredentialService =
      new VerifiableCredentialService(localContextsMap);

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
    // When
    // Then
  });

  it("should revoke an Asset Schema VC: Given a valid Asset Schema VC, When executing revokeAssetSchemaVerifiableCredential, Then the VC should be revoked successfully", async () => {
    // Given
    // When
    // Then
  });

  it("should fail to revoke an Asset Schema VC: Given a non-existent Asset Schema VC, When executing revokeAssetSchemaVerifiableCredential, Then should throw an exception", async () => {
    // Given
    // When
    // Then
  });

  // ------------------------
  // Schema Profile VC
  // ------------------------
  it("should create a Schema Profile VC: Given a valid Schema Profile, When executing createSchemaProfileVerifiableCredential, Then return a valid SchemaProfileVerifiableCredential", async () => {
    // Given
    // When
    // Then
  });

  it("should fail to create a Schema Profile VC: Given an invalid Schema Profile, When executing createSchemaProfileVerifiableCredential, Then should throw an exception", async () => {
    // Given
    // When
    // Then
  });

  it("should verify a Schema Profile VC: Given a valid Schema Profile VC, When executing verifySchemaProfileVerifiableCredential, Then return a valid ValidationResult", async () => {
    // Given
    // When
    // Then
  });

  it("should fail to verify a Schema Profile VC: Given a tampered Schema Profile VC, When executing verifySchemaProfileVerifiableCredential, Then return an invalid ValidationResult", async () => {
    // Given
    // When
    // Then
  });

  it("should revoke a Schema Profile VC: Given a valid Schema Profile VC, When executing revokeSchemaProfileVerifiableCredential, Then the VC should be revoked successfully", async () => {
    // Given
    // When
    // Then
  });

  it("should fail to revoke a Schema Profile VC: Given a non-existent Schema Profile VC, When executing revokeSchemaProfileVerifiableCredential, Then should throw an exception", async () => {
    // Given
    // When
    // Then
  });

  // ------------------------
  // Token Issuance Authorization VC
  // ------------------------
  it("should create a Token Issuance Authorization: Given a valid request, When executing createTokenIssuanceAuthorization, Then return a valid TokenIssuanceAuthorization VC", async () => {
    // Given
    // When
    // Then
  });

  it("should fail to create a Token Issuance Authorization: Given an invalid request, When executing createTokenIssuanceAuthorization, Then should throw an exception", async () => {
    // Given
    // When
    // Then
  });

  it("should verify a Token Issuance Authorization: Given a valid Token Issuance Authorization VC, When executing verifyTokenIssuanceAuthorization, Then return a valid ValidationResult", async () => {
    // Given
    // When
    // Then
  });

  it("should fail to verify a Token Issuance Authorization: Given a tampered Token Issuance Authorization VC, When executing verifyTokenIssuanceAuthorization, Then return an invalid ValidationResult", async () => {
    // Given
    // When
    // Then
  });

  it("should revoke a Token Issuance Authorization: Given a valid Token Issuance Authorization VC, When executing revokeTokenIssuanceAuthorization, Then the VC should be revoked successfully", async () => {
    // Given
    // When
    // Then
  });

  it("should fail to revoke a Token Issuance Authorization: Given a non-existent Token Issuance Authorization VC, When executing revokeTokenIssuanceAuthorization, Then should throw an exception", async () => {
    // Given
    // When
    // Then
  });
});

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";

import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_TEST,
  //VALID_TOKEN_ISSUANCE_AUTHORIZATION,
  //VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
} from "../../../constants/constants";

import { ValidationErrorType } from "../../../../../main/typescript/types/asset-schema-architecture-types.type";
import { AssetProviderService } from "../../../../../main/typescript/entities/asset-provider/modules/services/asset-provider-service/implementations/asset-provider.service";

describe("Asset Provider Service", () => {
  const TIMEOUT: number = 50000000;
  let assetProviderService: AssetProviderService;

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
    assetProviderService = new AssetProviderService();
  }, TIMEOUT);

  afterEach(async () => {
    //placeholder
  }, TIMEOUT);

  afterAll(async () => {
    //Placeholder
  });

  // ------------------------------------
  // Token Issuance Authorization Request
  // ------------------------------------
  it("should create a TokenIssuanceAuthorizationRequest: Given a valid Network ID and Schema Profile DID Document, When executing createTokenIssuanceAuthorizationRequest, Then return a valid TokenIssuanceAuthorizationRequest", async () => {
    // Given
    const networkId = "Ethereum";
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetProviderService = new AssetProviderService(localContexts);

    // When
    const tokenIssuanceAuthorizationRequest =
      await assetProviderService.createTokenIssuanceAuthorizationRequest(
        networkId,
        schemaProfileDidDocument,
      );

    // Then
    expect(tokenIssuanceAuthorizationRequest).toBeDefined();
    expect(tokenIssuanceAuthorizationRequest).toHaveProperty("@context");
    expect(tokenIssuanceAuthorizationRequest).toHaveProperty("id");
    expect(tokenIssuanceAuthorizationRequest).toHaveProperty("type");
    expect(tokenIssuanceAuthorizationRequest.type).toContain(
      "VerifiableCredential",
    );
    expect(tokenIssuanceAuthorizationRequest.type).toContain(
      "TokenIssuanceAuthorizationRequest",
    );
    expect(tokenIssuanceAuthorizationRequest).toHaveProperty(
      "credentialSubject",
    );
    expect(tokenIssuanceAuthorizationRequest).toHaveProperty("proof");
    expect(tokenIssuanceAuthorizationRequest.proof).toHaveProperty("type");
  });

  it("should fail to create an TokenIssuanceAuthorizationRequest: Given an invalid Schema Profile DID Document, When executing createTokenIssuanceAuthorizationRequest, Then should throw an exception", async () => {
    // Given
    const networkId = "Ethereum";
    const invalidDidDocument = {
      ...VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
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

    assetProviderService = new AssetProviderService(localContexts);

    // When & Then
    await expect(
      assetProviderService.createTokenIssuanceAuthorizationRequest(
        networkId as any,
        invalidDidDocument as any,
      ),
    ).rejects.toThrowError(/Missing Required Inputs|Invalid/); // match the relevant error message
  });

  it("should verify a TokenIssuanceAuthorizationRequest: Given a valid TokenIssuanceAuthorizationRequest, When executing verifyTokenIssuanceAuthorizationRequest, Then return a valid ValidationResult", async () => {
    // Given
    const networkId = "Ethereum";
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
    };
    assetProviderService = new AssetProviderService(localContexts);

    const tokenIssuanceAuthorizationRequest =
      await assetProviderService.createTokenIssuanceAuthorizationRequest(
        networkId,
        schemaProfileDidDocument,
      );

    // When
    const result =
      await assetProviderService.verifyTokenIssuanceAuthorizationRequest(
        tokenIssuanceAuthorizationRequest,
      );

    // Then
    expect(result.valid).toBe(true);
  });

  it("should fail to verify a TokenIssuanceAuthorizationRequest: Given a tampered TokenIssuanceAuthorizationRequest, When executing verifyTokenIssuanceAuthorizationRequest, Then return an invalid ValidationResult", async () => {
    // Given
    const networkId = "Ethereum";
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
    };
    assetProviderService = new AssetProviderService(localContexts);

    const tokenIssuanceAuthorizationRequest =
      await assetProviderService.createTokenIssuanceAuthorizationRequest(
        networkId,
        schemaProfileDidDocument,
      );

    const tamperedVC = {
      ...tokenIssuanceAuthorizationRequest,
      credentialSubject: {
        ...tokenIssuanceAuthorizationRequest.credentialSubject,
        name: "HACKED-NAME",
      },
    };
    console.debug("Tampered VC:\n", tamperedVC);

    // When & Then
    await expect(
      assetProviderService.verifyTokenIssuanceAuthorizationRequest(tamperedVC),
    ).rejects.toMatchObject({
      type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
      message: expect.stringMatching(
        /invalid signature|proof verification failed/i,
      ),
    });
  });

  // ------------------------------------
  // Tokenized Asset Record
  // ------------------------------------

  it("should create a TokenenizedAssetRecord: Given a valid TokenIssuanceAuthorization, When executing createTokenIssuanceAuthorizationRequest, Then return a valid TokenizedAssetRecord, TokenizedAssetRecordDidDocument and TokenizedAssetRecordVerifiableCredential", async () => {
    // Given
    const tokenIssuanceAuthorization = VALID_TOKEN_ISSUANCE_AUTHORIZATION_TEST;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };
    assetProviderService = new AssetProviderService(localContexts);

    // When
    const {
      tokenizedAssetRecord,
      tokenizedAssetRecordVerifiableCredential,
      tokenizedAssetRecordDidDocument,
    } = await assetProviderService.createTokenizedAssetRecord(
      tokenIssuanceAuthorization,
    );

    // Then
    expect(tokenizedAssetRecord).toBeDefined();
    expect(tokenizedAssetRecordDidDocument).toBeDefined();
    expect(tokenizedAssetRecordVerifiableCredential).toBeDefined();
    expect(tokenizedAssetRecordVerifiableCredential).toHaveProperty("@context");
    expect(tokenizedAssetRecordVerifiableCredential).toHaveProperty("id");
    expect(tokenizedAssetRecordVerifiableCredential).toHaveProperty("type");
    expect(tokenizedAssetRecordVerifiableCredential.type).toContain(
      "VerifiableCredential",
    );
    expect(tokenizedAssetRecordVerifiableCredential.type).toContain(
      "TokenizedAssetRecordVerifiableCredential",
    );
    expect(tokenizedAssetRecordVerifiableCredential).toHaveProperty(
      "credentialSubject",
    );
    expect(tokenizedAssetRecordVerifiableCredential).toHaveProperty("proof");
    expect(tokenizedAssetRecordVerifiableCredential.proof).toHaveProperty(
      "type",
    );
  });

  it("should fail to create a TokenizedAssetRecord: Given an invalid TokenIssuanceAuthorization, When executing createTokenizedAssetRecord, Then should throw an exception", async () => {
    // Given
    const invalidTokenIssuanceAuthorization = null;

    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };

    assetProviderService = new AssetProviderService(localContexts);

    // When & Then
    await expect(
      assetProviderService.createTokenizedAssetRecord(
        invalidTokenIssuanceAuthorization as any,
      ),
    ).rejects.toThrowError(/Missing Required Inputs|Invalid/); // adjust regex if needed
  });

  it("should verify a TokenenizedAssetRecord: Given a valid TokenenizedAssetRecord, When executing verifyTokenenizedAssetRecord, Then return a valid ValidationResult", async () => {
    // Given
    const tokenIssuanceAuthorization = VALID_TOKEN_ISSUANCE_AUTHORIZATION_TEST;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };
    assetProviderService = new AssetProviderService(localContexts);

    const {
      tokenizedAssetRecord,
      tokenizedAssetRecordVerifiableCredential,
      tokenizedAssetRecordDidDocument,
    } = await assetProviderService.createTokenizedAssetRecord(
      tokenIssuanceAuthorization,
    );

    // When
    const result = await assetProviderService.verifyTokenizedAssetRecord(
      tokenizedAssetRecordVerifiableCredential,
    );

    // Then
    expect(result.valid).toBe(true);
  });
});

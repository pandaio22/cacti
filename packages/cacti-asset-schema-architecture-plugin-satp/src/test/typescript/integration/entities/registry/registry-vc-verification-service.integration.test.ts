import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_TEST,
  VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL,
  VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT,
  //VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
} from "../../../constants/constants";
import { ValidationErrorType } from "../../../../../main/typescript/types/asset-schema-architecture-types.type";

import { VcVerificationService } from "../../../../../main/typescript/entities/registry/modules/services/vc-verification-service/implementations/vc-verification-service";

describe("Verifiable Credential (VC) Verification Service", () => {
  const TIMEOUT: number = 50000000;
  let registryVcVerifiableCredentialService: VcVerificationService;

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
    registryVcVerifiableCredentialService = new VcVerificationService();
  }, TIMEOUT);

  afterEach(async () => {
    //placeholder
  }, TIMEOUT);

  afterAll(async () => {
    //Placeholder
  });

  it("should verify an Asset Schema VC: Given a valid Asset Schema VC, When executing verifyAssetSchemaVerifiableCredential, Then return a valid ValidationResult", async () => {
    // Given
    const assetSchemaVerifiableCredential =
      VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;

    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };

    localContexts[assetSchemaDidDocument.id] = assetSchemaDidDocument;
    console.debug("Context Map:\n", localContexts);

    registryVcVerifiableCredentialService = new VcVerificationService(
      localContexts,
    );

    // When
    const result =
      await registryVcVerifiableCredentialService.verifyAssetSchemaVerifiableCredential(
        assetSchemaVerifiableCredential,
      );

    // Then
    expect(result.valid).toBe(true);
  });

  it("should fail to verify an Asset Schema VC: Given a tampered Asset Schema VC, When executing verifyAssetSchemaVerifiableCredential, Then return an invalid ValidationResult", async () => {
    // Given
    const assetSchemaVerifiableCredential =
      VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;

    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };

    localContexts[assetSchemaDidDocument.id] = assetSchemaDidDocument;
    console.debug("Context Map:\n", localContexts);

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

    registryVcVerifiableCredentialService = new VcVerificationService(
      localContexts,
    );

    // When & Then
    await expect(
      registryVcVerifiableCredentialService.verifyAssetSchemaVerifiableCredential(
        tamperedVC,
      ),
    ).rejects.toMatchObject({
      type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
      message: expect.stringMatching(
        /invalid signature|proof verification failed/i,
      ),
    });
  });

  it("should verify a Schema Profile VC: Given a valid Schema Profile VC, When executing verifySchemaProfileVerifiableCredential, Then return a valid ValidationResult", async () => {
    // Given
    const schemaProfileVerifiableCredential =
      VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL;
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };

    localContexts[schemaProfileDidDocument.id] = schemaProfileDidDocument;
    console.debug("Context Map:\n", localContexts);

    registryVcVerifiableCredentialService = new VcVerificationService(
      localContexts,
    );

    // When
    const result =
      await registryVcVerifiableCredentialService.verifySchemaProfileVerifiableCredential(
        schemaProfileVerifiableCredential,
      );

    // Then
    expect(result.valid).toBe(true);
  });

  it("should fail to verify a Schema Profile VC: Given a tampered Schema Profile VC, When executing verifySchemaProfileVerifiableCredential, Then return an invalid ValidationResult", async () => {
    // Given
    const schemaProfileVerifiableCredential =
      VALID_SCHEMA_PROFILE_VERIFIABLE_CREDENTIAL;
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;
    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };

    localContexts[schemaProfileDidDocument.id] = schemaProfileDidDocument;
    console.debug("Context Map:\n", localContexts);

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

    registryVcVerifiableCredentialService = new VcVerificationService(
      localContexts,
    );

    // When & Then
    await expect(
      registryVcVerifiableCredentialService.verifySchemaProfileVerifiableCredential(
        tamperedVC,
      ),
    ).rejects.toMatchObject({
      type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
      message: expect.stringMatching(
        /invalid signature|proof verification failed/i,
      ),
    });
  });

  it("should verify a Token Issuance Authorization: Given a valid Token Issuance Authorization VC, When executing verifyTokenIssuanceAuthorization, Then return a valid ValidationResult", async () => {
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
    };

    registryVcVerifiableCredentialService = new VcVerificationService(
      localContexts,
    );

    // When
    const result =
      await registryVcVerifiableCredentialService.verifyTokenIssuanceAuthorization(
        tokenIssuanceAuthorization,
      );

    // Then
    expect(result.valid).toBe(true);
  });

  it("should fail to verify a Token Issuance Authorization: Given a tampered Token Issuance Authorization VC, When executing verifyTokenIssuanceAuthorization, Then return an invalid ValidationResult", async () => {
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
    };

    registryVcVerifiableCredentialService = new VcVerificationService(
      localContexts,
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
      registryVcVerifiableCredentialService.verifyTokenIssuanceAuthorization(
        tamperedVC,
      ),
    ).rejects.toMatchObject({
      type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
      message: expect.stringMatching(
        /invalid signature|proof verification failed/i,
      ),
    });
  });

  it("should verify an Tokenized Asset Record VC: Given a valid Tokenized Asset Record VC, When executing verifyTokenizedAssetRecordVerifiableCredential, Then return a valid ValidationResult", async () => {
    // Given
    const tokenizedAssetRecordVerifiableCredential =
      VALID_TOKENIZED_ASSET_RECORD_VERIFIABLE_CREDENTIAL;
    const tokenizedAssetRecordDidDocument =
      VALID_TOKENIZED_ASSET_RECORD_DID_DOCUMENT;

    const localContexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };

    localContexts[tokenizedAssetRecordDidDocument.id] =
      tokenizedAssetRecordDidDocument;
    console.debug("Context Map:\n", localContexts);

    registryVcVerifiableCredentialService = new VcVerificationService(
      localContexts,
    );

    // When
    const result =
      await registryVcVerifiableCredentialService.verifyAssetSchemaVerifiableCredential(
        tokenizedAssetRecordVerifiableCredential,
      );

    // Then
    expect(result.valid).toBe(true);
  });

  it("should fail to verify an Tokenized Asset Record VC: Given a tampered Tokenized Asset Record VC, When executing verifyTokenizedAssetRecordVerifiableCredential, Then return an invalid ValidationResult", async () => {
    // Given
    const assetSchemaVerifiableCredential =
      VALID_ASSET_SCHEMA_VERIFIABLE_CREDENTIAL;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;

    const localContexts: Record<string, any> = {
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };

    localContexts[assetSchemaDidDocument.id] = assetSchemaDidDocument;
    console.debug("Context Map:\n", localContexts);

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

    registryVcVerifiableCredentialService = new VcVerificationService(
      localContexts,
    );

    // When & Then
    await expect(
      registryVcVerifiableCredentialService.verifyAssetSchemaVerifiableCredential(
        tamperedVC,
      ),
    ).rejects.toMatchObject({
      type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
      message: expect.stringMatching(
        /invalid signature|proof verification failed/i,
      ),
    });
  });
});

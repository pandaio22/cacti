import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";

import {
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
} from "../../../constants/constants";

import { AssetSchemaAuthorityService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/asset-schema-authority-service/implementations/asset-schema-authority-service";
import { ValidationErrorDetail } from "../../../../../main/typescript/types/asset-schema-architecture-types.type";

describe("Asset Schema Authority Service", () => {
  const TIMEOUT: number = 50000000;
  let assetSchemaAuthorityService: AssetSchemaAuthorityService;

  /***********************************************CONTEXT SETUP*/
  const didV1Context = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../../json-ld/contexts/did-v1.jsonld"),
      "utf-8",
    ),
  );
  const didV1ContextAssetSchema = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/asset-schema-did-document-added.jsonld",
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
    // Placeholder
  });

  beforeEach(async () => {
    assetSchemaAuthorityService = new AssetSchemaAuthorityService();
  }, TIMEOUT);

  afterEach(async () => {
    // Placeholder
  }, TIMEOUT);

  afterAll(async () => {
    // Placeholder
  });

  // ------------------------
  // certifyAssetSchema
  // ------------------------
  it("should certify an Asset Schema: Given a valid Asset Schema and DID Document, When executing certifyAssetSchema, Then return a valid CommissionedAssetSchema", async () => {
    // Given
    const assetSchema = VALID_ASSET_SCHEMA_EXAMPLE;
    const assetSchemaDidDocument = VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE;

    const localContextsMap: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.example.org/ns/did/v1/asset-schema": didV1ContextAssetSchema,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      //"https://www.w3.org/ns/credentials/v2": verifiableCredentialsContext,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      //"did:example:123456789abcdefghi#": assetSchemaContext,
      "https://www.example.org/asset-schema/vc/v1":
        assetSchemaVerifiableCredentialContext,
    };
    assetSchemaAuthorityService = new AssetSchemaAuthorityService(
      localContextsMap,
    );

    // When
    const commissionedAssetSchema =
      await assetSchemaAuthorityService.certifyAssetSchema(
        assetSchema,
        assetSchemaDidDocument,
      );

    // Then
    expect(commissionedAssetSchema).toBeDefined();

    expect(commissionedAssetSchema).toHaveProperty("@context");
    expect(commissionedAssetSchema).toHaveProperty("id");
    expect(commissionedAssetSchema).toHaveProperty("type");
    expect(commissionedAssetSchema.type).toContain("VerifiableCredential");
    expect(commissionedAssetSchema.type).toContain(
      "AssetSchemaVerifiableCredential",
    );
    expect(commissionedAssetSchema).toHaveProperty("issuer");
    expect(commissionedAssetSchema).toHaveProperty("issuanceDate");

    expect(commissionedAssetSchema).toHaveProperty("credentialSubject");

    expect(commissionedAssetSchema).toHaveProperty("proof");
    expect(commissionedAssetSchema.proof).toHaveProperty("type");
    expect(commissionedAssetSchema.proof).toHaveProperty("verificationMethod");
    expect(commissionedAssetSchema.proof).toHaveProperty("created");
    expect(commissionedAssetSchema.proof).toHaveProperty("proofPurpose");
    expect(commissionedAssetSchema.proof).toHaveProperty("proofValue");
  });

  it("should fail to certify an Asset Schema: Given invalid inputs, When executing certifyAssetSchema, Then should throw ValidationErrorDetail", async () => {
    // Given
    const invalidAssetSchema = { ...VALID_ASSET_SCHEMA_EXAMPLE, name: null };
    const invalidDidDocument = {
      ...VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
      id: null,
    };

    // When & Then
    await expect(
      assetSchemaAuthorityService.certifyAssetSchema(
        invalidAssetSchema as any,
        invalidDidDocument as any,
      ),
    ).rejects.toMatchObject({
      type: "CERTIFY_ASSET_SCHEMA_ERROR",
    });
  });

  // ------------------------
  // certifySchemaProfile
  // ------------------------
  it("should certify an Schema Profile: Given a valid Schema Profile and DID Document, When executing certifySchemaProfile, Then return a valid CommissionedSchemaProfile", async () => {
    // Given
    const schemaProfile = VALID_SCHEMA_PROFILE_EXAMPLE;
    const schemaProfileDidDocument = VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE;

    const localContextsMap: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://www.w3.org/2018/credentials/v1":
        verifiableCredentialsContextTest,
      "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
      "https://www.example.org/schema-profile/vc/v1":
        schemaProfileVerifiableCredentialContext,
      "did:example:123456789abcdefghi#": assetSchemaContext,
    };
    assetSchemaAuthorityService = new AssetSchemaAuthorityService(
      localContextsMap,
    );

    // When
    const commissionedSchemaProfile =
      await assetSchemaAuthorityService.certifySchemaProfile(
        schemaProfile,
        schemaProfileDidDocument,
      );

    // Then
    expect(commissionedSchemaProfile).toBeDefined();

    expect(commissionedSchemaProfile).toHaveProperty("@context");
    expect(commissionedSchemaProfile).toHaveProperty("id");
    expect(commissionedSchemaProfile).toHaveProperty("type");
    expect(commissionedSchemaProfile.type).toContain("VerifiableCredential");
    expect(commissionedSchemaProfile.type).toContain(
      "SchemaProfileVerifiableCredential",
    );
    expect(commissionedSchemaProfile).toHaveProperty("issuer");
    expect(commissionedSchemaProfile).toHaveProperty("issuanceDate");

    expect(commissionedSchemaProfile).toHaveProperty("credentialSubject");

    expect(commissionedSchemaProfile).toHaveProperty("proof");
    expect(commissionedSchemaProfile.proof).toHaveProperty("type");
    expect(commissionedSchemaProfile.proof).toHaveProperty(
      "verificationMethod",
    );
    expect(commissionedSchemaProfile.proof).toHaveProperty("created");
    expect(commissionedSchemaProfile.proof).toHaveProperty("proofPurpose");
    expect(commissionedSchemaProfile.proof).toHaveProperty("proofValue");
  });

  it("should fail to certify an Schema Profile: Given invalid inputs, When executing certifySchemaProfile, Then should throw ValidationErrorDetail", async () => {
    // Given
    const invalidSchemaProfile = {
      ...VALID_SCHEMA_PROFILE_EXAMPLE,
      name: null,
    };
    const invalidDidDocument = {
      ...VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
      id: null,
    };

    // When & Then
    await expect(
      assetSchemaAuthorityService.certifySchemaProfile(
        invalidSchemaProfile as any,
        invalidDidDocument as any,
      ),
    ).rejects.toMatchObject({
      type: "CERTIFY_SCHEMA_PROFILE_ERROR",
    });
  });

  // ---------------------------------
  // requestTokenIssuanceAuthorization
  // ---------------------------------
});

import fs from "fs";
import path from "path";

import {
  INVALID_JSON_EXAMPLE,
  VALID_JSON_LD_EXAMPLE,
  INVALID_JSON_LD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  INVALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
  INVALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
  VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION,
} from "../../../constants/constants";
import { ValidationService } from "../../../../../main/typescript/entities/registry/modules/services/validation-service/implementations/validation-service";

describe("Registry Validation Service", () => {
  const TIMEOUT: number = 50000000;
  let registryValidationService: ValidationService;

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
  const assetProviderContext = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../json-ld/contexts/asset-provider-certificate.jsonld",
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
    registryValidationService = new ValidationService();
  }, TIMEOUT);

  it("should validate JSON syntax: Given a valid JSON, When executing validateJson and validateJson, Then return Valid", async () => {
    //Given: Valid JSON-LD example
    //When
    const result = await registryValidationService.validateJson(
      VALID_JSON_LD_EXAMPLE,
    );
    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail JSON syntax validation: Given an invalid JSON, When executing validateJson and validateJsonSyntax, Then return Invalid", async () => {
    //Given: Invalid JSON-LD example
    //When
    const result =
      await registryValidationService.validateJson(INVALID_JSON_EXAMPLE);
    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate JSON-LD syntax: Given a valid JSON-LD, When executing validateJson and validateJsonLdSyntax, Then return Valid", async () => {
    //Given: Valid JSON-LD example

    //When
    const result = await registryValidationService.validateJsonLdSyntax(
      VALID_JSON_LD_EXAMPLE,
    );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail JSON-LD syntax validation: Given an invalid JSON-LD, When executing validateJson and validateJsonLdSyntax, Then return Invalid", async () => {
    //Given: Invalid JSON-LD example
    //When
    const result = await registryValidationService.validateJsonLdSyntax(
      INVALID_JSON_LD_EXAMPLE,
    );
    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Asset Schema: Given a valid Asset Schema, When executing validateAssetSchema, Then return Valid", async () => {
    // Given
    registryValidationService = new ValidationService();

    // When
    const result = await registryValidationService.validateAssetSchema(
      VALID_ASSET_SCHEMA_EXAMPLE,
    );

    // Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Asset Schema validation: Given an invalid Asset Schema, When executing validateAssetSchema, Then return Invalid", async () => {
    // Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://example.org/AssetSchemaAuthority":
        assetSchemaAuthorityCertificateContext,
    };
    registryValidationService = new ValidationService(contexts);

    // When
    const result = await registryValidationService.validateAssetSchema(
      null as unknown as typeof VALID_ASSET_SCHEMA_EXAMPLE,
    );

    // Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Signed Asset Schema: Given a valid signed Asset Schema, When executing validateAssetSchema, Then return Valid", async () => {
    //Given
    registryValidationService = new ValidationService();

    //When
    const result = await registryValidationService.validateSignedAssetSchema(
      VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
    );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Signed Asset Schema validation: Given an invalid signed Asset Schema, When executing validateAssetSchema, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://example.org/AssetSchemaAuthority":
        assetSchemaAuthorityCertificateContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };
    registryValidationService = new ValidationService(contexts);

    //When
    const result = await registryValidationService.validateSignedAssetSchema(
      null as unknown as typeof VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
    );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Schema Profile: Given a valid Schema Profile, When executing validateSchemaProfile, Then return Valid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "did:example:123456789abcdefghi#": assetSchemaContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };

    registryValidationService = new ValidationService(contexts);

    //When
    const result = await registryValidationService.validateSchemaProfile(
      VALID_SCHEMA_PROFILE_EXAMPLE,
    );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Schema Profile validation: Given an invalid Schema Profile, When executing validateSchemaProfile, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "did:example:123456789abcdefghi#": assetSchemaContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };

    registryValidationService = new ValidationService(contexts);

    //When
    const result = await registryValidationService.validateSchemaProfile(
      null as unknown as typeof VALID_SCHEMA_PROFILE_EXAMPLE,
    );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Signed Schema Profile: Given a valid signed Schema Profile, When executing validateSchemaProfile, Then return Valid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "did:example:123456789abcdefghi#": assetSchemaContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };

    registryValidationService = new ValidationService(contexts);

    //When
    const result = await registryValidationService.validateSignedSchemaProfile(
      VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
    );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Signed Schema Profile validation: Given an invalid signed Schema Profile, When executing validateSchemaProfile, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "did:example:123456789abcdefghi#": assetSchemaContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };

    registryValidationService = new ValidationService(contexts);

    //When
    const result = await registryValidationService.validateSignedSchemaProfile(
      null as unknown as typeof VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
    );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Tokenized Asset Record: Given a valid Tokenized Asset Record, When executing validateTokenizedAssetRecord, Then return Valid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };

    registryValidationService = new ValidationService(contexts);

    //When
    const result = await registryValidationService.validateTokenizedAssetRecord(
      VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
    );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Tokenized Asset Record validation: Given an invalid Tokenized Asset Record, When executing validateTokenizedAssetRecord, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "did:example:123456789abcdefghi#": assetSchemaContext,
      "did:example:56745689abcdefghi#": schemaProfileContext,
    };

    registryValidationService = new ValidationService(contexts);

    //When
    const result = await registryValidationService.validateTokenizedAssetRecord(
      null as unknown as typeof VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
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

    registryValidationService = new ValidationService(contexts);

    //When
    const result =
      await registryValidationService.validateTokenIssuanceAuthorization(
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

    registryValidationService = new ValidationService(contexts);

    //When
    const result =
      await registryValidationService.validateTokenIssuanceAuthorization(
        null as unknown as typeof VALID_TOKEN_ISSUANCE_AUTHORIZATION,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Asset Schema Authority Certificate: Given a valid Asset Schema Authority Certificate, When executing validateAssetSchemaAuthorityCertificate, Then return Valid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://example.org/AssetSchemaAuthority":
        assetSchemaAuthorityCertificateContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };
    registryValidationService = new ValidationService(contexts);

    //When
    const result =
      await registryValidationService.validateAssetSchemaAuthorityCertificate(
        VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Asset Schema Authority Certificate validation: Given an invalid Asset Schema Authority Certificate, When executing validateAssetSchemaAuthorityCertificate, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://example.org/AssetSchemaAuthority":
        assetSchemaAuthorityCertificateContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };
    registryValidationService = new ValidationService(contexts);

    //When
    const result =
      await registryValidationService.validateAssetSchemaAuthorityCertificate(
        INVALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Asset Provider Certificate: Given a valid Asset Provider Certificate, When executing validateAssetProviderCertificate, Then return Valid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://example.org/AssetProvider": assetProviderContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };
    registryValidationService = new ValidationService(contexts);

    //When
    const result =
      await registryValidationService.validateAssetProviderCertificate(
        VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail Asset Provider Certificate validation: Given an invalid Asset Provider Certificate, When executing validateAssetProviderCertificate, Then return Invalid", async () => {
    //Given
    const contexts: Record<string, any> = {
      "https://www.w3.org/ns/did/v1": didV1Context,
      "https://example.org/AssetProvider": assetProviderContext,
      //"https://example.com/context/asset-schema": require("./contexts/asset-schema.jsonld"),
    };
    registryValidationService = new ValidationService(contexts);

    //When
    const result =
      await registryValidationService.validateAssetProviderCertificate(
        INVALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
      );

    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });
});

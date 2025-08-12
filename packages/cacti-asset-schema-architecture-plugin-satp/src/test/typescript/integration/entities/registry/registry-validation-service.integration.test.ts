import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { Configuration } from "@hyperledger/cactus-core-api";
import { after } from "node:test";
import fs from "fs";
import path from "path";

import {
  INVALID_JSON_EXAMPLE,
  VALID_JSON_LD_EXAMPLE,
  INVALID_JSON_LD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
  VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
  VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_CERTIFICATE_EXAMPLE,
  VALID_ASSET_PROVIDER_CERTIFICATE_EXAMPLE,
} from "../../../constants/constants";
import { createCustomLoader } from "../../../../../main/typescript/utils/custom-loader";
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

  beforeAll(async () => {});

  beforeEach(async () => {
    registryValidationService = new ValidationService();
  }, TIMEOUT);

  afterEach(async () => {
    //placeholder
  }, TIMEOUT);

  afterAll(async () => {
    //Placeholder
  });
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

  it("should validate JSON-LD semantics: Given a semantically correct JSON-LD, When executing validateJsonLdSemantics, Then return Valid", async () => {
    //Given: Valid JSON-LD example
    //When
    const result = await registryValidationService.validateJsonLdSemantics(
      VALID_JSON_LD_EXAMPLE,
    );
    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.details).toBeDefined();
  });

  it("should fail JSON-LD semantics validation: Given a semantically incorrect JSON-LD, When executing validateJsonLdSemantics, Then return Invalid", async () => {
    //Given: Invalid JSON-LD example
    //When
    const result = await registryValidationService.validateJsonLdSemantics(
      INVALID_JSON_LD_EXAMPLE,
    );
    //Then
    console.debug("Validation Result:", result);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.details).toBeDefined();
  });

  it("should validate Asset Schema: Given a valid signed Asset Schema, When executing validateAssetSchema, Then return Valid", async () => {
    // TODO: implement passing test
  });

  it("should fail Asset Schema validation: Given an invalid signed Asset Schema, When executing validateAssetSchema, Then return Invalid", async () => {
    // TODO: implement failing test
  });

  it("should validate Schema Profile: Given a valid signed Schema Profile, When executing validateSchemaProfile, Then return Valid", async () => {
    // TODO: implement passing test
  });

  it("should fail Schema Profile validation: Given an invalid signed Schema Profile, When executing validateSchemaProfile, Then return Invalid", async () => {
    // TODO: implement failing test
  });

  it("should validate Tokenized Asset Record: Given a valid Tokenized Asset Record, When executing validateTokenizedAssetRecord, Then return Valid", async () => {
    // TODO: implement passing test
  });

  it("should fail Tokenized Asset Record validation: Given an invalid Tokenized Asset Record, When executing validateTokenizedAssetRecord, Then return Invalid", async () => {
    // TODO: implement failing test
  });

  it("should validate Token Issuance Authorization: Given a valid Token Issuance Authorization, When executing validateTokenIssuanceAuthorization, Then return Valid", async () => {
    // TODO: implement passing test
  });

  it("should fail Token Issuance Authorization validation: Given an invalid Token Issuance Authorization, When executing validateTokenIssuanceAuthorization, Then return Invalid", async () => {
    // TODO: implement failing test
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
    // TODO: implement failing test
  });

  it("should validate Asset Provider Certificate: Given a valid Asset Provider Certificate, When executing validateAssetProviderCertificate, Then return Valid", async () => {
    // TODO: implement passing test
  });

  it("should fail Asset Provider Certificate validation: Given an invalid Asset Provider Certificate, When executing validateAssetProviderCertificate, Then return Invalid", async () => {
    // TODO: implement failing test
  });
});

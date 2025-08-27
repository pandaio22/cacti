import jsonld from "jsonld";
import {
  AssetSchema,
  TokenIssuanceAuthorization,
  TokenIssuanceAuthorizationRequest,
  SchemaProfile,
  AssetSchemaAuthorityCertificate,
  AssetProviderCertificate,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import {
  ValidationErrorDetail,
  ValidationErrorType,
  ValidationResult,
} from "../../../../../../types/asset-schema-architecture-types.type";
import { createCustomLoader } from "../../../../../../utils/custom-loader";
import { IValidationService } from "../interfaces/validation-service.interface";

export class ValidationService implements IValidationService {
  private localContexts: Record<string, any> | undefined;

  constructor(localContexts?: Record<string, any>) {
    this.localContexts = localContexts;

    if (this.localContexts) {
      (jsonld as any).documentLoader = createCustomLoader(this.localContexts);
    }
  }

  public async validateJsonLdSyntax(
    jsonLdObject: any,
  ): Promise<ValidationResult> {
    try {
      const expandedJsonld = await jsonld.expand(jsonLdObject);

      console.debug(JSON.stringify(expandedJsonld, null, 3));
      if (!expandedJsonld || expandedJsonld.length === 0) {
        throw new Error("Expanded JSON-LD is empty or invalid.");
      }

      return {
        valid: true,
        details: "JSON-LD syntax is valid",
      };
    } catch (error: any) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.PARSING_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errorDetail],
        details: `JSON-LD syntax error: ${error.message}`,
      };
    }
  }

  public async validateAssetSchema(
    assetSchema: AssetSchema,
  ): Promise<ValidationResult> {
    try {
      console.debug("Validating Asset Schema:", assetSchema);

      if (!assetSchema) {
        throw new Error("Asset Schema is missing in signed asset schema.");
      }

      // Validate @context object structure (if applicable)
      if (
        typeof assetSchema["@context"] === "object" &&
        !Array.isArray(assetSchema["@context"])
      ) {
        const ctx = assetSchema["@context"];
        const requiredContextKeys = [
          "@version",
          "fungible",
          "facets",
          "organization_key",
        ];
        const missingCtxKeys = requiredContextKeys.filter(
          (key) => !(key in ctx),
        );

        if (missingCtxKeys.length > 0) {
          throw new Error(
            `@context object is missing keys: ${missingCtxKeys.join(", ")}`,
          );
        }
      }

      return {
        valid: true,
        details: "Asset Schema passed semantic validation.",
      };
    } catch (error: any) {
      const errDetail: ValidationErrorDetail = {
        type: ValidationErrorType.SEMANTIC_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errDetail],
        details: `Validation failed: ${error.message}`,
      };
    }
  }

  public async validateSchemaProfile(
    schemaProfile: SchemaProfile,
  ): Promise<ValidationResult> {
    try {
      console.debug("Validating Schema Profile:", schemaProfile);
      if (!schemaProfile) {
        throw new Error("Schema Profile is missing in signed asset schema.");
      }

      const syntaxResult = await this.validateJsonLdSyntax(schemaProfile);

      if (!syntaxResult.valid) {
        return syntaxResult;
      }

      return {
        valid: true,
        details: "Schema Profile semantics are valid",
      };
    } catch (error: any) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.SEMANTIC_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errorDetail],
        details: `Validation error: ${error.message}`,
      };
    }
  }

  public async validateTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<ValidationResult> {
    try {
      console.debug(
        "Validating Token Issuance Authorization:",
        tokenIssuanceAuthorization,
      );
      if (!tokenIssuanceAuthorization) {
        throw new Error("tokenIssuanceAuthorization is missing.");
      }

      const syntaxResult = await this.validateJsonLdSyntax(
        tokenIssuanceAuthorization,
      );

      if (!syntaxResult.valid) {
        return syntaxResult;
      }

      return {
        valid: true,
        details: "Tokenized Issuance Authorization semantics are valid",
      };
    } catch (error: any) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.SEMANTIC_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errorDetail],
        details: `Validation error: ${error.message}`,
      };
    }
  }

  public async validateTokenIssuanceAuthorizationRequest(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<ValidationResult> {
    try {
      console.debug(
        "Validating Token Issuance Authorization Request:",
        tokenIssuanceAuthorizationRequest,
      );
      if (!tokenIssuanceAuthorizationRequest) {
        throw new Error("tokenIssuanceAuthorizationRequest is missing.");
      }

      const syntaxResult = await this.validateJsonLdSyntax(
        tokenIssuanceAuthorizationRequest,
      );

      if (!syntaxResult.valid) {
        return syntaxResult;
      }

      return {
        valid: true,
        details: "Tokenized Issuance Authorization Request semantics are valid",
      };
    } catch (error: any) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.SEMANTIC_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errorDetail],
        details: `Validation error: ${error.message}`,
      };
    }
  }

  public async validateDidDocument(
    didDocument: any,
  ): Promise<ValidationResult> {
    try {
      const syntaxResult = await this.validateJsonLdSyntax(didDocument);

      if (!syntaxResult.valid) {
        return syntaxResult;
      }
      // 1. Basic DID semantic validation (reuse or inline)
      if (!didDocument["@context"]) {
        throw new Error("Missing '@context' in DID Document.");
      }

      if (
        !didDocument.id ||
        !/^did:[a-z0-9]+:[a-zA-Z0-9.\-_:%]+$/.test(didDocument.id)
      ) {
        throw new Error("Invalid or missing DID in 'id' field.");
      }

      // Check allowed properties - you can customize this list
      const allowedProps = new Set([
        "@context",
        "id",
        "type",
        "verificationMethod",
        "authentication",
        "assertionMethod",
        "keyAgreement",
        "capabilityInvocation",
        "capabilityDelegation",
        "service",
        "controller",
        "alsoKnownAs",
      ]);
      const invalidProps = Object.keys(didDocument).filter(
        (p) => !allowedProps.has(p),
      );
      if (invalidProps.length > 0) {
        throw new Error(
          `Invalid top-level properties: ${invalidProps.join(", ")}`,
        );
      }

      // 2. Check "type" field exact match
      /*if (!didDocument.type || didDocument.type !== "AssetSchemaArchitecture") {
        throw new Error(
          `Missing or invalid 'type' field. Expected 'AssetSchemaArchitecture'`,
        );
      }*/

      // 3. Verify verificationMethod semantics if present
      if (didDocument.verificationMethod) {
        if (!Array.isArray(didDocument.verificationMethod)) {
          throw new Error("'verificationMethod' must be an array.");
        }
        for (const vm of didDocument.verificationMethod) {
          if (!vm.id || !vm.type || !vm.controller) {
            throw new Error(
              `Verification method missing required fields: ${JSON.stringify(vm)}`,
            );
          }
        }
      }

      // Additional domain-specific checks can go here...

      return {
        valid: true,
        details: "Asset Schema Authority Certificate semantics are valid",
      };
    } catch (error: any) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.SEMANTIC_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errorDetail],
        details: `Validation error: ${error.message}`,
      };
    }
  }

  public async validateAssetSchemaAuthorityCertificate(
    assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate,
  ): Promise<ValidationResult> {
    try {
      const syntaxResult = await this.validateJsonLdSyntax(
        assetSchemaAuthorityCertificate,
      );

      if (!syntaxResult.valid) {
        return syntaxResult;
      }
      // 1. Basic DID semantic validation (reuse or inline)
      if (!assetSchemaAuthorityCertificate["@context"]) {
        throw new Error("Missing '@context' in DID Document.");
      }

      if (
        !assetSchemaAuthorityCertificate.id ||
        !/^did:[a-z0-9]+:[a-zA-Z0-9.\-_:%]+$/.test(
          assetSchemaAuthorityCertificate.id,
        )
      ) {
        throw new Error("Invalid or missing DID in 'id' field.");
      }

      // Check allowed properties - you can customize this list
      const allowedProps = new Set([
        "@context",
        "id",
        "entity",
        "name",
        "description",
        "verificationMethod",
        "authentication",
        "assertionMethod",
        "keyAgreement",
        "capabilityInvocation",
        "capabilityDelegation",
        "service",
        "controller",
        "alsoKnownAs",
      ]);
      const invalidProps = Object.keys(assetSchemaAuthorityCertificate).filter(
        (p) => !allowedProps.has(p),
      );
      if (invalidProps.length > 0) {
        throw new Error(
          `Invalid top-level properties: ${invalidProps.join(", ")}`,
        );
      }

      // 2. Check "entity" field exact match
      console.debug(
        "Asset Schema Authority Certificate:",
        assetSchemaAuthorityCertificate,
      );
      if (
        !assetSchemaAuthorityCertificate.entity ||
        assetSchemaAuthorityCertificate.entity !== "AssetSchemaAuthority"
      ) {
        throw new Error(
          `Missing or invalid 'entity' field. Expected 'AssetSchemaAuthority'`,
        );
      }

      // 3. Verify verificationMethod semantics if present
      if (assetSchemaAuthorityCertificate.verificationMethod) {
        if (
          !Array.isArray(assetSchemaAuthorityCertificate.verificationMethod)
        ) {
          throw new Error("'verificationMethod' must be an array.");
        }
        for (const vm of assetSchemaAuthorityCertificate.verificationMethod) {
          if (!vm.id || !vm.type || !vm.controller) {
            throw new Error(
              `Verification method missing required fields: ${JSON.stringify(vm)}`,
            );
          }
        }
      }

      // Additional domain-specific checks can go here...

      return {
        valid: true,
        details: "Asset Schema Authority Certificate semantics are valid",
      };
    } catch (error: any) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.SEMANTIC_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errorDetail],
        details: `Validation error: ${error.message}`,
      };
    }
  }

  public async validateAssetProviderCertificate(
    assetProviderCertificate: AssetProviderCertificate,
  ): Promise<ValidationResult> {
    try {
      const syntaxResult = await this.validateJsonLdSyntax(
        assetProviderCertificate,
      );

      if (!syntaxResult.valid) {
        return syntaxResult;
      }
      // 1. Basic DID semantic validation (reuse or inline)
      if (!assetProviderCertificate["@context"]) {
        throw new Error("Missing '@context' in DID Document.");
      }

      if (
        !assetProviderCertificate.id ||
        !/^did:[a-z0-9]+:[a-zA-Z0-9.\-_:%]+$/.test(assetProviderCertificate.id)
      ) {
        throw new Error("Invalid or missing DID in 'id' field.");
      }

      // Check allowed properties - you can customize this list
      const allowedProps = new Set([
        "@context",
        "id",
        "entity",
        "name",
        "description",
        "verificationMethod",
        "authentication",
        "assertionMethod",
        "keyAgreement",
        "capabilityInvocation",
        "capabilityDelegation",
        "service",
        "controller",
        "alsoKnownAs",
      ]);
      const invalidProps = Object.keys(assetProviderCertificate).filter(
        (p) => !allowedProps.has(p),
      );
      if (invalidProps.length > 0) {
        throw new Error(
          `Invalid top-level properties: ${invalidProps.join(", ")}`,
        );
      }

      // 2. Check "entity" field exact match
      console.debug("Asset Provider Certificate:", assetProviderCertificate);
      if (
        !assetProviderCertificate.entity ||
        assetProviderCertificate.entity !== "AssetProvider"
      ) {
        throw new Error(
          `Missing or invalid 'entity' field. Expected 'AssetProvider'`,
        );
      }

      // 3. Verify verificationMethod semantics if present
      if (assetProviderCertificate.verificationMethod) {
        if (!Array.isArray(assetProviderCertificate.verificationMethod)) {
          throw new Error("'verificationMethod' must be an array.");
        }
        for (const vm of assetProviderCertificate.verificationMethod) {
          if (!vm.id || !vm.type || !vm.controller) {
            throw new Error(
              `Verification method missing required fields: ${JSON.stringify(vm)}`,
            );
          }
        }
      }

      // Additional domain-specific checks can go here...

      return {
        valid: true,
        details: "Asset Provider Certificate semantics are valid",
      };
    } catch (error: any) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.SEMANTIC_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errorDetail],
        details: `Validation error: ${error.message}`,
      };
    }
  }
}

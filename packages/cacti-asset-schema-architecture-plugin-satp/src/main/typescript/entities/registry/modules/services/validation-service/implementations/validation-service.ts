import jsonld from "jsonld";
import {
  SignedAssetSchema,
  TokenIssuanceAuthorization,
  TokenizedAssetRecord,
  SignedSchemaProfile,
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

  public async validateJson(jsonInput: any): Promise<ValidationResult> {
    try {
      // If input is string, parse it; if object, stringify and parse again to confirm validity
      const jsonString =
        typeof jsonInput === "string" ? jsonInput : JSON.stringify(jsonInput);

      const parsedJson = JSON.parse(jsonString);
      console.debug("Parsed JSON:", parsedJson);

      if (typeof parsedJson !== "object" || parsedJson === null) {
        throw new Error("Parsed value is not a valid JSON object or array.");
      }
      return {
        valid: true,
        details: "JSON syntax is valid",
      };
    } catch (error: any) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.PARSING_ERROR,
        message: error.message,
      };
      return {
        valid: false,
        errors: [errorDetail],
        details: `JSON syntax error: ${error.message}`,
      };
    }
  }

  public async validateJsonLdSyntax(
    jsonLdObject: any,
  ): Promise<ValidationResult> {
    try {
      const expandedJsonld = await jsonld.expand(jsonLdObject);
      console.debug("Expanded JSON-LD:", expandedJsonld);
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

  public async validateJsonLdSemantics(
    jsonLdObject: any,
  ): Promise<ValidationResult> {
    try {
      const expandedJsonld = await jsonld.expand(jsonLdObject);
      console.debug("Expanded JSON-LD:", expandedJsonld);
      if (!expandedJsonld || expandedJsonld.length === 0) {
        throw new Error("Expanded JSON-LD is empty or invalid.");
      }

      const nquads = await jsonld.toRDF(jsonLdObject, {
        format: "application/n-quads",
      });
      console.debug("JSON-LD to RDF:", nquads);

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
    signedAssetSchema: SignedAssetSchema,
  ): Promise<ValidationResult> {
    // Placeholder for Asset Schema validation logic
    return {
      valid: true,
      details: signedAssetSchema, // Example detail, could be expanded
    };
  }

  public async validateSchemaProfile(
    signedSchemaProfile: SignedSchemaProfile,
  ): Promise<ValidationResult> {
    // Placeholder for Schema Profile validation logic
    return {
      valid: true,
      details: signedSchemaProfile, // Example detail, could be expanded
    };
  }

  public async validateTokenizedAssetRecord(
    tokenizedAssetRecord: TokenizedAssetRecord,
  ): Promise<ValidationResult> {
    // Placeholder for Tokenized Asset Record validation logic
    return {
      valid: true,
      details: tokenizedAssetRecord, // Example detail, could be expanded
    };
  }

  public async validateTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<ValidationResult> {
    // Placeholder for Token Issuance Authorization validation logic
    return {
      valid: true,
      details: tokenIssuanceAuthorization, // Example detail, could be expanded
    };
  }

  public async validateDidDocument(
    assetSchemaAuthorityCertificate: any,
  ): Promise<ValidationResult> {
    try {
      if (
        !(await this.validateJsonLdSyntax(assetSchemaAuthorityCertificate))
          .valid
      ) {
        throw new Error(
          "Invalid JSON-LD syntax in Asset Schema Authority Certificate.",
        );
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
      const invalidProps = Object.keys(assetSchemaAuthorityCertificate).filter(
        (p) => !allowedProps.has(p),
      );
      if (invalidProps.length > 0) {
        throw new Error(
          `Invalid top-level properties: ${invalidProps.join(", ")}`,
        );
      }

      // 2. Check "type" field exact match
      if (
        !assetSchemaAuthorityCertificate.type ||
        assetSchemaAuthorityCertificate.type !== "AssetSchemaArchitecture"
      ) {
        throw new Error(
          `Missing or invalid 'type' field. Expected 'AssetSchemaArchitecture'`,
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

  public async validateAssetSchemaAuthorityCertificate(
    assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate,
  ): Promise<ValidationResult> {
    try {
      if (
        !(await this.validateJsonLdSyntax(assetSchemaAuthorityCertificate))
          .valid
      ) {
        throw new Error(
          "Invalid JSON-LD syntax in Asset Schema Authority Certificate.",
        );
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
    // Placeholder for Asset Provider Certificate validation logic
    return {
      valid: true,
      details: assetProviderCertificate, // Example detail, could be expanded
    };
  }
}

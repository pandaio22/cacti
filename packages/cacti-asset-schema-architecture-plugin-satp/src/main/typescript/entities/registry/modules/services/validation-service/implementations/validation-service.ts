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
import { IValidationService } from "../interfaces/validation-service.interface";

export class ValidationService implements IValidationService {
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
  public async validateAssetSchemaAuthorityCertificate(
    assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate,
  ): Promise<ValidationResult> {
    // Placeholder for Asset Schema Authority Certificate validation logic
    return {
      valid: true,
      details: assetSchemaAuthorityCertificate, // Example detail, could be expanded
    };
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

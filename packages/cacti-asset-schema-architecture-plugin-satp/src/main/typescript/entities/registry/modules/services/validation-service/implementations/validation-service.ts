import jsonld from "jsonld";
import {
  AssetSchema,
  SignedAssetSchema,
  TokenIssuanceAuthorization,
  TokenizedAssetRecord,
  SchemaProfile,
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

/**
 * ValidationService
 * -----------------
 * Provides a collection of validation methods for different types of JSON/JSON-LD
 * structures such as schemas, profiles, certificates, and DID documents.
 *
 * This service ensures:
 *  - Basic JSON syntax validation
 *  - JSON-LD syntax validation (via expansion)
 *  - Semantic validation of expected fields in domain-specific assets
 *  - Consistent error reporting through ValidationResult objects
 */
export class ValidationService implements IValidationService {
  private localContexts: Record<string, any> | undefined;

  /**
   * Constructor
   * Optionally accepts local JSON-LD contexts to be injected into the
   * JSON-LD document loader for offline or customized resolution.
   *
   * @param localContexts Optional mapping of custom contexts.
   */
  constructor(localContexts?: Record<string, any>) {
    this.localContexts = localContexts;

    if (this.localContexts) {
      (jsonld as any).documentLoader = createCustomLoader(this.localContexts);
    }
  }

  /**
   * Validates if input is valid JSON (syntax only).
   *
   * @param jsonInput JSON string or object.
   * @returns ValidationResult indicating success or parsing error.
   */
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

  /**
   * Validates JSON-LD syntax by attempting to expand the document.
   *
   * @param jsonLdObject JSON-LD object.
   * @returns ValidationResult indicating valid JSON-LD or syntax error.
   */
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

  /**
   * Validates an Asset Schema against semantic rules.
   * Ensures required fields like @context and @id are present,
   * and validates the structure of @context depending on its type.
   *
   * @param assetSchema AssetSchema object.
   * @returns ValidationResult indicating semantic validity.
   */
  public async validateAssetSchema(
    assetSchema: AssetSchema,
  ): Promise<ValidationResult> {
    try {
      console.debug("Validating Asset Schema:", assetSchema);

      // Ensure required fields are present
      if (!assetSchema["@context"]) {
        throw new Error("Missing required field: @context");
      }
      if (!assetSchema["@id"]) {
        throw new Error("Missing required field: @id");
      }

      // Validate @context
      const ctx = assetSchema["@context"];
      if (typeof ctx === "string") {
        // Must be a URI
        try {
          new URL(ctx);
        } catch {
          throw new Error(`@context string must be a valid URI: ${ctx}`);
        }
      } else if (Array.isArray(ctx)) {
        // Each element must be either URI or object
        for (const item of ctx) {
          if (typeof item === "string") {
            try {
              new URL(item);
            } catch {
              throw new Error(`Invalid URI in @context array: ${item}`);
            }
          } else if (typeof item === "object") {
            // No strict requirements for array objects in schema
            if (item === null) {
              throw new Error("Invalid null object in @context array");
            }
          } else {
            throw new Error("Invalid type in @context array");
          }
        }
      } else if (typeof ctx === "object") {
        // Must contain required keys
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
      } else {
        throw new Error(
          "@context must be a string (URI), an object, or an array",
        );
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

  /**
   * Validates a Signed Asset Schema object.
   * @param signedAssetSchema Signed Asset Schema containing an AssetSchema.
   * @returns A ValidationResult indicating whether the signed schema is valid.
   */
  public async validateSignedAssetSchema(
    signedAssetSchema: SignedAssetSchema,
  ): Promise<ValidationResult> {
    try {
      console.debug("Validating Asset Schema:", signedAssetSchema);
      if (!signedAssetSchema.asset_schema) {
        throw new Error("Asset Schema is missing in signed asset schema.");
      }

      const assetSchema = signedAssetSchema.asset_schema;

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

  /**
   * Validates a Schema Profile.
   * @param schemaProfile Schema Profile object to validate.
   * @returns A ValidationResult indicating whether the Schema Profile is syntactically
   *          and semantically valid.
   */
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

  /**
   * Validates a Signed Schema Profile.
   * @param signedSchemaProfile Signed Schema Profile containing a SchemaProfile.
   * @returns A ValidationResult indicating whether the signed schema profile is valid.
   */
  public async validateSignedSchemaProfile(
    signedSchemaProfile: SignedSchemaProfile,
  ): Promise<ValidationResult> {
    try {
      console.debug("Validating Schema Profile:", signedSchemaProfile);
      if (!signedSchemaProfile.schema_profile) {
        throw new Error("Schema Profile is missing in signed asset schema.");
      }

      const schemaProfile = signedSchemaProfile.schema_profile;

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

  /**
   * Validates a Tokenized Asset Record.
   * @param tokenizedAssetRecord Tokenized Asset Record to validate.
   * @returns A ValidationResult indicating validity of the record.
   */
  public async validateTokenizedAssetRecord(
    tokenizedAssetRecord: TokenizedAssetRecord,
  ): Promise<ValidationResult> {
    try {
      console.debug("Validating Tokenized Asset Record:", tokenizedAssetRecord);
      if (!tokenizedAssetRecord) {
        throw new Error("TokenizedAssetRecord is missing.");
      }

      const syntaxResult =
        await this.validateJsonLdSyntax(tokenizedAssetRecord);

      if (!syntaxResult.valid) {
        return syntaxResult;
      }

      return {
        valid: true,
        details: "Tokenized Asset Record semantics are valid",
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

  /**
   * Validates a Token Issuance Authorization object.
   * @param tokenIssuanceAuthorization Token Issuance Authorization to validate.
   * @returns A ValidationResult indicating validity of the authorization.
   */
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

  /**
   * Validates a DID Document against DID Core rules and custom domain rules.
   * @param didDocument DID Document to validate.
   * @returns A ValidationResult indicating whether the DID Document is valid.
   */
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

  /**
   * Validates an Asset Schema Authority Certificate.
   * @param assetSchemaAuthorityCertificate Certificate to validate.
   * @returns A ValidationResult indicating validity of the certificate.
   */
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

  /**
   * Validates an Asset Provider Certificate.
   * @param assetProviderCertificate Certificate to validate.
   * @returns A ValidationResult indicating validity of the certificate.
   */
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

  /* DEAD CODE
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
  */
}

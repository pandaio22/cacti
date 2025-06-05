//import axios from "axios";
import { IPFS_URL } from "../../../constants";
import { JsonLdValidationResult } from "../types/validation-types";
import { IValidationService } from "../interfaces/validation-service-interface"; // adjust path as needed

export class ValidationService implements IValidationService {
  /**
   * Validates asset schema data. Exported by IValidationService.
   * @param data The asset schema data to validate.
   * @returns A promise that resolves when the validation is complete.
   * @throws An error if the validation fails.
   */
  public async validateAssetSchema(data: any): Promise<void> {
    const validJsonLd: JsonLdValidationResult =
      await this.validateAssetSchemaStructure(data);
    console.log("Validating asset data:", validJsonLd);

    //Validate Semantics
    //TODO

    if (!validJsonLd.valid) {
      console.error(validJsonLd.errors);
      throw new Error(validJsonLd.errors.join(", "));
    } else {
      console.log("Commissioning asset with data:", data);
    }
  }

  /**
   * Validates schema profile data. Exported by IValidationService.
   * @param data The schema profile data to validate.
   * @returns A promise that resolves when the validation is complete.
   * @throws An error if the validation fails.
   */
  public async validateSchemaProfile(data: any): Promise<void> {
    //Validate Syntax
    let validJsonLd: JsonLdValidationResult =
      await this.validateSchemaProfileStructure(data);
    console.log("Validating schema profile:", validJsonLd);

    //Validate Semantics
    validJsonLd = await this.validateSchemaProfileSemantics(validJsonLd, data);

    if (!validJsonLd.valid) {
      console.error(validJsonLd.errors);
      throw new Error(validJsonLd.errors.join(", "));
    } else {
      console.log("Commissioning schema profile with data:", data);
    }
  }

  /**
   * Validates a JSON-LD structure.
   * @param data The JSON-LD data to validate.
   * @returns A JsonLdValidationResult indicating whether the validation was successful and any errors encountered.
   */
  public async validateJsonLdStructure(
    data: any,
  ): Promise<JsonLdValidationResult> {
    const errors: string[] = [];

    try {
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        errors.push("JSON-LD must be an object");
        return { valid: false, errors };
      }

      if (!data["@context"]) {
        errors.push("Missing @context");
      } else {
        this.validateContext(data["@context"], errors);
      }

      if (!data["@type"] && !data["@id"]) {
        errors.push("Must have either @type or @id");
      }

      // Validate @type
      if (data["@type"]) {
        if (
          typeof data["@type"] !== "string" &&
          !Array.isArray(data["@type"])
        ) {
          errors.push("@type must be string or array");
        }
      }

      // Validate @id
      if (data["@id"] && typeof data["@id"] !== "string") {
        errors.push("@id must be a string");
      }

      // Check for reserved keywords misuse
      this.validateReservedKeywords(data, errors);

      return { valid: errors.length === 0, errors };
    } catch (error) {
      errors.push(
        `Validation error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return { valid: false, errors };
    }
  }

  /**
   * Validates the structure of an asset schema.
   * @param data The asset schema data to validate.
   * @returns A JsonLdValidationResult indicating whether the validation was successful and any errors encountered.
   */
  public async validateAssetSchemaStructure(
    data: any,
  ): Promise<JsonLdValidationResult> {
    const errors: string[] = [];

    try {
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        errors.push("Asset schema must be a non-array object.");
        return { valid: false, errors };
      }

      // Required: @context
      if (!data["@context"]) {
        errors.push("Missing @context.");
      } else {
        this.validateContext(data["@context"], errors);

        // Validate specific prefixes in @context
        const context = data["@context"];
        const requiredPrefixes = ["foaf", "schema", "skos", "xsd", "rdf"];
        requiredPrefixes.forEach((prefix) => {
          if (!context[prefix]) {
            errors.push(`Missing namespace prefix: "${prefix}"`);
          }
        });

        // Check specific term definitions
        if (
          !context["schema_version"] ||
          context["schema_version"]["@id"] !==
            "https://schema.org/schemaVersion"
        ) {
          errors.push(`Missing or incorrect "schema_version" mapping`);
        }

        if (
          !context["fungible"] ||
          context["fungible"]["@id"] !== "https://example.org/fungibility"
        ) {
          errors.push(`Missing or incorrect "fungible" mapping`);
        }

        if (
          !context["facets"] ||
          context["facets"]["@id"] !==
            "https://satp.example.org/asset_schema_facets"
        ) {
          errors.push(`Missing or incorrect "facets" mapping`);
        }

        // Validate nested organization_key context
        const orgKey = context["organization_key"];
        if (!orgKey || !orgKey["@context"]) {
          errors.push(
            `Missing or incomplete "organization_key" mapping or sub-context`,
          );
        } else {
          const subCtx = orgKey["@context"];
          if (
            !subCtx["public_key"] ||
            subCtx["public_key"]["@id"] !==
              "https://gateway.satp.ietf.org/asset_schema_pub_key"
          ) {
            errors.push(
              `Missing or incorrect "public_key" in organization_key context`,
            );
          }
          if (
            !subCtx["issued"] ||
            subCtx["issued"]["@id"] !==
              "https://gateway.satp.ietf.org/asset_schema_key_issued"
          ) {
            errors.push(
              `Missing or incorrect "issued" in organization_key context`,
            );
          }
        }
      }

      // Optional but recommended: check @id
      if (!data["@id"]) {
        errors.push("Missing @id in asset schema.");
      } else if (typeof data["@id"] !== "string") {
        errors.push("@id must be a string.");
      }

      // You can reuse reserved keyword validation
      this.validateReservedKeywords(data, errors);

      return { valid: errors.length === 0, errors };
    } catch (error) {
      errors.push(
        `Validation error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return { valid: false, errors };
    }
  }

  /**
   * Validates a JSON-LD schema profile.
   * @param data The JSON-LD data to validate.
   * @returns A JsonLdValidationResult indicating whether the validation was successful and any errors encountered.
   */
  public async validateSchemaProfileStructure(
    data: any,
  ): Promise<JsonLdValidationResult> {
    const errors: string[] = [];

    try {
      console.log("Validating schema profile...");
      console.log(data);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        errors.push("JSON-LD must be an object");
        return { valid: false, errors };
      }

      if (!data["@context"]) {
        errors.push("Missing @context");
      } else {
        this.validateContext(data["@context"], errors);
      }

      if (!data["@type"] && !data["@id"]) {
        errors.push("Must have either @type or @id");
      }

      // Validate @type
      if (data["@type"]) {
        if (
          typeof data["@type"] !== "string" &&
          !Array.isArray(data["@type"])
        ) {
          errors.push("@type must be string or array");
        }
      }

      // Validate @id
      if (data["@id"] && typeof data["@id"] !== "string") {
        errors.push("@id must be a string");
      }

      if (
        !data["@context"]["asset_schema"] ||
        typeof data["@context"]["asset_schema"] !== "string" ||
        !data["@context"]["asset_schema"].startsWith("did:ipfs:")
      ) {
        errors.push("Missing or malformed 'asset_schema' DID in @context.");
        return { valid: false, errors };
      }

      // Check for reserved keywords misuse
      this.validateReservedKeywords(data, errors);

      return { valid: errors.length === 0, errors };
    } catch (error) {
      errors.push(
        `Validation error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return { valid: false, errors };
    }
  }

  /**
   * Validates the semantics of a schema profile.
   * @param data The schema profile data to validate.
   * @param structureResult The result of the structure validation.
   * @returns A JsonLdValidationResult indicating whether the validation was successful and any errors encountered.
   */
  public async validateSchemaProfileSemantics(
    structureResult: JsonLdValidationResult,
    data: any,
  ): Promise<JsonLdValidationResult> {
    const errors = [...(structureResult.errors || [])];

    if (!structureResult.valid) return { valid: false, errors };

    try {
      const context = data["@context"];
      const assetSchemaDid = context["asset_schema"];
      const cid = assetSchemaDid.replace("did:ipfs:", "");
      const ipfsUrl = IPFS_URL + `/cat?arg=${cid}`;
      const response = await fetch(ipfsUrl, { method: "POST" });

      if (!response.ok) {
        errors.push(
          `Unable to fetch asset schema from IPFS (${ipfsUrl}): ${response.statusText}`,
        );
        return { valid: false, errors };
      }

      const schemaData = await response.json();
      console.log("Dereferenced asset schema:", schemaData);

      // ✅ Semantic checks on dereferenced schema TODO
      if (!schemaData["@id"]) {
        errors.push("Dereferenced asset schema is missing '@id'");
      }

      if (!schemaData["@context"]) {
        errors.push("Dereferenced asset schema is missing '@context'");
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      errors.push(
        `Semantic validation error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return { valid: false, errors };
    }
  }

  /**
   * Validates the context of a JSON-LD document.
   * @param context The @context to validate.
   * @param errors An array to collect validation errors.
   */
  private validateContext(context: any, errors: string[]): void {
    if (typeof context === "string") {
      if (!this.isValidUrl(context)) {
        errors.push("Invalid @context URL format");
      }
    } else if (Array.isArray(context)) {
      context.forEach((ctx, index) => {
        if (
          typeof ctx !== "string" &&
          (typeof ctx !== "object" || ctx === null)
        ) {
          errors.push(`Invalid @context item at index ${index}`);
        }
      });
    } else if (typeof context === "object" && context !== null) {
      // Valid context object
      if (Object.keys(context).length === 0) {
        errors.push("Empty @context object");
      }
    } else {
      errors.push("@context must be string, object, or array");
    }
  }
  /**
   * Validates reserved keywords in a JSON-LD document.
   * @param data The JSON-LD data to validate.
   * @param errors An array to collect validation errors.
   */
  private validateReservedKeywords(data: any, errors: string[]): void {
    const reservedKeywords = [
      "@context",
      "@id",
      "@type",
      "@value",
      "@language",
      "@index",
      "@list",
      "@set",
      "@reverse",
      "@graph",
    ];

    for (const key in data) {
      if (key.startsWith("@") && !reservedKeywords.includes(key)) {
        errors.push(`Unknown JSON-LD keyword: ${key}`);
      }
    }
  }
  /**
   * Checks if a URL is valid.
   * @param url The URL to validate.
   * @returns True if the URL is valid, false otherwise.
   */
  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  // DEAD CODE - Optional: External validation for complex cases. WORK IN PROGRESS
  /*
  async validateWithExternalService(
    data: any,
  ): Promise<JsonLdValidationResult> {
    const errors: string[] = [];
    try {
      // You could use a service like JSON-LD Playground API
      const response = await axios.post(
        "https://json-ld.org/playground-api/expand",
        {
          input: JSON.stringify(data),
        },
        {
          timeout: 5000,
          headers: { "Content-Type": "application/json" },
        },
      );

      return { valid: true, errors };
    } catch (error) {
      errors.push(
        `Validation error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        valid: false,
        errors,
      };
    }
  }
  */
}

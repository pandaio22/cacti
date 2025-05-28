import axios from "axios";
import { JsonLdValidationResult } from "./validation-types";

export class ValidationService {
  // Manual validation (safe, no segfaults)
  public validateJsonLdStructure(data: any): JsonLdValidationResult {
    const errors: string[] = [];

    try {
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        errors.push("JSON-LD must be an object");
        return { valid: false, errors };
      }

      // Required @context
      if (!data["@context"]) {
        errors.push("Missing @context");
      } else {
        this.validateContext(data["@context"], errors);
      }

      // Either @type or @id required
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

  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  // DEAD CODE - Optional: External validation for complex cases. WORK IN PROGRESS
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
}

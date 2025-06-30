import jsonld from "jsonld";
import Ajv, { ValidateFunction } from "ajv";

export class JsonLdValidator {
  /**
   * Validate a JSON-LD object by attempting to expand it.
   * @param jsonLdInput The JSON-LD object to validate
   * @returns Promise<boolean> true if valid, rejects if invalid
   */
  static async validate(jsonLdInput: object): Promise<boolean> {
    try {
      const expanded = await jsonld.expand(jsonLdInput);
      if (!Array.isArray(expanded) || expanded.length === 0) {
        throw new Error("Empty JSON-LD expansion");
      }
      return true;
    } catch (error) {
      throw new Error(`Invalid JSON-LD: ${error.message}`);
    }
  }

  /**
   * Validate a JSON-LD object against a reference JSON Schema.
   * @param jsonLdInput The JSON-LD object to validate
   * @param schema The JSON Schema to validate against
   * @returns Promise<boolean> true if valid, rejects with errors if invalid
   */
  static async validateAgainstSchema(
    jsonLdInput: object,
    schema: object,
  ): Promise<boolean> {
    await this.validate(jsonLdInput);
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate: ValidateFunction = ajv.compile(schema);

    const valid = validate(jsonLdInput);
    if (!valid) {
      const errors = validate.errors
        ?.map((e) => `${e.instancePath} ${e.message}`)
        .join(", ");
      throw new Error(`Schema validation errors: ${errors}`);
    }

    return true;
  }
}

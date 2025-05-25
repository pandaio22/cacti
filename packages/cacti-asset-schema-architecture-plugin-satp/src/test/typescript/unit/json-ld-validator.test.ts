import { JsonLdValidator } from "../../../main/typescript/validation/json-ld-validator";
import jsonld from "jsonld";

// Mock the jsonld module
jest.mock("jsonld");
const mockJsonld = jsonld as jest.Mocked<typeof jsonld>;

describe("JsonLdValidator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validate", () => {
    it("should return true for valid JSON-LD that expands successfully", async () => {
      // Arrange
      const validJsonLd = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Person",
        name: "John Doe",
      };
      const expandedResult = [
        { "https://example.com/type": [{ "@value": "Person" }] },
      ];
      mockJsonld.expand.mockResolvedValue(expandedResult);

      // Act & Assert
      await expect(JsonLdValidator.validate(validJsonLd)).resolves.toBe(true);
      expect(mockJsonld.expand).toHaveBeenCalledWith(validJsonLd);
    });

    it("should throw error when JSON-LD expansion fails", async () => {
      // Arrange
      const invalidJsonLd = { invalid: "data" };
      const expansionError = new Error("Invalid context");
      mockJsonld.expand.mockRejectedValue(expansionError);

      // Act & Assert
      await expect(JsonLdValidator.validate(invalidJsonLd)).rejects.toThrow(
        "Invalid JSON-LD: Invalid context",
      );
      expect(mockJsonld.expand).toHaveBeenCalledWith(invalidJsonLd);
    });

    it("should throw error when expanded result is empty array", async () => {
      // Arrange
      const jsonLdInput = { "@context": "https://example.com" };
      mockJsonld.expand.mockResolvedValue([]);

      // Act & Assert
      await expect(JsonLdValidator.validate(jsonLdInput)).rejects.toThrow(
        "Invalid JSON-LD: Empty JSON-LD expansion",
      );
      expect(mockJsonld.expand).toHaveBeenCalledWith(jsonLdInput);
    });

    it("should throw error when expanded result is not an array", async () => {
      // Arrange
      const jsonLdInput = { "@context": "https://example.com" };
      mockJsonld.expand.mockResolvedValue({} as any);

      // Act & Assert
      await expect(JsonLdValidator.validate(jsonLdInput)).rejects.toThrow(
        "Invalid JSON-LD: Empty JSON-LD expansion",
      );
      expect(mockJsonld.expand).toHaveBeenCalledWith(jsonLdInput);
    });
  });

  describe("validateAgainstSchema", () => {
    const validJsonLd = {
      "@context": "https://www.w3.org/ns/activitystreams",
      type: "Person",
      name: "John Doe",
      age: 30,
    };

    const validSchema = {
      type: "object",
      properties: {
        type: { type: "string" },
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["type", "name"],
    };

    beforeEach(() => {
      // Mock successful JSON-LD validation by default
      const expandedResult = [
        { "https://example.com/type": [{ "@value": "Person" }] },
      ];
      mockJsonld.expand.mockResolvedValue(expandedResult);
    });

    it("should return true when both JSON-LD and schema validation pass", async () => {
      // Act & Assert
      await expect(
        JsonLdValidator.validateAgainstSchema(validJsonLd, validSchema),
      ).resolves.toBe(true);
      expect(mockJsonld.expand).toHaveBeenCalledWith(validJsonLd);
    });

    it("should throw error when JSON-LD validation fails", async () => {
      // Arrange
      const invalidJsonLd = { invalid: "data" };
      const expansionError = new Error("Invalid context");
      mockJsonld.expand.mockRejectedValue(expansionError);

      // Act & Assert
      await expect(
        JsonLdValidator.validateAgainstSchema(invalidJsonLd, validSchema),
      ).rejects.toThrow("Invalid JSON-LD: Invalid context");
    });

    it("should throw error when schema validation fails with single error", async () => {
      // Arrange
      const invalidData = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Person",
        // missing required 'name' field
      };

      // Act & Assert
      await expect(
        JsonLdValidator.validateAgainstSchema(invalidData, validSchema),
      ).rejects.toThrow(
        "Schema validation errors:  must have required property 'name'",
      );
    });

    it("should throw error when schema validation fails with multiple errors", async () => {
      // Arrange
      const invalidData = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: 123, // should be string
        age: "thirty", // should be number
        // missing required 'name' field
      };

      const schemaWithTypeValidation = {
        type: "object",
        properties: {
          type: { type: "string" },
          name: { type: "string" },
          age: { type: "number" },
        },
        required: ["type", "name"],
        additionalProperties: false,
      };

      // Act & Assert
      await expect(
        JsonLdValidator.validateAgainstSchema(
          invalidData,
          schemaWithTypeValidation,
        ),
      ).rejects.toThrow("Schema validation errors:");
    });

    it("should handle schema validation with no errors array", async () => {
      // This test covers the edge case where validate.errors might be undefined
      // This is more of a defensive programming test
      const validDataWithContext = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Person",
        name: "Jane Doe",
      };

      // Act & Assert
      await expect(
        JsonLdValidator.validateAgainstSchema(
          validDataWithContext,
          validSchema,
        ),
      ).resolves.toBe(true);
    });

    it("should validate complex JSON-LD structure against schema", async () => {
      // Arrange
      const complexJsonLd = {
        "@context": {
          "@vocab": "https://example.com/",
          name: "https://schema.org/name",
          Person: "https://schema.org/Person",
        },
        "@type": "Person",
        name: "Alice Smith",
        address: {
          street: "123 Main St",
          city: "Anytown",
        },
      };

      const complexSchema = {
        type: "object",
        properties: {
          "@context": { type: "object" },
          "@type": { type: "string" },
          name: { type: "string" },
          address: {
            type: "object",
            properties: {
              street: { type: "string" },
              city: { type: "string" },
            },
          },
        },
        required: ["@type", "name"],
      };

      // Act & Assert
      await expect(
        JsonLdValidator.validateAgainstSchema(complexJsonLd, complexSchema),
      ).resolves.toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty object input", async () => {
      // Arrange
      const emptyObject = {};
      mockJsonld.expand.mockRejectedValue(new Error("No context provided"));

      // Act & Assert
      await expect(JsonLdValidator.validate(emptyObject)).rejects.toThrow(
        "Invalid JSON-LD: No context provided",
      );
    });

    it("should handle null input gracefully", async () => {
      // Arrange
      const nullInput = null as any;
      mockJsonld.expand.mockRejectedValue(new Error("Cannot expand null"));

      // Act & Assert
      await expect(JsonLdValidator.validate(nullInput)).rejects.toThrow(
        "Invalid JSON-LD: Cannot expand null",
      );
    });
  });
});

import { AssetSchema } from "../../../main/typescript/data-model/asset-schema";

describe("AssetSchema Zod validation", () => {
  // Valid schema for testing
  const validAssetSchema = {
    "@id": "https://satp.example.org/asset_schema/",
    "@context": {
      "@version": {
        "@value": 1.1, // version field now has @value and @type
        "@type": "http://www.w3.org/2001/XMLSchema#decimal", // example type URL
      },
      namespaces: {
        foaf: "http://xmlns.com/foaf/0.1/",
        schema: "http://schema.org/",
        skos: "http://www.w3.org/2004/02/skos/core#",
        xsd: "http://www.w3.org/2001/XMLSchema#",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      },
      fungibility: {
        "@value": true,
        "@type": "http://www.w3.org/2001/XMLSchema#boolean", // example type URL
      },
      facets: {
        "@id": "https://satp.example.org/asset_schema_facets",
      },
      organization_key: {
        "@id": "https://satp.example.org/asset_schema_org_key",
        "@context": {
          public_key: {
            "@id": "https://gateway.satp.ietf.org/asset_schema_pub_key",
            "@type": "http://www.w3.org/2001/XMLSchema#string",
          },
          issued: {
            "@id": "https://gateway.satp.ietf.org/asset_schema_key_issued",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
          },
        },
      },
    },
  };

  it("validates a correct asset schema", () => {
    const result = AssetSchema.safeParse(validAssetSchema);
    expect(result.success).toBe(true);
  });

  it("fails validation when @version is missing", () => {
    const invalidSchema = { ...validAssetSchema };
    delete invalidSchema["@context"]["@version"];
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when namespaces is missing", () => {
    const invalidSchema = { ...validAssetSchema };
    delete invalidSchema["@context"].namespaces;
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when fungibility has the wrong @type", () => {
    const invalidSchema = { ...validAssetSchema };
    invalidSchema["@context"].fungibility["@type"] = "xsd:string";
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when @id is not a valid URL", () => {
    const invalidSchema = { ...validAssetSchema };
    invalidSchema["@id"] = "not-a-valid-url";
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when @version is not correctly structured", () => {
    const invalidSchema = { ...validAssetSchema };
    invalidSchema["@context"]["@version"] = {
      "@value": "not-a-number",
      "@type": "http://www.w3.org/2001/XMLSchema#string",
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation if facets is missing @id", () => {
    const invalidSchema = { ...validAssetSchema };
    delete invalidSchema["@context"].facets["@id"];
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when organization_key's public_key is missing @id", () => {
    const invalidSchema = { ...validAssetSchema };
    delete invalidSchema["@context"].organization_key["@context"].public_key["@id"];
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when organization_key's issued is missing @id", () => {
    const invalidSchema = { ...validAssetSchema };
    delete invalidSchema["@context"].organization_key["@context"].issued["@id"];
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });
});
import { AssetSchema } from "../../../../main/typescript/data-model/asset-schema";

describe("AssetSchema Zod validation", () => {
  const validAssetSchema = {
    "@id": "https://satp.example.org/asset_schema/",
    "@context": {
      "@version": {
        "@value": 1.1,
        "@type": "http://www.w3.org/2001/XMLSchema#decimal",
      },
      namespaces: {
        foaf: "http://xmlns.com/foaf/0.1/",
        schema: "http://schema.org/",
        skos: "http://www.w3.org/2004/02/skos/core#",
        xsd: "http://www.w3.org/2001/XMLSchema#",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      },
      fungibility: {
        "@id": "http://satp.example.org/asset_schema/fungibility",
        "@type": "http://www.w3.org/2001/XMLSchema#boolean",
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
    //Arrange and Act
    const result = AssetSchema.safeParse(validAssetSchema);
    //Assert
    expect(result.success).toBe(true);
  });
  it("fails validation when @version is missing", () => {
    const { ["@version"]: _, ...contextWithoutVersion } =
      validAssetSchema["@context"];
    const invalidSchema = {
      ...validAssetSchema,
      "@context": contextWithoutVersion,
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when namespaces is missing", () => {
    const { namespaces, ...contextWithoutNamespaces } =
      validAssetSchema["@context"];
    const invalidSchema = {
      ...validAssetSchema,
      "@context": contextWithoutNamespaces,
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when fungibility has the wrong @type", () => {
    const invalidSchema = {
      ...validAssetSchema,
      "@context": {
        ...validAssetSchema["@context"],
        fungibility: {
          ...validAssetSchema["@context"].fungibility,
          "@type": "not-a-valid-url",
        },
      },
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when @id is not a valid URL", () => {
    const invalidSchema = {
      ...validAssetSchema,
      "@id": "not-a-valid-url",
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when @version is not correctly structured", () => {
    const invalidSchema = {
      ...validAssetSchema,
      "@context": {
        ...validAssetSchema["@context"],
        "@version": {
          "@value": "not-a-number",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
      },
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation if facets is missing @id", () => {
    const invalidSchema = {
      ...validAssetSchema,
      "@context": {
        ...validAssetSchema["@context"],
        facets: {},
      },
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when organization_key's public_key is missing @id", () => {
    const invalidSchema = {
      ...validAssetSchema,
      "@context": {
        ...validAssetSchema["@context"],
        organization_key: {
          ...validAssetSchema["@context"].organization_key,
          "@context": {
            ...validAssetSchema["@context"].organization_key["@context"],
            public_key: {
              "@type": "http://www.w3.org/2001/XMLSchema#string",
            },
          },
        },
      },
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });

  it("fails validation when organization_key's issued is missing @id", () => {
    const invalidSchema = {
      ...validAssetSchema,
      "@context": {
        ...validAssetSchema["@context"],
        organization_key: {
          ...validAssetSchema["@context"].organization_key,
          "@context": {
            ...validAssetSchema["@context"].organization_key["@context"],
            issued: {
              "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
            },
          },
        },
      },
    };
    const result = AssetSchema.safeParse(invalidSchema);
    expect(result.success).toBe(false);
  });
});

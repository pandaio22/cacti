import { SchemaProfile } from "../../../../main/typescript/data-model/schema-profile";

describe("SchemaProfile schema", () => {
  const validSchemaProfile = {
    "@id": "https://example.org/schema/profile/1",
    parent_schema: {
      "@id": "https://example.org/schema/asset/1",
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
    },
  };

  it("validates a correct SchemaProfile", () => {
    const result = SchemaProfile.safeParse(validSchemaProfile);
    expect(result.success).toBe(true);
  });

  it("fails validation when @id is missing", () => {
    const invalidProfile = { ...validSchemaProfile, "@id": undefined };
    const result = SchemaProfile.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });

  it("fails validation when parent_schema is invalid", () => {
    const invalidProfile = {
      ...validSchemaProfile,
      parent_schema: { invalid: true },
    };
    const result = SchemaProfile.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });
});

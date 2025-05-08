import { z } from "zod";

// Reusable pieces
const JsonLdId = z.object({
  "@id": z.string(),
});

const JsonLdType = z.object({
  "@type": z.string(),
});

// Schema for IAssetSchemaContext
const AssetSchemaContext = z.object({
  version: JsonLdId.merge(JsonLdType),
  fungibility: JsonLdId.merge(JsonLdType),
  facets: JsonLdId,
  organization_key: JsonLdId.extend({
    "@context": z.object({
      public_key: JsonLdId.merge(JsonLdType),
      issued: JsonLdId.merge(JsonLdType),
    }),
  }),
});

// Schema for IAssetSchema
export const AssetSchema = z.object({
  "@context": AssetSchemaContext,
  "@id": z.string(),
});

// ✅ Infer the TypeScript type from the schema
type AssetSchemaType = z.infer<typeof AssetSchema>;

function validateAndUseSchema(data: unknown): AssetSchemaType | null {
  const parsed = AssetSchema.safeParse(data);

  if (!parsed.success) {
    console.error("❌ Invalid AssetSchema:", parsed.error.format());
    return null;
  }

  const schema: AssetSchemaType = parsed.data;

  // Now you can safely access properties with full type support
  console.log("✅ Valid Schema ID:", schema["@id"]);
  console.log("Version ID:", schema["@context"].version["@id"]);
  console.log(
    "Issued Type:",
    schema["@context"].organization_key["@context"].issued["@type"],
  );

  return schema;
}

const input = {
  "@id": "https://example.org/schema/asset/1",
  "@context": {
    version: { "@id": "http://schema.org/version", "@type": "xsd:string" },
    fungibility: {
      "@id": "http://schema.org/fungibility",
      "@type": "xsd:boolean",
    },
    facets: { "@id": "http://schema.org/facets" },
    organization_key: {
      "@id": "http://schema.org/org-key",
      "@context": {
        public_key: {
          "@id": "http://schema.org/pubkey",
          "@type": "xsd:string",
        },
        issued: { "@id": "http://schema.org/issued", "@type": "xsd:dateTime" },
      },
    },
  },
};

validateAndUseSchema(input);

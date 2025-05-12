import { z } from "zod";

/**
 * A reusable Zod schema representing a JSON-LD object with an `@id` field.
 */
const JsonLdId = z.object({
  "@id": z.string().url({
    message: "Please select a valid URL",
  }),
});

/**
 * A reusable Zod schema representing a JSON-LD object with an `@type` field.
 */
const JsonLdType = z.object({
  "@type": z.string().url({
    message: "Please select a valid URL",
  }),
});

const JsonLdVersion = z.object({
  "@value": z.number({
    message: "Please select a valid number",
  }),
  "@type": z.string().url({
    message: "Please select a valid URL",
  }),
});
/**
 * A reusable Zod schema representing a JSON-LD object with a `@id` and `@type` field
 * of type Boolean.
 */
const JsonLdBoolean = z.object({
  "@id": z.string().url({
    message: "Please select a valid URL",
  }),
  "@type": z.string().url({
    message: "Please select a valid URL",
  }),
});

/**
 * Namespaces block defining common RDF/OWL/Schema prefixes
 */
const Namespaces = z.object({
  foaf: z.string().url({
    message: "Please select a valid URL",
  }),
  schema: z.string().url({
    message: "Please select a valid URL",
  }),
  skos: z.string().url({
    message: "Please select a valid URL",
  }),
  xsd: z.string().url({
    message: "Please select a valid URL",
  }),
  rdf: z.string().url({
    message: "Please select a valid URL",
  }),
});

/**
 * Zod schema defining the structure of the `@context` field
 * for an AssetSchema object.
 *
 * Includes references to semantic version, fungibility, facets,
 * and organizational metadata.
 */
const NonRequiredAssetSchemaContext = z.object({
  "@version": JsonLdVersion,
  namespaces: Namespaces,
  fungibility: JsonLdBoolean,
  facets: JsonLdId,
  organization_key: JsonLdId.extend({
    "@context": z.object({
      public_key: JsonLdId.merge(JsonLdType),
      issued: JsonLdId.merge(JsonLdType),
    }),
  }),
});

const AssetSchemaContext = NonRequiredAssetSchemaContext.required({
  "@version": true,
  namespaces: true,
  fungibility: true,
  organization_key: true,
});

/**
 * Zod schema for validating a complete asset schema object in JSON-LD format.
 *
 * The object must include an `@id` and an `@context` field conforming to the
 * structure defined by `AssetSchemaContext`.
 */
const NonRequiredAssetSchema = z.object({
  "@context": AssetSchemaContext,
  "@id": z.string(),
});

export const AssetSchema = NonRequiredAssetSchema.required();



/**
 * TypeScript type inferred from the `AssetSchema` Zod schema.
 */
type AssetSchemaType = z.infer<typeof AssetSchema>;

/**
 * Validates unknown input data against the `AssetSchema`.
 *
 * @param data - The unknown input data to validate.
 * @returns The parsed `AssetSchemaType` object if valid, or `null` if validation fails.
 */
function validateAndUseSchema(data: unknown): AssetSchemaType | null {
  const parsed = AssetSchema.safeParse(data);

  if (!parsed.success) {
    console.error("❌ Invalid AssetSchema:", parsed.error.format());
    return null;
  }

  const schema: AssetSchemaType = parsed.data;

  // Log specific schema properties for demonstration purposes
  console.log("✅ Valid Schema ID:", schema["@id"]);
  console.log("Version ID:", schema["@context"].version["@id"]);
  console.log(
    "Issued Type:",
    schema["@context"].organization_key["@context"].issued["@type"],
  );

  return schema;
}

/**
 * Example input data conforming to the AssetSchema.
 * Used to demonstrate validation and usage.
 */
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

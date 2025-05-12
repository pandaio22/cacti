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
const JsonLdFungibility = z.object({
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
  fungibility: JsonLdFungibility,
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
  "@id": z.string().url(),
});

export const AssetSchema = NonRequiredAssetSchema.required();
export type AssetSchemaType = z.infer<typeof AssetSchema>;

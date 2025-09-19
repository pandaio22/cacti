import { z } from "zod";
import { AssetSchema } from "./asset-schema";

/**
 * Zod schema defining a Schema Profile object in JSON-LD format.
 *
 * A Schema Profile represents a specific configuration or extension
 * of a base Asset Schema. It includes:
 * - `@id`: A unique URL identifier for this schema profile.
 * - `parent_schema`: An embedded AssetSchema object that this profile derives from.
 *
 * This allows profiles to be nested and structured while maintaining
 * linkage to a canonical parent asset schema.
 */
export const SchemaProfile = z.object({
  "@id": z.string().url({
    message: "Schema profile must have a valid URL @id",
  }),
  parent_schema: AssetSchema,
});

export type SchemaProfileType = z.infer<typeof SchemaProfile>;

import { z } from "zod";

/**
 * Specifies the structure of a Token Issuance Authorization Request:
 * - `@context`: A URL that provides context for the request.
 *  - `asset_provider`: Information about the asset provider, including:
 *    - `name`: The name of the asset provider.
 *    - `id`: A unique identifier for the asset provider.
 *    - `organization_key`: An object containing the asset provider's public key and the date it was issued:
 *      - `public_key`: The public key of the asset provider.
 *      - `issued`: The date and time when the asset provider's public key was issued.
 * - `schema_profile`: An IRI that points to the schema profile being referenced.
 * - `network_id`: A string representing the network identifier.
 * - `proof': An object containing the proof of authorization, signed by the Asset Provider, which includes:
 *   - `type`: The type of proof being used.
 *   - `created`: The timestamp when the proof was created.
 *   - `proofPurpose`: The purpose of the proof.
 *   - `verificationMethod`: A URL or identifier for the verification method.
 *   - `jws`: The JSON Web Signature for the proof.
 */

/**
 * Linked Data Proof structure (W3C-compliant JwsSignature2020)
 */
const ProofSchema = z.object({
  type: z.literal("JwsSignature2020"),
  created: z.string().datetime(),
  proofPurpose: z.literal("assertionMethod"),
  verificationMethod: z.string().url(),
  jws: z.string(),
});

/**
 * Organization Key schema (public key + issued date)
 */
const OrganizationKeySchema = z.object({
  public_key: z.string(),
  issued: z.string().datetime(),
});

/**
 * Asset Provider schema
 */
const AssetProviderSchema = z.object({
  name: z.string(),
  id: z.string().url(),
  organization_key: OrganizationKeySchema,
});

/**
 * Complete Token Issuance Authorization Request schema (JSON-LD + Linked Data Proof)
 */
export const TokenIssuanceAuthorizationRequestSchema = z.object({
  "@context": z.union([z.string().url(), z.array(z.string().url())]),
  asset_provider: AssetProviderSchema,
  schema_profile: z.string().url(),
  network_id: z.string(),
  proof: ProofSchema,
});

export type TokenIssuanceAuthorizationRequest = z.infer<
  typeof TokenIssuanceAuthorizationRequestSchema
>;

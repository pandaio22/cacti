import { z } from "zod";
import { TokenIssuanceAuthorizationRequestSchema } from "./token-issuance-authorization-request";

/**
 * Specifies the structure of a Token Issuance Authorization:
 * - `token_issuance_authorization_request`: An object containing the details of the token issuance authorization request.
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
 * Complete Token Issuance Authorization schema (JSON-LD + Linked Data Proof)
 */
export const TokenIssuanceAuthorizationSchema = z.object({
  token_issuance_authorization_request: TokenIssuanceAuthorizationRequestSchema,
  proof: ProofSchema,
});

export type TokenIssuanceAuthorization = z.infer<
  typeof TokenIssuanceAuthorizationSchema
>;

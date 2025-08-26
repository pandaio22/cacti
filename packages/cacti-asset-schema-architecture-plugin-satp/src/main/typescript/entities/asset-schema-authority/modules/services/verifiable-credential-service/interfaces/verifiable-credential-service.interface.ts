import {
  AssetSchema,
  AssetSchemaDidDocument,
  AssetSchemaVerifiableCredential,
  SchemaProfile,
  SchemaProfileVerifiableCredential,
  SchemaProfileDidDocument,
  TokenIssuanceAuthorizationRequest,
  TokenIssuanceAuthorization,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import { ValidationResult } from "../../../../../../types/asset-schema-architecture-types.type";

export interface IVerifiableCredentialService {
  /**
   * Creates a Verifiable Credential for an Asset Schema.
   * @param assetSchema The Asset Schema to create a Verifiable Credential for.
   * @param assetSchemaDidDocument The DID Document associated with the Asset Schema.
   * @returns A promise that resolves to the created Asset Schema Verifiable Credential.
   */
  createAssetSchemaVerifiableCredential(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
  ): Promise<AssetSchemaVerifiableCredential>;

  /**
   * Verifies an Asset Schema Verifiable Credential.
   * @param assetSchemaVerifiableCredential The Asset Schema Verifiable Credential to verify.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Asset Schema Verifiable Credential.
   */
  verifyAssetSchemaVerifiableCredential(
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<ValidationResult>;

  /**
   * Revokes an Asset Schema Verifiable Credential.
   * @param assetSchemaVerifiableCredential The Asset Schema Verifiable Credential to revoke.
   * @returns A promise that resolves when the revocation is complete.
  
  revokeAssetSchemaVerifiableCredential(
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<void>;
  */

  /**
   * Creates a Verifiable Credential for a Schema Profile.
   * @param schemaProfile The Schema Profile to create a Verifiable Credential for.
   * @param schemaProfileDidDocument The DID Document associated with the Schema Profile.
   * @returns A promise that resolves to the created Schema Profile Verifiable Credential.
   */
  createSchemaProfileVerifiableCredential(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<SchemaProfileVerifiableCredential>;

  /**
   * Verifies a Schema Profile Verifiable Credential.
   * @param schemaProfileVerifiableCredential The Schema Profile Verifiable Credential to verify.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Schema Profile Verifiable Credential.
   */
  verifySchemaProfileVerifiableCredential(
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<ValidationResult>;

  /**
   * Revokes an Schema Profile Verifiable Credential.
   * @param schemaProfileVerifiableCredential The Schema Profile Verifiable Credential to revoke.
   * @returns A promise that resolves when the revocation is complete.
   * 
  revokeSchemaProfileVerifiableCredential(
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<void>;
   */

  /**
   * Creates a Token Issuance Authorization Verifiable Credential.
   * @param tokenIssuanceAuthorizationRequest The Token Issuance Authorization Request to create a Verifiable Credential for.
   * @param didDocument The DID Document associated with the Token Issuance Authorization.
   * @returns A promise that resolves to the created Token Issuance Authorization Verifiable Credential.
   
  createTokenIssuanceAuthorization(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
    didDocument: AssetSchemaDidDocument,
  ): Promise<TokenIssuanceAuthorization>;
*/
  /**
   * Verifies a Token Issuance Authorization Verifiable Credential.
   * @param tokenIssuanceAuthorization The Token Issuance Authorization to verify.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Token Issuance Authorization.
   
  verifyTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<ValidationResult>;
*/
  /**
   * Revokes a Token Issuance Authorization Verifiable Credential.
   * @param tokenIssuanceAuthorization The Token Issuance Authorization to revoke.
   * @returns A promise that resolves when the revocation is complete.
   
  revokeTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<void>;
  */
}

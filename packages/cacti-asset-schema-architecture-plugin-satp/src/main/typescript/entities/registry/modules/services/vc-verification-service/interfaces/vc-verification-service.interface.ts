import {
  AssetSchemaVerifiableCredential,
  SchemaProfileVerifiableCredential,
  TokenIssuanceAuthorization,
  TokenizedAssetRecordVerifiableCredential,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import { ValidationResult } from "../../../../../../types/asset-schema-architecture-types.type";

export interface IVcVerificationService {
  /**
   * Verifies an Asset Schema Verifiable Credential.
   * @param assetSchemaVerifiableCredential The Asset Schema Verifiable Credential to verify.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Asset Schema Verifiable Credential.
   */
  verifyAssetSchemaVerifiableCredential(
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<ValidationResult>;

  /**
   * Verifies a Schema Profile Verifiable Credential.
   * @param schemaProfileVerifiableCredential The Schema Profile Verifiable Credential to verify.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Schema Profile Verifiable Credential.
   */
  verifySchemaProfileVerifiableCredential(
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<ValidationResult>;

  /**
   * Verifies a Token Issuance Authorization Verifiable Credential.
   * @param tokenIssuanceAuthorization The Token Issuance Authorization to verify.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Token Issuance Authorization.
   */
  verifyTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<ValidationResult>;

  /**
   * Verifies a Tokenized Asset Record Verifiable Credential.
   * @param tokenIssuanceAuthorizationVerifiableCredential The Verifiable Credential to verify.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Tokenized Asset Record.
   */
  verifyTokenizedAssetRecordVerifiableCredential(
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential,
  ): Promise<ValidationResult>;
}

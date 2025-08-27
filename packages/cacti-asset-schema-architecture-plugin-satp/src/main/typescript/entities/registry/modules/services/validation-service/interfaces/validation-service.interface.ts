import {
  SignedAssetSchema,
  TokenIssuanceAuthorization,
  TokenizedAssetRecord,
  SignedSchemaProfile,
  AssetSchemaAuthorityCertificate,
  AssetProviderCertificate,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import { ValidationResult } from "../../../../../../types/asset-schema-architecture-types.type";

export default interface IValidationService {
  /**
   * Validates a JSON-LD object against various criteria.
   * @param jsonLdObject The JSON-LD object to validate.
   * @returns A promise that resolves to a ValidationResult.
   */
  validateJson(jsonLdObject: any): Promise<ValidationResult>;

  /**
   * Validates the syntax of a JSON-LD object.
   * @param jsonLdObject The JSON-LD object to validate.
   * @returns A promise that resolves to a ValidationResult indicating syntax validity.
   */
  validateJsonLdSyntax(jsonLdObject: any): Promise<ValidationResult>;

  /**
   * Validates an Asset Schema.
   * @param signedAssetSchema The Asset Schema to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Asset Schema.
   */
  validateAssetSchema(
    signedAssetSchema: SignedAssetSchema,
  ): Promise<ValidationResult>;

  /**
   * Validates a Schema Profile.
   * @param signedSchemaProfile The Schema Profile to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Schema Profile.
   */
  validateSchemaProfile(
    signedSchemaProfile: SignedSchemaProfile,
  ): Promise<ValidationResult>;

  /**
   * Validates a Tokenized Asset Record.
   * @param tokenizedAssetRecord The Tokenized Asset Record to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Tokenized
   */
  validateTokenizedAssetRecord(
    tokenizedAssetRecord: TokenizedAssetRecord,
  ): Promise<ValidationResult>;

  /**
   * Validates a Token Issuance Authorization.
   * @param tokenIssuanceAuthorization The Token Issuance Authorization to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Token Issuance Authorization.
   */
  validateTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<ValidationResult>;

  /**
   * Validates an Asset Schema Authority Certificate.
   * @param assetSchemaAuthorityCertificate The Asset Schema Authority Certificate to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Asset Schema Authority Certificate.
   */
  validateAssetSchemaAuthorityCertificate(
    assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate,
  ): Promise<ValidationResult>;

  /**
   * Validates an Asset Provider Certificate.
   * @param assetProviderCertificate The Asset Provider Certificate to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Asset Provider Certificate.
   */
  validateAssetProviderCertificate(
    assetProviderCertificate: AssetProviderCertificate,
  ): Promise<ValidationResult>;
}

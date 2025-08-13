import {
  AssetSchema,
  SchemaProfile,
  TokenIssuanceAuthorizationRequest,
  TokenIssuanceAuthorization,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import { ValidationResult } from "../../../../../../types/asset-schema-architecture-types.type";

export interface IValidationService {
  /**
   * Validates an Asset Schema.
   * @param signedAssetSchema The Asset Schema to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Asset Schema.
   */
  validateAssetSchema(assetSchema: AssetSchema): Promise<ValidationResult>;

  /**
   * Validates a Schema Profile.
   * @param signedSchemaProfile The Schema Profile to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Schema Profile.
   */
  validateSchemaProfile(
    schemaProfile: SchemaProfile,
  ): Promise<ValidationResult>;

  /**
   * Validates a Token Issuance Authorization Request.
   * @param tokenIssuanceAuthorizationRequest The Token Issuance Authorization request to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Token Issuance Authorization Request.
   */
  validateTokenIssuanceAuthorizationRequest(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<ValidationResult>;

  /**
   * Validates a Token Issuance Authorization.
   * @param tokenIssuanceAuthorization The Token Issuance Authorization to validate.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Token Issuance Authorization.
   */
  validateTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<ValidationResult>;
}

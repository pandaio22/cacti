import {
  AssetSchema,
  AssetSchemaDidDocument,
  CommissionedAssetSchema,
  SchemaProfile,
  SchemaProfileDidDocument,
  CommissionedSchemaProfile,
  TokenIssuanceAuthorization,
  TokenIssuanceAuthorizationRequest,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

export interface IAssetSchemaAuthorityService {
  /*
   *
   */
  certifyAssetSchema(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
  ): Promise<CommissionedAssetSchema>;

  /*
   *
   */
  certifySchemaProfile(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<CommissionedSchemaProfile>;

  /*
   * @requires - tokenIssuanceAuthorizationRequest to be signed by the Asset Provider
   * @requires - tokenIssuanceAuthorizationRequest to contain the public key of the Asset Provider
   * @requires - tokenIssuanceAuthorizationRequest to contain a reference to a Network
   * @requires - tokenIssuanceAuthorizationRequest to contain a reference to the Asset Schema-Profile
   * @ensures - the Asset Schema Authority that has signed the TIA has also created the Asset Schema-Profile (or the specific Asset Schema-Profile version)
   * @ensures - TokenIssuanceAuthorization contains the Asset Provider public key
   * @ensures - TokenIssuanceAuthorization is signed by the Asset Schema Authority
   */
  requestTokenIssuanceAuthorization(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<TokenIssuanceAuthorization>;
}

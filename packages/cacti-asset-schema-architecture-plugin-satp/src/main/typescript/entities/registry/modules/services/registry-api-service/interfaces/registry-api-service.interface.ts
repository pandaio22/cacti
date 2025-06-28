import {
  SignedAssetSchema,
  CommissionedAssetSchemaID,
  CommissionedSchemaProfileID,
  CommissionedTokenizedAssetRecordID,
  TokenIssuanceAuthorization,
  TokenIssuanceAuthorizationID,
  TokenizedAssetRecord,
  SignedSchemaProfile,
  AssetSchemaAuthorityCertificate,
  RegisteredAssetSchemaAuthorityID,
  AssetProviderCertificate,
  RegisteredAssetProviderID,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

export interface IRegistryApiService {
  getAssetSchema(uid: string): Promise<SignedAssetSchema>;

  commissionAssetSchema(
    signedAssetSchema: SignedAssetSchema,
  ): Promise<CommissionedAssetSchemaID>;

  commissionSchemaProfile(
    signedSchemaProfile: SignedSchemaProfile,
  ): Promise<CommissionedSchemaProfileID>;

  commissionTokenizedAssetRecord(
    tokenizedAssetRecord: TokenizedAssetRecord,
  ): Promise<CommissionedTokenizedAssetRecordID>;

  registerTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<TokenIssuanceAuthorizationID>;

  registerAssetSchemaAuthority(
    assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate,
  ): Promise<RegisteredAssetSchemaAuthorityID>;

  registerAssetProvider(
    assetProviderCertificate: AssetProviderCertificate,
  ): Promise<RegisteredAssetProviderID>;
}

import {
  SignedAssetSchema,
  CommissionedAssetSchemaID,
  CommissionedSchemaProfileID,
  CommissionedTokenizedAssetRecordID,
  TokenIssuanceAuthorization,
  TokenIssuanceAuthorizationID,
  TokenizedAssetRecord,
  SignedSchemaProfile,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

export interface IRegistryApiService {
  getAssetSchemaById(uid: string): Promise<any>;

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
}

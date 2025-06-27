import {
  SignedAssetSchema,
  CommissionedAssetSchemaID,
  CommissionedSchemaProfileID,
  TokenIssuanceAuthorization,
  TokenIssuanceAuthorizationID,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

export interface IRegistryApiService {
  getAssetSchemaById(uid: string): Promise<any>;

  commissionAssetSchema(
    signedAssetSchema: SignedAssetSchema,
  ): Promise<CommissionedAssetSchemaID>;

  commissionSchemaProfile(data: any): Promise<string>;

  commissionTokenizedAssetRecord(data: any): Promise<string>;

  registerTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<TokenIssuanceAuthorizationID>;
}

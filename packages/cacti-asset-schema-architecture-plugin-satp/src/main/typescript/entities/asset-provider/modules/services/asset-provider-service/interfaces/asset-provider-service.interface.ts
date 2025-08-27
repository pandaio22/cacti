import {
  TokenIssuanceAuthorizationRequest,
  TokenIssuanceAuthorization,
  SchemaProfileDidDocument,
  TokenizedAssetRecord,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import { ValidationResult } from "../../../../../../types/asset-schema-architecture-types.type";

export default interface IAssetProviderService {
  createTokenIssuanceAuthorizationRequest(
    networkId: string,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<TokenIssuanceAuthorizationRequest>;

  verifyTokenIssuanceAuthorizationRequest(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<ValidationResult>;

  /*createTokenizedAssetRecord(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<TokenizedAssetRecord>;
  */
}

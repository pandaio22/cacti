import {
  TokenIssuanceAuthorizationRequest,
  TokenIssuanceAuthorization,
  SchemaProfileDidDocument,
  TokenizedAssetRecord,
  TokenizedAssetRecordDidDocument,
  TokenizedAssetRecordVerifiableCredential,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import { ValidationResult } from "../../../../../../types/asset-schema-architecture-types.type";

export interface IAssetProviderService {
  createTokenIssuanceAuthorizationRequest(
    networkId: string,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<TokenIssuanceAuthorizationRequest>;

  verifyTokenIssuanceAuthorizationRequest(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<ValidationResult>;

  createTokenizedAssetRecord(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<{
    tokenizedAssetRecord: TokenizedAssetRecord;
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential;
    tokenizedAssetRecordDidDocument: TokenizedAssetRecordDidDocument;
  }>;

  verifyTokenizedAssetRecord(
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential,
  ): Promise<ValidationResult>;
}

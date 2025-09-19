import {
  AssetSchema,
  AssetSchemaDidDocument,
  AssetSchemaVerifiableCredential,
  TokenIssuanceAuthorization,
  TokenizedAssetRecord,
  TokenizedAssetRecordDidDocument,
  TokenizedAssetRecordVerifiableCredential,
  SchemaProfile,
  SchemaProfileDidDocument,
  SchemaProfileVerifiableCredential,
  AssetSchemaAuthorityCertificate,
  AssetProviderCertificate,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

/**
 * Interface for a DID Resolver Service with a single resolve method
 */
export interface IDidResolverService {
  /**
   * Resolve a DID to its DID Document only
   */
  resolve(
    did: string,
    options: { type: "didDocument" },
  ): Promise<
    | AssetSchemaDidDocument
    | SchemaProfileDidDocument
    | TokenizedAssetRecordDidDocument
    | AssetSchemaAuthorityCertificate
    | AssetProviderCertificate
    | null
  >;

  /**
   * Resolve a DID to its Schema Document only
   */
  resolve(
    did: string,
    options: { type: "schemaDocument" },
  ): Promise<AssetSchema | SchemaProfile | TokenizedAssetRecord | null>;

  /**
   * Resolve a DID to its Verifiable Credential only
   */
  resolve(
    did: string,
    options: { type: "verifiableCredential" },
  ): Promise<
    | AssetSchemaVerifiableCredential
    | SchemaProfileVerifiableCredential
    | TokenizedAssetRecordVerifiableCredential
    | TokenIssuanceAuthorization
    | null
  >;

  /**
   * Resolve a DID to all associated documents
   */
  resolve(
    did: string,
    options?: { type?: "all" },
  ): Promise<{
    did: string;
    didDocument:
      | AssetSchemaDidDocument
      | SchemaProfileDidDocument
      | TokenizedAssetRecordDidDocument
      | AssetSchemaAuthorityCertificate
      | AssetProviderCertificate;
    schemaDocument?: AssetSchema | SchemaProfile | TokenizedAssetRecord;
    verifiableCredential?:
      | AssetSchemaVerifiableCredential
      | SchemaProfileVerifiableCredential
      | TokenizedAssetRecordVerifiableCredential;
  }>;
}

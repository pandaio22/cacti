import { VerifiablePresentation } from "@digitalbazaar/vc";
import {
  AssetSchema,
  AssetSchemaDidDocument,
  AssetSchemaVerifiableCredential,
  CommissionedAssetSchemaID,
  CommissionedSchemaProfileID,
  CommissionedTokenizedAssetRecordID,
  TokenIssuanceAuthorization,
  TokenIssuanceAuthorizationID,
  TokenizedAssetRecord,
  SchemaProfile,
  SchemaProfileDidDocument,
  SchemaProfileVerifiableCredential,
  AssetSchemaAuthorityCertificate,
  RegisteredAssetSchemaAuthorityID,
  AssetProviderCertificate,
  RegisteredAssetProviderID,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

/**
 * IRegistryService
 * -----------------
 * Interface defining a registry service for managing and retrieving asset-related entities.
 * The registry handles Asset Schemas, Schema Profiles, Tokenized Asset Records,
 * Token Issuance Authorizations, and certificates for authorities and providers.
 * Implementers provide methods to retrieve, commission, and register these entities.
 */
export interface IRegistryService {
  //verifyAsset(uid: string, challenge?: string): VerifiablePresentation;
  /**
   * Retrieves an Asset Schema and its associated artifacts by unique identifier.
   *
   * @param uid - Unique identifier of the Asset Schema.
   * @returns Promise containing:
   *  - assetSchema: The asset schema definition.
   *  - assetSchemaDidDocument: The DID document linked to the schema.
   *  - assetSchemaVerifiableCredential: The verifiable credential attesting the schema.
   */
  getAssetSchema(uid: string): Promise<{
    assetSchema: AssetSchema;
    assetSchemaDidDocument: AssetSchemaDidDocument;
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential;
  }>;

  /**
   * Retrieves a Schema Profile and its associated artifacts by unique identifier.
   *
   * @param uid - Unique identifier of the Schema Profile.
   * @returns Promise containing:
   *  - schemaProfile: The schema profile definition.
   *  - schemaProfileDidDocument: The DID document linked to the profile.
   *  - schemaProfileVerifiableCredential: The verifiable credential attesting the profile.
   */
  getSchemaProfile(uid: string): Promise<{
    schemaProfile: SchemaProfile;
    schemaProfileDidDocument: SchemaProfileDidDocument;
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential;
  }>;

  /**
   * Retrieves a Tokenized Asset Record by unique identifier.
   *
   * @param uid - Unique identifier of the Tokenized Asset Record.
   * @returns Promise containing the full Tokenized Asset Record.
   */
  getTokenizedAssetRecord(uid: string): Promise<TokenizedAssetRecord>;

  /**
   * Retrieves a registered Asset Schema Authority by unique identifier.
   *
   * @param uid - Unique identifier of the Asset Schema Authority.
   * @returns Promise containing the Asset Schema Authority Certificate.
   */
  getAssetSchemaAuthority(
    uid: string,
  ): Promise<AssetSchemaAuthorityCertificate>;

  /**
   * Retrieves a registered Asset Provider by unique identifier.
   *
   * @param uid - Unique identifier of the Asset Provider.
   * @returns Promise containing the Asset Provider Certificate.
   */
  getAssetProvider(uid: string): Promise<AssetProviderCertificate>;

  /**
   * Commissions (registers) a new Asset Schema in the registry.
   *
   * @param assetSchema - The asset schema definition.
   * @param assetSchemaDidDocument - DID document linked to the schema.
   * @param assetSchemaVerifiableCredential - Verifiable credential attesting the schema.
   * @returns Promise resolving to the commissioned Asset Schema ID.
   */
  commissionAssetSchema(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<CommissionedAssetSchemaID>;

  /**
   * Commissions (registers) a new Schema Profile in the registry.
   *
   * @param schemaProfile - The schema profile definition.
   * @param schemaProfileDidDocument - DID document linked to the profile.
   * @param schemaProfileVerifiableCredential - Verifiable credential attesting the profile.
   * @returns Promise resolving to the commissioned Schema Profile ID.
   */
  commissionSchemaProfile(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<CommissionedSchemaProfileID>;

  /**
   * Commissions (registers) a new Tokenized Asset Record in the registry.
   *
   * @param tokenizedAssetRecord - The full tokenized asset record.
   * @returns Promise resolving to the commissioned Tokenized Asset Record ID.
   */
  commissionTokenizedAssetRecord(
    tokenizedAssetRecord: TokenizedAssetRecord,
  ): Promise<CommissionedTokenizedAssetRecordID>;

  /**
   * Registers a Token Issuance Authorization in the registry.
   *
   * @param tokenIssuanceAuthorization - Authorization document for token issuance.
   * @returns Promise resolving to the Token Issuance Authorization ID.
   */
  registerTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<TokenIssuanceAuthorizationID>;

  /**
   * Registers an Asset Schema Authority in the registry.
   *
   * @param assetSchemaAuthorityCertificate - Certificate proving the authority of the schema issuer.
   * @returns Promise resolving to the registered Asset Schema Authority ID.
   */
  registerAssetSchemaAuthority(
    assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate,
  ): Promise<RegisteredAssetSchemaAuthorityID>;

  /**
   * Registers an Asset Provider in the registry.
   *
   * @param assetProviderCertificate - Certificate proving the provider's identity and authority.
   * @returns Promise resolving to the registered Asset Provider ID.
   */
  registerAssetProvider(
    assetProviderCertificate: AssetProviderCertificate,
  ): Promise<RegisteredAssetProviderID>;
}

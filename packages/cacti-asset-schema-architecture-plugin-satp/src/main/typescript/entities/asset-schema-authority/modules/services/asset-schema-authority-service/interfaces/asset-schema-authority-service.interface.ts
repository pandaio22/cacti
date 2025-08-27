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
  /**
   * Certifies an Asset Schema by wrapping it into a Verifiable Credential (VC),
   * signed by the Asset Schema Authority.
   *
   * @requires Valid and non-empty DID and Asset Schema.
   *
   * @ensures Valid and successfully verifiable credential of the Asset Schema.
   *
   * @param assetSchema - The Asset Schema definition to be certified.
   * @param assetSchemaDidDocument - The DID Document of the Asset Schema, containing its verification methods.
   * @returns A CommissionedAssetSchema VC, signed and verifiable.
   *
   * @throws {Error} If the Asset Schema is invalid or incomplete.
   * @throws {Error} If the DID Document is invalid or missing required verification methods.
   * @throws {Error} If signing the credential by the Asset Schema Authority fails.
   */
  certifyAssetSchema(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
  ): Promise<CommissionedAssetSchema>;

  /**
   * Certifies a Schema Profile by wrapping it into a Verifiable Credential (VC),
   * signed by the Asset Schema Authority.
   *
   * @requires Valid and non-empty DID and Schema Profile.
   *
   * @ensures Valid and successfully verifiable credential of the Schema Profile.
   *
   * @param schemaProfile - The Schema Profile definition to be certified.
   * @param schemaProfileDidDocument - The DID Document of the Schema Profile, containing its verification methods.
   * @returns A CommissionedSchemaProfile VC, signed and verifiable.
   *
   * @throws {Error} If the Schema Profile is invalid or incomplete.
   * @throws {Error} If the DID Document is invalid or missing required verification methods.
   * @throws {Error} If signing the credential by the Asset Schema Authority fails.
   */
  certifySchemaProfile(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<CommissionedSchemaProfile>;

  /**
   * Issues a Token Issuance Authorization (TIA) VC in response to a valid request.
   *
   * @requires tokenIssuanceAuthorizationRequest to be valid and non-empty
   * @requires tokenIssuanceAuthorizationRequest to be signed by the Asset Provider.
   * @requires tokenIssuanceAuthorizationRequest to contain the public key of the Asset Provider.
   * @requires tokenIssuanceAuthorizationRequest to contain a reference to a Network.
   * @requires tokenIssuanceAuthorizationRequest to contain a reference to the Asset Schema-Profile.
   *
   * @ensures the Asset Schema Authority that has signed the TIA also certified the
   *          Asset Schema-Profile (or the specific version referenced).
   * @ensures the Token Issuance Authorization VC contains the Asset Provider public key.
   * @ensures the Token Issuance Authorization VC is signed by the Asset Schema Authority.
   * @ensures Valid and successfully verifiable credential of the Token Issuance Authorization
   *
   * @param tokenIssuanceAuthorizationRequest - The Token Issuance Authorization Request VC
   *                                            provided by the Asset Provider.
   * @returns A TokenIssuanceAuthorization VC, signed by the Asset Schema Authority.
   * @throws {Error} If the Token Issuance Authorization Request is invalid or unsigned.
   * @throws {Error} If the Asset Schema Authority cannot validate the referenced Schema Profile
   */
  requestTokenIssuanceAuthorization(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<TokenIssuanceAuthorization>;
}

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
import { VerifiableCredentialService } from "../../verifiable-credential-service/implementations/verifiable-credential-service";
import { ValidationService } from "../../validation-service/implementations/validation-service";
import {
  ValidationErrorDetail,
  ValidationErrorType,
} from "../../../../../../types/asset-schema-architecture-types.type";
import { IAssetSchemaAuthorityService } from "../interfaces/asset-schema-authority-service.interface";

export class AssetSchemaAuthorityService
  implements IAssetSchemaAuthorityService
{
  private localContexts: Record<string, any> | undefined;
  private validationService: ValidationService;
  private verifiableCredentialService: VerifiableCredentialService;

  constructor(localContexts?: Record<string, any>) {
    this.localContexts = localContexts;
    this.validationService = new ValidationService(localContexts);
    this.verifiableCredentialService = new VerifiableCredentialService(
      localContexts,
    );
  }
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
  public async certifyAssetSchema(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
  ): Promise<CommissionedAssetSchema> {
    try {
      //1st - Validate Inputs
      console.debug("Certifying Asset Schema...\n");
      if (!assetSchema || !assetSchemaDidDocument) {
        throw new Error(
          "Missing Required Inputs: Asset Schema and DID Document are required.",
        );
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      //2nd - If Valid, create VC for Asset Schema. Else, throw error
      if (
        !(await this.validationService.validateAssetSchema(assetSchema)).valid
      ) {
        throw new Error("Invalid Input: Asset Schema is invalid.");
      }
      if (
        !(
          await this.validationService.validateDidDocument(
            assetSchemaDidDocument,
          )
        ).valid
      ) {
        throw new Error("Invalid Input: Asset Schema DID Document is invalid.");
      }

      const assetSchemaVerifiableCredential =
        await this.verifiableCredentialService.createAssetSchemaVerifiableCredential(
          assetSchema,
          assetSchemaDidDocument,
        );
      console.debug(
        "Asset Schema Verifiable Credential:\n",
        assetSchemaVerifiableCredential,
      );

      if (
        !this.verifiableCredentialService.verifyAssetSchemaVerifiableCredential(
          assetSchemaVerifiableCredential,
        )
      ) {
        throw new Error(
          "Invalid Verifiable Credential: Error when verifying Verifiable Credential.",
        );
      }
      //3rd - Call Registry endpoint to commission Asset Schema, Asset Schema VC and Asset Schema DID Document

      //###CALL REGISTRY - TODOOO

      return assetSchemaVerifiableCredential as CommissionedAssetSchema;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.CERTIFY_ASSET_SCHEMA_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }

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
  public async certifySchemaProfile(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<CommissionedSchemaProfile> {
    try {
      //1st - Validate Inputs
      console.debug("Certifying Schema Profile...\n");
      if (!schemaProfile || !schemaProfile) {
        throw new Error(
          "Missing Required Inputs: Schema Profile and DID Document are required.",
        );
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      //2nd - If Valid, create VC for Schema Profile. Else, throw error
      if (
        !(await this.validationService.validateSchemaProfile(schemaProfile))
          .valid
      ) {
        throw new Error("Invalid Input: Schema Profile is invalid.");
      }
      if (
        !(
          await this.validationService.validateDidDocument(
            schemaProfileDidDocument,
          )
        ).valid
      ) {
        throw new Error(
          "Invalid Input: Schema Profile DID Document is invalid.",
        );
      }

      const schemaProfileVerifiableCredential =
        await this.verifiableCredentialService.createSchemaProfileVerifiableCredential(
          schemaProfile,
          schemaProfileDidDocument,
        );
      console.debug(
        "Schema Profile Verifiable Credential:\n",
        schemaProfileVerifiableCredential,
      );

      if (
        !this.verifiableCredentialService.verifySchemaProfileVerifiableCredential(
          schemaProfileVerifiableCredential,
        )
      ) {
        throw new Error(
          "Invalid Verifiable Credential: Error when verifying Verifiable Credential.",
        );
      }
      //3rd - Call Registry endpoint to commission Asset Schema, Asset Schema VC and Asset Schema DID Document

      //###TODO - CALL REGISTRY

      return schemaProfileVerifiableCredential as CommissionedSchemaProfile;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.CERTIFY_SCHEMA_PROFILE_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }

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
  public async requestTokenIssuanceAuthorization(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<TokenIssuanceAuthorization> {
    try {
      //1st - Validate Inputs
      console.debug("Creating Token Issuance Authorization...\n");
      if (!tokenIssuanceAuthorizationRequest) {
        throw new Error(
          "Missing Required Inputs: Token Issuance Authorization Request is required.",
        );
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      //2nd - If Valid, create VC for Asset Schema. Else, throw error
      if (
        !(
          await this.validationService.validateTokenIssuanceAuthorizationRequest(
            tokenIssuanceAuthorizationRequest,
          )
        ).valid
      ) {
        throw new Error(
          "Invalid Input: Token Issuance Authorization Request is invalid.",
        );
      }

      // TODO - Add verify Token Issuance Authorization Request

      const tokenIssuanceAuthorization =
        await this.verifiableCredentialService.createTokenIssuanceAuthorization(
          tokenIssuanceAuthorizationRequest,
        );
      console.debug(
        "Token Issuance Authorization:\n",
        tokenIssuanceAuthorization,
      );

      if (
        !this.verifiableCredentialService.verifyTokenIssuanceAuthorization(
          tokenIssuanceAuthorization,
        )
      ) {
        throw new Error(
          "Invalid Verifiable Credential: Error when verifying Verifiable Credential.",
        );
      }

      //3rd - Call Registry endpoint to commission Asset Schema, Asset Schema VC and Asset Schema DID Document

      return tokenIssuanceAuthorization as TokenIssuanceAuthorization;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.REQUEST_TOKEN_ISSUANCE_AUTHORIZATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }
}

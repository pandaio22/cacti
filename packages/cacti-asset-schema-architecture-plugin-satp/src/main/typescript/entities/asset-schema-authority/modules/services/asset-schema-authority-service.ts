/*import { SignatureService } from "./signature-service";
import { PRIVATE_KEYS_PEM } from "../../../../constants/constants";
import { TokenIssuanceAuthorizationRequest } from "../../../../generated/asset-schema-architecture/typescript-axios/api";

const signatureService = new SignatureService();
export class AssetSchemaAuthorityService {
  /**
   * Signs an asset schema using the private key PEM.
   * @param assetSchema - The asset schema to sign.
   * @returns A promise that resolves to the signed asset schema.
   * @throws Error if the asset schema is invalid or signing fails.
   
  public async signAssetSchema(assetSchema: any): Promise<string> {
    try {
      console.log("Signing asset schema:", assetSchema);

      if (!assetSchema || typeof assetSchema !== "object") {
        throw new Error("Invalid asset schema provided for signing.");
      }
      if (!PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY) {
        throw new Error("Private key PEM is not set in environment variables.");
      }

      const signedSchema = await signatureService.sign(
        assetSchema,
        PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY,
      );
      console.log("Asset schema signed successfully:", signedSchema);
      // TODO - Here you would typically save the signed schema to a file or database

      return signedSchema;
    } catch (error) {
      console.error("Error signing asset schema:", error);
      throw error;
    }
  }

  /**
   * Signs a schema profile using the private key PEM.
   * @param schemaProfile - The schema profile to sign.
   * @returns A promise that resolves to the signed schema profile.
   * @throws Error if the schema profile is invalid or signing fails.
   
  public async signSchemaProfile(schemaProfile: any): Promise<string> {
    try {
      console.log("Signing schema profile:", schemaProfile);

      if (!schemaProfile || typeof schemaProfile !== "object") {
        throw new Error("Invalid schema profile provided for signing.");
      }
      if (!PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY) {
        throw new Error("Private key PEM is not set in environment variables.");
      }

      const signedProfile = await signatureService.sign(
        schemaProfile,
        PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY,
      );
      console.log("Schema profile signed successfully:", signedProfile);
      // TODO - Here you would typically save the signed profile to a file or database

      return signedProfile;
    } catch (error) {
      console.error("Error signing schema profile:", error);
      throw error;
    }
  }

  /**
   * Validates and signs an asset schema using the private key PEM.
   * @param assetSchema - The asset schema to certify.
   * @returns A promise that resolves to the certified asset schema.
   * @throws Error if the asset schema is invalid or signing fails.
   
  public async handleAssetSchemaCertification(
    assetSchema: any,
  ): Promise<string> {
    try {
      console.log("Certifying asset schema:", assetSchema);

      if (!assetSchema || typeof assetSchema !== "object") {
        throw new Error("Invalid asset schema provided for signing.");
      }
      if (!PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY) {
        throw new Error("Private key PEM is not set in environment variables.");
      }

      //const signedSchema = await signatureService.sign(
      //  assetSchema,
      //  PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY,
      //);
      //console.log("Asset schema signed successfully:", signedSchema);
      // TODO - Here you would typically save the signed schema to a file or database

      //return signedSchema;
      return "Success";
    } catch (error) {
      console.error("Error signing asset schema:", error);
      throw error;
    }
  }

  /**
   * Validates and signs a schema profile using the private key PEM.
   * @param schemaProfile - The schema profile to certify.
   * @returns A promise that resolves to the certified schema profile.
   * @throws Error if the schema profile is invalid or signing fails.
   
  public async handleSchemaProfileCertification(
    schemaProfile: any,
  ): Promise<string> {
    try {
      console.log("Certifying schema profile:", schemaProfile);

      if (!schemaProfile || typeof schemaProfile !== "object") {
        throw new Error("Invalid schema profile provided for signing.");
      }
      if (!PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY) {
        throw new Error("Private key PEM is not set in environment variables.");
      }

      //const signedProfile = await signatureService.sign(
      //  schemaProfile,
      //  PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY,
      //);
      //console.log("Schema profile signed successfully:", signedProfile);
      // TODO - Here you would typically save the signed profile to a file or database

      //return signedProfile;
      return "Success";
    } catch (error) {
      console.error("Error signing schema profile:", error);
      throw error;
    }
  }

  /**
   * Signs a token issuance authorization request, using the private key PEM, hands sends it to the registry.
   * @param tokenIssuanceAuthorizationRequest - The request to sign.
   * @returns A promise that resolves to the signed token issuance authorization.
   * @throws Error if the request is invalid or signing fails.
   
  public async handleTokenIssuanceAuthorizationRequest(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<string> {
    //TODO
    //1st - Receives TIAR
    console.log(
      "Handling token issuance authorization request:",
      tokenIssuanceAuthorizationRequest,
    );
    try {
      //2nd - Validate TIAR
      /*TODO*/

      //3rd - If Valid, create TIA. Else, throw exception
      /*
      const wrappedTokenIssuanceAuthorization = {
        token_issuance_authorization_request: tokenIssuanceAuthorizationRequest,
      };

      console.debug(wrappedTokenIssuanceAuthorization);

      const tokenIssuanceAuthorization = await signatureService.sign(
        wrappedTokenIssuanceAuthorization,
        PRIVATE_KEYS_PEM.ASSET_SCHEMA_AUTHORITY,
      );

      //4th - Register TIA in the Registry (call registry API)
      //TODO

      //5th - If registered successfully, return TIA. Else, throw exception
      return tokenIssuanceAuthorization;
      //ADD A CLOSE COMMENT HERE
      return "Success";
    } catch (error) {
      console.error(
        "Error processing the Token Issuance Authorization Request:",
        error,
      );
      throw error;
    }
  }
}
*/
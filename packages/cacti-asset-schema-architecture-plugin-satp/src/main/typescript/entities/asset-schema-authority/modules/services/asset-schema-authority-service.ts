import { SignatureService } from "./signature-service";
import { PRIVATE_KEYS_PEM } from "../../../../constants/constants";

const signatureService = new SignatureService();
export class AssetSchemaAuthorityService {
  /**
   * Signs an asset schema using the private key PEM.
   * @param assetSchema - The asset schema to sign.
   * @returns A promise that resolves to the signed asset schema.
   * @throws Error if the asset schema is invalid or signing fails.
   */
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
}

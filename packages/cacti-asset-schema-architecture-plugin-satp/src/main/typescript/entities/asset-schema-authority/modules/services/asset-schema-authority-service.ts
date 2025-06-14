import { SignatureService } from "./signature-service";
import { PRIVATE_KEY_PEM } from "../../../../constants/constants";

const signatureService = new SignatureService();
export class AssetSchemaAuthorityService {
  // Placeholder for future implementation
  public async signAssetSchema(assetSchema: any): Promise<string> {
    try {
      console.log("Signing asset schema:", assetSchema);

      if (!assetSchema || typeof assetSchema !== "object") {
        throw new Error("Invalid asset schema provided for signing.");
      }
      if (!PRIVATE_KEY_PEM) {
        throw new Error("Private key PEM is not set in environment variables.");
      }

      const signedSchema = await signatureService.sign(
        assetSchema,
        PRIVATE_KEY_PEM,
      );
      console.log("Asset schema signed successfully:", signedSchema);
      // Here you would typically save the signed schema to a file or database

      return signedSchema;
    } catch (error) {
      console.error("Error signing asset schema:", error);
      throw error;
    }
  }
}

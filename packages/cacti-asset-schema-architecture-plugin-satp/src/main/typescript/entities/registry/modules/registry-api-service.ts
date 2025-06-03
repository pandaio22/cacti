import { ValidationService } from "./validation/validation-service";
import { JsonLdValidationResult } from "./validation/validation-types";
import { DatabaseIpfsConnector } from "./database/database-ipfs-connector";

export class RegistryApiService {
  // This class can be extended with methods to handle asset data validation,
  // communication with external services, or any other business logic needed
  // for the registry API.
  private databaseConnector: DatabaseIpfsConnector;
  constructor() {
    this.databaseConnector = new DatabaseIpfsConnector();
  }
  /**
   * Commission an asset by validating its data and adding it to IPFS.
   * @param data - The asset data to be commissioned.
   * @returns A promise that resolves when the asset is successfully commissioned.
   */
  public async commissionAsset(data: any): Promise<string> {
    await this.validateAssetData(data);
    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    return artifactSchemaId;
    //Remaining logic for commissioning the asset can be added here.
  }
  /**
   * Validates the asset data structure using the ValidationService.
   * Throws an error if the data is not valid.
   * @param data - The asset data to validate.
   * @returns A promise that resolves if the data is valid.
   */
  private async validateAssetData(data: any): Promise<void> {
    const validationService = new ValidationService();

    const validJsonLd: JsonLdValidationResult =
      await validationService.validateJsonLdStructure(data);
    console.log("Validating asset data:", validJsonLd);

    if (!validJsonLd.valid) {
      console.error(validJsonLd.errors);
      throw new Error(validJsonLd.errors.join(", "));
    } else {
      console.log("Commissioning asset with data:", data);
    }
  }
}

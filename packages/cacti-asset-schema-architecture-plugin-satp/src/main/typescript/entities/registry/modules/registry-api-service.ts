import { ValidationService } from "./validation/validation-service";
import { JsonLdValidationResult } from "./validation/validation-types";

export class RegistryApiService {
  // This class can be extended with methods to handle asset data validation,
  // communication with external services, or any other business logic needed
  // for the registry API.

  public async commissionAsset(data: any): Promise<void> {
    await this.validateAssetData(data);
    //Remaining logic for commissioning the asset can be added here.
  }
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

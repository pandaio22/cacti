/* eslint-disable prettier/prettier */
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
   * Commission an asset schema by validating its data and adding it to IPFS.
   * @param data - The asset schema data to be commissioned.
   * @returns A promise that resolves when the asset is successfully commissioned.
   */
  public async commissionAssetSchema(data: any): Promise<string> {
    await this.validateAssetSchema(data);
    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    return artifactSchemaId;
    //Remaining logic for commissioning the asset can be added here.
  }

  /**
   * Commissions a schema profile by validating its data and adding it to IPFS.
   * @param data - The schema profile data to be commissioned.
   * @returns A promise that resolves to the CID of the commissioned schema profile.
   */
  public async commissionSchemaProfile(data: any): Promise<string> {
    await this.validateSchemaProfile(data);
    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    return artifactSchemaId;
  }
  /**
   * Validates the asset data structure using the ValidationService.
   * Throws an error if the data is not valid.
   * @param data - The asset data to validate.
   * @returns A promise that resolves if the data is valid.
   */
  private async validateAssetSchema(data: any): Promise<void> {
    const validationService = new ValidationService();

    const validJsonLd: JsonLdValidationResult =
      await validationService.validateJsonLdStructure(data);
    console.log("Validating asset data:", validJsonLd);

    //Validate Semantics
    //TODO

    if (!validJsonLd.valid) {
      console.error(validJsonLd.errors);
      throw new Error(validJsonLd.errors.join(", "));
    } else {
      console.log("Commissioning asset with data:", data);
    }
  }

  private async validateSchemaProfile(data: any): Promise<void> {
    const validationService = new ValidationService();

    //Validate Syntax
    const validJsonLd: JsonLdValidationResult =
      await validationService.validateSchemaProfile(data);
    console.log("Validating schema profile:", validJsonLd);

    //Validate Semantics
    //TODO

    if (!validJsonLd.valid) {
      console.error(validJsonLd.errors);
      throw new Error(validJsonLd.errors.join(", "));
    } else {
      console.log("Commissioning schema profile with data:", data);
    }
  }
}

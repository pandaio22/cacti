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
    const validationService = new ValidationService();

    await validationService.validateAssetSchema(data);
    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    //Remaining logic for commissioning the asset can be added here.
    return artifactSchemaId;
    
  }

  /**
   * Commissions a schema profile by validating its data and adding it to IPFS.
   * @param data - The schema profile data to be commissioned.
   * @returns A promise that resolves to the CID of the commissioned schema profile.
   */
  public async commissionSchemaProfile(data: any): Promise<string> {
    const validationService = new ValidationService();
    await validationService.validateSchemaProfile(data);
    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    //Remaining logic for commissioning the asset can be added here.
    return artifactSchemaId;
  }
}

/* eslint-disable prettier/prettier */
import { IValidationService } from "./validation/interfaces/validation-service-interface";
import { ValidationService } from "./validation/services/validation-service";
import { DatabaseIpfsConnector } from "./database/database-ipfs-connector";


export class RegistryApiService {
  private databaseConnector: DatabaseIpfsConnector;
  private validationService: IValidationService;

  /**
   * Constructs a new instance of the RegistryApiService.
   * @param validationService - An optional validation service to use for validating asset schemas and profiles.
   */
  constructor(validationService?: IValidationService) {
    this.databaseConnector = new DatabaseIpfsConnector();
    this.validationService = validationService ?? new ValidationService();
  }

  public async getAssetSchemaById(uid: string): Promise<any> {
    const assetSchema: any = await this.databaseConnector.getFileFromIpfs(uid);
    if (!assetSchema) {
      throw new Error(`Asset schema with UID ${uid} not found.`);
    }
    return assetSchema;

  }

  /**
   * Commission an asset schema by validating its data and adding it to IPFS.
   * @param data - The asset schema data to be commissioned.
   * @returns A promise that resolves when the asset is successfully commissioned.
   */
  public async commissionAssetSchema(data: any): Promise<string> {
    await this.validationService.validateAssetSchema(data);
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
    await this.validationService.validateSchemaProfile(data);
    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    //Remaining logic for commissioning the asset can be added here.
    return artifactSchemaId;
  }
}

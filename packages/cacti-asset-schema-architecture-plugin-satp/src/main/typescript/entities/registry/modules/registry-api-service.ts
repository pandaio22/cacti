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

  /**
   * Retrieves an asset schema by its unique identifier (UID).
   * @param uid - The unique identifier of the asset schema to retrieve.
   * @returns A promise that resolves to the asset schema data.
   * @throws An error if the asset schema with the given UID is not found.
   */
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

    if (!artifactSchemaId) {
      throw new Error("Failed to commission asset schema.");
    }
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
    if (!artifactSchemaId) {
      throw new Error("Failed to commission schema profile.");
    }
    return artifactSchemaId;
  }

  /**
   * Commissions a tokenized asset record by validating its data and adding it to IPFS.
   * @param data - The tokenized asset record data to be commissioned.
   * @returns A promise that resolves to the CID of the commissioned tokenized asset record.
   */
  public async commissionTokenizedAssetRecord(
    data: any
  ): Promise<string> {
    await this.validationService.validateTokenizedAssetRecord(data);
    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    // Remaining logic for commissioning the tokenized asset record can be added here.
    if (!artifactSchemaId) {
      throw new Error("Failed to commission tokenized asset record.");
    }
    return artifactSchemaId;
  }
}

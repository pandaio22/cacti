/* eslint-disable prettier/prettier */
import { IValidationService } from "./../../../validation/interfaces/validation-service-interface";
import { ValidationService } from "./../../../validation/services/validation-service";
import { DatabaseIpfsConnector } from "./../../../database/database-ipfs-connector";
import { TokenIssuanceAuthorization, TokenIssuanceAuthorizationID, SignedAssetSchema, CommissionedAssetSchemaID, CommissionedSchemaProfileID } from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import {IRegistryApiService} from "../interfaces/registry-api-service.interface";


export class RegistryApiService implements IRegistryApiService {
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
  public commissionAssetSchema(data: object): Promise<string>; //TO REMOVEEE
  public commissionAssetSchema(signedAssetSchema: SignedAssetSchema): Promise<CommissionedAssetSchemaID>;

  public async commissionAssetSchema(data: any | SignedAssetSchema): Promise<string | CommissionedAssetSchemaID> {
    //Add step to verify ASA signature
    await this.validationService.validateAssetSchema(data.asset_schema);

    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    //Remaining logic for commissioning the asset can be added here.

    if (!artifactSchemaId) {
      throw new Error("Failed to commission asset schema.");
    }

    if (this.isSignedAssetSchema(data)) {
      return {
        "@context": "https://www.w3.org/ns/did/v1.1",
        id: artifactSchemaId,
        type: "CommissionedAssetSchemaID",
      };
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

  public async registerTokenIssuanceAuthorization(tokenIssuanceAuthorization: TokenIssuanceAuthorization): Promise<TokenIssuanceAuthorizationID>{
    const tokenIssuanceAuthorizationId: string =
    await this.databaseConnector.addFileToIpfs(tokenIssuanceAuthorization);

    if (!tokenIssuanceAuthorizationId) {
      throw new Error("Failed to commission tokenized asset record.");
    }
    
    return { 
      '@context': "https://www.w3.org/ns/did/v1.1",
      id: tokenIssuanceAuthorizationId,
      type: "TokenIssuanceAuthorizationID",
    };
  }

  private isSignedAssetSchema(data: any): data is SignedAssetSchema {
    return data && typeof data === "object" && "proof" in data;
  }
}

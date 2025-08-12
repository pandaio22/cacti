/* eslint-disable prettier/prettier */
import { IValidationService } from "./../../../validation/interfaces/validation-service-interface";
import { ValidationService } from "./../../../validation/services/validation-service";
import { DatabaseIpfsConnector } from "./../../../database/database-ipfs-connector";
import { TokenIssuanceAuthorization, 
  TokenIssuanceAuthorizationID, 
  SignedAssetSchema, 
  CommissionedAssetSchemaID, 
  SignedSchemaProfile, 
  CommissionedSchemaProfileID,
  TokenizedAssetRecord,
  CommissionedTokenizedAssetRecordID,
  AssetSchemaAuthorityCertificate,
  RegisteredAssetSchemaAuthorityID,
  AssetProviderCertificate,
  RegisteredAssetProviderID,
 } from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
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
  public async getAssetSchema(uid: string): Promise<SignedAssetSchema> {
    if (uid.startsWith("did:ipfs:")) 
      uid = uid.substring("did:ipfs:".length);
  
    const assetSchema: SignedAssetSchema = await this.databaseConnector.getFileFromIpfs(uid);

    if (!assetSchema) 
      throw new Error(`Asset schema with UID ${uid} not found.`);
    
    return assetSchema;
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
   * Retrieves an schema profile by its unique identifier (UID).
   * @param uid - The unique identifier of the schema profile to retrieve.
   * @returns A promise that resolves to the schema profile data.
   * @throws An error if the schema profile with the given UID is not found.
   */
  public async getSchemaProfile(uid: string): Promise<SignedSchemaProfile> {
    if (uid.startsWith("did:ipfs:")) 
      uid = uid.substring("did:ipfs:".length);
  
    const schemaProfile: SignedSchemaProfile = await this.databaseConnector.getFileFromIpfs(uid);
    
    if (!schemaProfile) 
      throw new Error(`Schema Profile with UID ${uid} not found.`);
    
    return schemaProfile;
  }

  /**
   * Retrieves a Tokenized Asset Record (TAR) by its unique identifier (UID).
   * @param uid - The unique identifier of the TAR to retrieve.
   * @returns A promise that resolves to the TAR data.
   * @throws An error if the TAR with the given UID is not found.
   */
  public async getTokenizedAssetRecord(uid: string): Promise<TokenizedAssetRecord> {
    if (uid.startsWith("did:ipfs:")) 
      uid = uid.substring("did:ipfs:".length);
  
    const tokenizedAssetRecord: TokenizedAssetRecord = await this.databaseConnector.getFileFromIpfs(uid);
    
    if (!tokenizedAssetRecord) 
      throw new Error(`Tokenized Asset Record with UID ${uid} not found.`);
    
    return tokenizedAssetRecord;
  }

  /**
   * Retrieves an Asset Schema Authority (ASA) by its unique identifier (UID).
   * @param uid - The unique identifier of the ASA to retrieve.
   * @returns A promise that resolves to the ASA data.
   * @throws An error if the ASA with the given UID is not found.
   */
  public async getAssetSchemaAuthority(uid: string): Promise<AssetSchemaAuthorityCertificate> {
    if (uid.startsWith("did:ipfs:")) 
      uid = uid.substring("did:ipfs:".length);
  
    const assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate = await this.databaseConnector.getFileFromIpfs(uid);

    if (!assetSchemaAuthorityCertificate) 
      throw new Error(`Asset schema Authority with UID ${uid} not found.`);
    
    return assetSchemaAuthorityCertificate;
  }

  /**
   * Retrieves an Asset Provider by its unique identifier (UID).
   * @param uid - The unique identifier of the Asset Provider to retrieve.
   * @returns A promise that resolves to the Asset Provider data.
   * @throws An error if the Asset Provider with the given UID is not found.
   */
  public async getAssetProvider(uid: string): Promise<AssetProviderCertificate> {
    if (uid.startsWith("did:ipfs:")) 
      uid = uid.substring("did:ipfs:".length);
  
    const assetProviderCertificate: AssetProviderCertificate = await this.databaseConnector.getFileFromIpfs(uid);

    if (!assetProviderCertificate) 
      throw new Error(`Asset Provider with UID ${uid} not found.`);
    
    return assetProviderCertificate;
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

    if (this.isSchemaSigned<SignedAssetSchema>(data)) {
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
  public commissionSchemaProfile(data: object): Promise<string>; //TO REMOVEEE
  public commissionSchemaProfile(signedSchemaProfile: SignedSchemaProfile): Promise<CommissionedSchemaProfileID>;

  public async commissionSchemaProfile(data: any | SignedSchemaProfile): Promise<string | CommissionedSchemaProfileID> {
    //Add step to verify ASA signature

    await this.validationService.validateSchemaProfile(data.schema_profile);

    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);

    //Remaining logic for commissioning the asset can be added here.

    if (!artifactSchemaId) {
      throw new Error("Failed to commission schema profile.");
    }
    if (this.isSchemaSigned<SignedSchemaProfile>(data)) {
      return {
        "@context": "https://www.w3.org/ns/did/v1.1",
        id: artifactSchemaId,
        type: "CommissionedAssetSchemaID",
      };
    }
    return artifactSchemaId;
  }

  /**
   * Commissions a tokenized asset record by validating its data and adding it to IPFS.
   * @param data - The tokenized asset record data to be commissioned.
   * @returns A promise that resolves to the CID of the commissioned tokenized asset record.
   */
  public commissionTokenizedAssetRecord(data: object): Promise<string>; //TO REMOVEEE
  public commissionTokenizedAssetRecord(tokenizedAssetRecord: TokenizedAssetRecord): Promise<CommissionedTokenizedAssetRecordID>;

  public async commissionTokenizedAssetRecord(data: any | TokenizedAssetRecord): Promise<string | CommissionedTokenizedAssetRecordID> {
    await this.validationService.validateTokenizedAssetRecord(data);

    const artifactSchemaId: string =
      await this.databaseConnector.addFileToIpfs(data);
    // Remaining logic for commissioning the tokenized asset record can be added here.

    if (!artifactSchemaId) {
      throw new Error("Failed to commission tokenized asset record.");
    }
    if (this.isTokenizedAssetRecord(data)) {
      return {
        "@context": "https://www.w3.org/ns/did/v1.1",
        id: artifactSchemaId,
        type: "CommissionedTokenizedAssetRecordID",
      };
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

  public async registerAssetSchemaAuthority(assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate,
  ): Promise<RegisteredAssetSchemaAuthorityID>{
    const registeredAssetSchemaAuthorityID: string =
    await this.databaseConnector.addFileToIpfs(assetSchemaAuthorityCertificate);

    if (!registeredAssetSchemaAuthorityID) {
      throw new Error("Failed to register Asset Schema Authority.");
    }
    
    return { 
      'id': registeredAssetSchemaAuthorityID,
      type: "RegisteredAssetSchemaAuthority",
    };
  }

  public async registerAssetProvider(assetProviderCertificate: AssetProviderCertificate): Promise<RegisteredAssetProviderID> {
    const registeredAssetProviderID: string =
    await this.databaseConnector.addFileToIpfs(assetProviderCertificate);

    if (!registeredAssetProviderID) {
      throw new Error("Failed to register Asset Schema Authority.");
    }
    
    return { 
      id: registeredAssetProviderID,
      type: "RegisteredAssetProvider",
    };    
  }

  private isSchemaSigned<T extends { proof: unknown }>(data: any): data is T {
    return data && typeof data === "object" && "proof" in data;
  }

  private isTokenizedAssetRecord(data: any): data is TokenizedAssetRecord {
    if (!data || typeof data !== "object") return false;

    const context = data["@context"];
    const isValidContext =
      typeof context === "string" ||
      typeof context === "object" ||
      (Array.isArray(context) && context.every(c => typeof c === "object" || typeof c === "string"));

    return isValidContext;
}
}

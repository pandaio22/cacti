import {
  AssetSchema,
  AssetSchemaDidDocument,
  AssetSchemaVerifiableCredential,
  CommissionedAssetSchemaID,
  SchemaProfile,
  SchemaProfileDidDocument,
  SchemaProfileVerifiableCredential,
  CommissionedSchemaProfileID,
  TokenizedAssetRecord,
  TokenizedAssetRecordDidDocument,
  TokenizedAssetRecordVerifiableCredential,
  CommissionedTokenizedAssetRecordID,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

import { RegisteredAssetSchemaDao } from "../../../dao/dao-asset-schema";
import { RegisteredSchemaProfileDao } from "../../../dao/dao-schema-profile";
import { RegisteredTokenizedAssetRecordDao } from "../../../dao/dao-tokenized-asset-record";
import { DidResolverService } from "../../did-resolver-service/implementations/did-resolver-service";

/**
 * Registry Service for managing Asset Schemas, Schema Profiles, and Tokenized Asset Records
 */
export class RegistryService {
  constructor(
    private assetSchemaDao: RegisteredAssetSchemaDao,
    private schemaProfileDao: RegisteredSchemaProfileDao,
    private tokenizedAssetRecordDao: RegisteredTokenizedAssetRecordDao,
  ) {}

  /**
   * Fetch an Asset Schema by DID
   */
  public async getAssetSchema(did: string): Promise<{
    assetSchema: AssetSchema;
    assetSchemaDidDocument: AssetSchemaDidDocument;
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential;
  }> {
    const didResolver: DidResolverService = new DidResolverService(
      this.assetSchemaDao,
      {} as any,
      {} as any,
    );

    //const assetSchema = await didResolver.resolve(did, { type: "all" });
    const assetSchema = await this.assetSchemaDao.getByDid(did);
    if (!assetSchema) {
      throw new Error(`Asset Schema with DID ${did} already exists`);
    }

    return {
      assetSchema: assetSchema.assetSchema,
      assetSchemaDidDocument: assetSchema.assetSchemaDidDocument,
      assetSchemaVerifiableCredential:
        assetSchema.assetSchemaVerifiableCredential,
    };
  }

  /**
   * Retrieves a Schema Profile and its associated artifacts by unique identifier.
   */
  public async getSchemaProfile(did: string): Promise<{
    schemaProfile: SchemaProfile;
    schemaProfileDidDocument: SchemaProfileDidDocument;
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential;
  }> {
    const didResolver: DidResolverService = new DidResolverService(
      {} as any,
      this.schemaProfileDao,
      {} as any,
    );
    const schemaProfile = await didResolver.resolve(did, { type: "all" });
    if (!schemaProfile) {
      throw new Error(`Schema Profile with DID ${did} already exists`);
    }

    return {
      schemaProfile: schemaProfile.schemaProfile,
      schemaProfileDidDocument: schemaProfile.schemaProfileDidDocument,
      schemaProfileVerifiableCredential:
        schemaProfile.schemaProfileVerifiableCredential,
    };
  }

  /**
   * Retrieves a Tokenized Asset Record by unique identifier.
   */
  public async getTokenizedAssetRecord(did: string): Promise<{
    tokenizedAssetRecord: TokenizedAssetRecord;
    tokenizedAssetRecordDidDocument: TokenizedAssetRecordDidDocument;
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential;
  }> {
    const didResolver: DidResolverService = new DidResolverService(
      {} as any,
      {} as any,
      this.tokenizedAssetRecordDao,
    );
    const tokenizedAssetRecord = await didResolver.resolve(did, {
      type: "all",
    });
    if (!tokenizedAssetRecord) {
      throw new Error(`Tokenized Asset Record with DID ${did} already exists`);
    }

    return {
      tokenizedAssetRecord: tokenizedAssetRecord.tokenizedAssetRecord,
      tokenizedAssetRecordDidDocument:
        tokenizedAssetRecord.tokenizedAssetRecordDidDocument,
      tokenizedAssetRecordVerifiableCredential:
        tokenizedAssetRecord.tokenizedAssetRecordVerifiableCredential,
    };
  }

  /**
   * Registers an asset schema in the database
   */
  public async commissionAssetSchema(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<CommissionedAssetSchemaID> {
    const did = assetSchemaDidDocument.id;

    // 1️⃣ Validate input
    if (
      !did ||
      !assetSchema ||
      !assetSchemaDidDocument ||
      !assetSchemaVerifiableCredential
    ) {
      throw new Error("Missing required inputs for registering Asset Schema");
    }

    // 2️⃣ Optionally: check if the DID already exists
    /*const didResolver: DidResolverService = new DidResolverService(
      this.assetSchemaDao,
      {} as any,
      {} as any,
    );
    const existing = await didResolver.resolve(did, { type: "all" });
    if (existing) {
      throw new Error(`Asset Schema with DID ${did} already exists`);
    }*/

    // 3️⃣ Persist using the DAO
    await this.assetSchemaDao.create({
      did,
      assetSchema,
      assetSchemaDidDocument,
      assetSchemaVerifiableCredential,
    });

    console.log(`Asset Schema registered with DID ${did}`);

    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: did,
      type: "CommissionedAssetSchemaID",
    } as CommissionedAssetSchemaID;
  }

  /**
   * Commissions (registers) a new Schema Profile in the registry.
   */
  public async commissionSchemaProfile(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<CommissionedSchemaProfileID> {
    const did = schemaProfileDidDocument.id;

    if (
      !did ||
      !schemaProfile ||
      !schemaProfileDidDocument ||
      !schemaProfileVerifiableCredential
    ) {
      throw new Error("Missing required inputs for registering Schema Profile");
    }

    await this.schemaProfileDao.create({
      did,
      schemaProfile,
      schemaProfileDidDocument,
      schemaProfileVerifiableCredential,
    });

    console.log(`Schema Profile registered with DID ${did}`);
    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: did,
      type: "CommissionedSchemaProfileID",
    } as CommissionedSchemaProfileID;
  }

  /**
   * Commissions (registers) a new Tokenized Asset Record in the registry.
   */
  public async commissionTokenizedAssetRecord(
    tokenizedAssetRecord: TokenizedAssetRecord,
    tokenizedAssetRecordDidDocument: TokenizedAssetRecordDidDocument,
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential,
  ): Promise<CommissionedTokenizedAssetRecordID> {
    const did = tokenizedAssetRecordDidDocument.id;

    if (
      !did ||
      !tokenizedAssetRecord ||
      !tokenizedAssetRecordDidDocument ||
      !tokenizedAssetRecordVerifiableCredential
    ) {
      throw new Error(
        "Missing required inputs for registering Tokenized Asset Record",
      );
    }
    await this.tokenizedAssetRecordDao.create({
      did,
      tokenizedAssetRecord,
      tokenizedAssetRecordDidDocument,
      tokenizedAssetRecordVerifiableCredential,
    });

    console.log(`Tokenized Asset Record registered with DID ${did}`);
    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: did,
      type: "CommissionedTokenizedAssetRecordID",
    } as CommissionedTokenizedAssetRecordID;
  }
}

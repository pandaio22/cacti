import {
  AssetSchema,
  AssetSchemaDidDocument,
  AssetSchemaVerifiableCredential,
  RegisteredAssetSchema,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

import { RegisteredAssetSchemaDao } from "../../../dao/dao-asset-schema";
import { DidResolverService } from "../../did-resolver-service/implementations/did-resolver-service";

/**
 * Registry Service for managing Asset Schemas, Schema Profiles, and Tokenized Asset Records
 */
export class RegistryService {
  constructor(private assetSchemaDao: RegisteredAssetSchemaDao) {}

  /**
   * Registers an asset schema in the database
   */
  public async commissionAssetSchema(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<void> {
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
  }

  /**
   * Fetch an Asset Schema by DID
   */
  public async getAssetSchema(
    did: string,
  ): Promise<RegisteredAssetSchema | null> {
    const asset = await this.assetSchemaDao.getByDid(did);
    if (!asset) return null;

    return {
      did: asset.did,
      assetSchema: asset.assetSchema,
      assetSchemaDidDocument: asset.assetSchemaDidDocument,
      assetSchemaVerifiableCredential: asset.assetSchemaVerifiableCredential,
    };
  }
}

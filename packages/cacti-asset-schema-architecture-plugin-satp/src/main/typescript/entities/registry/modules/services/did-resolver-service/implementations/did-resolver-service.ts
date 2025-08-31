import { IDidResolverService } from "../interfaces/did-resolver-service.interface";
import { RegisteredAssetSchemaDao } from "../../../dao/dao-asset-schema";
//import { RegisteredSchemaProfileDao } from "../../daos/RegisteredSchemaProfileDao";
//import { RegisteredTokenizedAssetRecordDao } from "../../daos/RegisteredTokenizedAssetRecordDao";

/**
 * DID Resolver Service
 * Resolves a DID locally first (via DAOs), then externally if not found.
 */
export class DidResolverService implements IDidResolverService {
  constructor(
    private assetSchemaDao: RegisteredAssetSchemaDao,
    private schemaProfileDao: any,
    private tokenizedAssetRecordDao: any,
  ) {}

  public async resolve(
    did: string,
    options?: {
      type?: "didDocument" | "schemaDocument" | "verifiableCredential" | "all";
    },
  ): Promise<any> {
    const type = options?.type ?? "all";

    // Try local resolution first
    const local = await this.resolveLocally(did, type);
    if (local) return local;

    // If not found, resolve externally
    return await this.resolveExternally(did, type);
  }

  private async resolveLocally(
    did: string,
    type: "didDocument" | "schemaDocument" | "verifiableCredential" | "all",
  ): Promise<any | null> {
    switch (type) {
      case "didDocument": {
        // Try all DAOs that can have a DID document
        const asset = await this.assetSchemaDao.getByDid(did);
        if (asset) return asset.assetSchemaDidDocument;

        const profile = await this.schemaProfileDao.getByDid(did);
        if (profile) return profile.schemaProfileDidDocument;

        const tar = await this.tokenizedAssetRecordDao.getByDid(did);
        if (tar) return tar.tokenizedAssetRecordDidDocument;

        return null;
      }

      case "schemaDocument": {
        const asset = await this.assetSchemaDao.getByDid(did);
        if (asset) return asset.assetSchema;

        const profile = await this.schemaProfileDao.getByDid(did);
        if (profile) return profile.schemaProfile;

        return null;
      }

      case "verifiableCredential": {
        const asset = await this.assetSchemaDao.getByDid(did);
        if (asset) return asset.assetSchemaVerifiableCredential;

        const profile = await this.schemaProfileDao.getByDid(did);
        if (profile) return profile.schemaProfileVerifiableCredential;

        const tar = await this.tokenizedAssetRecordDao.getByDid(did);
        if (tar) return tar.tokenizedAssetRecordVerifiableCredential;

        return null;
      }

      case "all": {
        const asset = await this.assetSchemaDao.getByDid(did);
        if (asset) {
          return {
            did,
            didDocument: asset.assetSchemaDidDocument,
            schemaDocument: asset.assetSchema,
            verifiableCredential: asset.assetSchemaVerifiableCredential,
          };
        }

        const profile = await this.schemaProfileDao.getByDid(did);
        if (profile) {
          return {
            did,
            didDocument: profile.schemaProfileDidDocument,
            schemaDocument: profile.schemaProfile,
            verifiableCredential: profile.schemaProfileVerifiableCredential,
          };
        }

        const tar = await this.tokenizedAssetRecordDao.getByDid(did);
        if (tar) {
          return {
            did,
            didDocument: tar.tokenizedAssetRecordDidDocument,
            schemaDocument: tar.tokenizedAssetRecord,
            verifiableCredential: tar.tokenizedAssetRecordVerifiableCredential,
          };
        }

        return null;
      }
    }
  }

  private async resolveExternally(
    did: string,
    type: "didDocument" | "schemaDocument" | "verifiableCredential" | "all",
  ): Promise<any | null> {
    // TODO: implement actual network fetching (e.g., DID:web, DID:IPFS)
    console.warn(`External DID resolution not implemented for DID: ${did}`);
    return null;
  }
}

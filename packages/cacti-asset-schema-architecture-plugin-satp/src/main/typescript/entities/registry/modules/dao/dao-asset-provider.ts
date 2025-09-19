import { db } from "./../database/knex/db-connection";
import { RegisteredAssetProviderCertificate } from "../../../../generated/asset-schema-architecture/typescript-axios/api";

export class AssetProviderCertificateDao {
  async create(
    assetProviderCertificate: RegisteredAssetProviderCertificate,
  ): Promise<void> {
    try {
      await db("asset_providers").insert({
        did: assetProviderCertificate.id,
        asset_provider: JSON.stringify(
          assetProviderCertificate.assetProviderCertificate,
        ),
      });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT" || err.code === "23505") {
        // SQLite and Postgres unique violations
        throw new Error(
          `Asset Provider with DID ${assetProviderCertificate.id} already exists`,
        );
      }
      console.error("DAO create failed:", err);
      throw new Error("DAO error: could not insert schema profile");
    }
  }

  async getByDid(
    did: string,
  ): Promise<RegisteredAssetProviderCertificate | null> {
    try {
      const row = await db("asset_providers").where({ did }).first();
      if (!row) return null;

      return {
        id: row.did,
        assetProviderCertificate: JSON.parse(row.asset_provider),
      };
    } catch (err) {
      console.error(`DAO getByDid failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to load asset provider for DID=${did}`,
      );
    }
  }

  async update(
    assetProviderCertificate: RegisteredAssetProviderCertificate,
  ): Promise<void> {
    try {
      const updated = await db("asset_providers")
        .where({ did: assetProviderCertificate.id })
        .update({
          asset_provider: JSON.stringify(
            assetProviderCertificate.assetProviderCertificate,
          ),
        });
      if (updated === 0) {
        throw new Error(
          `No asset provider found with DID ${assetProviderCertificate.id}`,
        );
      }
    } catch (err) {
      console.error(
        `DAO update failed for DID=${assetProviderCertificate.id}:`,
        err,
      );
      throw new Error(
        `DAO error: failed to update asset provider for DID=${assetProviderCertificate.id}`,
      );
    }
  }

  async delete(did: string): Promise<void> {
    try {
      const deleted = await db("asset_providers").where({ did }).del();

      if (deleted === 0) {
        throw new Error(`No asset provider found with DID ${did}`);
      }
    } catch (err) {
      console.error(`DAO delete failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to delete asset provider for DID=${did}`,
      );
    }
  }
}

import { db } from "./../database/knex/db-connection";
import { RegisteredAssetSchemaAuthorityCertificate } from "../../../../generated/asset-schema-architecture/typescript-axios/api";

export class AssetSchemaAuthorityCertificateDao {
  async create(
    assetSchemaAuthorityCertificate: RegisteredAssetSchemaAuthorityCertificate,
  ): Promise<void> {
    try {
      await db("asset_schema_authorities").insert({
        did: assetSchemaAuthorityCertificate.id,
        asset_schema_authority: JSON.stringify(
          assetSchemaAuthorityCertificate.assetSchemaAuthorityCertificate,
        ),
      });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT" || err.code === "23505") {
        // SQLite and Postgres unique violations
        throw new Error(
          `Asset Schema Authority with DID ${assetSchemaAuthorityCertificate.id} already exists`,
        );
      }
      console.error("DAO create failed:", err);
      throw new Error("DAO error: could not insert schema profile");
    }
  }

  async getByDid(
    did: string,
  ): Promise<RegisteredAssetSchemaAuthorityCertificate | null> {
    try {
      const row = await db("asset_schema_authorities").where({ did }).first();
      if (!row) return null;

      return {
        id: row.did,
        assetSchemaAuthorityCertificate: JSON.parse(row.asset_schema_authority),
      };
    } catch (err) {
      console.error(`DAO getByDid failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to load asset schema authority for DID=${did}`,
      );
    }
  }

  async update(
    assetSchemaAuthorityCertificate: RegisteredAssetSchemaAuthorityCertificate,
  ): Promise<void> {
    try {
      const updated = await db("asset_schema_authorities")
        .where({ did: assetSchemaAuthorityCertificate.id })
        .update({
          asset_schema_authority: JSON.stringify(
            assetSchemaAuthorityCertificate.assetSchemaAuthorityCertificate,
          ),
        });
      if (updated === 0) {
        throw new Error(
          `No asset schema authority found with DID ${assetSchemaAuthorityCertificate.id}`,
        );
      }
    } catch (err) {
      console.error(
        `DAO update failed for DID=${assetSchemaAuthorityCertificate.id}:`,
        err,
      );
      throw new Error(
        `DAO error: failed to update asset schema authority for DID=${assetSchemaAuthorityCertificate.id}`,
      );
    }
  }

  async delete(did: string): Promise<void> {
    try {
      const deleted = await db("asset_schema_authorities").where({ did }).del();

      if (deleted === 0) {
        throw new Error(`No asset schema authority found with DID ${did}`);
      }
    } catch (err) {
      console.error(`DAO delete failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to delete asset schema authority for DID=${did}`,
      );
    }
  }
}

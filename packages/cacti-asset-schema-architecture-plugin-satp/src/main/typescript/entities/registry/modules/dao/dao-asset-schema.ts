import { db } from "./../database/knex/db-connection";
import { RegisteredAssetSchema } from "../../../../generated/asset-schema-architecture/typescript-axios/api";

export class RegisteredAssetSchemaDao {
  async create(assetSchema: RegisteredAssetSchema): Promise<void> {
    try {
      await db("asset_schemas").insert({
        did: assetSchema.did,
        asset_schema: JSON.stringify(assetSchema.assetSchema),
        asset_schema_did_document: JSON.stringify(
          assetSchema.assetSchemaDidDocument,
        ),
        asset_schema_vc: JSON.stringify(
          assetSchema.assetSchemaVerifiableCredential,
        ),
      });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT" || err.code === "23505") {
        // SQLite and Postgres unique violations
        throw new Error(
          `Asset Schema with DID ${assetSchema.did} already exists`,
        );
      }
      console.error("DAO create failed:", err);
      throw new Error("DAO error: could not insert asset schema");
    }
  }

  async getByDid(did: string): Promise<RegisteredAssetSchema | null> {
    try {
      const row = await db("asset_schemas").where({ did }).first();
      if (!row) return null;

      return {
        did: row.did,
        assetSchema: JSON.parse(row.asset_schema),
        assetSchemaDidDocument: JSON.parse(row.asset_schema_did_document),
        assetSchemaVerifiableCredential: JSON.parse(row.asset_schema_vc),
      };
    } catch (err) {
      console.error(`DAO getByDid failed for DID=${did}:`, err);
      throw new Error(`DAO error: failed to load asset schema for DID=${did}`);
    }
  }

  async update(assetSchema: RegisteredAssetSchema): Promise<void> {
    try {
      const updated = await db("asset_schemas")
        .where({ did: assetSchema.did })
        .update({
          asset_schema: JSON.stringify(assetSchema.assetSchema),
          asset_schema_did_document: JSON.stringify(
            assetSchema.assetSchemaDidDocument,
          ),
          asset_schema_vc: JSON.stringify(
            assetSchema.assetSchemaVerifiableCredential,
          ),
        });
      if (updated === 0) {
        throw new Error(`No asset schema found with DID ${assetSchema.did}`);
      }
    } catch (err) {
      console.error(`DAO update failed for DID=${assetSchema.did}:`, err);
      throw new Error(
        `DAO error: failed to update asset schema for DID=${assetSchema.did}`,
      );
    }
  }

  async delete(did: string): Promise<void> {
    try {
      const deleted = await db("asset_schemas").where({ did }).del();

      if (deleted === 0) {
        throw new Error(`No asset schema found with DID ${did}`);
      }
    } catch (err) {
      console.error(`DAO delete failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to delete asset schema for DID=${did}`,
      );
    }
  }
}

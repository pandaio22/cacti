// AssetSchemaDAO.ts
import { db } from "./../database/knex/db-connection";
import { RegisteredAssetSchema } from "../../../../generated/asset-schema-architecture/typescript-axios/api";

export class RegisteredAssetSchemaDao {
  async create(assetSchema: RegisteredAssetSchema): Promise<void> {
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
  }

  async getByDid(did: string): Promise<RegisteredAssetSchema | null> {
    const row = await db("asset_schemas").where({ did }).first();
    if (!row) return null;

    return {
      did: row.did,
      assetSchema: JSON.parse(row.asset_schema),
      assetSchemaDidDocument: JSON.parse(row.asset_schema_did_document),
      assetSchemaVerifiableCredential: JSON.parse(row.asset_schema_vc),
    };
  }

  async update(assetSchema: RegisteredAssetSchema): Promise<void> {
    await db("asset_schemas")
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
  }

  async delete(did: string): Promise<void> {
    await db("asset_schemas").where({ did }).del();
  }
}

import { db } from "./../database/knex/db-connection";
import { RegisteredTokenizedAssetRecord } from "../../../../generated/asset-schema-architecture/typescript-axios/api";

export class RegisteredTokenizedAssetRecordDao {
  async create(
    tokenizedAssetRecord: RegisteredTokenizedAssetRecord,
  ): Promise<void> {
    try {
      await db("tokenized_asset_records").insert({
        did: tokenizedAssetRecord.did,
        tokenized_asset_record: JSON.stringify(
          tokenizedAssetRecord.tokenizedAssetRecord,
        ),
        tokenized_asset_record_did_document: JSON.stringify(
          tokenizedAssetRecord.tokenizedAssetRecordDidDocument,
        ),
        tokenized_asset_record_vc: JSON.stringify(
          tokenizedAssetRecord.tokenizedAssetRecordVerifiableCredential,
        ),
      });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT" || err.code === "23505") {
        // SQLite and Postgres unique violations
        throw new Error(
          `TokenizedAssetRecord with DID ${tokenizedAssetRecord.did} already exists`,
        );
      }
      console.error("DAO create failed:", err);
      throw new Error("DAO error: could not insert tokenized asset record");
    }
  }

  async getByDid(did: string): Promise<RegisteredTokenizedAssetRecord | null> {
    try {
      const row = await db("tokenized_asset_records").where({ did }).first();
      if (!row) return null;

      return {
        did: row.did,
        tokenizedAssetRecord: JSON.parse(row.tokenized_asset_record),
        tokenizedAssetRecordDidDocument: JSON.parse(
          row.tokenized_asset_record_did_document,
        ),
        tokenizedAssetRecordVerifiableCredential: JSON.parse(
          row.tokenized_asset_record_vc,
        ),
      };
    } catch (err) {
      console.error(`DAO getByDid failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to load tokenized asset record for DID=${did}`,
      );
    }
  }

  async update(
    tokenizedAssetRecord: RegisteredTokenizedAssetRecord,
  ): Promise<void> {
    try {
      const updated = await db("tokenized_asset_records")
        .where({ did: tokenizedAssetRecord.did })
        .update({
          tokenized_asset_record: JSON.stringify(
            tokenizedAssetRecord.tokenizedAssetRecord,
          ),
          tokenized_asset_record_did_document: JSON.stringify(
            tokenizedAssetRecord.tokenizedAssetRecordDidDocument,
          ),
          tokenized_asset_record_vc: JSON.stringify(
            tokenizedAssetRecord.tokenizedAssetRecordVerifiableCredential,
          ),
        });
      if (updated === 0) {
        throw new Error(
          `No tokenized asset record found with DID ${tokenizedAssetRecord.did}`,
        );
      }
    } catch (err) {
      console.error(
        `DAO update failed for DID=${tokenizedAssetRecord.did}:`,
        err,
      );
      throw new Error(
        `DAO error: failed to update tokenized asset record for DID=${tokenizedAssetRecord.did}`,
      );
    }
  }

  async delete(did: string): Promise<void> {
    try {
      const deleted = await db("tokenized_asset_records").where({ did }).del();

      if (deleted === 0) {
        throw new Error(`No tokenized asset record found with DID ${did}`);
      }
    } catch (err) {
      console.error(`DAO delete failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to delete tokenized asset record for DID=${did}`,
      );
    }
  }
}

import { db } from "./../database/knex/db-connection";
import { RegisteredSchemaProfile } from "../../../../generated/asset-schema-architecture/typescript-axios/api";

export class RegisteredSchemaProfileDao {
  async create(schemaProfile: RegisteredSchemaProfile): Promise<void> {
    try {
      await db("schema_profiles").insert({
        did: schemaProfile.did,
        schema_profile: JSON.stringify(schemaProfile.schemaProfile),
        schema_profile_did_document: JSON.stringify(
          schemaProfile.schemaProfileDidDocument,
        ),
        schema_profile_vc: JSON.stringify(
          schemaProfile.schemaProfileVerifiableCredential,
        ),
      });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT" || err.code === "23505") {
        // SQLite and Postgres unique violations
        throw new Error(
          `Schema Profile with DID ${schemaProfile.did} already exists`,
        );
      }
      console.error("DAO create failed:", err);
      throw new Error("DAO error: could not insert schema profile");
    }
  }

  async getByDid(did: string): Promise<RegisteredSchemaProfile | null> {
    try {
      const row = await db("schema_profiles").where({ did }).first();
      if (!row) return null;

      return {
        did: row.did,
        schemaProfile: JSON.parse(row.schema_profile),
        schemaProfileDidDocument: JSON.parse(row.schema_profile_did_document),
        schemaProfileVerifiableCredential: JSON.parse(row.schema_profile_vc),
      };
    } catch (err) {
      console.error(`DAO getByDid failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to load schema profile for DID=${did}`,
      );
    }
  }

  async update(schemaProfile: RegisteredSchemaProfile): Promise<void> {
    try {
      const updated = await db("schema_profiles")
        .where({ did: schemaProfile.did })
        .update({
          schema_profile: JSON.stringify(schemaProfile.schemaProfile),
          schema_profile_did_document: JSON.stringify(
            schemaProfile.schemaProfileDidDocument,
          ),
          schema_profile_vc: JSON.stringify(
            schemaProfile.schemaProfileVerifiableCredential,
          ),
        });
      if (updated === 0) {
        throw new Error(
          `No schema profile found with DID ${schemaProfile.did}`,
        );
      }
    } catch (err) {
      console.error(`DAO update failed for DID=${schemaProfile.did}:`, err);
      throw new Error(
        `DAO error: failed to update schema profile for DID=${schemaProfile.did}`,
      );
    }
  }

  async delete(did: string): Promise<void> {
    try {
      const deleted = await db("schema_profiles").where({ did }).del();

      if (deleted === 0) {
        throw new Error(`No schema profile found with DID ${did}`);
      }
    } catch (err) {
      console.error(`DAO delete failed for DID=${did}:`, err);
      throw new Error(
        `DAO error: failed to delete schema profile for DID=${did}`,
      );
    }
  }
}

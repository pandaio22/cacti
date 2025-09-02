import { db } from "./../database/knex/db-connection";
import { RegisteredTokenIssuanceAuthorization } from "../../../../generated/asset-schema-architecture/typescript-axios/api";

export class TokenIssuanceAuthorizationDao {
  async create(
    tokenIssuanceAuthorization: RegisteredTokenIssuanceAuthorization,
  ): Promise<void> {
    try {
      await db("token_issuance_authorizations").insert({
        id: tokenIssuanceAuthorization.id,
        token_issuance_authorization: JSON.stringify(
          tokenIssuanceAuthorization.tokenIssuanceAuthorization,
        ),
      });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT" || err.code === "23505") {
        // SQLite and Postgres unique violations
        throw new Error(
          `Token Issuance Authorization with ID ${tokenIssuanceAuthorization.id} already exists`,
        );
      }
      console.error("DAO create failed:", err);
      throw new Error("DAO error: could not insert schema profile");
    }
  }

  async getById(
    id: string,
  ): Promise<RegisteredTokenIssuanceAuthorization | null> {
    try {
      const row = await db("token_issuance_authorizations")
        .where({ id })
        .first();
      if (!row) return null;

      return {
        id: row.id,
        tokenIssuanceAuthorization: JSON.parse(
          row.token_issuance_authorization,
        ),
      };
    } catch (err) {
      console.error(`DAO getByDid failed for ID=${id}:`, err);
      throw new Error(`DAO error: failed to load asset provider for ID=${id}`);
    }
  }

  async update(
    tokenIssuanceAuthorization: RegisteredTokenIssuanceAuthorization,
  ): Promise<void> {
    try {
      const updated = await db("token_issuance_authorizations")
        .where({ id: tokenIssuanceAuthorization.id })
        .update({
          token_issuance_authorization: JSON.stringify(
            tokenIssuanceAuthorization.tokenIssuanceAuthorization,
          ),
        });
      if (updated === 0) {
        throw new Error(
          `No asset provider found with ID ${tokenIssuanceAuthorization.id}`,
        );
      }
    } catch (err) {
      console.error(
        `DAO update failed for ID=${tokenIssuanceAuthorization.id}:`,
        err,
      );
      throw new Error(
        `DAO error: failed to update asset provider for ID=${tokenIssuanceAuthorization.id}`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deleted = await db("token_issuance_authorizations")
        .where({ id })
        .del();

      if (deleted === 0) {
        throw new Error(`No asset provider found with ID ${id}`);
      }
    } catch (err) {
      console.error(`DAO delete failed for ID=${id}:`, err);
      throw new Error(
        `DAO error: failed to delete asset provider for ID=${id}`,
      );
    }
  }
}

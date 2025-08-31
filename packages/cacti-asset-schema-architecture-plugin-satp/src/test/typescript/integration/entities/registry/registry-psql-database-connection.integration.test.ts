import knex from "knex";
import config from "../../../../../main/typescript/entities/registry/modules/database/knex/knexfile";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("Postgres connection via Knex", () => {
  let db: ReturnType<typeof knex>;

  beforeAll(() => {
    db = knex(config.development); // use your knex config
  });

  afterAll(async () => {
    await db.destroy(); // close connection after tests
  });

  it("should connect to the database and run a test query", async () => {
    const result = await db.raw("SELECT 1+1 AS result");
    expect(result.rows[0].result).toBe(2);
  });
});

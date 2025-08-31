import { db } from "../../../../../main/typescript/entities/registry/modules/database/knex/db-connection"; // path to your knex instance

describe("SQLite dev DB", () => {
  beforeAll(async () => {
    await db.schema.dropTableIfExists("assets");
    await db.schema.createTable("assets", (table) => {
      table.string("id").primary();
      table.text("data");
    });
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("should store and retrieve JSON", async () => {
    const asset = {
      id: "asset1",
      name: "Asset Schema",
      version: "1.0.0",
    };

    await db("assets").insert({ id: asset.id, data: JSON.stringify(asset) });
    const row = await db("assets").where({ id: "asset1" }).first();
    const stored = JSON.parse(row.data);

    expect(stored.name).toBe("Asset Schema");
    expect(stored.version).toBe("1.0.0");
  });
});

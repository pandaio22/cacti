import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("asset_schema_authorities", (table) => {
    table.string("did").primary();
    table.text("asset_schema_authority").notNullable(); // JSON as string
    table.timestamps(true, true); // created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("asset_schema_authorities");
}

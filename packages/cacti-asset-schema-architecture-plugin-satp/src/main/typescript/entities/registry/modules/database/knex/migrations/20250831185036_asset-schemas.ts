import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("asset_schemas", (table) => {
    table.string("did").primary(); // DID of the asset schema
    table.text("asset_schema").notNullable(); // JSON as string
    table.text("asset_schema_did_document").notNullable(); // JSON as string
    table.text("asset_schema_vc").notNullable(); // JSON as string
    table.timestamps(true, true); // created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("asset_schemas");
}

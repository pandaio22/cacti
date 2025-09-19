import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tokenized_asset_records", (table) => {
    table.string("did").primary(); // DID of the tokenized asset record
    table.text("tokenized_asset_record").notNullable(); // JSON as string
    table.text("tokenized_asset_record_did_document").notNullable(); // JSON as string
    table.text("tokenized_asset_record_vc").notNullable(); // JSON as string
    table.timestamps(true, true); // created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("tokenized_asset_records");
}

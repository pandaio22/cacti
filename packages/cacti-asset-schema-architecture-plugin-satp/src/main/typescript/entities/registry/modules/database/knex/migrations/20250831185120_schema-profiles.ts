import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("schema_profiles", (table) => {
    table.string("did").primary(); // DID of the schema profile
    table.text("schema_profile").notNullable(); // JSON as string
    table.text("schema_profile_did_document").notNullable(); // JSON as string
    table.text("schema_profile_vc").notNullable(); // JSON as string
    table.timestamps(true, true); // created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("schema_profiles");
}

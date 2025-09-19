import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("token_issuance_authorizations", (table) => {
    table.string("id").primary(); // DID of the tokenized asset record
    table.text("token_issuance_authorization").notNullable(); // JSON as string
    table.timestamps(true, true); // created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("token_issuance_authorizations");
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("subscribers", (table: Knex.CreateTableBuilder) => {
        table.increments("id").primary();
        table.string("email").notNullable().unique();
        table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE"); // new
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("subscribers");
}


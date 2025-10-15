
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("email", 255).notNullable().unique();
        table.string("password", 255).notNullable();
        table.enum("role", ["user", "admin"]).defaultTo("user");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.boolean("is_verified").defaultTo(false);
        table.string("verification_token", 255).nullable();


    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("users");
}

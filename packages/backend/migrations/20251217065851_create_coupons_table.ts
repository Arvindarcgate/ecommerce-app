import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('coupons', (table) => {
    table.increments('id').primary();

    table.string('code').notNullable().unique();

    table.enu('discount_type', ['PERCENTAGE', 'FLAT']).notNullable();

    table.decimal('discount_value', 10, 2).notNullable();
    table.decimal('min_order_amount', 10, 2).notNullable();
    table.decimal('max_discount', 10, 2).notNullable();

    table.integer('usage_limit_per_user').notNullable();

    table.date('start_date').notNullable();
    table.date('end_date').notNullable();

    table
      .enu('status', ['ACTIVE', 'INACTIVE'])
      .notNullable()
      .defaultTo('ACTIVE');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('coupons');
}


// src/db/db.ts
import knex from 'knex';
import { Model } from 'objection';

const db = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'Flipkart',
        password: 'EmailSub@123',
        database: 'flipkart',
        port: 3306,
    },
});

Model.knex(db);

export { Model, db };









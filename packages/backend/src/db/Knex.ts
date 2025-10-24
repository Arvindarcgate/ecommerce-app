import knex from 'knex';

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

export default db;

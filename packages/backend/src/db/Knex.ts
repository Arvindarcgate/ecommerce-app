import knex from 'knex';

const db = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'Flipkart', // ✅ make sure this user exists in MySQL
        password: 'EmailSub@123',
        database: 'flipkart', // ❌ triple check spelling – is it *Ecomm**e**rce*?
        port: 3306, // ✅ default MySQL port; only change if you're using custom port
    },
});

export default db;

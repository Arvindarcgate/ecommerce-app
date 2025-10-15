// knexfile.ts
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "Flipkart",
      password: "EmailSub@123",
      database: "flipkart",
      port: 3306,
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },
};

export default config;

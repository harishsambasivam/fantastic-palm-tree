const { Pool } = require("pg");
require("dotenv").config({ path: "./.env.dev" });
const chalk = require("chalk");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  async query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(
      chalk.green(
        "\nexecuted query",
        JSON.stringify({ text, duration, rows: res.rowCount }, null, 2)
      )
    );
    return res;
  },
  async getClient() {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error(
        chalk.red("A client has been checked out for more than 5 seconds!")
      );
      console.error(
        chalk.red(
          `The last executed query on this client was: ${JSON.stringify(
            client.lastQuery,
            null,
            2
          )}`
        )
      );
    }, 5000);
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      const start = Date.now();
      client.lastQuery = args;
      const res = query.apply(client, args);
      const duration = Date.now() - start;
      console.log(
        chalk.yellow(
          "\nexecuted query",
          JSON.stringify({ query: args, duration }, null, 2)
        )
      );
      return res;
    };
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout);
      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  },
};

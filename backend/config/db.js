const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect()
    .then(() => console.log("connected to PostgreSQL on Render"))
    .catch(err => console.error('Connection error', err));

module.exports = pool;
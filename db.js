const { Pool } = require('pg');

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'blog',
    password: '1',
    port: 5432,
});

module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: P,
    host: 'localhost',
    database: 'project',
    password: '12345',
    port: 5432,
  });

module.exports = pool;


const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
  });
  console.log('User:', process.env.USER);
  console.log('Host:', process.env.HOST);
  console.log('Database:', process.env.DATABASE);
  console.log('Password:', process.env.PASSWORD);
  console.log('Port:', process.env.PORT);
  
module.exports = pool;


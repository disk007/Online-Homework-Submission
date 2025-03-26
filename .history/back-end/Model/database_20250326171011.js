const { Pool } = require('pg');
require('dotenv').config();

const pool = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = pool;

// const pool = new Pool({
//     user: process.env.USER,
//     host: process.env.HOST,
//     database: process.env.DATABASE,
//     password: process.env.PASSWORD,
//     port: process.env.PORT,
//   });
  
// module.exports = pool;


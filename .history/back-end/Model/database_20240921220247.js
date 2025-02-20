const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'project',
    password: '12345',
    port: 5432,
  });

module 
pool.connect((err, client, release) => {
if (err) {
    return console.error('Error acquiring client', err.stack);
}
console.log('Connected to the database successfully');
release(); // ปล่อย connection กลับไปที่ pool
});


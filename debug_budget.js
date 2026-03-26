const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

async function checkData() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'roomify'
    });

    const [users] = await db.query('SELECT user_id, name, budget FROM users');
    console.log('Users:', users);

    const [rooms] = await db.query('SELECT room_id, host_id, rent FROM rooms');
    console.log('Rooms:', rooms);

    const sql = `
        SELECT 
          users.user_id AS id,
          users.name,
          IFNULL(rooms.rent, users.budget) AS rent
        FROM users
        LEFT JOIN rooms ON users.user_id = rooms.host_id
    `;
    const [results] = await db.query(sql);
    console.log('Combined Results (rent):', results);

    await db.end();
}

checkData().catch(console.error);

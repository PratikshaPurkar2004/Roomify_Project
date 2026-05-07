const mysql = require('mysql2/promise');

const localConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Roomify@123',
    database: 'roomify'
};

const railwayUrl = 'mysql://root:TqvYkGzKEkaMINcIczCUhcbjtjpTAWGX@turntable.proxy.rlwy.net:48628/railway';

async function migrate() {
    const localDb = await mysql.createConnection(localConfig);
    const railwayDb = await mysql.createConnection(railwayUrl);

    console.log('Migrating users...');
    const [users] = await localDb.query('SELECT * FROM users');
    for (const user of users) {
        const columns = Object.keys(user).join(', ');
        const placeholders = Object.keys(user).map(() => '?').join(', ');
        const values = Object.values(user);
        await railwayDb.query(`INSERT IGNORE INTO users (${columns}) VALUES (${placeholders})`, values);
    }
    console.log(`Migrated ${users.length} users.`);

    console.log('Migrating rooms...');
    const [rooms] = await localDb.query('SELECT * FROM rooms');
    for (const room of rooms) {
        const columns = Object.keys(room).join(', ');
        const placeholders = Object.keys(room).map(() => '?').join(', ');
        const values = Object.values(room);
        await railwayDb.query(`INSERT IGNORE INTO rooms (${columns}) VALUES (${placeholders})`, values);
    }
    console.log(`Migrated ${rooms.length} rooms.`);

    console.log('Migration complete!');
    await localDb.end();
    await railwayDb.end();
}

migrate().catch(console.error);

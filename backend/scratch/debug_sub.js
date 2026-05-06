const mysql = require('mysql2/promise');

async function checkStatus() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Roomify@123', // Default password
        database: 'roomify'
    });

    try {
        console.log("RECENT USERS:");
        const [users] = await db.query("SELECT user_id, name, email FROM users ORDER BY user_id DESC LIMIT 5");
        console.table(users);

        console.log("\nRECENT SUBSCRIPTIONS:");
        const [subs] = await db.query("SELECT * FROM subscriptions ORDER BY id DESC LIMIT 5");
        console.table(subs);

        console.log("\nMESSAGE COUNTS PER USER:");
        const [msgCounts] = await db.query("SELECT sender_id, COUNT(*) as count FROM messages GROUP BY sender_id");
        console.table(msgCounts);

    } catch (err) {
        console.error(err);
    } finally {
        await db.end();
    }
}

checkStatus();

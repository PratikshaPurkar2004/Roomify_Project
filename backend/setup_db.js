const db = require('./config/db');

async function setupDB() {
  const query = `
    CREATE TABLE IF NOT EXISTS requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      receiver_name VARCHAR(255),
      status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    // Note: If receiver is just based on name in the current UI (the handleRequest took just 'name'),
    // we might just store receiver_name, or ideally join with users. 
    // Wait, let's keep it robust. FindRoommates has user.id probably (key={user.id}).
    // Let's modify the query to use receiver_id if FindRoommates provides user.id... Oh, wait! I will use receiver_id!
    const properQuery = `
      CREATE TABLE IF NOT EXISTS requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(properQuery);
    console.log("Requests table created or checked successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error creating table: ", err);
    process.exit(1);
  }
}

setupDB();

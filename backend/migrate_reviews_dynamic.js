const db = require("./config/db");

async function migrate() {
  try {
    console.log("Adding user_id to review table...");
    
    // Add user_id column if it doesn't exist
    const [columns] = await db.query("SHOW COLUMNS FROM review LIKE 'user_id'");
    if (columns.length === 0) {
      await db.query("ALTER TABLE review ADD COLUMN user_id INT DEFAULT NULL");
      await db.query("ALTER TABLE review ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL");
    }

    // Seed some reviews for room ID 5
    // We need some users first. Let's find some user IDs.
    const [users] = await db.query("SELECT user_id FROM users LIMIT 3");
    if (users.length > 0) {
      const roomId = 5;
      // Clear previous seed for room 5
      await db.query("DELETE FROM review WHERE room_id = ?", [roomId]);

      const reviewData = [
        [roomId, users[0].user_id, 5, "The room is exactly as shown in photos. Very clean and the host is extremely helpful. Highly recommended!", "2023-10-15"],
        [roomId, users[1]?.user_id || users[0].user_id, 4, "Great location and very peaceful environment. Minor issue with the water purifier but it was fixed within a day.", "2023-09-20"],
        [roomId, users[2]?.user_id || users[0].user_id, 5, "Best place I've stayed at so far! The amenities are top-notch and the roommate matching was perfect.", "2023-08-05"]
      ];

      for (const [rid, uid, rating, comment, date] of reviewData) {
        await db.query("INSERT INTO review (room_id, user_id, rating, comment, review_date) VALUES (?, ?, ?, ?, ?)", [rid, uid, rating, comment, date]);
      }
      console.log("Dynamic reviews seeded successfully.");
    }

    console.log("Migration and seeding complete! ✅");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();

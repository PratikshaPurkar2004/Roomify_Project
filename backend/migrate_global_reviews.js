const db = require("./config/db");

async function migrate() {
  try {
    console.log("Expanding review system for global ratings...");
    
    // Add target_user_id column to support reviewing roommates/hosts
    const [columns] = await db.query("SHOW COLUMNS FROM review LIKE 'target_user_id'");
    if (columns.length === 0) {
      await db.query("ALTER TABLE review ADD COLUMN target_user_id INT DEFAULT NULL");
      await db.query("ALTER TABLE review ADD CONSTRAINT fk_target_user FOREIGN KEY (target_user_id) REFERENCES users(user_id) ON DELETE CASCADE");
      console.log("target_user_id added to review table.");
    }

    // Seed some global testimonials for the Home page
    // We'll use these in a "What our users say" section
    const [users] = await db.query("SELECT user_id FROM users LIMIT 5");
    if (users.length >= 2) {
      const roommateId = users[1].user_id; // Let's say user 2 is a popular roommate
      
      const [existing] = await db.query("SELECT * FROM review WHERE target_user_id = ?", [roommateId]);
      if (existing.length === 0) {
        console.log("Seeding roommate reviews...");
        const reviews = [
          [roommateId, users[0].user_id, 5, "Amazing roommate! Very clean and always pays rent on time.", "2023-11-10"],
          [roommateId, users[2]?.user_id || users[0].user_id, 5, "Super friendly and great cook. Highly recommend living with them!", "2023-12-01"]
        ];
        for (const [target, reviewer, rating, comment, date] of reviews) {
          await db.query("INSERT INTO review (target_user_id, user_id, rating, comment, review_date) VALUES (?, ?, ?, ?, ?)", [target, reviewer, rating, comment, date]);
        }
      }
    }

    console.log("Global review system ready! ✅");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();

const db = require("./config/db");

async function migrate() {
  try {
    console.log("Checking for room_id in review table...");
    
    // Check if room_id column exists
    const [columns] = await db.query("SHOW COLUMNS FROM review LIKE 'room_id'");
    
    if (columns.length === 0) {
      console.log("Modifying review table schema...");
      // Make connect_id nullable first
      await db.query("ALTER TABLE review MODIFY COLUMN connect_id INT NULL");
      // Add room_id column
      await db.query("ALTER TABLE review ADD COLUMN room_id INT DEFAULT NULL");
      await db.query("ALTER TABLE review ADD CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE");
      console.log("Schema updated successfully.");
    } else {
      console.log("room_id column already exists.");
    }

    // Seed some reviews for room ID 5 (from the screenshot)
    const roomId = 5;
    const [existing] = await db.query("SELECT * FROM review WHERE room_id = ?", [roomId]);
    
    if (existing.length === 0) {
      console.log("Seeding mock reviews for room ID 5...");
      
      const reviews = [
        [roomId, 5, "The room is exactly as shown in photos. Very clean and the host is extremely helpful. Highly recommended!", "2023-10-15"],
        [roomId, 4, "Great location and very peaceful environment. Minor issue with the water purifier but it was fixed within a day.", "2023-09-20"],
        [roomId, 5, "Best place I've stayed at so far! The amenities are top-notch and the roommate matching was perfect.", "2023-08-05"]
      ];

      for (const [rid, rating, comment, date] of reviews) {
        // connect_id is NOT NULL in the original schema, but we might not have a valid connect_id.
        // Let's check if we can make it NULL or if we need a dummy connect_id.
        // For now, I'll try to insert with a dummy connect_id if possible, or modify the column to be nullable.
        
        await db.query("INSERT INTO review (room_id, connect_id, rating, comment, review_date) VALUES (?, NULL, ?, ?, ?)", [rid, rating, comment, date]);
      }
      console.log("Reviews seeded.");
    }

    console.log("Migration and seeding complete! ✅");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();

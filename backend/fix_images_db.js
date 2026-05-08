const db = require('./config/db');

async function fixImages() {
  try {
    console.log("Starting image URL cleanup...");
    
    // 1. Fix rooms table
    const [rooms] = await db.query("SELECT room_id, image_url FROM rooms WHERE image_url LIKE '%http://localhost:5000%'");
    console.log(`Found ${rooms.length} rooms with broken local links.`);
    
    for (const room of rooms) {
      const fixedUrl = room.image_url.replace(/http:\/\/localhost:5000/g, '');
      await db.query("UPDATE rooms SET image_url = ? WHERE room_id = ?", [fixedUrl, room.room_id]);
      console.log(`Updated room ${room.room_id}`);
    }

    // 2. Fix users table (profile images)
    const [users] = await db.query("SELECT user_id, profile_image FROM users WHERE profile_image LIKE '%http://localhost:5000%'");
    console.log(`Found ${users.length} users with broken profile links.`);
    
    for (const user of users) {
      const fixedUrl = user.profile_image.replace(/http:\/\/localhost:5000/g, '');
      await db.query("UPDATE users SET profile_image = ? WHERE user_id = ?", [fixedUrl, user.user_id]);
      console.log(`Updated user ${user.user_id}`);
    }

    console.log("Cleanup complete! ✅ All images are now using relative paths.");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed ❌", err);
    process.exit(1);
  }
}

fixImages();

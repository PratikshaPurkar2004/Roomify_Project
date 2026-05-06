const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const notifications = [];
    let idCounter = 1;

    const now = new Date();

    // Helper for fuzzy time
    const getTimeAgo = (dateStr) => {
      const past = new Date(dateStr);
      const diffInMins = Math.floor((now - past) / 60000);
      if (diffInMins < 1) return "Just now";
      if (diffInMins < 60) return `${diffInMins}m ago`;
      if (diffInMins < 1440) return `${Math.floor(diffInMins/60)}h ago`;
      return `${Math.floor(diffInMins/1440)}d ago`;
    };

    // 1. Connection Requests (Pending sent to user)
    const sqlRequests = `
      SELECT r.id, r.created_at, u.name 
      FROM requests r
      JOIN users u ON r.sender_id = u.user_id
      WHERE r.receiver_id = ? AND r.status = 'pending'
      ORDER BY r.created_at DESC
    `;
    const [pendingReqs] = await db.query(sqlRequests, [userId]);
    
    pendingReqs.forEach(req => {
      notifications.push({
        id: idCounter++,
        type: "request",
        title: "New Request",
        message: `${req.name} wants to connect with you.`,
        time: getTimeAgo(req.created_at),
        unread: true
      });
    });

    // 2. Accept Messages (People who accepted user's request)
    const sqlAccepts = `
      SELECT r.id, r.created_at, u.name 
      FROM requests r
      JOIN users u ON r.receiver_id = u.user_id
      WHERE r.sender_id = ? AND r.status = 'accepted'
      ORDER BY r.created_at DESC
    `;
    const [acceptedReqs] = await db.query(sqlAccepts, [userId]);
    
    acceptedReqs.forEach(req => {
      notifications.push({
        id: idCounter++,
        type: "accept",
        title: "Request Accepted",
        message: `${req.name} accepted your roommate request!`,
        time: getTimeAgo(req.created_at),
        unread: true
      });
    });

    // 3. Sent Notifications (History of your recent activity)
    const sqlSent = `
      SELECT r.id, r.created_at, u.name 
      FROM requests r
      JOIN users u ON r.receiver_id = u.user_id
      WHERE r.sender_id = ? AND r.status = 'pending'
      ORDER BY r.created_at DESC
      LIMIT 5
    `;
    const [sentReqs] = await db.query(sqlSent, [userId]);
    
    sentReqs.forEach(req => {
      notifications.push({
        id: idCounter++,
        type: "sent",
        title: "Request Sent",
        message: `Your request was sent to ${req.name}.`,
        time: getTimeAgo(req.created_at),
        unread: false
      });
    });

    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Database error (notifications GET):", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Endpoint for Sidebar to get badge counts
router.get("/sidebar-counts/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    // Count pending requests
    const [reqs] = await db.query(
      "SELECT COUNT(*) as c FROM requests WHERE receiver_id = ? AND status = 'pending'",
      [userId]
    );
    const requestsCount = reqs[0].c;

    // Count messages received (for chat badge) - now using is_read column
    const [chats] = await db.query(
      "SELECT COUNT(*) as c FROM messages WHERE receiver_id = ? AND is_read = 0",
      [userId]
    );
    const chatCount = chats[0].c;

    res.json({ success: true, requestsCount, chatCount });
  } catch (err) {
    console.error("Error fetching sidebar counts", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;

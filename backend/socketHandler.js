const db = require("./config/db");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific room (based on roomid)
    socket.on("join_room", (data) => {
      const { roomid, userid } = data;
      if (roomid) socket.join(roomid);
      if (userid) socket.join(`user_${userid}`); // Join personal room for notifications
      console.log(`User ${userid} joined room: ${roomid} and user_${userid}`);
    });

    // Handle sending message
    socket.on("send_message", async (data) => {
      const { roomid, sender_id, receiver_id, content } = data;

      try {
        // 1. Save to Database
        const [result] = await db.query(
          "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
          [sender_id, receiver_id, content]
        );

        const newMessage = {
          id: result.insertId,
          sender_id: sender_id,
          receiver_id: receiver_id,
          content: content,
          created_at: new Date(),
          roomid: roomid // Adding roomid for frontend tracking
        };


        // 2. Emit to the room AND the receiver's personal room
        console.log(`Message sent in room ${roomid} by ${sender_id}`);
        io.to(roomid).emit("receive_message", newMessage);
        io.to(`user_${receiver_id}`).emit("receive_message", newMessage); // Instant unread count for receiver


      } catch (err) {
        console.error("Error saving/sending message via socket:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("delete_message", async (data) => {
      const { messageId, roomid } = data;
      try {
        await db.query("DELETE FROM messages WHERE id = ?", [messageId]);
        io.to(roomid).emit("message_deleted", { messageId });
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;

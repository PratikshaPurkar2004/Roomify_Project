const db = require("./config/db");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific room (based on roomid)
    socket.on("join_room", (data) => {
      const { roomid, userid } = data;
      socket.join(roomid);
      console.log(`User ${userid} joined room: ${roomid}`);
    });

    // Handle sending message
    socket.on("send_message", async (data) => {
      const { roomid, senderid, receiverid, content } = data;

      try {
        // 1. Save to Database
        const [result] = await db.query(
          "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
          [senderid, receiverid, content]
        );

        const newMessage = {
          id: result.insertId,
          sender_id: senderid,
          receiver_id: receiverid,
          content: content,
          created_at: new Date(),
          roomid: roomid // Adding roomid for frontend tracking
        };

        // 2. Emit to the room
        console.log(`Message sent in room ${roomid} by ${senderid}`);
        io.to(roomid).emit("receive_message", newMessage);

      } catch (err) {
        console.error("Error saving/sending message via socket:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;

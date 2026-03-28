const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a private room for the user
    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their private room.`);
    });

    // Handle sending messages
    socket.on("sendMessage", (data) => {
       const { senderId, receiverId, message } = data;
       // Emit to the receiver's private room
       io.to(`user_${receiverId}`).emit("newMessage", data);
    });

    // Handle typing status
    socket.on("typing", (data) => {
      io.to(`user_${data.receiverId}`).emit("userTyping", { senderId: data.senderId });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;

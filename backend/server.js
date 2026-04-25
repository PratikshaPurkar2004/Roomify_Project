const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./config/db");
const socketHandler = require("./socketHandler");

// Load .env from backend directory
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const roommateRoutes = require("./routes/roommateRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const chatRoutes = require("./routes/chatRoutes");
const roomRoutes = require("./routes/roomRoutes");
const cityRoutes = require("./routes/cityRoutes");
const matchRoutes = require("./routes/matchRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Inject Socket.io into requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Initialize Socket Handler
socketHandler(io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/roommates", roommateRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/matches", matchRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Health check for database
app.get("/health", async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: "ok", message: "Database connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Socket.io support`);
});

// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const authRoutes = require("./routes/authRoutes");
// const cityRoutes = require("./routes/cityRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const profileRoutes = require("./routes/profileRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/cities", cityRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/profile", profileRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend Running 🚀");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

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

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const roommateRoutes = require("./routes/roommateRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");



const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/roommates", roommateRoutes);
app.use("/api/preferences", preferenceRoutes);


app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
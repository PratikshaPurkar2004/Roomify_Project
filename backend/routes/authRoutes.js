// // routes/authRoutes.js
// const express = require("express");
// const router = express.Router();

// const { register } = require("../controllers/registerController");
// const { login } = require("../controllers/loginController");

// router.post("/register", register);
// router.post("/login", login);

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your mysql connection file

// LOGIN API
router.post("/login", (req, res) => {
  const { email, password } = req.body;

<<<<<<< Updated upstream
const { forgotPassword } = require("../controllers/forgotPasswordController");
const { resetPassword } = require("../controllers/resetPasswordController");
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
module.exports = router;
=======
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }

    if (result.length > 0) {
      return res.json({
        success: true,
        message: "Login Successful",
        user: result[0],
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
  });
});

module.exports = router;
>>>>>>> Stashed changes

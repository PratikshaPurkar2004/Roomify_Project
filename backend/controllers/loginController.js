// // controllers/loginController.js
// const bcrypt = require("bcryptjs");
// const { findUserByEmail } = require("../models/loginModel");

// const login = (req, res) => {
//   const { email, password } = req.body;

//   findUserByEmail(email, async (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     if (result.length === 0) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const user = result[0];

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     res.json({ message: "Login successful ✅" });
//   });
// };

// module.exports = { login };

const bcrypt = require("bcryptjs");
const { findUserByEmail } = require("../models/loginModel");

const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, async (err, result) => {

    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ IMPORTANT PART
    res.json({
      message: "Login successful",
      user_id: user.user_id,
      name: user.name
    });

  });
};

module.exports = { login };
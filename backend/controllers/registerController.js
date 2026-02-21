// controllers/registerController.js
const bcrypt = require("bcryptjs");
const { createUser } = require("../models/registerModel");
const { findUserByEmail } = require("../models/loginModel");

const register = async (req, res) => {
  const { name, DOB, email, occupation, password, user_type, area, gender } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    findUserByEmail(email, (err, result) => {
      if (err) {
        console.log("Find error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      createUser(
        name,
        DOB,
        email,
        hashedPassword ? occupation : occupation,
        hashedPassword,
        user_type,
        area,
        gender,
        (err) => {
          if (err) {
            console.log("Insert error:", err);
            return res.status(500).json({ message: "Registration failed" });
          }

          res.json({ message: "User registered successfully ✅" });
        }
      );
    });

  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register };

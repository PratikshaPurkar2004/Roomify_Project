const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail } = require("../models/userModel");

const register = async (req, res) => {
  const { name, DOB, email, occupation, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  findUserByEmail(email, (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    return createUser(name, DOB, email, occupation, hashedPassword, (err) => {
      if (err) {
        return res.status(500).json({ message: "Registration failed" });
      }
      res.json({ message: "User registered successfully ✅" });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, async (err, result) => {
    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful ✅" });
  });
};

module.exports = { register, login };

 
// const bcrypt = require("bcryptjs");
// const { createUser } = require("../models/registerModel");
// const { findUserByEmail } = require("../models/loginModel");

// const register = async (req, res) => {
//   const { name,email, occupation, password, user_type, gender } = req.body;
//   console.log(req.body)
//   try 
//   {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       findUserByEmail(email, (err, result) => {
//       if (err){
//         console.log("Find error:", err);
//         return res.status(500).json({ message: "Database error" });
//       }

//       if (result.length > 0) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       createUser(name,email,occupation,hashedPassword,user_type,gender,
//         (err) => {
//           if (err) {
//             console.log("Insert error:", err);
//             return res.status(500).json({ message: "Registration failed" });
//           }
//           res.json({ message: "User registered successfully ✅" });
//         }
//       );
//     });

//   } catch (error) {
//     console.log("Server error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { register };


const db = require("../config/db");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, occupation, password, user_type, gender } = req.body;

  console.log("Register request:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  // Normalize email to avoid case/whitespace mismatch between register/login
  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const [existingUsers] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { dob } = req.body;

    const [result] = await db.query(
      `INSERT INTO users (name, email, occupation, password, user_type, gender) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, normalizedEmail, occupation, hashedPassword, user_type, gender]
    );

    console.log("User inserted successfully", { email: normalizedEmail, insertId: result.insertId });

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
      user: {
        user_id: result.insertId,
        name,
        email: normalizedEmail,
        user_type,
        gender
      }
    });
  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register };

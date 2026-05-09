 
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
const nodemailer = require("nodemailer");

// In-memory store for pending registration OTPs
// map key: email, value: { otp, expiry }
const registerOtps = new Map();

const sendRegisterOtp = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    // 1. Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // 3. Save to memory map
    registerOtps.set(normalizedEmail, { otp, expiry });

    // 4. Send email
    // --- Log the OTP for debugging ---
    console.log("--------------------------------------------------");
    console.log(`[OTP DEBUG] Registration OTP for ${normalizedEmail} is: ${otp}`);
    console.log("--------------------------------------------------");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("[WARN] Email credentials missing in .env. Skipping email send, but OTP is logged above.");
      return res.json({ 
        message: "OTP generated successfully (check server console in dev mode)",
        devMode: true 
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 5000, // 5 seconds
        greetingTimeout: 5000,
        socketTimeout: 5000,
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: "Your Registration OTP for Roomify",
        text: `Hello ${name},\n\nYour OTP for registration is: ${otp}\n\nIt is valid for 5 minutes.`
      });

      return res.json({ message: "OTP sent to email" });
    } catch (mailError) {
      console.error("Email sending failed, but OTP was generated:", mailError.message || mailError);
      return res.json({ 
        message: "OTP generated (Email failed, check server console)",
        devMode: true 
      });
    }

  } catch (error) {
    console.error("Send Registration OTP Error:", error.message || error);
    return res.status(500).json({ message: "Failed to process OTP request. Please try again." });
  }
};

const register = async (req, res) => {
  const { name, email, occupation, password, gender, user_type, otp } = req.body;

  console.log("Register request:", { ...req.body, password: "***" });

  if (!name || !email || !password || !otp) {
    return res.status(400).json({ message: "Name, email, password, and OTP are required" });
  }

  // Normalize email to avoid case/whitespace mismatch between register/login
  const normalizedEmail = String(email).trim().toLowerCase();

  // Validate OTP
  const record = registerOtps.get(normalizedEmail);
  // Allow '123456' as a master OTP for development/testing
  if (otp === "123456") {
    console.log(`[AUTH] Master OTP used for ${normalizedEmail}`);
  } else {
    if (!record) {
      return res.status(400).json({ message: "No OTP found for this email. Please request a new one." });
    }

    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > record.expiry) {
      registerOtps.delete(normalizedEmail);
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }
  }

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
      `INSERT INTO users (name, email, occupation, password, user_type, gender, DOB) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, normalizedEmail, occupation || "Other", hashedPassword, user_type || "Finder", gender || "Other", dob || null]
    );

    console.log("User inserted successfully", { email: normalizedEmail, insertId: result.insertId });

    // Remove the OTP from map since it's now used
    registerOtps.delete(normalizedEmail);

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
      user: {
        user_id: result.insertId,
        name,
        email: normalizedEmail,
        gender
      }
    });
  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, sendRegisterOtp };

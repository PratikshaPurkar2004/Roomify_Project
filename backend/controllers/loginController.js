const db = require("../config/db");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      message: "Login successful",
      user
    });

  } 
  // catch (error) {
  //   console.log(error);
  //   res.status(500).json({
  //     message: "Server error"
  //   });
  // }

  catch (error) {
  console.log("LOGIN ERROR:", error.response?.data);
  return rejectWithValue(
    error.response?.data?.message || "Login failed"
  );
}
};

module.exports = { login };
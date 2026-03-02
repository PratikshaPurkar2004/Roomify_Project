const jwt = require("jsonwebtoken");

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try 
  {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({message: "Password updated successfully!",});

  } catch (err) {
    res.status(400).json({message: "Invalid or expired token",});
  }
};
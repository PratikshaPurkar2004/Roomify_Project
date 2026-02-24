const jwt = require("jsonwebtoken");

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  // check user exists in DB
try{
  const token = jwt.sign({ email }, "roomifysecret123", {expiresIn: "10m",}
);

  res.status(200).json({
    message: "Reset link sent!",
    token // for testing
  });

   } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
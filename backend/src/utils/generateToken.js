const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET || "taskflow_super_secret_key_change_later",
    { expiresIn: "7d" }
  );
}

module.exports = generateToken;

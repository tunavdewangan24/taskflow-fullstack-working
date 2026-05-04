const jwt = require("jsonwebtoken");
const { readDB } = require("../db/fileDb");

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token missing."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "taskflow_super_secret_key_change_later"
    );

    const db = readDB();
    const user = db.users.find((item) => item.id === decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists."
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid token."
    });
  }
}

module.exports = { protect };

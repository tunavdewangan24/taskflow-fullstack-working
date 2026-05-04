const bcrypt = require("bcryptjs");
const { readDB, writeDB } = require("../db/fileDb");
const generateToken = require("../utils/generateToken");

function cleanUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  const db = readDB();

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required."
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters."
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = db.users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists. Please login."
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  return res.status(201).json({
    success: true,
    message: "Account created successfully.",
    user: cleanUser(newUser)
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const db = readDB();

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required."
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = db.users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  return res.json({
    success: true,
    message: "Login successful.",
    token: generateToken(user),
    user: cleanUser(user)
  });
}

function getProfile(req, res) {
  return res.json({
    success: true,
    user: req.user
  });
}

module.exports = {
  registerUser,
  loginUser,
  getProfile
};

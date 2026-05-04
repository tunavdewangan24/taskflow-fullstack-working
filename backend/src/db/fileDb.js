const fs = require("fs");
const path = require("path");

const DB_DIR = path.join(__dirname, "../../data");
const DB_FILE = path.join(DB_DIR, "database.json");

function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const starterData = {
      users: [],
      tasks: []
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(starterData, null, 2));
  }
}

function readDB() {
  initDatabase();
  const rawData = fs.readFileSync(DB_FILE, "utf-8");

  try {
    return JSON.parse(rawData);
  } catch {
    const resetData = { users: [], tasks: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(resetData, null, 2));
    return resetData;
  }
}

function writeDB(data) {
  initDatabase();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  initDatabase,
  readDB,
  writeDB
};

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./support.db", (err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
  if (err) {
    console.log(err);
  } else {
    console.log("📦 Tables:", rows);
  }
});db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
  if (err) {
    console.log(err);
  } else {
    console.log("📦 Tables:", rows);
  }
});

db.all("SELECT * FROM sessions", [], (err, rows) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Sessions Data:", rows);
  }
});

db.all("SELECT * FROM messages", [], (err, rows) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Messages Data:", rows);
  }
});
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      role TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES sessions(id)
    )
  `);
});

module.exports = db;
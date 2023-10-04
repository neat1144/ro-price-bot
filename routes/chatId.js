import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// Create the 'chatBot' table if it doesn't exist and insert a single row
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS chatBot (
      id INTEGER PRIMARY KEY,
      chat_id TEXT,
      token TEXT
    )
  `);

  db.get("SELECT * FROM chatBot", (err, row) => {
    if (!row) {
      db.run("INSERT INTO chatBot (chat_id, token) VALUES (?, ?)", [
        "default_chat_id",
        "default_token",
      ]);
    }
  });
});

// Insert or update the single chatBot row
router.post("/", (req, res) => {
  const { chat_id, token } = req.body;

  db.run(
    "INSERT OR REPLACE INTO chatBot (id, chat_id, token) VALUES (?, ?, ?)",
    [1, chat_id, token],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to create/update chat_bot_id" });
      }
      res
        .status(201)
        .json({ message: "chat_bot_id created/updated successfully" });
    }
  );
});

// Get the chatBot entry
router.get("/", (req, res) => {
  db.get("SELECT * FROM chatBot WHERE id = 1", (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch chat_bot_id" });
    }
    res.json(row);
  });
});

export default router;

import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// Create the 'botState' table if it doesn't exist and insert a single row
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS botState (
      id           INTEGER PRIMARY KEY,
      bot_is_start INTEGER
    )
  `);

  db.get("SELECT * FROM botState", (err, row) => {
    if (!row) {
      db.run("INSERT INTO botState (bot_is_start) VALUES (?)", ["0"]);
    }
  });
});

// /bot-state
// Insert or update the single botState row
router.post("/", (req, res) => {
  const { bot_is_start } = req.body;

  db.run(
    "INSERT OR REPLACE INTO botState (id, bot_is_start) VALUES (?, ?)",
    [1, bot_is_start],
    (err) => {
      // Error
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to create/update bot_is_start" });
      }

      // Successful
      // Log
      let chnState =
        bot_is_start === 0
          ? "Stop"
          : bot_is_start === 1
          ? "Start"
          : bot_is_start === 2
          ? "None"
          : "";
      console.log(`Bot is ${chnState} (${bot_is_start})`);
      // Response
      res.status(201).json({
        message: `created/updated bot_is_start:${bot_is_start}`,
      });
    }
  );
});

// Get the botState entry
router.get("/", (req, res) => {
  db.get("SELECT * FROM botState WHERE id = 1", (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch bot_is_start" });
    }

    // Check if row is null (no data found)
    if (!row) {
      console.error("No data found in the 'botState' table.");
      return res.status(404).json({ error: "No data found" });
    }

    res.json(row);
  });
});

export default router;

import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// Create the 'timeout' table if it doesn't exist and insert a single row
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS timeout (
      id           INTEGER PRIMARY KEY,
      timeout_sec  INTEGER
    )
  `);

  db.get("SELECT * FROM timeout", (err, row) => {
    if (!row) {
      db.run("INSERT INTO timeout (timeout_sec) VALUES (?)", ["99"]);
    }
  });
});

// /timeout
// Insert or update the single timeout row
router.post("/", (req, res) => {
  const { timeout_sec } = req.body;

  db.run(
    "INSERT OR REPLACE INTO timeout (id, timeout_sec) VALUES (?, ?)",
    [1, timeout_sec],
    (err) => {
      // Error
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to create/update timeout_sec" });
      }

      // Sucessful
      // Log
      // console.log(`Timeout is ${timeout_sec}(sec)`);
      // Response
      res.status(201).json({
        message: `created/updated timeout: ${timeout_sec}`,
      });
    }
  );
});

// Get the timeout entry
router.get("/", (req, res) => {
  db.get("SELECT * FROM timeout WHERE id = 1", (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch timeout_sec and nothing" });
    }

    // Check if row is null (no data found)
    if (!row) {
      console.error("No data found in the 'timeout' table.");
      return res.status(404).json({ error: "No data found" });
    }

    res.json(row);
  });
});

export default router;

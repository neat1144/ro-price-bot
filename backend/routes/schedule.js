import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// Create the 'schedule' table if it doesn't exist and insert a single row
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS schedule (
      id         INTEGER PRIMARY KEY,
      start_time TIME,
      stop_time  TIME
    )
  `);

  db.get("SELECT * FROM schedule", (err, row) => {
    if (!row) {
      db.run("INSERT INTO schedule (start_time, stop_time) VALUES (?, ?)", [
        "00:00:00",
        "23:59:59"
      ]);
    }
  });
});

// Insert or update the single schedule row
router.post("/", (req, res) => {
  const { start_time, stop_time } = req.body;

  db.run(
    "INSERT OR REPLACE INTO schedule (id, start_time, stop_time) VALUES (?, ?, ?)",
    [1, start_time, stop_time],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to create/update schedule entry" });
      }
      res
        .status(201)
        .json({ message: "Schedule entry created/updated successfully" });
    }
  );
});

// Get the schedule entry
router.get("/", (req, res) => {
  db.get("SELECT * FROM schedule WHERE id = 1", (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch schedule entry" });
    }

    // Check if row is null (no data found)
    if (!row) {
      console.error("No data found in the 'schedule' table.");
      return res.status(404).json({ error: "No data found" });
    }

    res.json(row);
  });
});

export default router;

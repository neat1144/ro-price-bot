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
      id            INTEGER PRIMARY KEY,
      is_scheduled  INTEGER DEFAULT 0,
      start_time    TIME,
      stop_time     TIME
    )
  `);

  db.get("SELECT * FROM schedule", (err, row) => {
    if (!row) {
      db.run(
        "INSERT INTO schedule (is_scheduled, start_time, stop_time) VALUES (?, ?, ?)",
        [0, "00:00", "23:59"]
      );
    }
  });
});

// Insert or update the single schedule row
router.post("/", (req, res) => {
  const { is_scheduled, start_time, stop_time } = req.body;

  db.run(
    "INSERT OR REPLACE INTO schedule (id, is_scheduled, start_time, stop_time) VALUES (?, ?, ?, ?)",
    [1, is_scheduled, start_time, stop_time],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to create/update schedule entry" });
      }
      let scheduleStatus = is_scheduled === 1 ? "enabled" : "disabled";
      console.log(
        `Schedule created/updated successfully!!\nStatus: ${scheduleStatus}, Start time: ${start_time}, Stop time: ${stop_time}`
      );
      res
        .status(201)
        .json({ message: "Schedule entry created/updated successfully" });
    }
  );
});

// If you want to update only the is_scheduled field, use this route
// That mean you don't need to send and update start_time and stop_time
router.post("/is-scheduled", (req, res) => {
  const { is_scheduled } = req.body;

  db.run(
    "UPDATE schedule SET is_scheduled = ? WHERE id = 1",
    [is_scheduled],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to update schedule entry" });
      }
      let scheduleStatus = is_scheduled === 1 ? "enabled" : "disabled";
      console.log(`Schedule updated successfully!!\nStatus: ${scheduleStatus}`);
      res.status(201).json({ message: "Schedule entry updated successfully" });
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

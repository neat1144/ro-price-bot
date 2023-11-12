import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Create the 'timeout' table if it doesn't exist and insert a single row
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS req_timeout (
      id           INTEGER PRIMARY KEY,
      req_timeout_sec  INTEGER
    )
  `);

  db.get("SELECT * FROM req_timeout", (err, row) => {
    if (!row) {
      db.run("INSERT INTO req_timeout (req_timeout_sec) VALUES (?)", ["99"]);
    }
  });
});

// /timeout
// Insert or update the single timeout row
router.post("/", (req, res) => {
  const { req_timeout_sec } = req.body;

  db.run(
    "INSERT OR REPLACE INTO req_timeout (id, req_timeout_sec) VALUES (?, ?)",
    [1, req_timeout_sec],
    (err) => {
      // Error
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to create/update req_timeout_sec" });
      }

      // Sucessful
      // Log
      // console.log(`Timeout is ${req_timeout_sec}(sec)`);
      // Response
      res.status(201).json({
        message: `created/updated timeout: ${req_timeout_sec}`,
      });
    }
  );
});

// Get the timeout entry
router.get("/", (req, res) => {
  db.get("SELECT * FROM req_timeout WHERE id = 1", (err, row) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch req_timeout_sec and nothing" });
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

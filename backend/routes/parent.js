import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// Create the 'parent' table
db.run(`CREATE TABLE IF NOT EXISTS parent
      (id        INTEGER PRIMARY KEY AUTOINCREMENT, 
       keyword   TEXT, 
       svr       INTEGER,
       type      INTEGER)`);

// Create a item for parent table
router.post("/", (req, res) => {
  // Parementer from request body
  const { keyword, svr, type } = req.body;

  // Query
  const insertQuery = `INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`;

  // Insert to db
  db.run(insertQuery, [keyword, svr, type], (err) => {
    // Handle error
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Handle success
    res.json({
      message: "success",
      data: req.body,
    });
  });
});

// Get all items
router.get("/", (req, res) => {
  // Query
  const selectQuery = `SELECT * FROM parent`;

  // Get from db
  db.all(selectQuery, (err, rows) => {
    // Handle error
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Handle success
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Get a item by id

// Update a item by id

// Delete a item by id

export default router;

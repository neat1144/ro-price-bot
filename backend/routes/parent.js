import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// Set foreign key constraints
db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");
});

// TABLE: Create the 'parent' table
db.run(`CREATE TABLE IF NOT EXISTS parent
      (id        INTEGER PRIMARY KEY AUTOINCREMENT, 
       keyword   TEXT, 
       svr       INTEGER,
       type      INTEGER)`);

// If parent table is empty, insert four default rows
db.get("SELECT * FROM parent", (err, row) => {
  if (!row) {
    db.run(
      `INSERT INTO parent (keyword, svr, type) VALUES 
      ('乙太星塵', 2290, 0),
      ('乙太星塵', 3290, 0),
      ('乙太星塵', 4290, 0),
      ('乙太星塵', 829, 0)`
    );
  }
});

// CREATE a new parent
router.post("/", (req, res) => {
  // Parameters from the request body
  const { keyword, svr, type } = req.body;

  // Check if 'keyword' is null or empty
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required." });
  }

  // Query
  const insertQuery = `INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`;

  // Insert to db
  db.run(insertQuery, [keyword, svr, type], function (err) {
    // Handle error
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    // Get the last inserted ID using lastID
    const parentID = this.lastID;

    // Handle success
    res.json({
      message: "success to create a new parent",
      data: {
        id: parentID,
        keyword,
        svr,
        type,
      },
    });
  });
});

// GET all items
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

// UPDATE a item by id
router.put("/:id", (req, res) => {
  // Parementer from request body
  const { keyword, svr, type } = req.body;

  // Check if 'keyword' is null or empty
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required." });
  }

  // Query
  const updateQuery = `UPDATE parent SET keyword = ?, svr = ?, type = ? WHERE id = ?`;

  // Update to db
  db.run(updateQuery, [keyword, svr, type, req.params.id], (err) => {
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

// DELETE a item by id
router.delete("/:id", (req, res) => {
  // Query
  const deleteQuery = `DELETE FROM parent WHERE id = ?`;

  // Delete from db
  db.run(deleteQuery, req.params.id, (err) => {
    // Handle error
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Handle success
    res.json({
      message: "success",
    });
  });
});

export default router;

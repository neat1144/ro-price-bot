import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// TABLE: Create the 'child' table

db.run(`CREATE TABLE IF NOT EXISTS child
        (id        INTEGER PRIMARY KEY AUTOINCREMENT, 
         include   TEXT, 
         exclude   TEXT, 
         set_price REAL, 
         new_price REAL,
         nofi_time TEXT,
         parent_id INTEGER,
         item_name TEXT,
         FOREIGN KEY (parent_id) REFERENCES parent(id))`);

// CRATE a new child
router.post("/", (req, res) => {
  const {
    include,
    exclude,
    set_price,
    new_price,
    nofi_time,
    parent_id,
    item_name,
  } = req.body;

  // If parent_id is not provided, return an error
  if (!parent_id) {
    return res.status(400).json({ error: "parent_id is required" });
  }

  db.run(
    `INSERT INTO child (include, exclude, set_price, new_price, nofi_time, parent_id, item_name) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [include, exclude, set_price, new_price, nofi_time, parent_id, item_name],
    (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: req.body,
        // id: this.lastID,
      });
    }
  );
});

// Update a child by id
router.put("/:id", (req, res) => {
  const {
    include,
    exclude,
    set_price,
    new_price,
    nofi_time,
    parent_id,
    item_name,
  } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE child SET include = ?, exclude = ?, set_price = ?, new_price = ?, nofi_time = ?, parent_id = ?, item_name = ? WHERE id = ?`,
    [
      include,
      exclude,
      set_price,
      new_price,
      nofi_time,
      parent_id,
      item_name,
      id,
    ],
    (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: req.body,
      });
    }
  );
});

// Get all child
router.get("/", (req, res) => {
  db.all(`SELECT * FROM child`, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Get child list by parent_id
router.get("/parent_id/:parent_id", (req, res) => {
  const { parent_id } = req.params;

  db.all(`SELECT * FROM child WHERE parent_id = ?`, parent_id, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Delete a child by id
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM child WHERE id = ?`, id, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
    });
  });
});

export default router;

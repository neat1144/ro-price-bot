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
       parent_id INTEGER)`);

// CRATE a new child
router.post("/", (req, res) => {
  // Step 1: Validate the request body
  const { include, exclude, set_price, new_price, nofi_time, parent_name } =
    req.body;

  if (
    !include ||
    !exclude ||
    !set_price ||
    !new_price ||
    !nofi_time ||
    !parent_name
  ) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  // Step 2: Get parent_id from table parent by parent_name
  db.get(`SELECT id FROM parent WHERE keyword = ?`, parent_name, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(400).json({ error: "Parent not found" });
    }

    const parent_id = row.id;

    // Step 3: Insert the new child into the database
    db.run(
      `INSERT INTO child (include, exclude, set_price, new_price, nofi_time, parent_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [include, exclude, set_price, new_price, nofi_time, parent_id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.status(200).json({ message: "success" });
      }
    );
  });

  // Step 3: Insert the new child into the database
  db.run(
    `INSERT INTO child (include, exclude, set_price, new_price, nofi_time, parent_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [include, exclude, set_price, new_price, nofi_time, parent_id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.status(200).json({ message: "success" });
    }
  );
});

// Update a child by id
router.put("/:id", (req, res) => {
  const { include, exclude, set_price, new_price, nofi_time, parent_id } =
    req.body;

  if (
    !include ||
    !exclude ||
    !set_price ||
    !new_price ||
    !nofi_time ||
    !parent_id
  ) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  db.run(
    `UPDATE child SET include = ?, exclude = ?, set_price = ?, new_price = ?, nofi_time = ?, parent_id = ? WHERE id = ?`,
    [
      include,
      exclude,
      set_price,
      new_price,
      nofi_time,
      parent_id,
      req.params.id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.status(200).json({ message: "success" });
    }
  );
});

// Get all child
router.get("/", (req, res) => {
  db.all(`SELECT * FROM child`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({ child: rows });
  });
});

// Delete a child by id
router.delete("/:id", (req, res) => {
  db.run(`DELETE FROM child WHERE id = ?`, req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({ message: "success" });
  });
});

export default router;

import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Set foreign key constraints
db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");
});

// TABLE: Create the 'child' table
db.run(`CREATE TABLE IF NOT EXISTS child
        (id         INTEGER PRIMARY KEY AUTOINCREMENT, 
         include    TEXT, 
         exclude    TEXT, 
         set_refine REAL,
         set_level  REAL,
         set_price  REAL, 
         new_price  REAL,
         nofi_time  TEXT,
         item_name  TEXT,
         item_CNT   REAL,
         parent_id  INTEGER,
         FOREIGN KEY (parent_id) REFERENCES parent(id) ON DELETE CASCADE)`);

// CREATE a new child
router.post("/", (req, res) => {
  const {
    include,
    exclude,
    set_refine,
    set_level,
    set_price,
    new_price,
    nofi_time,
    parent_id,
    item_name,
    item_CNT,
  } = req.body;

  // If parent_id is not provided, return an error
  if (!parent_id) {
    return res.status(400).json({ error: "parent_id is required" });
  }

  db.run(
    `INSERT INTO child (include, exclude, set_refine, set_level, set_price, new_price, nofi_time, parent_id, item_name, item_CNT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      include,
      exclude,
      set_refine,
      set_level,
      set_price,
      new_price,
      nofi_time,
      parent_id,
      item_name,
      item_CNT,
    ],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      // Get the last inserted ID using lastID
      const lastID = this.lastID;

      // Return the ID of the newly inserted child
      res.json({
        message: "success to create a new child",
        data: {
          id: lastID,
          include,
          exclude,
          set_refine,
          set_level,
          set_price,
          new_price,
          nofi_time,
          parent_id,
          item_name,
          item_CNT,
        },
      });
    }
  );
});

// Update a child by id
router.put("/:id", (req, res) => {
  const {
    include,
    exclude,
    set_refine,
    set_level,
    set_price,
    new_price,
    nofi_time,
    parent_id,
    item_name,
    item_CNT,
  } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE child SET include = ?, exclude = ?, set_refine = ?, set_level = ?, set_price = ?, new_price = ?, nofi_time = ?, parent_id = ?, item_name = ?, item_CNT = ? WHERE id = ?`,
    [
      include,
      exclude,
      set_refine,
      set_level,
      set_price,
      new_price,
      nofi_time,
      parent_id,
      item_name,
      item_CNT,
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

// Update all child's nofi_time to ""
router.post("/reset", (req, res) => {
  db.run("UPDATE child SET nofi_time = '', new_price = 0", (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
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

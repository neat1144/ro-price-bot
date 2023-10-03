const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

// SQLite database connection
const db = new sqlite3.Database("mydatabase.db");

// Create the 'items' table
db.run(`CREATE TABLE IF NOT EXISTS items 
      (id        INTEGER PRIMARY KEY AUTOINCREMENT, 
       name      TEXT, 
       svr       INTEGER, 
       type      INTEGER, 
       set_price REAL, 
       new_price REAL, 
       nofi      INTEGER)`);

/* example JSON
{
  "name": "Example Item",
  "svr": 4456,
  "type": 2,
  "set_price": 50,
  "new_price": 40,
  "nofi": 2
}
*/

// Create a new item
router.post("/", (req, res) => {
  const { name, svr, type, set_price, new_price, nofi } = req.body;

  db.run(
    "INSERT INTO items (name, svr, type, set_price, new_price, nofi) VALUES (?, ?, ?, ?, 0, 0)",
    [name, svr, type, set_price, new_price, nofi],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `${name} is added`, id: this.lastID });
    }
  );
});

// Get all items
router.get("/", (req, res) => {
  db.all("SELECT * FROM items", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ items: rows });
  });
});

// Get a specific item by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ item: row });
  });
});

// Update an item by ID
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, svr, type, set_price, new_price, nofi } = req.body;

  db.run(
    "UPDATE items SET name = ?, svr = ?, type = ?, set_price = ?, new_price = ?, nofi = ? WHERE id = ?",
    [name, svr, type, set_price, new_price, nofi, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `${id} is updated`, changes: this.changes });
    }
  );
});

// Delete an item by ID
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: `${id} is deleted`, changes: this.changes });
  });
});

module.exports = router;

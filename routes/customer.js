import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const sqlite3Verbose = sqlite3.verbose();

// SQLite database connection
const db = new sqlite3Verbose.Database("mydatabase.db");

// Create the 'customers' table
db.run(`CREATE TABLE IF NOT EXISTS customers
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
    "INSERT INTO customers (name, svr, type, set_price, new_price, nofi) VALUES (?, ?, ?, ?, 0, 0)",
    [name, svr, type, set_price, new_price, nofi],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log(`Add a new customer ${name}`);
      res.json({ message: `${name} is added`, id: this.lastID });
    }
  );
});

// Get all items
router.get("/", (req, res) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Check if there are no rows returned
    if (rows.length === 0) {
      console.error("No rows found in the 'customers' table.");
    }

    console.log("Fetching all customers");
    res.json(rows);
  });
});

// Get a specific item by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM customers WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      console.error(`No customer found with ID ${id}`);
    }

    console.log(`Fetching ID customer ${id}!`);
    res.json(row);
  });
});

// Update an item by ID
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, svr, type, set_price, new_price, nofi } = req.body;

  db.run(
    "UPDATE customers SET name = ?, svr = ?, type = ?, set_price = ?, new_price = ?, nofi = ? WHERE id = ?",
    [name, svr, type, set_price, new_price, nofi, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log(`Updating ID customer ${id}`);
      res.json({ message: `${id} is updated`, changes: this.changes });
    }
  );
});

// Delete an item by ID
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM customers WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(`Deleting ID customer ${id}`);
    res.json({ message: `${id} is deleted`, changes: this.changes });
  });
});

export default router;

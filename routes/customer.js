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
       is_notify REAL,
       time      TEXT)`);

/* example JSON
{
  "name": "Example Item",
  "svr": 4456,
  "type": 2,
  "set_price": 50,
  "new_price": 40,
  "time": 2
}
*/

// Create a new item
router.post("/", (req, res) => {
  const { name, svr, type, set_price, new_price, is_notify, time } = req.body;

  // Check if 'time' is present in the request body
  // If not, set it to 0
  const finaltime = time !== undefined ? time : "";
  const isNofi = is_notify !== undefined ? is_notify : 1;
  const newPrice = is_notify !== undefined ? new_price : 0;

  db.run(
    "INSERT INTO customers (name, svr, type, set_price, new_price, is_notify, time) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, svr, type, set_price, newPrice, isNofi, finaltime], // Use finaltime here
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // console.log(`Add a new customer ${name}`);
      res.json({ message: `${name} is added`, id: this.lastID });
    }
  );
});

// Count all customers
router.get("/count", (req, res) => {
  db.get("SELECT COUNT(*) as count FROM customers", [], (err, row) => {
    if (err) {
      console.error("Error to get customers");
      return res.status(500).json({ error: err.message });
    }

    res.json({ count: row.count });
  });
});

// Get all items
router.get("/", (req, res) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) {
      console.error("Error to get customers");
      return res.status(500).json({ error: err.message });
    }

    // Check if there are no rows returned
    // if (rows.length === 0) {
    //   console.error("No rows found in the 'customers' table.");
    // }

    // console.log("Fetching all customers");
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

    // if (!row) {
    //   console.error(`No customer found with ID ${id}`);
    // }

    // console.log(`Fetching ID customer ${id}!`);
    res.json(row);
  });
});



// Update an item by ID
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, svr, type, set_price, new_price, is_notify, time } = req.body;

  // If not, set it to 0
  const finaltime = time !== undefined ? time : "";
  const isNofi = is_notify !== undefined ? is_notify : 1;
  // const newPrice = is_notify !== undefined ? new_price : 0;
  const newPrice = new_price;

  db.run(
    "UPDATE customers SET name = ?, svr = ?, type = ?, set_price = ?, new_price = ?, is_notify = ?, time = ? WHERE id = ?",
    [name, svr, type, set_price, newPrice, isNofi, finaltime, id],
    function (err) {
      if (err) {
        console.error(`Error updating ID ${id}: ${err.message}`);
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        console.warn(`No customer with ID ${id} found for updating.`);
        return res
          .status(404)
          .json({ error: `No customer with ID ${id} found for updating.` });
      }
      // console.log(`Updating ID customer ${id}`);
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
    // console.log(`Deleting customer`);
    res.json({ message: `${id} is deleted`, changes: this.changes });
  });
});

export default router;

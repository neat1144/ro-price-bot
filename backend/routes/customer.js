import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Enable foreign key support (if not already enabled)
db.run("PRAGMA foreign_keys = ON;");

/* example JSON
{
  "parent_id": 1,
  "name": "Example Item",
  "svr": 4456,
  "type": 2,
  "child_id": 1,
  "include": "Example Include",
  "exclude": "Example Exclude",
  "set_refine": 0,
  "set_lavel": 0,
  "set_price": 50,
  "new_price": 40,
  "time": "2022-01-01 00:00",
}
*/

// Get all child by parent_id
// Define the route to retrieve child records joined with parent records
router.get("/", (req, res) => {
  // Query to fetch all child records joined with parent records
  const query = `
  SELECT child.id AS child_id, include, exclude, set_refine, set_lavel, set_price, new_price, nofi_time, item_name, parent_id, keyword, svr, type
  FROM child
  LEFT JOIN parent ON child.parent_id = parent.id;
`;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows); // Respond with JSON containing the query results
    }
  });
});

// Create child and parent
router.post("/", (req, res) => {
  const {
    keyword,
    svr,
    type,
    include,
    exclude,
    set_refine,
    set_lavel,
    set_price,
    new_price,
    nofi_time,
  } = req.body;

  const selectParentQuery = `
    SELECT id
    FROM parent
    WHERE keyword = ? AND svr = ? AND type = ?
  `;

  db.get(selectParentQuery, [keyword, svr, type], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (row) {
        // If parent_id does exist, use that parent_id to create a new child
        const parentId = row.id;
        const insertChildQuery = `
          INSERT INTO child (parent_id, include, exclude, set_refine, set_lavel, set_price, new_price, nofi_time)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(
          insertChildQuery,
          [
            parentId,
            include,
            exclude,
            set_refine,
            set_lavel,
            set_price,
            new_price,
            nofi_time,
          ],
          (err) => {
            if (err) {
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              res.status(201).json({ message: "Child created successfully" });
            }
          }
        );
      } else {
        // If parent_id doesn't exist, create a new parent first
        const insertParentQuery = `
          INSERT INTO parent (keyword, svr, type)
          VALUES (?, ?, ?)
        `;
        db.run(insertParentQuery, [keyword, svr, type], function (err) {
          if (err) {
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            const parentId = this.lastID;
            const insertChildQuery = `
              INSERT INTO child (parent_id, include, exclude, set_refine, set_lavel, set_price, new_price, nofi_time)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
              insertChildQuery,
              [
                parentId,
                include,
                exclude,
                set_refine,
                set_lavel,
                set_price,
                new_price,
                nofi_time,
              ],
              (err) => {
                if (err) {
                  res.status(500).json({ error: "Internal Server Error" });
                } else {
                  res
                    .status(201)
                    .json({ message: "Child created successfully" });
                }
              }
            );
          }
        });
      }
    }
  });
});

export default router;

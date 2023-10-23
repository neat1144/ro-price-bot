import request from "supertest";
// import app from "../app"; // Assuming this is your main Express app exported from "../app.js"
import sqlite3 from "sqlite3";
import express from "express";
import childRouter from "../routes/child.js";

const app = express();
app.use(express.json());
app.use("/child", childRouter);

// SQLite database connection
const sqlite3Verbose = sqlite3.verbose();
const db = new sqlite3Verbose.Database("mydatabase.db");

// Test suite for the child API
describe("/child API", () => {
  beforeAll((done) => {
    // Create the 'child' table in memory database
    db.run(
      `CREATE TABLE IF NOT EXISTS child
      (id        INTEGER PRIMARY KEY AUTOINCREMENT,
       include   TEXT,
       exclude   TEXT,
       set_price REAL,
       new_price REAL,
       nofi_time TEXT,
       parent_id INTEGER)`,
      done
    );

    // Create the 'parent' table in memory database
    db.run(
      `CREATE TABLE IF NOT EXISTS parent
      (id        INTEGER PRIMARY KEY AUTOINCREMENT,
       keyword   TEXT,
       svr       INTEGER,
       type      INTEGER)`,
      done
    );
  });

  afterEach((done) => {
    // Delete all data from 'child' table after each test
    db.run(`DELETE FROM child`, done);
    // Delete all data from 'parent' table after each test
    db.run(`DELETE FROM parent`, done);
  });

  //  POST test
  describe("POST /child", () => {
    it("should create a new child item", async () => {
      // Create a new parent item in the 'parent' table

      // Insert a new parent item into the 'parent' table
      const res = await request(app).post("/child").send({
        include: "test1",
        exclude: "test2",
        set_price: 10.0,
        new_price: 20.0,
        nofi_time: "2022-01-01 00:00:00",
        parent: 1,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "success");
    });

    it("should return an error if missing parameters", async () => {
      const res = await request(app).post("/child").send({
        include: "test1",
        exclude: "test2",
        set_price: 10.0,
        new_price: 20.0,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  // GET list of child test
  //   describe("GET /child", () => {
  //     it("should return all child items", async () => {
  //       // Insert 2 child items into the 'child' table
  //       db.run(
  //         `INSERT INTO child (include, exclude, set_price, new_price, nofi_time) VALUES (?, ?, ?, ?, ?)`,
  //         ["test1", "test2", 10.0, 20.0, "2022-01-01 00:00:00"]
  //       );
  //       db.run(
  //         `INSERT INTO child (include, exclude, set_price, new_price, nofi_time) VALUES (?, ?, ?, ?, ?)`,
  //         ["test3", "test4", 30.0, 40.0, "2022-01-01 00:00:00"]
  //       );

  //       const res = await request(app).get("/child");

  //       expect(res.statusCode).toEqual(200);
  //       expect(res.body.data).toHaveLength(2);
  //     });
  //   });

  // UPDATE test

  // DELETE test
});

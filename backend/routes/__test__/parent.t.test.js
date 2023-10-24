import request from "supertest";
import express from "express";
import db from "../../db/db.js";
import parentRouter from "../../routes/parent.js";

const app = express();
app.use(express.json());
app.use("/parent", parentRouter);

describe("/parent API", () => {
  // beforeAll((done) => {
  //   // Create the 'parent' table in memory database
  //   db.run(
  //     `CREATE TABLE IF NOT EXISTS parent
  //     (id        INTEGER PRIMARY KEY AUTOINCREMENT,
  //      keyword   TEXT,
  //      svr       INTEGER,
  //      type      INTEGER)`,
  //     done
  //   );
  // });

  afterEach((done) => {
    // Delete all data from 'parent' table after each test
    db.run(`DELETE FROM parent`, done);
  });

  // Test POST /parent
  describe("POST /parent", () => {
    // Success case
    it("should create a new parent item", async () => {
      const res = await request(app)
        .post("/parent")
        .send({ keyword: "test", svr: 1, type: 2 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "success");
      expect(res.body).toHaveProperty("data", {
        keyword: "test",
        svr: 1,
        type: 2,
      });
    });

    // Error case (missing keyword)
    it("should return an error if missing parameters", async () => {
      const res = await request(app)
        .post("/parent")
        .send({ svr: "123", type: 2 });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  // Test GET /parent
  describe("GET /parent", () => {
    // Success case
    it("should return all parent items", async () => {
      // Insert test data
      db.run(`INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`, [
        "test1",
        1,
        2,
      ]);
      db.run(`INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`, [
        "test2",
        2,
        3,
      ]);

      const res = await request(app).get("/parent");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "success");
      // expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty("keyword", "test1");
      expect(res.body.data[0]).toHaveProperty("svr", 1);
      expect(res.body.data[0]).toHaveProperty("type", 2);
      expect(res.body.data[1]).toHaveProperty("keyword", "test2");
      expect(res.body.data[1]).toHaveProperty("svr", 2);
      expect(res.body.data[1]).toHaveProperty("type", 3);
    });
  });

  // Test UPDATE /parent/:id
  describe("PUT /parent/:id", () => {
    // Success case
    it("should update a parent item", async () => {
      // Insert test data
      db.run(`INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`, [
        "test1",
        1,
        2,
      ]);
      db.run(`INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`, [
        "test2",
        2,
        3,
      ]);

      // Update the item
      const res = await request(app)
        .put("/parent/1")
        .send({ keyword: "test3", svr: 3, type: 4 });

      // Check if the item is updated
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "success");
      expect(res.body).toHaveProperty("data", {
        keyword: "test3",
        svr: 3,
        type: 4,
      });
    });

    // Error case ('keyword' is null or empty)
    it("should return an error if missing parameters", async () => {
      // Insert test data
      db.run(`INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`, [
        "test1",
        1,
        2,
      ]);
      db.run(`INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`, [
        "test2",
        2,
        3,
      ]);

      // Update the item('keyword' is null or empty)
      const res = await request(app).put("/parent/1").send({ svr: 3, type: 4 });

      // Check if the error is returned
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  // Test DELETE /parent/:id
  describe("DELETE /parent/:id", () => {
    // Success case
    it("should delete a parent item", async () => {
      // Insert test data
      db.run(`INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`, [
        "test1",
        1,
        2,
      ]);
      db.run(`INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`, [
        "test2",
        2,
        3,
      ]);

      // Delete the item
      const res = await request(app).delete("/parent/1");

      // Check if the item is deleted
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "success");
    });
  });
});

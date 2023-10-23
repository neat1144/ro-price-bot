import request from "supertest";
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
     parent_id INTEGER,
     FOREIGN KEY (parent_id) REFERENCES parent(id))`,
      done
    );
  });

  afterEach((done) => {
    // Delete all data from 'child' table after each test
    db.run(`DELETE FROM child`, done);
  });

  // POST test
  describe("POST /child", () => {
    it("should create a new child", async () => {
      // Sucess case
      const res = await request(app).post("/child").send({
        include: "乙太",
        exclude: "星星",
        set_price: "120",
        new_price: "300",
        parent_id: "1",
        nofi_time: "2022-01-01 (23:30)",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");

      // Error case
      const res2 = await request(app).post("/child").send({
        include: "乙太",
        exclude: "星星",
        set_price: "120",
        new_price: "300",
        nofi_time: "2022-01-01 (23:30)",
      });
      expect(res2.statusCode).toEqual(400);
      expect(res2.body).toHaveProperty("error");
    });
  });

  // UPDATE test
  describe("PUT /child/:id", () => {
    it("should update a child", async () => {
      // Create a child
      const res = await request(app).post("/child").send({
        include: "乙太",
        exclude: "星星",
        set_price: "120",
        new_price: "300",
        parent_id: "1",
        nofi_time: "2022-01-01 (23:30)",
      });

      // Update the child
      const res2 = await request(app).put(`/child/${res.body.data.id}`).send({
        include: "乙太",
        exclude: "星星",
        set_price: "120",
        new_price: "300",
        parent_id: "1",
        nofi_time: "2022-01-01 (23:30)",
      });

      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toHaveProperty("message");
      expect(res2.body).toHaveProperty("data");
    });
  });

  // GET list of child test
  describe("GET /child", () => {
    it("should return all child", async () => {
      // Create two child
      const res = await request(app).post("/child").send({
        include: "乙太",
        exclude: "星星",
        set_price: "120",
        new_price: "300",
        parent_id: "1",
        nofi_time: "2022-01-01 (23:30)",
      });
      const res2 = await request(app).post("/child").send({
        include: "乙太",
        exclude: "星星",
        set_price: "120",
        new_price: "300",
        parent_id: "1",
        nofi_time: "2022-01-01 (23:30)",
      });

      // Get all child
      const res3 = await request(app).get("/child");

      expect(res3.statusCode).toEqual(200);
      expect(res3.body).toHaveProperty("message");
      expect(res3.body).toHaveProperty("data");
      expect(res3.body.data.length).toEqual(2);
    });
  });

  // DELETE test
  describe("DELETE /child/:id", () => {
    it("should delete a child", async () => {
      // Create a child
      const res = await request(app).post("/child").send({
        include: "乙太",
        exclude: "星星",
        set_price: "120",
        new_price: "300",
        parent_id: "1",
        nofi_time: "2022-01-01 (23:30)",
      });

      // Delete the child
      const res2 = await request(app).delete(`/child/${res.body.data.id}`);

      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toHaveProperty("message");
    });
  });
});

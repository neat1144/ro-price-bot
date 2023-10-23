import request from "supertest";
import sqlite3 from "sqlite3";
import express from "express";

import timeoutRouter from "../routes/timeout.js";

const app = express();
app.use(express.json());
app.use("/timeout", timeoutRouter);

// SQLite database connection
const sqlite3Verbose = sqlite3.verbose();
const db = new sqlite3Verbose.Database("mydatabase.db");

// Test suite for the timeout API
describe("/timeout API", () => {
  // beforeAll
  beforeAll((done) => {
    // Create the 'timeout' table in memory database
    db.run(
      `CREATE TABLE IF NOT EXISTS timeout (
            id              INTEGER PRIMARY KEY,
            timeout_sec     INTEGER)`,
      done
    );
  });

  // afterEach
  afterEach((done) => {
    // Delete all data from 'timeout' table after each test
    db.run(`DELETE FROM timeout`, done);
  });

  // POST test (Create)
  describe("POST /timeout for create", () => {
    it("should create a new timeout", async () => {
      // Sucess case
      const res = await request(app).post("/timeout").send({
        timeout_sec: 10,
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");
    });
  });

  // POST test (Update)
  describe("POST /timeout for update", () => {
    it("should update the timeout", async () => {
      // Create a timeout entry
      const res1 = await request(app).post("/timeout").send({
        timeout_sec: 10,
      });

      // Update
      const res = await request(app).post("/timeout").send({
        timeout_sec: 20,
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");

      // Get the timeout item for verification
      const res2 = await request(app).get("/timeout");
      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toHaveProperty("timeout_sec", 20);
    });
  });

  // Get test
  describe("GET /timeout", () => {
    it("should get the timeout", async () => {
      // Create a timeout entry
      const res1 = await request(app).post("/timeout").send({
        timeout_sec: 10,
      });

      // Get the timeout item
      const res = await request(app).get("/timeout");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("timeout_sec", 10);
    });
  });
});

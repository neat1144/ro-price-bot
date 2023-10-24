import request from "supertest";
import express from "express";
import sqlite3 from "sqlite3";

import botStateRouter from "../../routes/botState.js";

const app = express();
app.use(express.json());
app.use("/botState", botStateRouter);

// SQLite database connection
const sqlite3Verbose = sqlite3.verbose();
const db = new sqlite3Verbose.Database("mydatabase.db");

// Test suite for the botState API
describe("/botState API", () => {
  // beforeAll
  beforeAll((done) => {
    // Create the 'botState' table in memory database
    db.run(
      `CREATE TABLE IF NOT EXISTS botState (
            id             INTEGER PRIMARY KEY,
            bot_is_start   INTEGER)`,
      done
    );
  });

  // afterEach
  afterEach((done) => {
    // Delete all data from 'botState' table after each test
    db.run(`DELETE FROM botState`, done);
  });

  // POST test (Create)
  describe("POST /botState for create", () => {
    it("should create a new botState", async () => {
      // Sucess case
      const res = await request(app).post("/botState").send({
        bot_is_start: 0,
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");
    });
  });

  // POST test (Update)
  describe("POST /botState for update", () => {
    it("should update the botState", async () => {
      // Create a botState entry
      const res1 = await request(app).post("/botState").send({
        bot_is_start: 0,
      });

      // Update
      const res = await request(app).post("/botState").send({
        bot_is_start: 1,
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");

      // Check bot_is_start is 1
      const res2 = await request(app).get("/botState");
      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toHaveProperty("bot_is_start", 1);
    });
  });

  // GET test
  describe("GET /botState", () => {
    it("should get the current botState", async () => {
      // Create a botState entry
      const res1 = await request(app).post("/botState").send({
        bot_is_start: 1,
      });

      // Get
      const res = await request(app).get("/botState");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("bot_is_start");
      expect(res.body).toHaveProperty("bot_is_start", 1);
    });
  });
});

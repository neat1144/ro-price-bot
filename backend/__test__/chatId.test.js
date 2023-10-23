import request from "supertest";
import sqlite3 from "sqlite3";
import express from "express";

import chatIdRouter from "../routes/chatId.js";

const app = express();
app.use(express.json());
app.use("/chatId", chatIdRouter);

// SQLite database connection
const sqlite3Verbose = sqlite3.verbose();
const db = new sqlite3Verbose.Database("mydatabase.db");

// Test suite for the chatId API
describe("/chatId API", () => {
  // beforeAll
  beforeAll((done) => {
    // Create the 'chatBot' table in memory database
    db.run(
      `CREATE TABLE IF NOT EXISTS chatBot (
        id      INTEGER PRIMARY KEY,
        chat_id TEXT,
        token   TEXT)`,
      done
    );
  });

  // afterEach
  afterEach((done) => {
    // Delete all data from 'chatBot' table after each test
    db.run(`DELETE FROM chatBot`, done);
  });

  // POST test
  describe("POST /chatId for create", () => {
    it("should create a new chatId", async () => {
      // Sucess case
      const res = await request(app).post("/chatId").send({
        chat_id: "12345",
        token: "12345",
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");
    });
  });

  //   POST test (Update)
  describe("POST /chatId for update", () => {
    it("should update the chatId", async () => {
      // Create a chatId entry
      const res1 = await request(app).post("/chatId").send({
        chat_id: "12345",
        token: "12345",
      });

      // Update
      const res = await request(app).post("/chatId").send({
        chat_id: "54321",
        token: "87654",
      });

      // Get the chatId item
      const res2 = await request(app).get("/chatId");

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");
      expect(res2.statusCode).toEqual(200);
      expect(res2.body.chat_id).toEqual("54321");
      expect(res2.body.token).toEqual("87654");
    });
  });

  // GET test
  describe("GET /chatId", () => {
    it("should get the chatId", async () => {
      // Create a chatId entry
      const res1 = await request(app).post("/chatId").send({
        chat_id: "12345",
        token: "45678",
      });

      // Success case
      const res = await request(app).get("/chatId");
      expect(res.statusCode).toEqual(200);
      expect(res.body.chat_id).toEqual("12345");
      expect(res.body.token).toEqual("45678");
    });
  });
});

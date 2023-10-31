import request from "supertest";
import express from "express";
import db from "../../db/db.js";
import reqTimeoutRouter from "../reqTimeout.js";

const app = express();
app.use(express.json());
app.use("/req-timeout", reqTimeoutRouter);

// Test suite for the timeout API
describe("/req-timeout API", () => {
  // afterEach clean req_timeout table
  afterEach((done) => {
    db.run("DELETE FROM req_timeout", () => {
      done();
    });
  });

  // Test for POST /req-timeout
  describe("POST /req-timeout", () => {
    // POST /req-timeout (create)
    it("should create a new req_timeout entry", async () => {
      const res = await request(app).post("/req-timeout").send({
        req_timeout_sec: 10,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");
    });

    // POST /req-timeout (update)
    it("should update the req_timeout entry", async () => {
      // Create a req_timeout entry
      const res1 = await request(app).post("/req-timeout").send({
        req_timeout_sec: 15,
      });

      // Update
      const res = await request(app).post("/req-timeout").send({
        req_timeout_sec: 28,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");

      // Get the req_timeout item for verification
      const res2 = await request(app).get("/req-timeout");
      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toHaveProperty("req_timeout_sec", 28);
    });
  });

  // Test for GET /req-timeout
  describe("GET /req-timeout", () => {
    it("should get the req_timeout entry", async () => {
      // Create a req_timeout entry
      const res1 = await request(app).post("/req-timeout").send({
        req_timeout_sec: 99,
      });

      // Get the req_timeout item
      const res = await request(app).get("/req-timeout");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("req_timeout_sec", 99);
    });
  });
});

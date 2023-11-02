import request from "supertest";
import express from "express";
import db from "../../db/db.js";
import scheduleRouter from "../../routes/schedule.js";

const app = express();
app.use(express.json());
app.use("/schedule", scheduleRouter);

describe("/schedule API", () => {
  // afterEach
  afterEach((done) => {
    // Delete all data from 'schedule' table after each test
    db.run(`DELETE FROM schedule`, done);
  });

  // Post test (Create)
  describe("POST /schedule for create", () => {
    it("should create a new schedule", async () => {
      // Sucess case
      const res = await request(app).post("/schedule").send({
        is_scheduled: 1,
        start_time: "00:00:00",
        stop_time: "23:59:59",
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");
    });
  });

  // Post test (Update)
  describe("POST /schedule for update", () => {
    it("should update the schedule", async () => {
      // Create a schedule entry
      const res1 = await request(app).post("/schedule").send({
        is_scheduled: 0,
        start_time: "00:00:00",
        stop_time: "23:59:59",
      });

      // Update
      const res = await request(app).post("/schedule").send({
        is_scheduled: 1,
        start_time: "06:06:06",
        stop_time: "18:18:18",
      });

      // Get the schedule item
      const res2 = await request(app).get("/schedule");

      // Check the schedule item
      expect(res2.body).toHaveProperty("start_time");
      expect(res2.body).toHaveProperty("stop_time");
      expect(res2.body.is_scheduled).toEqual(1);
      expect(res2.body.start_time).toEqual("06:06:06");
      expect(res2.body.stop_time).toEqual("18:18:18");
    });
  });

  // Get test
  describe("GET /schedule", () => {
    it("should get the schedule", async () => {
      // Create a schedule entry
      const res1 = await request(app).post("/schedule").send({
        is_scheduled: 1,
        start_time: "08:30:45",
        stop_time: "21:20:40",
      });

      // Get the schedule item
      const res2 = await request(app).get("/schedule");

      // Check the schedule item
      expect(res2.body).toHaveProperty("start_time");
      expect(res2.body).toHaveProperty("stop_time");
      expect(res2.body.is_scheduled).toEqual(1);
      expect(res2.body.start_time).toEqual("08:30:45");
      expect(res2.body.stop_time).toEqual("21:20:40");
    });
  });
});

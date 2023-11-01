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

  // requestBody
  const requestBody = {
    id: 0,
    is_scheduled: 1,
    start_time: "00:00",
    stop_time: "23:59",
  };

  // Post test (Create)
  describe("POST /schedule for create", () => {
    it("should create a new schedule", async () => {
      // Sucess case
      // Get first schedule response
      const res = await request(app)
        .post("/schedule")
        .send({ ...requestBody, id: 1 });

      // Get second schedule response
      const res2 = await request(app)
        .post("/schedule")
        .send({ ...requestBody, id: 2 });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");
      expect(res2.statusCode).toEqual(201);
      expect(res2.body).toHaveProperty("message");
    });
  });

  // Post test (Update)
  describe("POST /schedule for update", () => {
    it("should update the schedule", async () => {
      // Create two schedule entry
      await request(app)
        .post("/schedule")
        .send({
          ...requestBody,
          id: 1,
        });
      await request(app)
        .post("/schedule")
        .send({
          ...requestBody,
          id: 2,
        });

      // Update
      // Update first schedule
      const res1 = await request(app).post("/schedule").send({
        id: 1,
        is_scheduled: 1,
        start_time: "01:01",
        stop_time: "11:11",
      });
      expect(res1.statusCode).toEqual(201);

      // Update second schedule
      const res2 = await request(app).post("/schedule").send({
        id: 2,
        is_scheduled: 1,
        start_time: "02:02",
        stop_time: "22:22",
      });
      expect(res2.statusCode).toEqual(201);

      // Get the schedule item
      const getRes = await request(app).get("/schedule");

      // Check the schedule item
      expect(getRes.body.data[0]).toHaveProperty("start_time");
      expect(getRes.body.data[1]).toHaveProperty("stop_time");
      expect(getRes.body.data[0]["is_scheduled"]).toEqual(1);

      expect(getRes.body.data[0]["start_time"]).toEqual("01:01");
      expect(getRes.body.data[0]["stop_time"]).toEqual("11:11");
      expect(getRes.body.data[1]["start_time"]).toEqual("02:02");
      expect(getRes.body.data[1]["stop_time"]).toEqual("22:22");
    });
  });

  // Get test
  describe("GET /schedule", () => {
    it("should get the schedule", async () => {
      // Create two schedule entry
      await request(app)
        .post("/schedule")
        .send({
          ...requestBody,
          id: 1,
          start_time: "03:30",
        });
      await request(app)
        .post("/schedule")
        .send({
          ...requestBody,
          id: 2,
          stop_time: "18:29",
        });

      // Get the schedule item
      const res2 = await request(app).get("/schedule");

      // Check the schedule item
      expect(res2.body.data[0]).toHaveProperty("start_time");
      expect(res2.body.data[1]).toHaveProperty("stop_time");
      expect(res2.body.data[0]["start_time"]).toEqual("03:30");
      expect(res2.body.data[1]["stop_time"]).toEqual("18:29");
    });
  });
});

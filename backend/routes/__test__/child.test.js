import request from "supertest";
import db from "../../db/db.js";
import express from "express";

import childRouter from "../../routes/child.js";

const app = express();
app.use(express.json());
app.use("/child", childRouter);

// Test suite for the child API
describe("/child API", () => {
  // This will store the parent ID for later use
  let parentID;

  beforeAll((done) => {
    // Insert a parent record before running the tests
    db.run(
      `INSERT INTO parent (keyword, svr, type) VALUES (?, ?, ?)`,
      ["test keyword", 2209, 1],
      function (err) {
        if (err) {
          console.error(err);
          done();
        } else {
          parentID = this.lastID;
          done();
        }
      }
    );
  });

  // Delete parent table after all
  afterAll((done) => {
    db.run(`DELETE FROM parent`, done);
  });

  // Clean up child table after each
  afterEach((done) => {
    // Delete all data from 'child' table after each test
    db.run(`DELETE FROM child`, done);
  });

  const requestBody = {
    include: "",
    exclude: "",
    set_refine: 0,
    set_level: 0,
    set_price: 200000,
    new_price: 0,
    parent_id: 1,
    nofi_time: "",
    item_name: "test item",
  };

  // POST test
  describe("POST /child", () => {
    it("should create a new child", async () => {
      // Sucess case
      const res = await request(app)
        .post("/child")
        .send({ ...requestBody, parent_id: parentID });

      // Check
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.include).toEqual("");

      // Error case
      const res2 = await request(app).post("/child").send({
        include: "乙太",
        exclude: "星星",
        set_price: "120",
        new_price: "300",
        nofi_time: "2022-01-01 (23:30)",
      });

      // Check
      expect(res2.statusCode).toEqual(400);
      expect(res2.body).toHaveProperty("error");
    });
  });

  // UPDATE test
  describe("PUT /child/:id", () => {
    it("should update a child", async () => {
      // Create a child
      const res = await request(app)
        .post("/child")
        .send({ ...requestBody, parent_id: parentID });

      // Update the child
      const res2 = await request(app)
        .put(`/child/${res.body.data.id}`)
        .send({
          ...requestBody,
          include: "乙太-updated",
          parent_id: parentID,
        });

      // Check
      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toHaveProperty("message");
      expect(res2.body).toHaveProperty("data");
      expect(res2.body.data.include).toEqual("乙太-updated");
    });
  });

  // GET list of child test
  describe("GET /child", () => {
    it("should return all child", async () => {
      // Create two child
      const res = await request(app)
        .post("/child")
        .send({ ...requestBody, parent_id: parentID });
      const res2 = await request(app)
        .post("/child")
        .send({ ...requestBody, parent_id: parentID });

      // Get all child
      const res3 = await request(app).get("/child");

      expect(res3.statusCode).toEqual(200);
      expect(res3.body).toHaveProperty("message");
      expect(res3.body).toHaveProperty("data");
      expect(res3.body.data.length).toEqual(2);
      expect(res3.body.data[0]).toHaveProperty("set_refine");
      expect(res3.body.data[1]).toHaveProperty("set_level");
    });
  });

  // DELETE test
  describe("DELETE /child/:id", () => {
    it("should delete a child", async () => {
      // Create a child
      const res = await request(app)
        .post("/child")
        .send({ ...requestBody, parent_id: parentID });

      // Delete the child
      const res2 = await request(app).delete(`/child/${res.body.data.id}`);

      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toHaveProperty("message");
    });
  });

  // GET child list by parent_id test
  describe("GET /child/parent_id/:parent_id", () => {
    it("should return child list by parent_id", async () => {
      // Create two child
      // Number 1
      const res = await request(app)
        .post("/child")
        .send({ ...requestBody, parent_id: parentID });

      // Number 2
      const res2 = await request(app)
        .post("/child")
        .send({ ...requestBody, parent_id: parentID });
      expect(res.statusCode).toEqual(200);
      expect(res2.statusCode).toEqual(200);

      // Get child list by parent_id
      const res3 = await request(app).get(`/child/parent_id/${parentID}`);

      expect(res3.statusCode).toEqual(200);
      expect(res3.body).toHaveProperty("message");
      expect(res3.body).toHaveProperty("data");
      expect(res3.body.data.length).toEqual(2);
    });
  });
});

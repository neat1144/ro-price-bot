// import request from "supertest";
// import db from "../../db/db.js";
// import express from "express";

// import customerRouter from "../../routes/customer.js";

// const app = express();
// app.use(express.json());
// app.use("/customer", customerRouter);

// Test suite for the customer API
describe("/customer API", () => {
  //
  it("should pass", () => {
    const a = 1;
    expect(a).toEqual(1);
  });
  //   afterEach((done) => {
  //     // Delete all data from 'customer' table after each test
  //     db.run(`DELETE FROM child`, done);
  //     db.run(`DELETE FROM parent`, done);
  //   });
  //   const requestBody = {
  //     keyword: "test keyword1",
  //     svr: 2209,
  //     type: 1,
  //     include: "test include1",
  //     exclude: "test exclude1",
  //     set_refine: 0,
  //     set_lavel: 0,
  //     set_price: 1000,
  //     new_price: 0,
  //     nofi_time: "2022-01-01 (23:09)",
  //   };
  //   const requestBody2 = {
  //     keyword: "test keyword2",
  //     svr: 3209,
  //     type: 1,
  //     include: "test include2",
  //     exclude: "test exclude2",
  //     set_refine: 2,
  //     set_lavel: 2,
  //     set_price: 8888,
  //     new_price: 0,
  //     nofi_time: "2030-01-01 (23:09)",
  //   };
  //   const insertOneParent = () => {
  //     const insertParentQuery = `
  //     INSERT INTO parent (keyword, svr, type)
  //     VALUES (?, ?, ?)`;
  //     db.run(insertParentQuery, ["test keyword", 2209, 1], function (err) {
  //       if (err) {
  //         res.status(500).json({ error: "Internal Server Error" });
  //       }
  //     });
  //   };
  //   // POST test
  //   describe("POST /customer", () => {
  //     // If parent doesn't exists
  //     it("should create a new child with parent NOT exists", async () => {
  //       // Send POST request
  //       const res = await request(app).post("/customer").send(requestBody);
  //       // Check
  //       expect(res.statusCode).toEqual(201);
  //       expect(res.body).toHaveProperty("message");
  //     });
  //     // If parent exist
  //     it("should create a new child with parent exists", async () => {
  //       // Create parent first
  //       insertOneParent();
  //       // Send POST request
  //       const res = await request(app).post("/customer").send(requestBody);
  //       // Check
  //       expect(res.statusCode).toEqual(201);
  //       expect(res.body).toHaveProperty("message");
  //     });
  //   });
  //   // GET test
  //   describe("GET /customer", () => {
  //     it("should get all customers", async () => {
  //       // Create child and parent(non-exists)
  //       insertOneParent();
  //       const postRes = await request(app).post("/customer").send(requestBody);
  //       expect(postRes.statusCode).toEqual(201);
  //       // Create child and parent(exists)
  //       const postRes2 = await request(app).post("/customer").send(requestBody2);
  //       expect(postRes2.statusCode).toEqual(201);
  //       // Send GET request
  //       const getRes = await request(app).get("/customer");
  //       // Check
  //       expect(getRes.statusCode).toEqual(200);
  //       // {
  //       //     "child_id": 3,
  //       //     "include": "",
  //       //     "exclude": "",
  //       //     "set_refine": 0,
  //       //     "set_lavel": 0,
  //       //     "set_price": 200000,
  //       //     "new_price": 0,
  //       //     "nofi_time": "",
  //       //     "item_name": null,
  //       //     "parent_id": 2,
  //       //     "keyword": "乙太星塵",
  //       //     "svr": 2290,
  //       //     "type": 0
  //       // }
  //       expect(getRes.body[0]).toHaveProperty("child_id");
  //       expect(getRes.body[0].include).toEqual(requestBody.include);
  //       expect(getRes.body[0].exclude).toEqual(requestBody.exclude);
  //       expect(getRes.body[0].set_price).toEqual(requestBody.set_price);
  //       expect(getRes.body[0].new_price).toEqual(requestBody.new_price);
  //       expect(getRes.body[0].nofi_time).toEqual(requestBody.nofi_time);
  //       expect(getRes.body[0].item_name).toEqual(null);
  //       expect(getRes.body[0]).toHaveProperty("parent_id");
  //       expect(getRes.body[0].keyword).toEqual(requestBody.keyword);
  //       expect(getRes.body[0].svr).toEqual(requestBody.svr);
  //       expect(getRes.body[0].type).toEqual(requestBody.type);
  //       expect(getRes.body[1].keyword).toEqual(requestBody2.keyword);
  //       expect(getRes.body[1].set_price).toEqual(requestBody2.set_price);
  //       expect(getRes.body[1].set_refine).toEqual(2);
  //       expect(getRes.body[1].set_lavel).toEqual(2);
  //     });
  //   });
});

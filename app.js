// const express = require("express");
import express from "express";
import apiRoRequest from "./routes/ro-request.js";
import apiCustomer from "./routes/customer.js";
// import checkPrice from "./utils/checkPrice.js";

const app = express();
const port = 3000; // You can choose any port you like

app.use(express.json());

// RO api
// http://localhost:3000/ro-request?
// name="乙太星塵"&svr="2290"&type="0"&sort_desc="desc"
app.use("/ro-request", apiRoRequest);

// Customer api
app.use("/customer", apiCustomer);

// Check price is low for every ? seconds
const checkInterval = 5000; // 30 seconds
// setInterval(checkPrice, checkInterval);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

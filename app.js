// const express = require("express");
import express from "express";
import apiCustomer from "./routes/customer.js";
import apiGetItems from "./routes/get-items.js";
// import { checkPrice } from "./utils/checkPrice.js";

const app = express();
const port = 3000; // You can choose any port you like

app.use(express.json());

// Customer api
app.use("/customer", apiCustomer);

// Get-items api
app.use("/get-items", apiGetItems);

// Check price is low for every ? seconds
// checkPrice("");

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

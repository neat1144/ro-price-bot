// const express = require("express");
import express from "express";
import apiCustomer from "./routes/customer.js";
import apiGetItems from "./routes/items.js";
import apiChatId from "./routes/chatId.js";

const app = express();
const port = 3000;

app.use(express.json());

// Customer api
app.use("/customer", apiCustomer);

// Get-items api
app.use("/get-items", apiGetItems);

// Chat-bot id
app.use("/chat-id", apiChatId);

// Check price is low for every ? seconds
// checkPrice("");

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

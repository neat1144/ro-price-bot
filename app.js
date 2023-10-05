// const express = require("express");
import express from "express";
import apiCustomer from "./routes/customer.js";
import apiGetItems from "./routes/items.js";
import apiChatId from "./routes/chatId.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());

// Allow requests from a specific origin (replace with your React app's URL)
const allowedOrigins = ["http://localhost:3000"]; // Add your React app's URL here
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions)); // Use CORS middleware with options

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

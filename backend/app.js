// const express = require("express");
import express from "express";
import apiCustomer from "./routes/customer.js";
import apiParent from "./routes/parent.js";
import apiChild from "./routes/child.js";
import lowPriceRouter from "./routes/lowPrice.js";
import apiChatId from "./routes/chatId.js";
import botStateRouter from "./routes/botState.js";
import bodyParser from "body-parser";
import timeoutRouter from "./routes/timeout.js";
import cors from "cors";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3030;

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

// Parent api
app.use("/parent", apiParent);

// Child api
app.use("/child", apiChild);

// Get-items api
app.use("/low-price", lowPriceRouter);

// Chat-bot id
app.use("/chat-id", apiChatId);

// Bot State
app.use("/bot-state", botStateRouter);

// Timeout
app.use("/timeout", timeoutRouter);

// Price checker and Bot nofi
// const priceCheckerBot = async () => {
//   // Check bot state
//   const response = await axios.get("http://localhost:3030/bot-state");
//   const { bot_is_start: botIsStart, timeout_sec: timeoutSeconds } =
//     response.data;

//   if (botIsStart === 1) {
//     // Send request to low-price bot
//     await axios.get("http://localhost:3030/low-price");

//     // Get timeout

//     console.log(`Timeout ${timeoutSeconds}(sec)`);
//   }
// };
// priceCheckerBot();

// timeoutS = 3 * 1000;

// // Set timeout
// const interval = setInterval(priceCheckerBot, timeoutS);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const express = require("express");
import express from "express";
import apiCustomer from "./routes/customer.js";
import apiParent from "./routes/parent.js";
import apiChild from "./routes/child.js";
import scheduleRouter from "./routes/schedule.js";
import lowPriceRouter from "./routes/lowPrice.js";
import apiChatId from "./routes/chatId.js";
import botStateRouter from "./routes/botState.js";
import bodyParser from "body-parser";
import timeoutRouter from "./routes/timeout.js";
import cors from "cors";
import { lowPriceChecker } from "./models/lowPriceChecker.js";
import {
  getBotState,
  changeBotState,
  getTimeout,
  getCurrentTime,
  getScheduleTime,
} from "./models/toGetUpdate.js";
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

// Schedule api
app.use("/schedule", scheduleRouter);

let intervalId = null;

// Price checker and Bot nofi
const priceCheckerBot = async () => {
  // Get bot state
  const botState = await getBotState();

  // Get current time for 24h format contain seconds (ex: 13:00:00)
  const now = getCurrentTime();

  // Get start time and stop time
  const scheduleTime = await getScheduleTime();
  const startTime = scheduleTime["start_time"];
  const stopTime = scheduleTime["stop_time"];
  const isScheduled = scheduleTime["is_scheduled"];

  // If is_scheduled is 1, then run schedule for start/stop checker
  if (isScheduled === 1) {
    // Check if current time is between start time and stop time, change bot state to 1
    if (now >= startTime && now <= stopTime) {
      if (botState !== 2) {
        await changeBotState(1);
        console.log("Start checker by schedule");
      }
    }

    // Check if current time is not between start time and stop time, change bot state to 0
    if (now < startTime || now > stopTime) {
      if (botState !== 3) {
        await changeBotState(0);
        console.log("Stop checker by schedule");
      }
    }
  }

  // Start checker for every ${timeout} seconds
  if (botState === 1) {
    // Change bot state to 2
    await changeBotState(2);

    // Get timeout
    const timeoutSeconds = await getTimeout();

    // Log msg
    console.log(`Start checker every ${timeoutSeconds}(sec)`);

    // Do the first check
    await lowPriceChecker();

    // Start checker every ${timeout} seconds
    intervalId = setInterval(lowPriceChecker, timeoutSeconds * 1000);
  }

  // Stop checker
  if (botState === 0) {
    console.log("Stop checker");
    // Clean interval
    clearInterval(intervalId);

    await changeBotState(3);
  }
};

// Set timeout for price checker bot
setInterval(priceCheckerBot, 500);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

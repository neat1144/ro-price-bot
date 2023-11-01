// const express = require("express");
import express from "express";
import apiCustomer from "./routes/customer.js";
import apiParent from "./routes/parent.js";
import apiChild from "./routes/child.js";
import scheduleRouter from "./routes/schedule.js";
import lowPriceRouter from "./routes/lowPrice.js";
import apiChatId from "./routes/chatId.js";
import reqTimeoutRouter from "./routes/reqTimeout.js";
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
} from "./utils/toGetUpdate.js";
import { checkSchedule } from "./utils/handleSchedule.js";

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

// Req timeout
app.use("/req-timeout", reqTimeoutRouter);

// Schedule api
app.use("/schedule", scheduleRouter);

let intervalId = null;

// Price checker and Bot nofi
const priceCheckerRootBot = async () => {
  // Get start time and stop time
  const scheduleTimeList = await getScheduleTime();
  const firstSchedule = scheduleTimeList[0];
  const secondSchedule = scheduleTimeList[1];

  // Check schedule
  // If firstSchedule is working(1), then skip secondSchedule
  if (firstSchedule["is_scheduled"] === 1) {
    await checkSchedule(firstSchedule);
  } else if (secondSchedule["is_scheduled"] === 1) {
    await checkSchedule(secondSchedule);
  }

  // Get bot state
  let botState;
  botState = await getBotState();

  // Start checker for every ${timeout} seconds
  if (botState === 1) {
    // Change bot state to 2
    await changeBotState(2);
    console.log("Change bot state to 2");

    // Change bot state to 2
    botState = 2;

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
    await changeBotState(3);
    console.log("Change bot state to 3");

    // Change bot state to 3
    botState = 3;

    console.log("Stop checker by user");
    // Clean interval
    clearInterval(intervalId);
  }
};

// Set timeout for price checker bot
setInterval(priceCheckerRootBot, 500);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

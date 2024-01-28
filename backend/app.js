// const express = require("express");
import express from "express";
import apiCustomer from "./routes/customer.js";
import apiParent from "./routes/parent.js";
import apiChild from "./routes/child.js";
import scheduleRouter from "./routes/schedule.js";
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
  resetAllChild,
} from "./utils/toGetUpdate.js";

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

let priceCheckerIntervalId = null;

// Price checker and Bot nofi
const priceCheckerRootBot = async () => {
  // Get bot state
  let botState;
  botState = await getBotState();

  // Start checker for every ${timeout} seconds
  if (botState === 1) {
    // Change bot state to 2
    await changeBotState(2);
    console.log("Start bot and Change bot state to 2");

    // Change bot state to 2
    botState = 2;

    // Get timeout
    const timeoutSeconds = await getTimeout();

    // Log msg
    console.log(`Start checker every ${timeoutSeconds}(sec)`);

    // Start checker every ${timeout} seconds
    priceCheckerIntervalId = setInterval(
      lowPriceChecker,
      timeoutSeconds * 1000
    );

    // Do the first check
    await lowPriceChecker();
  }

  // Stop checker
  if (botState === 0) {
    await changeBotState(3);
    console.log("Stop bot and Change bot state to 3");

    // Change bot state to 3
    botState = 3;

    // Clean interval
    clearInterval(priceCheckerIntervalId);

    // Log
    console.log("\n========================STOP!========================\n");
  }
};

const scheduleChecker = async () => {
  // Get bot state
  let botState;
  botState = await getBotState();

  // Get current time for 24h format contain seconds (ex: 13:00:00)
  const now = getCurrentTime();

  // Get start time and stop time
  const scheduleTime = await getScheduleTime();
  const startTime = scheduleTime["start_time"];
  const stopTime = scheduleTime["stop_time"];
  const isScheduled = scheduleTime["is_scheduled"];

  // If is_scheduled is 1, then checker current time
  // If current time is between start time and stop time, then change botState to 1
  // If current time is not between start time and stop time, then change botState to 0
  if (isScheduled === 1) {
    // Check if current time is between start time and stop time, change bot state to 1
    if (now === startTime) {
      if (botState !== 2) {
        // Reset all child's nofi_time and new_price
        console.log("RESET all child's nofi_time and new_price!");
        await resetAllChild();

        // Change bot state to 1 (which is start bot)
        await changeBotState(1);
        console.log(`Current time: ${now}`);
        console.log("Start checker by schedule");

        // Get new bot state
        botState = 1;
      }
    }

    // Check if current time is not between start time and stop time, change bot state to 0
    if (now === stopTime) {
      if (botState !== 3) {
        await changeBotState(0);
        console.log(`Current time: ${now}`);
        console.log("Stop checker by schedule");

        // Get new bot state
        botState = 0;
      }
    }
  }
};

// Set timeout for price checker bot
setInterval(priceCheckerRootBot, 2000); // every 2 seconds
setInterval(scheduleChecker, 10000); // every 10 seconds

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

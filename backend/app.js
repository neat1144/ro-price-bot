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

/* 
botState:
0: stop action
1: start action
2: running
3: already stop
*/

// Price checker and Bot nofi
const priceCheckerRootBot = async () => {
  // Get bot state
  let botState;
  botState = await getBotState();

  // Start checker for every ${timeout} seconds
  if (botState === 1) {
    // Change bot state to 2 (which is running bot)
    botState = 2;
    await changeBotState(botState);
    console.log("Start bot and Change bot state to 2");

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
    // Change bot state to 3 (which is stop bot so don't stop again)
    botState = 3;
    await changeBotState(botState);
    console.log("Stop bot and Change bot state to 3");

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
  let now = getCurrentTime();

  // Get start time and stop time
  const scheduleTime = await getScheduleTime();
  const startTime = scheduleTime["start_time"];
  const stopTime = scheduleTime["stop_time"];
  const isScheduled = scheduleTime["is_scheduled"];

  // Log
  // console.log(`Checking schedule... (${now})`);

  // If is_scheduled is 1, then checker current time
  if (isScheduled === 1 || isScheduled === "1") {
    // If now == "start time" then start bot
    if (now === startTime) {
      // If botState is 2 which is running bot
      // then don't start bot again
      if (botState !== 2) {
        // Reset all child's nofi_time and new_price
        console.log("RESET all child's nofi_time and new_price!");
        await resetAllChild();

        // Change bot state to 1 (which is start bot)
        botState = 1;
        await changeBotState(botState);

        // Log
        console.log(`Current time: ${now}`);
        console.log("Start checker by schedule");
      }
    }

    // If now == "stop time" then stop bot
    if (now === stopTime) {
      // If botState is 3 which is already stop bot
      // then don't stop bot again
      if (botState !== 3) {
        // Change bot state to 0 (which is stop bot)
        botState = 0;
        await changeBotState(botState);

        // Log
        console.log(`Current time: ${now}`);
        console.log("Stop checker by schedule");
      }
    }
  }
};

// Set timeout for price checker bot
setInterval(priceCheckerRootBot, 2000); // every 2 seconds
setInterval(scheduleChecker, 20000); // every 10 seconds

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

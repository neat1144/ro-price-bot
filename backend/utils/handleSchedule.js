import { changeBotState, getCurrentTime, getBotState } from "./toGetUpdate.js";

// If firstSchedule or secondSchedule is 1, then checker current time
// If current time is between start time and stop time, then change botState to 1
// If current time is not between start time and stop time, then change botState to 0
export const checkSchedule = async (schedule) => {
  // Get current time for 24h format contain seconds (ex: 13:00:00)
  const now = getCurrentTime();

  // Get bot state
  const botState = await getBotState();

  // Get item from schedule
  const {
    id,
    is_scheduled: isScheduled,
    start_time: startTime,
    stop_time: stopTime,
  } = schedule;

  if (isScheduled === 1) {
    // Check if current time is between start time and stop time, change bot state to 1
    if (now >= startTime && now <= stopTime) {
      if (botState !== 2) {
        await changeBotState(1);
        console.log(`Start checker by schedule ${id}`);
      }
    }

    // Check if current time is not between start time and stop time, change bot state to 0
    if (now < startTime || now > stopTime) {
      if (botState !== 3) {
        await changeBotState(0);
        console.log(`Stop checker by schedule ${id}`);
      }
    }
  }
};

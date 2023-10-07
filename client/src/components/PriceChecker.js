import { useState, useEffect } from "react";
import axios from "axios";

// const StateButton = ({ timeoutSeconds }) => {
const PriceChecker = () => {
  const [storedStateCode, setStoredStateCode] = useState(false);
  const [priceCheckingIntervalId, setPriceCheckingIntervalId] = useState(null);
  const [timeoutSeconds, setTimeoutSeconds] = useState(10);
  // const [botStateCode, setBotStateCode] = useState(0);

  // const getBotState = async () => {
  //   console.log(`${timeoutSeconds}(sec)!`);
  //   // const lowPriceList = await callLowPriceItemApi();
  //   // if (lowPriceList.length) await sendMsgByChatBot(lowPriceList);

  //   // Check bot is start or stop
  //   const response = await axios.get("http://localhost:3030/bot-state");
  //   const { bot_is_start: botIsStart } = response.data;
  //   // setBotStateCode(botIsStart);
  //   const chnBotCode = botIsStart === 1 ? "Working" : "Dead";
  //   console.log(`Bot is "${chnBotCode}" from init`);
  // };

  // Load the previous state from localStorage when the component mounts
  useEffect(
    () => {
      // Load the previous state from local storage when the component mounts
      const storedState = localStorage.getItem("isChecking");
      if (storedState && JSON.parse(storedState)) {
        // Start checking if it was previously running
        startChecking();
      } else {
        // Stop checking if it was not previously running
        stopChecking();
      }

      // Load the timeoutSeconds from local storage or use a default value
      // const storedTimeoutSeconds = parseInt(
      //   localStorage.getItem("timeoutSeconds")
      // );
      // if (!isNaN(storedTimeoutSeconds)) {
      //   setTimeoutSeconds(storedTimeoutSeconds);
      // } else {
      //   setTimeoutSeconds(10); // Set a default value if not found in local storage
      // }
    }, // eslint-disable-next-line
    []
  );

  const handleTimeoutChange = (e) => {
    const newTimeout = parseInt(e.target.value, 10);
    setTimeoutSeconds(newTimeout);

    // Store the new timeoutSeconds in local storage
    localStorage.setItem("timeoutSeconds", newTimeout.toString());
  };

  // Start button and change state code
  const startChecking = async () => {
    setStoredStateCode(true);
    // Store the state in local storage when the state changes
    localStorage.setItem("isChecking", JSON.stringify(true));

    // Call api change botState set 1 (backend)
    await changeBotState(1);

    console.log("Price chcker bot start!");
    // Bot is start
    // Call Price Checking with timeout
    // seconds * 1000 = milliseconds
    const intervalDuration = timeoutSeconds * 1000;

    // Print
    console.log(`Start checking for every ${timeoutSeconds}(sec)!`);

    // Call priceChecking every X seconds
    const intervalId = setInterval(priceChecking, intervalDuration);
    // const intervalId = setInterval(priceChecking, 2000);
    setPriceCheckingIntervalId(intervalId);
  };

  // Stop button and change state code
  const stopChecking = async () => {
    setStoredStateCode(false);
    // Store the state in local storage when the state changes
    localStorage.setItem("isChecking", JSON.stringify(false));
    console.log("Stop checking!");

    // Call api change botState set 0 (backend)
    await changeBotState(0);

    // Bot is stop
    // Clear the interval using the stored interval ID
    if (priceCheckingIntervalId) {
      clearInterval(priceCheckingIntervalId);
      setPriceCheckingIntervalId(null);
    }
  };

  // Bot State API
  const changeBotState = async (stateCode) => {
    const botStateUrl = "http://localhost:3030/bot-state";

    // Post request
    try {
      await axios.post(botStateUrl, {
        bot_is_start: stateCode,
        timeout_sec: timeoutSeconds,
      });

      // Print suc-msg
      const chnBotCode = stateCode === 1 ? "Start" : "Stop";
      console.log(`Change bot code to "${chnBotCode}"`);
    } catch (error) {
      console.error("Error to set/change Bot State!");
    }
  };

  // Price Checking function!
  const priceChecking = async () => {
    // Print
    console.log(`${timeoutSeconds}(sec)!`);
    // Send low-price bot api
    await axios.get("http://localhost:3030/low-price");
  };

  // NOT USE (BOT)
  // Get chat bot id/token
  // const fetchBotId = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3030/chat-id");
  //     // setBotId({ chat_id, token });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching bot data:", error);
  //   }
  // };

  // Send msg by bot
  //   const sendMsgByChatBot = async (itemList) => {
  //     // Get token and id
  //     const { chat_id: chatId, token } = await fetchBotId();

  //     // Api Information
  //     const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  //     // Loop item list to send msg
  //     console.log("Sending message...");
  //     for (const item of itemList) {
  //       const { name, set_price: setPrice, new_price: newPrice, type } = item;

  //       const chnType = type === 0 ? "販賣" : type === 1 ? "收購" : "未知";

  //       // Msg by sended
  //       const messageText = `
  // 關鍵字: ${name}
  // 設定價格: ${setPrice.toLocaleString("en-US")}
  // 目前${chnType}: ${newPrice.toLocaleString("en-US")}`;

  //       // Send request by telegram api
  //       try {
  //         const response = await axios.post(tgUrl, {
  //           chat_id: chatId,
  //           text: messageText,
  //         });

  //         // Print suc-msg
  //         console.log("Message sent successfully:", response.data);
  //       } catch (error) {
  //         console.error("Error sending msg by TG bot");
  //       }
  //     }
  // };

  return {
    isChecking: storedStateCode,
    startChecking,
    stopChecking,
    timeoutSeconds,
    handleTimeoutChange,
  };
};

export default PriceChecker;

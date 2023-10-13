import { useState, useEffect } from "react";
import axios from "axios";
import "./StateButton.css";

// const StateButton = ({ inputTimeout }) => {
const PriceChecker = (inputTimeout) => {
  const [isStartChecking, setIsStartChecking] = useState(false);
  const [priceCheckingIntervalId, setPriceCheckingIntervalId] = useState(null);
  // const [timeoutSeconds, setTimeoutSeconds] = useState(250);

  // Load the previous state from localStorage when the component mounts
  useEffect(() => {
    // Load the previous state from local storage when the component mounts
    const storedState = localStorage.getItem("isChecking");
    if (storedState && JSON.parse(storedState)) {
      // Start checking if it was previously running
      startChecking();
    } else {
      // Stop checking if it was not previously running
      stopChecking();
    }
  }, []); // eslint-disable-next-line

  // Start button and change state code
  const startChecking = async () => {
    setIsStartChecking(true);
    // Store the state in local storage when the state changes
    localStorage.setItem("isChecking", JSON.stringify(true));

    // Call api change botState set 1 (backend)
    await changeBotState(1);

    console.log("Price chcker bot start!");

    // Get timeout from db
    const timeoutSeconds = await getTimeout();

    // Call Price Checking with timeout
    // seconds * 1000 = milliseconds
    const intervalDuration = timeoutSeconds * 1000;

    // Print
    console.log(`Start checking for every ${timeoutSeconds}(sec)!`);

    // Call priceChecking every X seconds
    priceCheckingApi();
    const intervalId = setInterval(priceCheckingApi, intervalDuration);
    // const intervalId = setInterval(priceCheckingApi, 2000);
    setPriceCheckingIntervalId(intervalId);
  };

  // Stop button and change state code
  const stopChecking = async () => {
    setIsStartChecking(false);
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
      });

      // Print suc-msg
      const chnBotCode = stateCode === 1 ? "Start" : "Stop";
      console.log(`Change bot code to "${chnBotCode}"`);
    } catch (error) {
      console.error("Error to set/change Bot State!");
    }
  };

  // Get timeout
  const getTimeout = async () => {
    try {
      const response = await axios.get("http://localhost:3030/timeout");
      const sec = response.data["timeout_sec"];
      console.log(`timeout of db is: ${sec}`);
      return sec;
    } catch (error) {
      console.error("Error to fetch timeout from db", error);
    }
  };

  // Price Checking function!
  const priceCheckingApi = async () => {
    try {
      // Send low-price bot api
      await axios.get("http://localhost:3030/low-price");
    } catch (error) {
      console.error("Error check price");
    }
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

  // return {
  //   // Start/Stop
  //   isStartChecking,
  //   startChecking,
  //   stopChecking,
  // };
  return (
    // Start/Stop
    <div className="button-container">
      {isStartChecking ? (
        <button
          className="btn btn-danger"
          // className="btn btn-danger button-start-stop"
          onClick={stopChecking}
        >
          Stop
        </button>
      ) : (
        <button
          className="btn btn-primary"
          // className="btn btn-success button-start-stop"
          onClick={startChecking}
        >
          Start
        </button>
      )}
    </div>
  );
};

export default PriceChecker;

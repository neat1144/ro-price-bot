import { useState, useEffect } from "react";
import axios from "axios";

// const StateButton = ({ timeoutSeconds }) => {
const PriceChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [priceCheckingIntervalId, setPriceCheckingIntervalId] = useState(null);
  const [timeoutSeconds, setTimeoutSeconds] = useState(10);

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

    // Load the timeoutSeconds from local storage or use a default value
    const storedTimeoutSeconds = parseInt(
      localStorage.getItem("timeoutSeconds")
    );
    if (!isNaN(storedTimeoutSeconds)) {
      setTimeoutSeconds(storedTimeoutSeconds);
    } else {
      setTimeoutSeconds(10); // Set a default value if not found in local storage
    }
  }, []);

  const handleTimeoutChange = (e) => {
    const newTimeout = parseInt(e.target.value, 10);
    setTimeoutSeconds(newTimeout);

    // Store the new timeoutSeconds in local storage
    localStorage.setItem("timeoutSeconds", newTimeout.toString());
  };

  // Start checking
  const startChecking = () => {
    setIsChecking(true);
    // Store the state in local storage when the state changes
    localStorage.setItem("isChecking", JSON.stringify(true));

    // seconds * 1000 = milliseconds
    const intervalDuration = timeoutSeconds * 1000;

    // Print
    console.log(`Start checking for every ${timeoutSeconds}(sec)!`);

    // Call priceChecking every X seconds
    // const intervalId = setInterval(priceChecking, intervalDuration);
    const intervalId = setInterval(priceChecking, 2000);
    setPriceCheckingIntervalId(intervalId);
  };

  // Stop checking
  const stopChecking = () => {
    setIsChecking(false);
    // Store the state in local storage when the state changes
    localStorage.setItem("isChecking", JSON.stringify(false));
    console.log("Stop checking!");

    // Clear the interval using the stored interval ID
    if (priceCheckingIntervalId) {
      clearInterval(priceCheckingIntervalId);
      setPriceCheckingIntervalId(null);
    }
  };

  // Combine function!
  const priceChecking = async () => {
    console.log(`Test timeout ${timeoutSeconds}(sec)!`);
    // const lowPriceList = await callLowPriceItemApi();
    // if (lowPriceList.length) await sendMsgByChatBot(lowPriceList);
  };

  // Call api to get low price item
  const callLowPriceItemApi = async () => {
    try {
      console.log("Calling low-price-check api");
      const response = await axios.get("http://localhost:3030/low-price");
      console.log("Calling sucessfull！");
      return response.data;
    } catch (error) {
      console.error("Error calling low-price-check api");
    }
  };

  // Get chat bot id/token
  const fetchBotId = async () => {
    try {
      const response = await axios.get("http://localhost:3030/chat-id");
      // setBotId({ chat_id, token });
      return response.data;
    } catch (error) {
      console.error("Error fetching bot data:", error);
    }
  };

  // Send msg by bot
  const sendMsgByChatBot = async (itemList) => {
    // Get token and id
    const { chat_id: chatId, token } = await fetchBotId();

    // Api Information
    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    // Loop item list to send msg
    console.log("Sending message...");
    for (const item of itemList) {
      const { name, set_price: setPrice, new_price: newPrice, type } = item;

      const chnType = type === 0 ? "販賣" : type === 1 ? "收購" : "未知";

      // Msg by sended
      const messageText = `
關鍵字: ${name}
設定價格: ${setPrice.toLocaleString("en-US")} 
目前${chnType}: ${newPrice.toLocaleString("en-US")}`;

      // Send request by telegram api
      try {
        const response = await axios.post(tgUrl, {
          chat_id: chatId,
          text: messageText,
        });

        // Print suc-msg
        console.log("Message sent successfully:", response.data);
      } catch (error) {
        console.error("Error sending msg by TG bot");
      }
    }
  };

  return {
    isChecking,
    startChecking,
    stopChecking,
    timeoutSeconds,
    handleTimeoutChange,
  };
};

export default PriceChecker;

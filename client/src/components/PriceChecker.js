import { useState, useEffect } from "react";
import axios from "axios";
import "./PriceChecker.css";

const PriceChecker = () => {
  const [botState, setBotState] = useState(0);

  // Get bot state
  const fetchBotState = async () => {
    try {
      const response = await axios.get("http://localhost:3030/bot-state");
      setBotState(response.data["bot_is_start"]);
    } catch (error) {
      console.error("Error fetching bot state:", error);
    }
  };

  useEffect(() => {
    fetchBotState();
  }, []);

  // Change Bot State
  const changeBotState = async (stateCode) => {
    const botStateApi = "http://localhost:3030/bot-state";
    try {
      await axios.post(botStateApi, {
        bot_is_start: stateCode,
      });

      // Print success message
      let chnBotCode =
        stateCode === 0
          ? "Stop"
          : stateCode === 1
          ? "Start"
          : stateCode === 2
          ? "None"
          : "";
      console.log(`Change bot code to "${stateCode}" (${chnBotCode})`);

      // Update the botState state
      setBotState(stateCode);
    } catch (error) {
      console.error("Error to set/change Bot State!");
    }
  };

  return (
    <div className="button-container">
      {botState === 0 ? (
        <button className="btn btn-primary" onClick={() => changeBotState(1)}>
          Start
        </button>
      ) : (
        <button className="btn btn-danger" onClick={() => changeBotState(0)}>
          Stop
        </button>
      )}
    </div>
  );
};

export default PriceChecker;

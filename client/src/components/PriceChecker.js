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

  // Change schdule state
  const changeSchduleState = async (stateCode) => {
    const schduleStateApi = "http://localhost:3030/schedule";

    try {
      await axios.post(schduleStateApi, {
        is_scheduled: stateCode,
      });

      // Print success message
      console.log(`Change schedule code to "${stateCode}"`);
    } catch (error) {
      console.error("Error to set/change Schdule State!");
    }
  };

  // Handle start
  const handleStart = () => {
    changeBotState(1);
  };

  // Handle stop
  const handleStop = () => {
    changeSchduleState(0);
    changeBotState(0);
  };

  return (
    <div className="button-container">
      {botState === 1 || botState === 2 ? (
        <button className="btn btn-danger" onClick={() => handleStop()}>
          Stop
        </button>
      ) : (
        <button className="btn btn-primary" onClick={() => handleStart()}>
          Start
        </button>
      )}
    </div>
  );
};

export default PriceChecker;

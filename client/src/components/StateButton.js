// StateButton.js
import React from "react";
import "./StateButton.css";

const StateButton = ({ isChecking, startChecking, stopChecking }) => {
  return (
    <div>
      {isChecking ? (
        <button className="button-stop" onClick={stopChecking}>
          Stop
        </button>
      ) : (
        <button className="button-start" onClick={startChecking}>
          Start
        </button>
      )}
    </div>
  );
};

export default StateButton;

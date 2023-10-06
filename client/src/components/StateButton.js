// StateButton.js
import React from "react";
import "./StateButton.css";

const StateButton = ({ isChecking, startChecking, stopChecking }) => {
  return (
    <div className="button-container">
      {isChecking ? (
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

export default StateButton;

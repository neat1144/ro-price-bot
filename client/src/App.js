import React from "react";
import "./App.css"; // Import your app-specific CSS file if you have one
import CustomerTable from "./components/CustomerTable"; // Import the CustomerTable component
import StateButton from "./components/StateButton";
import PriceChecker from "./components/PriceChecker";
import TGTable from "./components/TGTable";

function App() {
  // Get the isChecking, startChecking, and stopChecking from StateButton
  const {
    isChecking,
    startChecking,
    stopChecking,
    timeoutSeconds,
    handleTimeoutChange,
  } = PriceChecker();

  return (
    <div className="App">
      {/* Header and Title */}
      <div className="header">
        <h1>RO Spider</h1>
      </div>

      {/* Timeout Input */}
      <div className="timeout-input">
        <label>
          Timeout(sec)
          <br />
          至少要項目的兩倍秒數{" "}
        </label>
        <input
          type="number"
          value={timeoutSeconds}
          onChange={handleTimeoutChange}
        />
      </div>

      {/* Start/Stop Button (using StateButton component) */}
      <StateButton
        isChecking={isChecking}
        startChecking={startChecking}
        stopChecking={stopChecking}
      />
      {/* CustomerTable component */}
      <CustomerTable />
      {/* TGTable component */}
      <TGTable />
    </div>
  );
}

export default App;

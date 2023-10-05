import React, { useState } from "react";
import "./App.css"; // Import your app-specific CSS file if you have one
import CustomerTable from "./components/CustomerTable"; // Import the CustomerTable component
import StateButton from "./components/StateButton";
import PriceChecker from "./components/PriceChecker";
import TGTable from "./components/TGTable";

function App() {
  const [timeoutSeconds, setTimeoutSeconds] = useState(30); // Initialize with a default value

  // Get the isChecking, startChecking, and stopChecking from StateButton
  const { isChecking, startChecking, stopChecking } = PriceChecker({
    timeoutSeconds,
  }); // Pass timeoutSeconds as a prop

  const handleTimeoutChange = (e) => {
    const newTimeout = parseInt(e.target.value, 10);
    setTimeoutSeconds(newTimeout);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>RO Spider</h1>
      </div>
      <div className="timeout-input">
        <label>Timeout (seconds): </label>
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
      <br />
      {/* CustomerTable component */}
      <CustomerTable />
      {/* TGTable component */}
      <TGTable />
    </div>
  );
}

export default App;

import React from "react";
import "./App.css"; // Import your app-specific CSS file if you have one
import CustomerTable from "./components/CustomerTable"; // Import the CustomerTable component
import PriceChecker from "./components/PriceChecker";
import StateButton from "./components/StateButton";
import ButtonChecking from "./components/ButtonChecking"

function App() {
  // Telegram function
  const handleTelegram = () => {
    // Implement the new button functionality here
    console.log("New button clicked");
  };

  // Get the isChecking, startChecking, and stopChecking from StateButton
  const { isChecking, startChecking, stopChecking } = ButtonChecking();

  return (
    <div className="App">
      <h1>RO Spider</h1>
      {/* PriceChecker component */}
      <PriceChecker isChecking={isChecking} />
      {/* Start/Stop Button (using StateButton component) */}
      <StateButton
        isChecking={isChecking}
        startChecking={startChecking}
        stopChecking={stopChecking}
      />
      {/* TG Button */}
      <button className="tg-button" onClick={() => handleTelegram()}>
        telegram
      </button>
      {/* CustomerTable component */}
      <CustomerTable />
    </div>
  );
}

export default App;

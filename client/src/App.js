import React from "react";
import "./App.css"; // Import your app-specific CSS file if you have one
import CustomerTable from "./components/CustomerTable"; // Import the CustomerTable component
import StateButton from "./components/StateButton";
import ButtonChecking from "./components/ButtonChecking"
import TGTable from "./components/TGTable"

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
      <br />
      <TGTable />
    </div>
  );
}

export default App;

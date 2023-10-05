import React from "react";
import "./App.css"; // Import your app-specific CSS file if you have one
import CustomerTable from "./components/CustomerTable"; // Import the CustomerTable component
import StateButton from "./components/StateButton";
import PriceChecker from "./components/PriceChecker";
import TGTable from "./components/TGTable";

function App() {
  // Get the isChecking, startChecking, and stopChecking from StateButton
  const { isChecking, startChecking, stopChecking } = PriceChecker();

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
      <TGTable />
    </div>
  );
}

export default App;

import React from "react";
import "./App.css"; // Import your app-specific CSS file if you have one
import CustomerTable from "./components/CustomerTable"; // Import the CustomerTable component
// import StateButton from "./components/StateButton";
import PriceChecker from "./components/PriceChecker";
import TGTable from "./components/TGTable";
import "bootstrap/dist/css/bootstrap.min.css";
import Timeout from "./components/Timeout";

function App() {
  // Get the isChecking, startChecking, and stopChecking from StateButton
  // const {
  //   // Start/Stop
  //   isStartChecking,
  //   startChecking,
  //   stopChecking,
  // } = PriceChecker();

  return (
    <div className="App">
      {/* Header and Title */}
      <div className="header-cus header">
        <h1>RO Spider</h1>
      </div>

      {/* Timeout Input */}
      <Timeout />

      {/* Start/Stop Button (using StateButton component) */}
      {/* <StateButton
        isStartChecking={isStartChecking}
        startChecking={startChecking}
        stopChecking={stopChecking}
      /> */}
      <PriceChecker />
      {/* CustomerTable component */}
      <CustomerTable />
      {/* TGTable component */}
      <TGTable />
    </div>
  );
}

export default App;

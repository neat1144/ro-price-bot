import React from "react";
import "./App.css"; // Import your app-specific CSS file if you have one
import CustomerTable from "./CustomerTable"; // Import the CustomerTable component

function App() {
  return (
    <div className="App">
      <CustomerTable /> {/* Include the CustomerTable component */}
    </div>
  );
}

export default App;

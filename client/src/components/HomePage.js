import React from "react";
import Timeout from "./Timeout";
import CustomerTable from "./CustomerTable";
import PriceChecker from "./PriceChecker";

const HomePage = () => {
  return (
    <>
      {/* Timeout Input */}
      <Timeout />
      <PriceChecker />

      {/* CustomerTable component */}
      <CustomerTable />
    </>
  );
};

export default HomePage;

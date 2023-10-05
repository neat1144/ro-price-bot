import { useState, useEffect } from "react";
import axios from "axios";

const StateButton = () => {
  const [isChecking, setIsChecking] = useState(false);

  // Load the previous state from localStorage when the component mounts
  useEffect(() => {
    const storedState = localStorage.getItem("isChecking");
    if (storedState) {
      setIsChecking(JSON.parse(storedState));
    }
  }, []);

  // Start checking
  const startChecking = async () => {
    setIsChecking(true);
    // Store the state in localStorage when the state changes
    localStorage.setItem("isChecking", JSON.stringify(true));

    // Print
    console.log("Start!");
    const customers = await fectchAllCustomers();
    // console.log("customers", customers);
    const itemList = await fectchItemListByCustomer();
    console.log(itemList);
  };

  // Stop checking
  const stopChecking = async () => {
    setIsChecking(false);
    // Store the state in localStorage when the state changes
    localStorage.setItem("isChecking", JSON.stringify(false));
    console.log("Stop!");
  };

  // Get all customers
  const fectchAllCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3030/customer");
      return response.data;
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // Get item list with an customer
  const fectchItemListByCustomer = () => {};

  // Create bot
  const createChatBot = () => {};

  // Send msg by bot
  const sendMsgByChatBot = () => {};

  return { isChecking, startChecking, stopChecking };
};

export default StateButton;

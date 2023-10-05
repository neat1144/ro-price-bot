import React, { useState, useEffect } from 'react';

const StateButton = () => {
  const [isChecking, setIsChecking] = useState(false);

  // Load the previous state from localStorage when the component mounts
  useEffect(() => {
    const storedState = localStorage.getItem('isChecking');
    if (storedState) {
      setIsChecking(JSON.parse(storedState));
    }
  }, []);

  const startChecking = () => {
    setIsChecking(true);
    // Store the state in localStorage when the state changes
    localStorage.setItem('isChecking', JSON.stringify(true));
    console.log("Start!");
  };

  const stopChecking = () => {
    setIsChecking(false);
    // Store the state in localStorage when the state changes
    localStorage.setItem('isChecking', JSON.stringify(false));
    console.log("Stop!");
  };

  return { isChecking, startChecking, stopChecking };
};

export default StateButton;

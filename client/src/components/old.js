import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PriceChecker = () => {
  const [itemPrice, setItemPrice] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const fetchItemPrice = async () => {
    try {
      const response = await axios.get('API_ENDPOINT'); // Replace 'API_ENDPOINT' with the actual API URL
      const price = response.data.price; // Adjust this based on your API response structure
      setItemPrice(price);

      // Check if the price is low (e.g., less than $50)
      if (price < 50) {
        sendTelegramNotification();
      }
    } catch (error) {
      console.error('Error fetching item price:', error);
    }
  };

  const sendTelegramNotification = async () => {
    try {
      const botToken = 'YOUR_BOT_TOKEN'; // Replace with your Telegram bot token
      const chatId = 'YOUR_CHAT_ID'; // Replace with the chat ID where you want to send notifications
      const message = 'Item price is low!';

      const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;
      await axios.get(apiUrl);
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
    }
  };

  useEffect(() => {
    // Start checking for the item price at a specified interval (e.g., every 60 seconds)
    const id = setInterval(fetchItemPrice, 60000);
    setIntervalId(id);

    // Clean up the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div>
      {itemPrice !== null && (
        <p>Item Price: ${itemPrice}</p>
      )}
    </div>
  );
};

export default PriceChecker;

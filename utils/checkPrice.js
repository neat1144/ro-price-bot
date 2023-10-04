import { getRoRequest } from "./getRoRequest";
import axios from "axios";

const getCustomers = async () => {
  // Get all customers from db
  url = "http://localhost:3000/customer";
  try {
    // Get response
    const response = await axios.get(url);
    const customers = response.data;
    // Return
    // console.log(customers);
    return customers;
  } catch (error) {
    console.error("Error getting customers", error);
    return [];
  }
};

const checkPrice = async (sort_desc) => {
  try {
    // Get all customer
    const customers = await getCustomers();

    // Loop items to get response
    for (const customer of customers) {
      // Get name, svr, type
      const { name, svr, type } = customer;

      // Send a request to /ro-request
      const items = await getRoRequest(name, svr, type, sort_desc);

      // Loop through items and perform actions based on itemPrice
      /*     
    items.forEach((item) => {
      // Check if price is low (e.g., less than 135000)
      if (item.itemPrice < 135000) {
        // Perform actions for low-priced items
        console.log(
          `Low-priced item: Item ID: ${item.itemID}, Item Name: ${item.itemName}, Item Price: ${item.itemPrice}, Server: ${item.svr}`
        );
        // You can add more actions here
      }
    }); 
    */
    }
    // then Chat-Bot send msg
    // then update nofi code
  } catch (error) {
    console.error("Error checking price:", error);
  }
};

exports = { checkPrice };

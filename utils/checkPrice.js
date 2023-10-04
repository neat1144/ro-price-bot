// import { getRoRequest } from "./getRoRequest";
import axios from "axios";

const checkPrice = async (sort_desc) => {
  const customers = [];
  // Get all customers from db
  try {
    // Get response
    const response = await axios.get("http://localhost:3000/customers");
    customers = response.data;
  } catch (error) {
    console.error("Error getting customers", error);
  }

  // Loop Customers to get items
  try {
    for (const customer of customers) {
      // Get name, svr, type from a customer
      const { name: keyword, svr, type } = customer;

      // Send a request to get "items"
      const itemList = await getRoRequest(keyword, svr, type, sort_desc);

      console.log(itemList);

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

// export { checkPrice };

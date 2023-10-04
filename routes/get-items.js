import express from "express";
import {
  getCustomers,
  sleep,
  getItemList,
} from "../controller/itemsController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // Set sort_desc
  const sort_desc = "";

  // Get all customers
  const customers = await getCustomers();

  // Loop customers to get items
  for (const customer of customers) {
    // Get item list of a customer
    const itemList = await getItemList(customer, sort_desc);
    // console.log(itemList);

    // Set price
    const { set_price } = customer;

    // If price of item list < set_price
    for (const item of itemList) {
      if (item.item_price < set_price) {
        // Perform your action here for items with item_price less than set_price
        console.log(`Name: ${item.name}, Price: ${item.item_price}`);

        // Send nofi by chat-bot
      }
    }

    // Set timeout
    await sleep(1000);
  }
});

export default router;

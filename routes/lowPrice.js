import express from "express";
import {
  getCustomers as getCustomerList,
  sleep,
  getItemList as getItemListByCustomer,
  updateCustomers,
  sendMsgByChatBot,
  getDateTime,
} from "../controller/itemsController.js";
import TelegramBot from "node-telegram-bot-api";

const router = express.Router();

// /low-pric
router.get("/", async (req, res) => {
  // Set sort_desc
  const sort_desc = "";

  // Get all customers
  const customers = await getCustomerList();
  // console.log(customers);

  // Low price lsit
  const lowPriceCustomers = [];

  // Loop customers to get items
  if (customers.length) {
    for (const customer of customers) {
      // Get item list of a customer
      const itemList = await getItemListByCustomer(customer, sort_desc);
      // console.log(itemList);

      // Set price
      const { set_price: setPrice, new_price: newPrice } = customer;

      // Price of first dict (because item list is sorted)
      // if itemList exist
      if (itemList && itemList.length) {
        // Lowest Price of customer
        const lowestPrice = itemList[0].item_price;

        // If have low price item, Push to list
        // item price < set price
        // item price < new price
        if (setPrice >= lowestPrice) {
          if (newPrice === null || newPrice === 0 || lowestPrice < newPrice) {
            // Push to new list
            lowPriceCustomers.push(customer);
            customer.new_price = lowestPrice;
            customer.time = getDateTime();

            // Set is_notify
            customer.is_notify = 0;
          }
        }
      }
      // Set timeout
      await sleep(1000);
    }
  }

  if (lowPriceCustomers && lowPriceCustomers.length) {
    // Send msg by chat bot
    await sendMsgByChatBot(lowPriceCustomers);

    // Update new_price to db
    await updateCustomers(lowPriceCustomers);
  }

  // Response
  res.json(lowPriceCustomers);
});

export default router;

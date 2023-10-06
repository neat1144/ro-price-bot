import express from "express";
import {
  getCustomers as getCustomerList,
  sleep,
  getItemList as getItemListByCustomer,
  chat_bot,
  getChatBotId,
  updateCustomers,
} from "../controller/itemsController.js";
import TelegramBot from "node-telegram-bot-api";

const router = express.Router();

router.get("/", async (req, res) => {
  // Set sort_desc
  const sort_desc = "";

  // Get chat id and token of telegram
  // const { chat_id: chatId, token } = await getChatBotId();

  // New bot
  // const bot = new TelegramBot(token, { polling: true });

  // Get all customers
  const customers = await getCustomerList();

  // Low price lsit
  const lowPriceCustomers = [];

  // Loop customers to get items
  for (const customer of customers) {
    // Get item list of a customer
    const itemList = await getItemListByCustomer(customer, sort_desc);
    // console.log(itemList);

    // Set price
    const { set_price: setPrice, new_price: newPrice } = customer;

    // Price of first dict (because item list is sorted)
    if (itemList) {
      const firtItemPrice = itemList[0].item_price;

      // If have low price item, Push to list
      if (setPrice > firtItemPrice) {
        if (newPrice === 0 || firtItemPrice < newPrice) {
          lowPriceCustomers.push(customer);
          customer.new_price = firtItemPrice;
        }
      }
    }
    // Set timeout
    await sleep(1000);
  }

  // Update new_price to db
  await updateCustomers(lowPriceCustomers);

  // Response
  res.json(lowPriceCustomers);
});

export default router;

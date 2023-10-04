import express from "express";
import {
  getCustomers,
  sleep,
  getItemList,
  chat_bot,
  getChatBotId,
} from "../controller/itemsController.js";
import TelegramBot from "node-telegram-bot-api";

const router = express.Router();

router.get("/", async (req, res) => {
  // Set sort_desc
  const sort_desc = "";

  // Get chat id and token of telegram
  const { chat_id: chatId, token } = await getChatBotId();

  // New bot
  const bot = new TelegramBot(token, { polling: true });

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
    // Send nofi by chat-bot
    for (const item of itemList) {
      if (item.item_price < set_price) {
        chat_bot(bot, chatId, item, set_price);
      }
    }

    // Set timeout
    await sleep(1000);
  }
});

export default router;

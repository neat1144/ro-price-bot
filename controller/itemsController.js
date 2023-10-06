import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import Mutexify from "mutexify";

// Get customers of api
export const getCustomers = async () => {
  try {
    const response = await axios.get("http://localhost:3030/customer");
    const customers = response.data;
    return customers;
  } catch (error) {
    console.error("Error to getting items");
  }
};

// Update new price to customer
export const updateCustomers = async (customerList) => {
  for (const customer of customerList) {
    // data
    const requestBody = customer;

    // PUT method
    try {
      const response = await axios.put(
        `http://localhost:3030/customer/${customer.id}`,
        requestBody
      );
      console.log(`Updating ${customer.name}...`);
    } catch (error) {
      console.error("Error to update custoemrs", error);
    }
  }
};

// Sleep function
export const sleep = (ms) => {
  console.log(`Waitting 1(sec)...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//   Get item of a customer
export const getItemList = async (customer, sort_desc) => {
  // Get key word for api
  const { name, svr, type } = customer;

  // Api infromation
  // const ro_url = `http://localhost:3000/ro-request?name="${name}"&svr=${svr}&type=${type}&sort_desc="${sort_desc}"`;
  const ro_url = "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
  };
  const requestBody = {
    div_svr: svr.toString(), // '2290'
    div_storetype: type.toString(), // '0'販售, '1'收購, '2'全部
    txb_KeyWord: `\"${name}\"`, // '乙太星塵'
    row_start: "1",
    recaptcha: "",
    sort_by: "itemPrice",
    sort_desc: sort_desc, // '', 'desc'
  };

  // Send request to getting items from ro-api
  try {
    // Get response
    const response = await axios.post(ro_url, requestBody, { headers });
    const responseData = response.data;

    // Format response
    const itemList = [];
    for (const item of responseData.dt) {
      const {
        storeName: store,
        itemID: id,
        itemName: name,
        itemPrice: item_price,
        storetype: type,
      } = item;
      itemList.push({ id, name, store, item_price, svr, type });
    }
    // console.log(itemList);

    // Return data
    console.log(`Sucessfull to checking price of "${name}"!`);
    return itemList;
  } catch (error) {
    console.error(`Error to checking price of "${name}"!`);
  }
};

export const chat_bot = async (bot, chatId, item, set_price) => {
  const mutex = Mutexify();

  // Create a bot instance
  mutex(async (release) => {
    // Handle '/start' command
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from.first_name;
      bot.sendMessage(chatId, `Hello, ${firstName}! Your id is "${chatId}!"`);
    });

    // Handle text messages
    // bot.on("text", (msg) => {
    //   const chatId = msg.chat.id;
    //   const messageText = msg.text;
    //   bot.sendMessage(chatId, `You said: ${messageText}`);
    // });
    // Handle errors
    // bot.on("polling_error", (error) => {
    //   console.error("error: ", error);
    // });

    // Construct the message
    const message = `關鍵字: ${item.name}, 現在價格: ${item.item_price}, 設定價格: ${set_price}`;

    // Send notification through chat-bot
    try {
      await bot.sendMessage(chatId, message);
      console.log("Message sent sucessfully!");
    } catch (error) {
      console.log("Error sending message with telegram", error);
    }

    // Release the mutex when done
    release();
  });
};

export const getChatBotId = async () => {
  const apiUrl = "http://localhost:3030/chat-id";
  const response = await axios.get(apiUrl);

  return response.data;
};

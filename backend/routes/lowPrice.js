import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  // Log
  console.log("Price is checking...");

  // Get all parent
  const parentList = await axios
    .get("http://localhost:3030/parent")
    .catch((error) => {
      console.error("Error to get parent list!", error);
    });

  // Loop parent to check price of child
  for (const parent of parentList) {
    // Get child list by one parent
    const childList = await axios
      .get(`http://localhost:3030/child/parent_id/${parent.id}`)
      .catch((error) => {
        console.error("Error to get child list!", error);
      });

    // Get item list by one parent
    const itemList = await getItemList(parent);

    // Loop child to check price
    for (const child of childList) {
      // Variable of child
      const {
        include: keywordInclude,
        exclude: keywordExclude,
        set_price,
        new_price,
      } = child;

      // Filter item(keyword and price) list by a child
      for (const item of itemList) {
        // Variable of item
        const { itemName, item_price } = item;

        // TODO: Support multiple include and exclude, splite by "+"

        // Filter itemName by keywordInclude and keywordExclude
        if (
          itemName.includes(keywordInclude) &&
          !itemName.includes(keywordExclude)
        ) {
          // Filter by set_price (if item_price < set_price or item_price < new_price)
          if (item_price < set_price || item_price < new_price) {
            // Update new_price of child
            child.new_price = item_price;

            // Update nofi_time of child
            child.nofi_time = getDateTime();

            // Update child
            await updateChild(child);

            // Send msg by chat bot
            await sendMsgByChatBot(parent.keyword, child, item);
          }
        }
      }
    }
  }

  // Time out
  const ms = 1000;
  new Promise((resolve) => setTimeout(resolve, ms));
});

// Send msg by chat bot
const sendMsgByChatBot = async (keyword, child, item) => {
  // Get token and id
  const botIdResponse = await axios.get("http://localhost:3030/chat-id");
  const { chat_id: chatId, token } = botIdResponse.data;

  // Api Information
  const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  const { include, exclude, set_price, new_price, svr, nofi_time } = child;
  const { name: firstItemName, type } = item;

  const chnType = type === 0 ? "販賣" : type === 1 ? "收購" : "未知";

  // Msg by sended
  const messageText = `
物品名稱: ${firstItemName}
伺服器　: ${svr}
設定價格: ${set_price.toLocaleString("en-US")} 
${chnType}價格: ${new_price.toLocaleString("en-US")}
關鍵字　: ${keyword}
包含　　: ${include}
排除　　: ${exclude}
時間　　: ${nofi_time}
`;

  // Log msg
  console.log(messageText);

  // Send request by telegram api
  try {
    const response = await axios.post(tgUrl, {
      chat_id: chatId,
      text: messageText,
    });
  } catch (error) {
    const errorMsg = `Error sending msg by TG bot.
Token:${token}
chatId:${chatId}
      `;
    console.error(errorMsg);
  }
  // }
  console.log();
};

// Update child by id
const updateChild = async (child) => {
  try {
    await axios.put(`http://localhost:3030/child/${child.id}`, child);
  } catch (error) {
    console.error("Error to update child!", error);
  }
};

// Get itemList of a parent from RO server
const getItemList = async (parent) => {
  // Variable of parent
  const { keyword, svr, type } = parent;

  // Request
  const ro_url = "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
  const headers = setHeaders();
  const requestBody = {
    div_svr: svr.toString(), // '2290'
    div_storetype: type.toString(), // '0'販售, '1'收購, '2'全部
    txb_KeyWord: keyword, // '乙太星塵'
    row_start: "1",
    recaptcha: "",
    sort_by: "itemPrice",
    sort_desc: "", // '', 'desc'
  };

  // Send request
  const response = await axios
    .post(ro_url, requestBody, { headers })
    .catch((error) => {
      console.error("Error to get item list from RO server!", error);
    });
  const responseData = response.data;

  // Check if dt is an array before processing
  if (Array.isArray(responseData.dt)) {
    // Filter data of response (only return itemName, itemPrice, svr, type)
    const itemList = responseData.dt.map((item) => {
      const {
        storeName: store,
        itemID: id,
        itemName: itemName,
        itemPrice: item_price,
        storetype: type,
      } = item;
      return { id, itemName, store, item_price, svr, type };
    });
  }
};

// Get time
const getDateTime = () => {
  // Create a new Date object to represent the current date and time
  const currentTime = new Date();

  // Get the current date components (month and day)
  const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Add 1 to the month because it's zero-based
  const day = String(currentTime.getDate()).padStart(2, "0");

  // Get the current time components (hours and minutes)
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");

  // Format the date and time as a string (e.g., "MM/DD HH:mm")
  const formattedTime = `${month}/${day}(${hours}:${minutes})`;

  return formattedTime;
};

const setHeaders = () => {
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",

    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language":
      "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-CN;q=0.5",
    Dnt: "1",
    // Host: "httpbin.org",
    Referer:
      "https://event.gnjoy.com.tw/Ro/RoShopSearch?fbclid=IwAR1xC46Qfmpbv0RzjG2t7LpJp19ZUKNnpBDL0QLKNfAbzScZYgU_Sl9C04Q",
    "Sec-Ch-Ua":
      '"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    // "Sec-Fetch-User": "?1",
    // "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.60",
    // "X-Amzn-Trace-Id": "Root=1-65267ecd-1956ffae7713148b3b9305fa",
    "x-request-with": "XMLHttpRequest",
  };

  return headers;
};

// // /low-pric
// router.get("/", async (req, res) => {
//   // Log
//   console.log("Price is checking...");

//   // Set sort_desc
//   const sort_desc = "";

//   // Get all customers
//   const customers = await getCustomerList();
//   // console.log(customers);

//   // Low price lsit
//   const lowPriceCustomers = [];

//   // Loop customers to get items
//   if (customers.length) {
//     for (const customer of customers) {
//       // Set price
//       const {
//         name: keyWrod,
//         svr,
//         set_price: setPrice,
//         new_price: newPrice,
//       } = customer;

//       // Get item list of a customer
//       // console.log(`Checking ${keyWrod}(${svr})`);
//       const itemList = await getItemList(customer, sort_desc);
//       // console.log(itemList);

//       // Price of first dict (because item list is sorted)
//       // if itemList exist
//       if (itemList && itemList.length) {
//         // Lowest Price of customer
//         const lowestPrice = itemList[0].item_price;
//         const firstItemName = itemList[0].itemName;

//         // If have low price item, Push to list
//         // item price < set price
//         // item price < new price
//         if (setPrice >= lowestPrice) {
//           if (newPrice === null || newPrice === 0 || lowestPrice < newPrice) {
//             // Push to new list
//             lowPriceCustomers.push(customer);
//             customer.new_price = lowestPrice;
//             customer.time = getDateTime();

//             // Set is_notify
//             customer.is_notify = 0;

//             // Update customer and Send Nofi
//             await updateCustomers(customer);
//             await sendMsgByChatBot(customer, firstItemName);
//           }
//         }
//       }
//       // Set timeout
//       await sleep(1000);
//     }
//   }

//   // if (lowPriceCustomers && lowPriceCustomers.length) {
//   //   // Send msg by chat bot
//   //   await sendMsgByChatBot(lowPriceCustomers);

//   //   // Update new_price to db
//   //   await updateCustomers(lowPriceCustomers);
//   // }

//   // Response
//   res.json(lowPriceCustomers);
// });

export default router;

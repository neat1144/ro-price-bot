import axios from "axios";

// router.get("/", async (req, res) => {
export const lowPriceChecker = async () => {
  // Get bot state
  const botState = await getBotState();

  // if botState is false(0), then stop check
  if (botState === 0) {
    // stop this function
    return;
  }

  // Log
  console.log("Price is checking...");

  // Get bot id and token
  const botIdToken = await getBotIdToken();

  // Get all parent
  const parentList = await getParentList();

  // if parentList is empty, response error with 404
  if (!parentList.length) {
    console.error("No parent list found!");
    return;
  }

  // if botState is true(1), then start check
  if (botState !== 0) {
    // Loop parent to check price of child
    for (const parent of parentList) {
      // Get child list by one parent
      const childList = await getChildList(parent.id);
      // if childList is empty, response error with 404
      if (!childList.length) {
        console.error("No child list found!");
        return;
      }

      // Get item list by one parent
      const itemList = await getItemList(parent);

      // if itemList is empty, response error with 404
      if (!itemList.length) {
        console.error("No item list found!");
        console.log(itemList);
        return;
      }

      // Loop child to check price
      for (const child of childList) {
        // Filter item(keyword and price) list by a child
        const childFiltered = await checkChildPriceByItemList(child, itemList);

        // If childFiltered is not empty, send msg by chat bot
        if (childFiltered) {
          // Send msg by chat bot
          const botMsg = formatMsg(parent, childFiltered);
          console.log(botMsg);
          await sendMsgByBot(botIdToken, botMsg);

          // Update child
          await updateChild(childFiltered);
        }
      }
    }
  }

  // Timeout
  timeoutSleep(1000);
};

// Chcek price by a child
const checkChildPriceByItemList = async (child, itemList) => {
  // Variable of child
  const {
    include: keywordInclude,
    exclude: keywordExclude,
    set_price,
    new_price,
  } = child;

  // Loop item list to check price of child
  for (const item of itemList) {
    // Variable of item
    const { itemName, itemPrice } = item;

    // TODO: Support multiple include and exclude, splite by "+"
    // const includeKeywords = keywordInclude.split("+");
    // const excludeKeywords = keywordExclude.split("+");

    // Filter itemName by keywordInclude,keywordExclude and if they are both not ""
    if (
      (itemName.includes(keywordInclude) || keywordInclude === "") &&
      (!itemName.includes(keywordExclude) || keywordExclude === "")
    ) {
      // Filter by set_price (if itemPrice <= set_price or new_price < itemPrice)
      // Set price > item price
      // Find a new lowest item price
      if (set_price > itemPrice) {
        if (itemPrice < new_price || new_price === 0) {
          // Update new_price of child
          child.new_price = itemPrice;

          // Update item_name of child
          child.item_name = itemName;

          // Update nofi_time of child
          child.nofi_time = getDateTime();

          // Stop loop
          return child;
        }
      }
    }
  }
  // If child is not filtered, return null
  return null;
};

// Send msg by chat bot
const sendMsgByBot = async (botIdToken, messageText) => {
  // Get token and id
  const { chat_id: chatId, token } = botIdToken;

  // Api Information
  const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  // Log msg
  // console.log(messageText);

  // Send request by telegram api
  try {
    const response = await axios.post(tgUrl, {
      chat_id: chatId,
      text: messageText,
    });

    return response;
  } catch (error) {
    const errorMsg = `Error sending msg by TG bot.
Token:${token}
chatId:${chatId}
      `;
    console.error(errorMsg);
  }
};

const getBotIdToken = async () => {
  // Get bot id and token from db
  const response = await axios
    .get("http://localhost:3030/chat-id")
    .catch((error) => {
      console.error("Error to get bot id and token!", error);
    });

  return response.data;
};

// Send msg by chat bot
const formatMsg = (parent, child) => {
  const { keyword, type, svr } = parent;
  const { include, exclude, set_price, new_price, nofi_time, item_name } =
    child;

  const chnType = type === 0 ? "販賣" : type === 1 ? "收購" : "未知";

  // Msg by sended
  const messageText = `
物品名稱: ${item_name}
伺服器　: ${svr}
設定價格: ${set_price.toLocaleString("en-US")} 
${chnType}價格: ${new_price.toLocaleString("en-US")}
關鍵字　: ${keyword}, 包含(${include}), 排除(${exclude})
時間　　: ${nofi_time}
`;

  return messageText;
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

  // Response data:
  // {  Message: null,
  //    sdate: null,
  //    edate: null,
  //    dt: [
  //          {...},
  //          {...},
  //          ...
  //        ],
  // }

  // Item list
  let itemList = [];

  // Filter data of response
  if (responseData.dt && responseData.dt.length) {
    itemList = responseData.dt.map((item) => ({
      itemRefining: item.itemRefining,
      itemName: item.itemName,
      ItemGradeLevel: item.ItemGradeLevel,
      itemPrice: item.itemPrice,
      type: item.storetype,
    }));
  }
  // Check if dt is an array before processing
  // if (Array.isArray(responseData.dt)) {
  //   // Filter data of response (only return itemName, itemPrice, svr, type)
  //   const itemList = responseData.dt.map((item) => {
  //     const {
  //       storeName: store,
  //       itemID: id,
  //       itemName: itemName,
  //       storetype: type,
  //     } = item;
  //     return { id, itemName, store, itemPrice, svr, type };
  //   });
  // }

  // Return itemList
  return itemList;
};

// Get customer list
const getParentList = async () => {
  const response = await axios
    .get("http://localhost:3030/parent")
    .catch((error) => {
      console.error("Error to get parent list!", error);
    });

  return response.data["data"];
};

// Get child list by parent id
const getChildList = async (parentId) => {
  const response = await axios
    .get(`http://localhost:3030/child/parent_id/${parentId}`)
    .catch((error) => {
      console.error("Error to get child list!", error);
    });

  return response.data["data"];
};

// Get bot state
export const getBotState = async () => {
  const response = await axios
    .get("http://localhost:3030/bot-state")
    .catch((error) => {
      console.error("Error to get bot state!", error);
    });
  return response.data["bot_is_start"];
};

// Timeout
const timeoutSleep = (ms) => {
  new Promise((resolve) => setTimeout(resolve, ms));
};

// Get timeout from db
export const getTimeout = async () => {
  const response = await axios
    .get("http://localhost:3030/timeout")
    .catch((error) => {
      console.error("Error to get timeout!", error);
    });
  return response.data["timeout_sec"];
};

export const changeBotState = async (botState) => {
  axios
    .post("http://localhost:3030/bot-state", { bot_is_start: botState })
    .catch((error) => {
      console.error("Error to change bot state!", error);
    });
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

// export
export default lowPriceChecker;

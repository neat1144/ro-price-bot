import axios from "axios";
import isOnline from "is-online";

import {
  getBotIdToken,
  getParentList,
  getChildList,
  updateChild,
  getBotState,
  getTimeout,
  getDateTime,
  getTime,
  setHeaders,
} from "./toGetUpdate.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// router.get("/", async (req, res) => {
export const lowPriceChecker = async () => {
  // Get bot state
  const botState = await getBotState();

  // if botState is false(0), then stop check
  if (botState === 0 || botState === 3) {
    // stop this function
    return;
  }

  // Log
  console.log("");
  console.log(`Price is checking...               (${getTime()})`);

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

      // Timeout 5s
      await delay(2000);

      // if childList is empty, response error with 404
      if (!childList.length) {
        console.error("No child list found!");
        return;
      }

      // Log
      console.log(
        `Checking ${parent.keyword}-${parent.svr}-${
          parent.type
        }...         (${getTime()})`
      );

      // Get item list by one parent
      // Because RO server only return 30 items per page
      const itemList1 = await getItemList(parent, "1"); // First page (item1 ~ item30)
      await delay(1500);

      // if item of itemList1 is less than 30, then itemList2 is empty
      let itemList2 = [];
      if (itemList1.length < 30) {
        itemList2 = [];
      } else {
        itemList2 = await getItemList(parent, "31"); // Second page (item31 ~ )
      }

      // Merge itemList1 and itemList2
      const itemList = [...itemList1, ...itemList2];

      // if itemList is empty, response error with 404
      if (!itemList.length) {
        console.error("No item list found!");
        return;
      }

      // Loop child to check price
      for (const child of childList) {
        // Filter item(keyword and price) list by a child
        // const childFiltered = await checkChildPriceByItemList(child, itemList);
        // Filter itemList by a child (include, exclude, itemRefine, and itemLevel)
        const itemListFiltered = itemNameFilter(child, itemList);

        // Filter item list by a child (price)
        const childFilteredByPrice = filterChildPrice(child, itemListFiltered);

        // If childFiltered is not empty, send msg by chat bot
        if (childFilteredByPrice) {
          // Send msg by chat bot
          const botMsg = formatMsg(parent, childFilteredByPrice);
          console.log(botMsg);
          await sendMsgByBot(botIdToken, botMsg);

          // Update child
          await updateChild(childFilteredByPrice);
        }
      }
    }
  }
  // Log timeout from db
  const timeoutSeconds = await getTimeout();
  console.log(`Next check after ${timeoutSeconds}(sec)`);
};

// Filter item name list by a child (include, exclude, itemRefine, and itemLevel)
export const itemNameFilter = (child, itemList) => {
  const itemListFiltered = [];

  // Support multiple include and exclude, split by "+"
  const includeList = child.include.split("+");
  const excludeList = child.exclude.split("+");

  // Get itemRefining and itemGradeLevel of child
  const { set_refine: setRefine, set_level: setLevel } = child;

  itemList.forEach((item) => {
    const itemName = item.itemName;
    const itemRefine = item.itemRefining;
    const itemLevel = item.itemGradeLevel;

    // Check if the itemName matches any term in the includeList, or includeList is empty
    const includesTerm = includeList.some(
      (includeTerm) => itemName.includes(includeTerm) || includeTerm === ""
    );

    // Check if the itemName does not match any term in the excludeList, or excludeList is empty
    const excludesTerm = excludeList.every(
      (excludeTerm) => !itemName.includes(excludeTerm) || excludeTerm === ""
    );

    // Check if set_refine matches itemRefine, or set_refine is 0 (no filter on refining)
    const matchesRefine = setRefine === 0 || setRefine === itemRefine;

    // Check if set_level matches itemLevel, or set_level is 0 (no filter on level)
    const matchesLevel = setLevel === 0 || setLevel === itemLevel;

    if (includesTerm && excludesTerm && matchesRefine && matchesLevel) {
      // if (includesTerm && excludesTerm) {
      itemListFiltered.push(item);
    }
  });

  return itemListFiltered;
};

export const filterChildPrice = (child, itemList) => {
  // Get set price of child
  const { set_price: setPrice, new_price: newPrice } = child;

  // Loop item list to check price of child
  for (const item of itemList) {
    // Get item price and name
    const { itemPrice, itemName } = item;

    // Condition of filter
    // If item price < set price
    if (itemPrice <= setPrice) {
      if (itemPrice < newPrice || newPrice === 0) {
        // Update new_price of child
        child.new_price = itemPrice;

        // Update item_name of child
        child.item_name = itemName;

        // Update nofi_time of child
        child.nofi_time = getDateTime();

        // Stop loop and return child
        // Because item list is already sorted by price
        // So the first item that meet the condition is the lowest price
        return child;
      }
    }
  }
};

// Send msg by chat bot
export const sendMsgByBot = async (botIdToken, messageText) => {
  // Get token and id
  const { chat_id: chatId, token } = botIdToken;

  // Api Information
  const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;

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

// Send msg by chat bot
export const formatMsg = (parent, child) => {
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

// Get itemList of a parent from RO server
const getItemList = async (parent, rowStart) => {
  // Get original itemList from RO server
  const response = await requestRoServer(parent, rowStart);
  const responseData = response.data;

  if (responseData["Message"] !== null) {
    console.log("ro response message: ", responseData["Message"]);
  }
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
      itemGradeLevel: item.ItemGradeLevel,
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

// Check internet
// const checkInternet = async (delaySeconds) => {
//   // Check internet by is-online
//   // If internet is not available, check again after 30s, until internet is available
//   let internetAvailable = await isOnline();
//   while (!internetAvailable) {
//     // delay
//     await delay(delaySeconds * 1000);

//     // Log
//     console.log(`Internet disconnected! Check again after ${delaySeconds}s...`);

//     // Check internet again
//     internetAvailable = await isOnline();
//   }
// };

export const requestRoServer = async (parent, rowStart) => {
  // Variable of parent
  const { keyword, svr, type } = parent;

  // Request
  const ro_url = "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
  const headers = setHeaders();
  const requestBody = {
    div_svr: svr.toString(), // '2290'
    div_storetype: type.toString(), // '0'販售, '1'收購, '2'全部
    txb_KeyWord: keyword, // '乙太星塵'
    row_start: rowStart, // '1'
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

  return response;
};

// export
export default lowPriceChecker;

import axios, { all } from "axios";
import { delay } from "../utils/delay.js";
import { getTime, getBotState } from "../utils/toGetUpdate.js";

// Get item list of page
export const getAllItemList = async (parent, timeoutSeconds) => {
  // Get page from parent
  const { page } = parent;

  // Get reqTimeout
  const timeoutMilliseconds = timeoutSeconds * 1000;

  // Empty allItemList
  let allItemList = [];

  // Get itemList of page 1
  const rowStart = 1;
  const firstItemList = await getItemListByRoServer(parent, rowStart);
  allItemList = [...allItemList, ...firstItemList];
  await delay(timeoutMilliseconds);

  console.log(`page 1 itemList length: ${firstItemList.length}`);

  // If itemList of page 1 is more than 30
  // Then get itemList of other pages
  // For loop in range(page)
  for (let i = 2; i <= page; i++) {
    // check bot status
    const botState = await getBotState();
    if (botState === 0 || botState === 3) {
      console.log("Bot is stopped! (getAllItemList)");
      break;
    }

    // Get page i itemList
    if (allItemList.length >= 30 * (i - 1)) {
      // Log page
      // Delay for request timeout
      console.log(`Getting page ${i}...               (${getTime()})`);

      // Get itemList i
      const rowStart = (i - 1) * 30 + 1;
      const tempItemList = await getItemListByRoServer(parent, rowStart);

      // Log page and itemList length
      console.log(`page ${i} itemList length: ${tempItemList.length}`);

      // Append tempItemList to allItemList
      allItemList = [...allItemList, ...tempItemList];
      await delay(timeoutMilliseconds);
    }
  }

  return allItemList;
};

// Get itemList of a parent from RO server
export const getItemListByRoServer = async (parent, rowStart) => {
  // Variable of parent
  const { keyword, svr, type } = parent;

  // Request
  const ro_url = "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
  const headers = setHeaders();
  const requestBody = {
    div_svr: svr.toString(), // '2290'
    div_storetype: type.toString(), // '0'販售, '1'收購, '2'全部
    txb_KeyWord: keyword, // '乙太星塵'
    row_start: rowStart.toString(), // '1'
    recaptcha: "",
    sort_by: "itemPrice",
    sort_desc: "", // '', 'desc'
  };

  // Init Item list
  let itemList = [];

  // Send request
  try {
    const response = await axios.post(ro_url, requestBody, { headers });

    // Get original itemList from RO server
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

    // Filter data of response
    if (responseData.dt && responseData.dt.length) {
      itemList = responseData.dt.map((item) => ({
        itemRefining: item.itemRefining,
        itemName: item.itemName,
        itemGradeLevel: item.ItemGradeLevel,
        itemPrice: item.itemPrice,
        itemCNT: item.itemCNT,
        type: item.storetype,
      }));
    }

    return itemList;
  } catch (error) {
    console.error(`Error to get item list by "${keyword}" from RO server!`);
    return itemList;
  }

  // Return itemList
};

// export const requestRoServer = async (parent, rowStart) => {
//   // Variable of parent
//   const { keyword, svr, type } = parent;

//   // Request
//   const ro_url = "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
//   const headers = setHeaders();
//   const requestBody = {
//     div_svr: svr.toString(), // '2290'
//     div_storetype: type.toString(), // '0'販售, '1'收購, '2'全部
//     txb_KeyWord: keyword, // '乙太星塵'
//     row_start: rowStart.toString(), // '1'
//     recaptcha: "",
//     sort_by: "itemPrice",
//     sort_desc: "", // '', 'desc'
//   };

//   // Send request
//   const response = await axios
//     .post(ro_url, requestBody, { headers })
//     .catch((error) => {
//       console.error("Error to get item list from RO server!", error);
//     });

//   return response;
// };

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

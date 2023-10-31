// import axios from "axios";

// // Get customers of api
// export const getCustomers = async () => {
//   try {
//     const response = await axios.get("http://localhost:3030/customer");
//     const customers = response.data;
//     return customers;
//   } catch (error) {
//     console.error("Error to getting items");
//   }
// };

// // Update new price to customer
// // export const updateCustomers = async (customerList) => {
// export const updateCustomers = async (customer) => {
//   // for (const customer of customerList) {
//   // data
//   const requestBody = customer;

//   // PUT method
//   try {
//     await axios.put(
//       `http://localhost:3030/customer/${customer.id}`,
//       requestBody
//     );
//     // console.log(`${customer.name} is updated`);
//   } catch (error) {
//     console.error("Error to update custoemrs", error);
//   }
//   // }
// };

// // Sleep function
// export const sleep = (ms) => {
//   // console.log(`Waitting 1(sec)...`);
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

// //   Get item of a customer
// export const getItemList = async (customer, sort_desc) => {
//   // Get key word for api
//   const { name: itemName, svr, type } = customer;

//   // Api infromation
//   // const ro_url = `http://localhost:3000/ro-request?name="${name}"&svr=${svr}&type=${type}&sort_desc="${sort_desc}"`;
//   const ro_url = "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
//   const headers = {
//     "Content-Type": "application/json; charset=UTF-8",
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",

//     Accept: "application/json, text/javascript, */*; q=0.01",
//     "Accept-Language":
//       "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-CN;q=0.5",
//     Dnt: "1",
//     // Host: "httpbin.org",
//     Referer:
//       "https://event.gnjoy.com.tw/Ro/RoShopSearch?fbclid=IwAR1xC46Qfmpbv0RzjG2t7LpJp19ZUKNnpBDL0QLKNfAbzScZYgU_Sl9C04Q",
//     "Sec-Ch-Ua":
//       '"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
//     "Sec-Ch-Ua-Mobile": "?0",
//     "Sec-Ch-Ua-Platform": '"Windows"',
//     "Sec-Fetch-Dest": "empty",
//     "Sec-Fetch-Mode": "cors",
//     "Sec-Fetch-Site": "same-origin",
//     // "Sec-Fetch-User": "?1",
//     // "Upgrade-Insecure-Requests": "1",
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.60",
//     // "X-Amzn-Trace-Id": "Root=1-65267ecd-1956ffae7713148b3b9305fa",
//     "x-request-with": "XMLHttpRequest",
//   };
//   const requestBody = {
//     div_svr: svr.toString(), // '2290'
//     div_storetype: type.toString(), // '0'販售, '1'收購, '2'全部
//     txb_KeyWord: `${itemName}`, // '乙太星塵'
//     row_start: "1",
//     recaptcha: "",
//     sort_by: "itemPrice",
//     sort_desc: sort_desc, // '', 'desc'
//   };

//   // Send request to getting items from ro-api
//   try {
//     // Get response
//     const response = await axios.post(ro_url, requestBody, { headers });
//     const responseData = response.data;

//     // Check if dt is an array before processing
//     if (Array.isArray(responseData.dt)) {
//       // Format response
//       const itemList = responseData.dt.map((item) => {
//         const {
//           storeName: store,
//           itemID: id,
//           itemName: itemName,
//           itemPrice: item_price,
//           storetype: type,
//         } = item;
//         return { id, itemName, store, item_price, svr, type };
//       });

//       // Return data
//       // console.log(`Checking price for "${name}"`);
//       return itemList;
//     }
//   } catch (error) {
//     console.error(`Error checking the price of "${itemName}"!`, error);
//   }
// };

// // export const sendMsgByChatBot = async (itemList) => {
// export const sendMsgByChatBot = async (item, firstItemName) => {
//   // Get token and id
//   const { chat_id: chatId, token } = await fetchBotId();

//   // Api Information
//   const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;

//   // Loop item list to send msg
//   // console.log("Sending message...");
//   // for (const item of itemList) {
//   const { name, set_price: setPrice, new_price: newPrice, type, svr } = item;

//   const chnType = type === 0 ? "販賣" : type === 1 ? "收購" : "未知";

//   // Msg by sended
//   const messageText = `
// 名稱: ${firstItemName}
// 伺服器: ${svr}
// 設定價格: ${setPrice.toLocaleString("en-US")} 
// ${chnType}價格: ${newPrice.toLocaleString("en-US")}
// 關鍵字: ${name}
// 時間: ${getDateTime()}
// `;

//   // Log msg
//   console.log(messageText);
//   // console.log();

//   // Send request by telegram api
//   try {
//     const response = await axios.post(tgUrl, {
//       chat_id: chatId,
//       text: messageText,
//     });
//   } catch (error) {
//     const errorMsg = `Error sending msg by TG bot.
// Token:${token}
// chatId:${chatId}
//       `;
//     console.error(errorMsg);
//   }
//   // }
//   console.log();
// };

// export const fetchBotId = async () => {
//   try {
//     const response = await axios.get("http://localhost:3030/chat-id");
//     // setBotId({ chat_id, token });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching bot data:", error);
//   }
// };

// // Get time
// export const getDateTime = () => {
//   // Create a new Date object to represent the current date and time
//   const currentTime = new Date();

//   // Get the current date components (month and day)
//   const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Add 1 to the month because it's zero-based
//   const day = String(currentTime.getDate()).padStart(2, "0");

//   // Get the current time components (hours and minutes)
//   const hours = String(currentTime.getHours()).padStart(2, "0");
//   const minutes = String(currentTime.getMinutes()).padStart(2, "0");

//   // Format the date and time as a string (e.g., "MM/DD HH:mm")
//   const formattedTime = `${month}/${day}(${hours}:${minutes})`;

//   return formattedTime;
// };

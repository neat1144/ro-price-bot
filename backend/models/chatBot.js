import axios from "axios";

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
  const {
    include,
    exclude,
    set_price,
    new_price,
    nofi_time,
    item_name,
    item_CNT,
  } = child;

  const chnType = type === 0 ? "販賣" : type === 1 ? "收購" : "未知";

  // Msg by sended
  const messageText = `
  物品名稱: ${item_name}
  伺服器　: ${svr}
  設定價格: ${set_price.toLocaleString("en-US")} 
  ${chnType}價格: ${new_price.toLocaleString("en-US")}
  數量　　: ${item_CNT}
  關鍵字　: ${keyword}, 包含(${include}), 排除(${exclude})
  時間　　: ${nofi_time}
  `;

  return messageText;
};

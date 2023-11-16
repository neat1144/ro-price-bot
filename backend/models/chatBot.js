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
    set_refine,
    set_level,
  } = child;

  const chnType = type === 0 ? "販賣" : type === 1 ? "收購" : "未知";

  // set set_level to eng
  // 0:"", 1:"D", 2:"C", 3:"B", 4:"A"
  const levelList = ["", "D階", "C階", "B階", "A階"];
  const engLevel = levelList[set_level];

  // if set_refine is 0, then set to ""
  const newRefine = set_refine === 0 ? "" : `+${set_refine}`;

  const messageText = `
    物品名稱: ${newRefine} ${item_name} ${engLevel}
    伺服器　: ${svr}
    設定價格: ${set_price.toLocaleString("en-US")} 
    ${chnType}價格: ${new_price.toLocaleString("en-US")}
    數量　　: ${item_CNT}
    關鍵字　: ${keyword}, 包含(${include}), 排除(${exclude}), (+${set_refine}), (${engLevel})
    時間　　: ${nofi_time}
    `;

  return messageText;
};

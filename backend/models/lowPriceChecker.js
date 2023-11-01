import { sendMsgByBot, formatMsg } from "./chatBot.js";
import {
  getBotIdToken,
  getParentList,
  getChildList,
  updateChild,
  getBotState,
  getDateTime,
  getTime,
  getReqTimeout,
} from "../utils/toGetUpdate.js";
import { getAllItemList } from "./getItemList.js";

// router.get("/", async (req, res) => {
export const lowPriceChecker = async () => {
  // Check bot state
  const botState = await getBotState();
  if (botState === 0 || botState === 3) {
    // Log
    console.log("Bot is stopping...");

    // stop this function
    return;
  }

  // Log
  console.log("");
  console.log(`Price is checking...               (${getTime()})`);
  console.log("");

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
  // Get request timeout
  const reqTimeoutSeconds = await getReqTimeout();

  // Loop parent to check price of child
  for (const parent of parentList) {
    // Check bot state
    const botState = await getBotState();
    if (botState === 0 || botState === 3) {
      // Log
      console.log("Bot is stopping...");

      // stop this loop immediately
      break;
    }

    // Get child list by one parent
    const childList = await getChildList(parent.id);

    // if childList is EMPTY, then return
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

    // Get all item list by one parent
    const allItemList = await getAllItemList(parent, reqTimeoutSeconds);

    // if itemList is empty, response error with 404
    if (!allItemList.length) {
      console.error("No item list found!");
    }

    // Loop child to check price
    for (const child of childList) {
      // Check bot state
      const botState = await getBotState();
      if (botState === 0 || botState === 3) {
        // Log
        console.log("Bot is stopping...");

        // stop this loop immediately
        break;
      }

      // Filter itemList by a child (include, exclude, itemRefine, and itemLevel)
      const itemListFiltered = itemNameFilter(child, allItemList);

      // Filter item list by a child (price)
      const childFilteredByPrice = childPriceFilter(child, itemListFiltered);

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
    console.log("");
  }
  console.log("==============Waiting for next check...==============");
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

export const childPriceFilter = (child, itemList) => {
  // Get set price of child
  const { set_price: setPrice, new_price: newPrice } = child;

  // Loop item list to check price of child
  for (const item of itemList) {
    // Get item price and name
    const { itemPrice, itemName, itemCNT } = item;

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

        // Update item_CNT of child
        child.item_CNT = itemCNT;

        // Stop loop and return child
        // Because item list is already sorted by price
        // So the first item that meet the condition is the lowest price
        return child;
      }
    }
  }
};

// export
export default lowPriceChecker;

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
import { getItemListByRoServer } from "./getItemList.js";
import { delay } from "../utils/delay.js";

// Check botstate
const isBotStopped = async () => {
  const botState = await getBotState();
  return botState === 0 || botState === 3;
};

// router.get("/", async (req, res) => {
export const lowPriceChecker = async () => {
  // Step1: Check bot state
  if (await isBotStopped()) {
    console.log("Bot is stopping... (lowPriceChecker)");
    return;
  }

  // Step2: Get some data and Log
  const botIdToken = await getBotIdToken();
  const reqTimeoutSeconds = await getReqTimeout();

  // Log
  console.log("\n========================START========================");
  console.log("");
  console.log(`Price is checking...               (${getTime()})`);
  console.log("");

  // Step3: Get parent list and Loop parent list
  // Get all parent
  const parentList = await getParentList();

  // if parentList is empty, response error with 404
  if (!parentList.length) {
    console.error("No parent list found!");
    return;
  }

  // Loop every parent to Check price of its child
  let parentIndex = 0;
  for (const parent of parentList) {
    // Add index
    parentIndex++;

    // Check bot state
    if (await isBotStopped()) {
      console.log("Bot is stopping...(lowPriceChecker-loop-parentList))");
      return;
    }

    // Step4: Get child list by one parent
    // Get child list by one parent
    const childList = await getChildList(parent.id);

    // if childList is EMPTY, then return
    if (!childList.length) {
      console.error("No child list found!");
      return;
    }

    // Log
    console.log(
      `Checking ${parentIndex}-${parent.keyword}-${parent.svr}-${
        parent.type
      }...              (${getTime()})`
    );

    // Step5: Loop every page of itemList to update child
    // Loop itemList of every page to update child
    await loopAllPageToUpdateChildsByParent(
      botIdToken,
      parent,
      childList,
      reqTimeoutSeconds
    );

    console.log("");
  }
  console.log("==============Waiting for next check...==============");
};

// Loop itemList for every page from RO server
const loopAllPageToUpdateChildsByParent = async (
  botIdToken,
  parent,
  childList,
  reqTimeoutSeconds
) => {
  // Step1: Get how many pages need to check from parent
  // Get page from parent
  const { page } = parent;

  // Get request timeout
  const timeoutMilliseconds = reqTimeoutSeconds * 1000;

  // Sentinal for loop (check item of every page is more than 30)
  let isMoreThan30 = true;

  // Step2: Loop every page
  // Loop page
  for (let i = 1; i <= page; i++) {
    // Step3: Check last page is more than 30
    // Check sentinal
    if (!isMoreThan30) {
      break;
    }

    // Check bot state
    if (await isBotStopped()) {
      console.log("Bot is stopping...(lowPriceChecker-loop-page)");
      break;
    }

    // Step4: Get itemList of page i
    // Get itemList of page i
    const rowStart = (i - 1) * 30 + 1; // rowStart = 1, 31, 61, 91, ...
    const tempItemList = await getItemListByRoServer(parent, rowStart);

    // Step5: Delay by request timeout
    // Delay
    await delay(timeoutMilliseconds);

    // Step6: If Ro Server is not response, then drop this loop
    // If tempItemList is error, then drop this loop
    if (tempItemList === "no-internet-error") {
      console.error("No internet connection! (lowPriceChecker-loop-page)");
      break;
    }

    // Log page and itemList length
    console.log(
      `Checking page-${i} (length:${
        tempItemList.length
      })                (${getTime()})`
    );

    // Step7: Update child by itemList
    // Update child by itemList
    await updateChildsByParent(botIdToken, parent, childList, tempItemList);

    // Step8: Update sentinal for itemList is  more than 30
    // Check if tempItemList is less than 30
    if (tempItemList.length < 30) {
      isMoreThan30 = false;
    }
  }
};

// Update childList by a parent with itemList
const updateChildsByParent = async (
  botIdToken,
  parent,
  childList,
  itemList
) => {
  // Step1: Loop childList by a parent
  for (const child of childList) {
    // Check bot state
    if (await isBotStopped()) {
      console.log("Bot is stopping...(lowPriceChecker-loop-childList)");
      break;
    }

    // Step2: Filter itemList by a child (include, exclude, itemRefine, and itemLevel)
    const itemListFiltered = itemNameFilter(child, itemList);

    // Step3: Filter item list by a child (price)
    const childFilteredByPrice = childPriceFilter(child, itemListFiltered);

    // Step4: Update child and Send msg(chat bot)
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
    const includesTerm = includeList.every(
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

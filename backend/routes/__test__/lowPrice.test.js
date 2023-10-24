import lowPriceRouter, {
  sendMsgByBot,
  formatMsg,
  getItemList,
  checkChildPriceByItemList,
  timeoutSleep,
} from "../lowPrice";
import request from "supertest";
import express from "express";
import chatIdRouter from "../chatId";

const app = express();
app.use(express.json());
app.use("/chat-id", chatIdRouter);

describe("/lowPriceRouter API", () => {
  // Helper function
  describe("chat bot function", () => {
    // Test send msg by chat bot
    it("should send msg by chat bot", async () => {
      // Token and id
      const botIdToken = {
        chat_id: "1027259614",
        token: "6036458497:AAFOS4yKzMkZEekK1WCEpjbPyzuG3jzrYu0",
      };
      //  Message
      const child = {
        include: "test_include",
        exclude: "test_exclude",
        set_price: "2000",
        new_price: "1000",
        svr: "8890",
        nofi_time: "2021-05-01 00:00",
      };
      const item = {
        name: "test_name",
        type: 2,
      };

      const messageText = formatMsg("TEST", child, item);

      //  Send msg by chat bot
      const response = await sendMsgByBot(botIdToken, messageText);

      expect(response.status).toBe(200);
    });
  });
});

// Filter child
describe("filter child by price, include and exclude", () => {
  let itemList;

  // Get item list by parent from RO server
  it("should get item list from RO server", async () => {
    const parent = {
      keyword: "乙太星塵",
      svr: 2290,
      type: 0,
    };

    itemList = await getItemList(parent);

    // Check itemList have data
    expect(itemList.length).toBeGreaterThan(0);
    // Check first item of itemList itemName is "乙太星塵"
    expect(itemList[0].itemName).toBe("乙太星塵");
    expect(itemList[0].type).toBe(0);
  });

  // Test check child price is lower than set price
  it("check set price < item price", async () => {
    expect(itemList.length).toBeGreaterThan(0);

    // Set child
    const child = {
      include: "",
      exclude: "",
      set_price: 6000000,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price
    const childFiltered = await checkChildPriceByItemList(child, itemList);

    // Check item price < set price
    expect(childFiltered.new_price).toBeLessThan(child.set_price);
  });

  // TODO: make itemNameChcker to be a independent function
  /*
  // Check child exclude is not in item name
  it("check child exclude is not in item name", async () => {
    expect(itemList.length).toBeGreaterThan(0);

    // Set child
    const child = {
      include: "",
      exclude: "乙太星塵",
      set_price: 6000000,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price with exclude
    const childFiltered = await checkChildPriceByItemList(child, itemList);

    expect(childFiltered).toBeNull();
  });

  // Check child "include" is in item name
  it("check child include is in item name", async () => {
    expect(itemList.length).toBeGreaterThan(0);

    // Set child
    const child = {
      include: "庇佑",
      exclude: "",
      set_price: 66000000,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price with include
    const childFiltered = await checkChildPriceByItemList(child, itemList);
    // console.log(childFiltered);

    // Check new price < set price
    expect(childFiltered.new_price).toBeLessThan(child.set_price);

    // Check include is in item name
    expect(child.item_name).toContain(child.include);
  });
  */
});

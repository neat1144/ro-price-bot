import lowPriceRouter, {
  sendMsgByBot,
  formatMsg,
  getItemList,
  checkChildPriceByItemList,
  lowerPriceFilter,
  itemNameFilter,
} from "../lowPriceChecker";

const create12Items = () => {
  // Create a list of 12 items
  const itemJson5Data = {
    itemRefining: 0,
    itemName: "乙太星塵",
    itemGradeLevel: 0,
    itemPrice: 1000,
    type: 0,
  };
  const itemJsonData = {
    itemRefining: 0,
    itemName: "庇佑乙太星塵",
    itemGradeLevel: 0,
    itemPrice: 2000,
    type: 0,
  };
  const itemJsonData2 = {
    itemRefining: 0,
    itemName: "庇佑乙太星塵2",
    itemGradeLevel: 0,
    itemPrice: 2000,
    type: 0,
  };
  const itemList = [];
  for (let i = 1; i <= 5; i++) {
    // itemPrice of itemJsonData multiply by i every time
    const itemJsonDataCopy = {
      ...itemJson5Data,
      itemPrice: i * 1000,
      itemName: `乙太星塵${i}`,
    };

    // Add item to itemList
    itemList.push(itemJsonDataCopy);
    itemList.push(itemJsonDataCopy);
  }
  itemList.push(itemJsonData);
  itemList.push(itemJsonData2);

  return itemList;
};

/*
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
*/

/*
// Test get item list from RO server
describe("get item list from RO server", () => {
  it("should get item list from RO server", async () => {
    const parent = {
      keyword: "乙太星塵",
      svr: 2290,
      type: 0,
    };

    const itemListByRoServer = await getItemList(parent);

    // Check itemList have data
    expect(itemListByRoServer.length).toBeGreaterThan(0);
    // Check first item of itemList itemName is "乙太星塵"
    expect(itemListByRoServer[0].itemName).toBe("乙太星塵");
    expect(itemListByRoServer[0].type).toBe(0);
  });
});
*/

// Filter child
describe("filter child by price, include and exclude", () => {
  // Create a list of 12 items
  const itemList = create12Items();

  it("check item list have data", () => {
    expect(itemList.length).toBeGreaterThan(0);
    expect(itemList[0].itemName).toBe("乙太星塵1");
    expect(itemList[10 - 1].itemPrice).toBe(5000);
  });

  // Test check child price is lower than set price
  it("check set price < item price", async () => {
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
    const childFiltered = lowerPriceFilter(child, itemList);

    // Check item price < set price
    expect(childFiltered.new_price).toBeLessThan(child.set_price);
    expect(childFiltered.item_name).toBe("乙太星塵1");
  });

  // Only include
  it("check ONE child.include is in item name", async () => {
    // Set child
    const childByInclude = {
      include: "庇佑",
      exclude: "",
      set_price: 0,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price with exclude
    const itemListFiltered = itemNameFilter(childByInclude, itemList);

    expect(itemListFiltered.length).toBe(2);
    expect(itemListFiltered[0].itemName).toBe("庇佑乙太星塵");
  });

  // Only exclude
  it("check ONE child.exclude is not in item name", async () => {
    expect(itemList.length).toBeGreaterThan(0);

    // Set child
    const childByExclude = {
      include: "",
      exclude: "庇佑",
      set_price: 0,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price with include
    const itemListFiltered = itemNameFilter(childByExclude, itemList);

    expect(itemListFiltered.length).toBe(10);
    expect(itemListFiltered[0].itemName).toBe("乙太星塵1");
  });

  // Include and exclude
  it("check ONE child.include is in and ONE child.exclude is NOT in item name", async () => {
    // Set child
    const childByBoth = {
      include: "4",
      exclude: "庇佑",
      set_price: 0,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price with include
    const itemListFiltered = itemNameFilter(childByBoth, itemList);

    expect(itemListFiltered.length).toBe(2);
    expect(itemListFiltered[0].itemName).toBe("乙太星塵4");
  });

  // Check multiple include (split by "+")
  it("check MULTI child.incldue is in item name", async () => {
    const multiChildByInclude = {
      include: "1+2+3",
      exclude: "",
      set_price: 0,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price with include
    const itemListFiltered = itemNameFilter(multiChildByInclude, itemList);

    expect(itemListFiltered.length).toBe(7);
    // First item
    expect(itemListFiltered[0].itemName).toBe("乙太星塵1");
    // Last item
    expect(itemListFiltered[6].itemName).toBe("庇佑乙太星塵2");
  });

  // Check multiple exclude (split by "+")
  it("check MULTI child.exclude is NOT in item name", async () => {
    const multiChildByExclude = {
      include: "",
      exclude: "1+2+3",
      set_price: 0,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price with exclude
    const itemListFiltered = itemNameFilter(multiChildByExclude, itemList);

    expect(itemListFiltered.length).toBe(5);
    // First item
    expect(itemListFiltered[0].itemName).toBe("乙太星塵4");
    // Last item
    expect(itemListFiltered[4].itemName).toBe("庇佑乙太星塵");
  });

  // Check multiple include and exclude (split by "+")
  it("check MULTI child.include is in and MULTI child.exclude is NOT in item name", async () => {
    const multiChildByBoth = {
      include: "庇佑",
      exclude: "2",
      set_price: 0,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    // Check child price is lower than set price with include
    const itemListFiltered = itemNameFilter(multiChildByBoth, itemList);

    expect(itemListFiltered.length).toBe(1);
    expect(itemListFiltered[0].itemName).toBe("庇佑乙太星塵");
  });

  // TODO: Check item refine

  // TODO: Check item level

  // TODO: Check child price with filter item list
});

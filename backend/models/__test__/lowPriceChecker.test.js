import { childPriceFilter, itemNameFilter } from "../lowPriceChecker";

// Create a list of 14 items
const create14Items = () => {
  const itemJson10Data = {
    itemRefining: 0,
    itemName: "乙太星塵",
    itemGradeLevel: 0,
    itemPrice: 1000,
    type: 0,
  };

  const itemJsonData = {
    ...itemJson10Data,
    itemName: "庇佑乙太星塵",
    itemPrice: 2000,
  };

  const itemJsonData2 = {
    ...itemJsonData,
    itemName: "庇佑乙太星塵2",
  };

  const itemJsonDataRefining12 = {
    ...itemJsonData,
    itemName: "庇佑乙太星塵2 (+12)",
    itemRefining: 12,
  };

  const itemJsonDataLevelA = {
    ...itemJsonData,
    itemName: "庇佑乙太星塵99 A",
    itemGradeLevel: 4,
  };

  const itemList = [];
  for (let i = 1; i <= 5; i++) {
    // itemPrice of itemJsonData multiply by i every time
    const itemJsonDataCopy = {
      ...itemJson10Data,
      itemPrice: i * 1000,
      itemName: `乙太星塵${i}`,
    };

    // Add item to itemList
    itemList.push(itemJsonDataCopy);
    itemList.push(itemJsonDataCopy);
  }
  itemList.push(itemJsonData);
  itemList.push(itemJsonData2);
  itemList.push(itemJsonDataRefining12);
  itemList.push(itemJsonDataLevelA);

  return itemList;
};

describe("Low Price Checker", () => {
  // Helper function

  // Filter child
  describe("filter child by price, include and exclude", () => {
    // Create a list of 12 items
    const itemList = create14Items();

    // init child
    const childInit = {
      include: "",
      exclude: "",
      set_refine: 0,
      set_level: 0,
      set_price: 0,
      new_price: 0,
      nofi_time: "",
      item_name: "",
    };

    it("check item list have data", () => {
      expect(itemList.length).toBeGreaterThan(0);
      expect(itemList[0].itemName).toBe("乙太星塵1");
      expect(itemList[10 - 1].itemPrice).toBe(5000);
    });

    // Test check child price is lower than set price
    it("check set price < item price", async () => {
      // Set child
      const childByPrice = {
        ...childInit,
        set_price: 6000000,
      };

      // Check child price is lower than set price
      const childFiltered = childPriceFilter(childByPrice, itemList);

      // Check item price < set price
      expect(childFiltered.new_price).toBeLessThan(childByPrice.set_price);
      expect(childFiltered.item_name).toBe("乙太星塵1");
    });

    // Only include
    it("check ONE child.include is in item name", async () => {
      // Set child
      const childByInclude = {
        ...childInit,
        include: "庇佑",
      };

      // Filter item list by child
      const itemListFiltered = itemNameFilter(childByInclude, itemList);
      expect(itemListFiltered.length).toBe(4);
      expect(itemListFiltered[0].itemName).toBe("庇佑乙太星塵");
    });

    // Only exclude
    it("check ONE child.exclude is not in item name", async () => {
      expect(itemList.length).toBeGreaterThan(0);

      // Set child
      const childByExclude = {
        ...childInit,
        exclude: "庇佑",
      };

      // Filter item list by child
      const itemListFiltered = itemNameFilter(childByExclude, itemList);

      expect(itemListFiltered.length).toBe(10);
      expect(itemListFiltered[0].itemName).toBe("乙太星塵1");
    });

    // Include and exclude
    it("check ONE child.include is in and ONE child.exclude is NOT in item name", async () => {
      // Set child
      const childByBoth = {
        ...childInit,
        include: "4",
        exclude: "庇佑",
      };

      // Filter item list by child
      const itemListFiltered = itemNameFilter(childByBoth, itemList);

      expect(itemListFiltered.length).toBe(2);
      expect(itemListFiltered[0].itemName).toBe("乙太星塵4");
    });

    // Check multiple include (split by "+")
    it("check MULTI child.incldue is in item name", async () => {
      const multiChildByInclude = {
        ...childInit,
        include: "1+2+3",
      };

      // Filter item list by child
      const itemListFiltered = itemNameFilter(multiChildByInclude, itemList);

      expect(itemListFiltered.length).toBe(8);
      // First item
      expect(itemListFiltered[0].itemName).toBe("乙太星塵1");
      // Last item
      expect(itemListFiltered[6].itemName).toBe("庇佑乙太星塵2");
    });

    // Check multiple exclude (split by "+")
    it("check MULTI child.exclude is NOT in item name", async () => {
      const multiChildByExclude = {
        ...childInit,
        exclude: "1+2+3",
      };

      // Filter item list by child
      const itemListFiltered = itemNameFilter(multiChildByExclude, itemList);

      expect(itemListFiltered.length).toBe(6);
      // First item
      expect(itemListFiltered[0].itemName).toBe("乙太星塵4");
      // Last item
      expect(itemListFiltered[4].itemName).toBe("庇佑乙太星塵");
    });

    // Check multiple include and exclude (split by "+")
    it("check MULTI child.include is in and MULTI child.exclude is NOT in item name", async () => {
      const multiChildByBoth = {
        ...childInit,
        include: "庇佑",
        exclude: "2",
      };

      // Filter item list by child

      const itemListFiltered = itemNameFilter(multiChildByBoth, itemList);
      expect(itemListFiltered.length).toBe(2);
      expect(itemListFiltered[0].itemName).toBe("庇佑乙太星塵");
    });

    // Check item refine
    it("check Refine of item is equal to child.set_refine", async () => {
      const childByRefine = {
        ...childInit,
        set_refine: 12,
      };

      // Filter item list by child
      const itemListFiltered = itemNameFilter(childByRefine, itemList);
      expect(itemListFiltered.length).toBe(1);
      expect(itemListFiltered[0].itemRefining).toBe(12);
    });

    // Check item level
    it("check Level of item is equal than child.set_level", async () => {
      const childByLevel = {
        ...childInit,
        set_level: 4, // A
      };

      // Filter item list by child

      const itemListFiltered = itemNameFilter(childByLevel, itemList);

      expect(itemListFiltered.length).toBe(1);
      expect(itemListFiltered[0].itemGradeLevel).toBe(4);
    });

    // TODO: Check child price with filter item list
    it("check child price with filter item list", async () => {
      const childByPriceFilter = {
        ...childInit,
        include: "庇+佑",
        exclude: "2",
        set_level: 4, // A
        set_price: 200000,
      };

      // Check child price is lower than set price with include
      const itemListFiltered = itemNameFilter(childByPriceFilter, itemList);

      expect(itemListFiltered.length).toBe(1);
      expect(itemListFiltered[0].itemPrice).toBeLessThan(
        childByPriceFilter.set_price
      );
      expect(itemListFiltered[0].itemGradeLevel).toBe(4);
      expect(itemListFiltered[0].itemName).toBe("庇佑乙太星塵99 A");
    });
  });
});

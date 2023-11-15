import { getItemListByRoServer, getAllItemList } from "../../models/getItemList";

describe("function getAllItemList()", () => {
  let responseByRoServer = {};

  // Test get item list from RO server
    it("should response status from RO server (requestRoServer())", async () => {
      const parent = {
        keyword: "[獸妖莉偷通翡蒼龍星]%環",
        svr: 4290,
        type: 0,
      };
      const rowStart = 1;

      const itemList = await getItemListByRoServer(parent, rowStart);

      // Check itemList is not empty
      expect(itemList.length).toBeGreaterThan(0);
    });

  // Check format of item list
  // it("should get item list with correct format (getItemList())", async () => {
  //   const parent = {
  //     keyword: "乙太星塵",
  //     svr: 2290,
  //     type: 0,
  //   };

  //   const rowStart = 1;

  //   // Get an item list
  //   const itemList = await getItemListByRoServer(parent, rowStart);

  //   // Check
  //   expect(itemList.length).toBeGreaterThan(0);
  //   expect(itemList[0]).toHaveProperty("itemRefining");
  //   expect(itemList[0]).toHaveProperty("itemName");
  //   expect(itemList[0]).toHaveProperty("itemGradeLevel");
  //   expect(itemList[0]).toHaveProperty("itemPrice");
  //   expect(itemList[0]).toHaveProperty("itemCNT");
  //   expect(itemList[0]).toHaveProperty("type");
  // });

  // it("should get all item list with page of parent (getAllItemList())", async () => {
  //   const parent = {
  //     keyword: "乙太星塵",
  //     svr: 2290,
  //     type: 0,
  //     page: 2,
  //   };

  //   const reqTimeout = 2;

  //   // Get all item list
  //   await new Promise((resolve) => setTimeout(resolve, 2000)); // add delay timeout of 5 seconds
  //   const allItemList = await getAllItemList(parent, reqTimeout);
  // });
});

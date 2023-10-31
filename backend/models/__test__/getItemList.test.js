import { requestRoServer } from "../../models/getItemList";
import { getItemList, getAllItemList } from "../../models/getItemList";

describe("function getAllItemList()", () => {
  let responseByRoServer = {};

  // Test get item list from RO server
  //   it("should response status from RO server (requestRoServer())", async () => {
  //     const parent = {
  //       keyword: "乙太星塵",
  //       svr: 2290,
  //       type: 0,
  //     };
  //     const rowStart = 1;

  //     responseByRoServer = await requestRoServer(parent, rowStart);

  //     console.log(responseByRoServer.data["Message"]);

  //     // Check itemList have data
  //     // expect(itemListByRoServer.length).toBeGreaterThan(0);
  //     expect(responseByRoServer.status).toBe(200);
  //     expect(responseByRoServer.data).toHaveProperty("Message");

  //     // Check first item of itemList itemName is "乙太星塵"
  //     // expect(itemListByRoServer[0].itemName).toBe("乙太星塵");
  //     // expect(itemListByRoServer[0].type).toBe(0);
  //   });

  // Check format of item list
  it("should get item list with correct format (getItemList())", async () => {
    const parent = {
      keyword: "乙太星塵",
      svr: 2290,
      type: 0,
    };

    const rowStart = 1;

    // Get an item list
    const itemList = await getItemList(parent, rowStart);

    // Check
    expect(itemList.length).toBeGreaterThan(0);
    expect(itemList[0]).toHaveProperty("itemRefining");
    expect(itemList[0]).toHaveProperty("itemName");
    expect(itemList[0]).toHaveProperty("itemGradeLevel");
    expect(itemList[0]).toHaveProperty("itemPrice");
    expect(itemList[0]).toHaveProperty("itemCNT");
    expect(itemList[0]).toHaveProperty("type");
  });

  it("should get all item list with page of parent (getAllItemList())", async () => {
    const parent = {
      keyword: "乙太星塵",
      svr: 2290,
      type: 0,
      page: 2,
    };

    const reqTimeout = 2;

    // Get all item list
    await new Promise((resolve) => setTimeout(resolve, 2000)); // add delay timeout of 5 seconds
    const allItemList = await getAllItemList(parent, reqTimeout);
  });
});

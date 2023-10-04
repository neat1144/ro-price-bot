import express from "express";
import axios from "axios";

const router = express.Router();

/* 
http://localhost:3000/ro-request?
name="乙太星塵"&
svr=2290&
type=0&
sort_desc="desc"
*/

router.get("/", async (req, res) => {
  try {
    const apiUrl =
      "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    };

    // Get item from url
    const name = req.query.name;
    const svr = req.query.svr;
    const type = req.query.type;
    const sort_desc = req.query.sort_desc;

    // console.log(sort_desc);

    // "物品名稱", "伺服器", "收購/販售", "價格""
    const requestBody = {
      div_svr: svr, // '2290'
      div_storetype: type, // '0'販售, '1'收購, '2'全部
      txb_KeyWord: name, // '乙太星塵'
      sort_desc: sort_desc, // '', 'desc'
      row_start: "1",
      recaptcha: "",
      sort_by: "itemPrice",
    };

    // Send a request and Get response
    const response = await axios.post(apiUrl, requestBody, { headers });
    const responseData = response.data;
    // console.log(responseData);

    // Convert response to new List
    const itemList = [];
    for (const item of responseData.dt) {
      const { itemID: id, itemName: name, itemPrice: price } = item;
      itemList.push({ id, name, price, svr });
    }
    console.log(itemList);

    // Send the API response back to the client
    console.log("Get data sucessfull!");
    res.json(itemList);
  } catch (error) {
    console.error("Error making API call:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

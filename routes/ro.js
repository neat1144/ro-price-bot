const express = require("express");
const axios = require("axios");
const router = express.Router();

/* 
http://localhost:3000/ro-request?
txb_KeyWord=自定义关键词&
div_svr=自定义服务器 
*/
router.get("/ro-request", async (req, res) => {
  try {
    const apiUrl =
      "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    };

    // Get item from url
    const keyWord = req.query.keyWord;
    const svr = req.query.svr;
    const storetype = req.query.storetype;
    const sort_desc = req.query.sort_desc;

    // console.log(sort_desc);

    // "物品名稱", "伺服器", "收購/販售", "價格""
    const requestBody = {
      div_svr: svr, // '2290'
      div_storetype: storetype, // '0'販售, '1'收購, '2'全部
      txb_KeyWord: keyWord, // '乙太星塵'
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
      const { itemID, itemName, itemPrice } = item;
      itemList.push({ itemID, itemName, itemPrice, svr });
    }
    console.log(itemList);

    // Send the API response back to the client
    console.log("Get data sucessfull!");
    res.json(itemList);
    // res.json({ items: itemList });
  } catch (error) {
    console.error("Error making API call:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

// call method
/* 
axios.get('http://localhost:3000/make-api-call')
  .then((response) => {
    console.log('API Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
}); 
*/

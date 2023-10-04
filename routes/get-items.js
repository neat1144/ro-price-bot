import express, { response } from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  // Get customers of api
  const getCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/customer");
      const customers = response.data;
      return customers;
    } catch (error) {
      console.error("Error to getting items");
    }
  };

  // Sleep function
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Set sort_desc
  const sort_desc = "";

  // Get all customers
  const customers = await getCustomers();

  // Loop customers to get items
  for (const customer of customers) {
    // Get key word for api
    const { name, svr, type } = customer;

    // Api infromation
    // const ro_url = `http://localhost:3000/ro-request?name="${name}"&svr=${svr}&type=${type}&sort_desc="${sort_desc}"`;
    const ro_url =
      "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    };
    const requestBody = {
      div_svr: svr.toString(), // '2290'
      div_storetype: type.toString(), // '0'販售, '1'收購, '2'全部
      txb_KeyWord: name, // '乙太星塵'
      row_start: "1",
      recaptcha: "",
      sort_by: "itemPrice",
      sort_desc: sort_desc, // '', 'desc'
    };

    // Send request to getting items from ro-api
    try {
      // Get response
      const response = await axios.post(ro_url, requestBody, { headers });
      const responseData = response.data;

      // Format response
      const itemListOfCustomer = [];
      for (const item of responseData.dt) {
        const {
          storeName: store,
          itemID: id,
          itemName: name,
          itemPrice: item_price,
          storetype: type,
        } = item;
        itemListOfCustomer.push({ id, name, store, item_price, svr, type });
      }
      console.log(itemListOfCustomer);

      // Return data
      console.log(`Sucessfull to checking price of "${name}"!`);
    } catch (error) {
      console.error(`Error to checking price of "${name}"!`);
    }

    // Set timeout
    const sec = 1000;
    await sleep(sec);
    console.log(`Waitting ${sec / 1000}(sec)...`);
  }
});

export default router;

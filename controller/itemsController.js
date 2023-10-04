import axios from "axios";

// Get customers of api
export const getCustomers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/customer");
    const customers = response.data;
    return customers;
  } catch (error) {
    console.error("Error to getting items");
  }
};

// Sleep function
export const sleep = (ms) => {
  console.log(`Waitting 1(sec)...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//   Get item of a customer
export const getItemList = async (customer, sort_desc) => {
  // Get key word for api
  const { name, svr, type } = customer;

  // Api infromation
  // const ro_url = `http://localhost:3000/ro-request?name="${name}"&svr=${svr}&type=${type}&sort_desc="${sort_desc}"`;
  const ro_url = "https://event.gnjoy.com.tw/Ro/RoShopSearch/forAjax_shopDeal";
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
    const itemList = [];
    for (const item of responseData.dt) {
      const {
        storeName: store,
        itemID: id,
        itemName: name,
        itemPrice: item_price,
        storetype: type,
      } = item;
      itemList.push({ id, name, store, item_price, svr, type });
    }
    // console.log(itemList);

    // Return data
    console.log(`Sucessfull to checking price of "${name}"!`);
    return itemList;
  } catch (error) {
    console.error(`Error to checking price of "${name}"!`);
  }
};

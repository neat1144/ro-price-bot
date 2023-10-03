const axios = require("axios");

// Set url
// const keyWord = "乙太星塵";
// const svr = 0;
// const sort_desc = "desc";

// Function to check the /ro-request route
async function checkRoRequest(keyWord, svr, sort_desc) {
  // URL
  url = `http://localhost:3000/ro-request?keyWord="${keyWord}"&svr=2290&storetype=${svr}&sort_desc="${sort_desc}"`;
  console.log(url);
  // GET response
  try {
    // Send request
    const response = await axios.get(url); // Replace with the actual URL of your /ro-request route

    if (response.status === 200) {
      items = response.data; // Assuming the response contains a "price" field
      // Filter
      // const filteredItems = items.filter((item) => item.itemPrice < 135000);
      // Print
      // filteredItems.forEach((item) => {
      //   console.log(
      //     `Item ID: ${item.itemID}, Item Name: ${item.itemName}, Item Price: ${item.itemPrice}, Server: ${item.svr}`
      //   );
      // });
      return items;
    }
  } catch (error) {
    console.error("Error checking /ro-request:", error);
  }
}

module.exports = { getRoRequest };

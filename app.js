const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000; // You can choose any port you like

app.use(express.json());

// RO api
// http://localhost:3000/ro-request?
// name="乙太星塵"&svr="2290"&type="0"&sort_desc="desc"
const apiRo = require("./routes/ro");
app.use("/ro-request", apiRo);

// Customer api
const apiCustomer = require("./routes/customer");
app.use("/customer", apiCustomer);

// Check price is low for every ? seconds
const { checkPrice } = require("./utils/checkPrice");
const checkInterval = 5000; // 30 seconds
// setInterval(checkPrice, checkInterval);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

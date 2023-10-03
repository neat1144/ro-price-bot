const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000; // You can choose any port you like

app.use(express.json());

// RO api
// http://localhost:3000/ro-request?
// keyWord="乙太星塵"&svr="2290"&storetype="0"&sort_desc="desc"
const apiRo = require("./routes/ro");
app.use("/", apiRo);

// Customer api
const apiCustomer = require("./routes/customer")
app.use("/customer", apiCustomer);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

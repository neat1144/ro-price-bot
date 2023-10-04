import express from "express";
import {
  getCustomers,
  sleep,
  getItemList,
} from "../controller/itemsController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // Set sort_desc
  const sort_desc = "";

  // Get all customers
  const customers = await getCustomers();

  // Loop customers to get items
  for (const customer of customers) {
    const itemList = await getItemList(customer, sort_desc);
    // console.log(itemList);

    // Set timeout
    await sleep(1000);
  }
});

export default router;

import axios from "axios";

// Set url
// const keyWord = "乙太星塵";
// const svr = 0;
// const sort_desc = "desc";

// Get the /ro-request route
async function getRoRequest(name, svr, type, sort_desc) {
  // URL
  const url = `http://localhost:3000/ro-request?name="${name}"&svr=2290&storetype=${svr}&storetype="${type}"&sort_desc="${sort_desc}`;
  console.log(url);

  // GET response
  try {
    // Send request
    const response = await axios.get(url); // Replace with the actual URL of your /ro-request route
    const customers = response.data; // Assuming the response contains a "price" field
    console.log(customers);

    // Return
    return customers;
  } catch (error) {
    console.error("Error checking /ro-request:", error);
  }
}

exports = { getRoRequest };

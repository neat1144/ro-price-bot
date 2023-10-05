import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerTable.css"; // Import a CSS file for styling

function CustomerTable() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  // Function to fetch customer data
  const fetchCustomerData = () => {
    axios
      .get("http://localhost:5000/customer")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  };

  // Function to edit a customer
  const handleEdit = (customerId) => {
    // Implement the edit functionality here
    console.log(`Edit customer with ID ${customerId}`);
  };

  // Function to delete a customer
  const handleDelete = (customerId) => {
    // Make a DELETE request to the API endpoint
    axios
      .delete(`http://localhost:5000/customer/${customerId}`)
      .then(() => {
        // Remove the deleted customer from the state
        setCustomers(
          customers.filter((customer) => customer.id !== customerId)
        );
        console.log(`Deleted customer with ID ${customerId}`);
      })
      .catch((error) => {
        console.error(`Error deleting customer with ID ${customerId}:`, error);
      });
  };

  // Function to new a customer
  const handleNew = () => {
    // Implement the new button functionality here
    console.log("New button clicked");
  };

  // Function to edit telegram token
  const handleTelegram = () => {
    // Implement the Telegram button functionality here
    console.log("Telegram button clicked");
  };

  return (
    <div>
      <h1>RO Spider</h1>
      <button className="telegram-button" onClick={handleTelegram}>
        Telegram
      </button>{" "}
      {/* Telegram button */}
      <button className="new-button" onClick={handleNew}>
        New
      </button>{" "}
      {/* New button */}
      <table className="customer-table">
        {" "}
        {/* Add a class for styling */}
        <thead>
          <tr>
            <th>標號</th>
            <th>名稱</th>
            <th>伺服器</th>
            <th>價格</th>
            <th>販賣/收購</th>
            <th>操作</th>
            {/* <th>Email</th> */}
            {/* Add more table headers for other fields if needed */}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.svr}</td>
              <td>{customer.set_price}</td>
              <td>{customer.type}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(customer.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </td>
              {/* Add more table cells for other fields if needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;

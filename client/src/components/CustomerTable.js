import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerTable.css"; // Import a CSS file for styling
import NewCustomerForm from "./NewCustomerForm"; // Import the new component

function CustomerTable() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  // Get/Fetch customer
  const fetchCustomerData = () => {
    axios
      .get("http://localhost:3030/customer")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  };

  // Create customer
  const handleCustomerCreated = () => {
    fetchCustomerData(); // Refresh the customer data when a new customer is created
  };

  // Edit cutomer
  const handleEdit = (customerId) => {
    // Implement the edit functionality here
    console.log(`Edit customer with ID ${customerId}`);
  };

  // Delete customer
  const handleDelete = (customerId) => {
    // Make a DELETE request to the API endpoint
    axios
      .delete(`http://localhost:3030/customer/${customerId}`)
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

  // Telegram function
  const handleTelegram = () => {
    // Implement the new button functionality here
    console.log("New button clicked");
  };

  return (
    <div>
      <h1>RO Spider</h1>

      {/* Include the NewCustomerForm component */}
      <NewCustomerForm onCustomerCreated={handleCustomerCreated} />

      {/* Telegram buttons */}
      <button className="telegram-button" onClick={() => handleTelegram()}>
        telegram
      </button>{" "}

      {/* Table */}
      <table className="customer-table">
        <thead>
          <tr>
            <th>標號</th>
            <th>名稱</th>
            <th>伺服器</th>
            <th>價格</th>
            <th>販賣/收購</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.svr}</td>
              <td>{customer.set_price}</td>
              <td>
                <span
                  style={{
                    color:
                      customer.type === 0
                        ? "blue"
                        : customer.type === 1
                        ? "red"
                        : "black",
                  }}
                >
                  {customer.type === 0
                    ? "販賣"
                    : customer.type === 1
                    ? "收購"
                    : ""}
                </span>
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;

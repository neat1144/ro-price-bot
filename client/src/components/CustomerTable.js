import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerTable.css"; // Import a CSS file for styling
import NewCustomerForm from "./NewCustomerForm"; // Import the new component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  // Get/Fetch customer
  const fetchCustomerData = async () => {
    try {
      const response = await axios.get("http://localhost:3030/customer");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // Create customer
  const handleCustomerCreated = () => {
    fetchCustomerData(); // Refresh the customer data when a new customer is created
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

  // Create a variable to track the serial number
  let serialNumber = 1;

  return (
    <div>
      {/* NewCustomerForm component */}
      <NewCustomerForm onCustomerCreated={handleCustomerCreated} />

      {/* Container for the table and button */}
      <div className="table-container">
        {/* Refresh button with icon */}
        <button className="refresh-button" onClick={fetchCustomerData}>
          <FontAwesomeIcon icon={faSync} />
        </button>

        {/* Table */}
        <table className="customer-table">
          <thead>
            <tr>
              <th>序號</th>
              <th>關鍵字</th>
              <th>伺服器</th>
              <th>設定價格</th>
              <th>最低價</th>
              <th>販賣/收購</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{serialNumber++}</td>
                <td>{customer.name}</td>
                <td>
                  {customer.svr === 2290
                    ? "巴基利"
                    : customer.svr === 3290
                    ? "查爾斯"
                    : customer.svr === 4290
                    ? "波利"
                    : customer.svr === 0
                    ? "羅札納(未開放)"
                    : ""}
                </td>
                <td>{customer.set_price.toLocaleString()}</td>
                <td>{customer.new_price.toLocaleString()}</td>
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
                  {/* <button
                  className="edit-button"
                  onClick={() => handleEdit(customer.id)}
                >
                  Edit
                </button> */}
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
    </div>
  );
}

export default CustomerTable;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerTable.css"; // Import a CSS file for styling
// import NewCustomerForm from "./NewCustomerForm"; // Import the new component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

function CustomerTable() {
  const [newCustomer, setNewCustomer] = useState({
    name: "乙太",
    svr: 2290,
    type: 0, // Initialize type as 0 (販賣) by default
    set_price: 200000,
  });
  const [customers, setCustomers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isFormHidden, setIsFormHidden] = useState(true);
  const [editedCustomer, setEditedCustomer] = useState(null);

  // Get/Fetch customer
  const fetchCustomerData = async () => {
    try {
      const response = await axios.get("http://localhost:3030/customer");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // useEffect
  useEffect(() => {
    fetchCustomerData();
    // Set up an interval to refresh the data every 10 seconds
    const intervalId = setInterval(fetchCustomerData, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Create customer
  const handleCustomerCreated = () => {
    fetchCustomerData(); // Refresh the customer data when a new customer is created
  };

  // Create customer
  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:3030/customer", newCustomer);

      // onCustomerCreated(); // Notify the parent component that a new customer has been created
      setNewCustomer({
        name: "乙太",
        svr: 2290,
        type: 0,
        set_price: 100000,
      });
      console.log("New customer added successfully");
    } catch (error) {
      console.error("Error creating new customer:", error);
    }
  };

  // Enter edit mode
  const enterEditMode = (customer) => {
    setIsEdit(true);
    setEditedCustomer(customer);
  };

  // Update customer
  const handleEdit = async () => {
    // Make a PUT request to update the customer
    try {
      const response = await axios.put(
        `http://localhost:3030/customer/${editedCustomer.id}`,
        editedCustomer
      );

      // Refresh the customer data and exit edit mode
      fetchCustomerData();
      setIsEdit(false);
      setEditedCustomer(null);
      console.log(`Updated customer with ID ${editedCustomer.id}`);
    } catch (error) {
      console.error(
        `Error updating customer with ID ${editedCustomer.id}:`,
        error
      );
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setIsEdit(false);
    setEditedCustomer(null);
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
      {" "}
      {/* Add button */}
      {isFormHidden ? (
        <button
          className="add-form-button"
          onClick={() => setIsFormHidden(!isFormHidden)}
        >
          Add
        </button>
      ) : (
        <button
          className="hidden-form-button"
          onClick={() => setIsFormHidden(!isFormHidden)}
        >
          Hidden
        </button>
      )}
      {/* Create customer button */}
      {!isFormHidden && (
        <div className="new-customer-form">
          <h2> </h2>
          <div>
            <label>關鍵字:</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
            />
          </div>
          <div>
            <label>伺服器:</label>
            <select
              type="text"
              value={newCustomer.svr}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, svr: e.target.value })
              }
            >
              <option value={2290}>巴基利</option>
              <option value={3290}>查爾斯</option>
              <option value={4290}>波利</option>
              <option value={1}>羅札納(未開放)</option>
            </select>
          </div>
          <div>
            <label>類型:</label>
            <select
              value={newCustomer.type}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  type: parseInt(e.target.value),
                })
              }
            >
              <option value={0}>販賣</option>
              <option value={1}>收購</option>
            </select>
          </div>
          <div>
            <label>設定價格:</label>
            <input
              type="number"
              value={newCustomer.set_price}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  set_price: parseInt(e.target.value),
                })
              }
            />
          </div>
          <button className="create-button" onClick={handleCreate}>
            Create
          </button>
        </div>
      )}
      {/* Container for the table and button */}
      <div className="table-container">
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
              <th>
                操作 {/* Refresh button with icon */}
                <button className="refresh-button" onClick={fetchCustomerData}>
                  <FontAwesomeIcon icon={faSync} />
                </button>
              </th>
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
                  {/* Edit button */}
                  <button
                    className="edit-button"
                    onClick={() => enterEditMode(customer)}
                  >
                    Edit
                  </button>
                  {/* Delete button */}
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerTable.css"; // Import a CSS file for styling
// import NewCustomerForm from "./NewCustomerForm"; // Import the new component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faSync } from "@fortawesome/free-solid-svg-icons";

function CustomerTable() {
  const [formCustomer, setFormCustomer] = useState({
    id: "",
    name: "乙太",
    svr: 2290,
    type: 0, // Initialize type as 0 (販賣) by default
    set_price: 200000,
    low_price: 0,
    nofi: "",
  });
  const [customerList, setCustomerList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isFormHidden, setIsFormHidden] = useState(true);
  // const [editedCustomer, setEditedCustomer] = useState(null);

  // Get/Fetch customer
  const fetchCustomerData = async () => {
    try {
      const response = await axios.get("http://localhost:3030/customer");
      setCustomerList(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // useEffect
  useEffect(() => {
    fetchCustomerData();
    // Set up an interval to refresh the data every 10 seconds
    const intervalId = setInterval(fetchCustomerData, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // "Reset" form
  const resetFormCustomer = () => {
    setFormCustomer({
      id: "",
      name: "乙太",
      svr: 2290,
      type: 0,
      set_price: 220000,
      new_price: 0,
    });
  };

  // "Create" customer
  const handleCustomerCreated = () => {
    fetchCustomerData(); // Refresh the customer data when a new customer is created
  };

  // Create customer
  const handleCreate = async () => {
    setIsEdit(false);
    try {
      await axios.post("http://localhost:3030/customer", formCustomer);

      // onCustomerCreated(); // Notify the parent component that a new customer has been created
      resetFormCustomer();
      console.log("New customer added successfully");
    } catch (error) {
      console.error("Error creating new customer:", error);
    }
  };

  // "Update" customer
  // Enter edit button
  const enterEditButton = (customer) => {
    console.log(customer);
    setIsEdit(true);
    if (isFormHidden) setIsFormHidden(!isFormHidden);
    setFormCustomer({
      id: customer.id,
      name: customer.name,
      svr: customer.svr,
      type: customer.type,
      set_price: customer.set_price,
      new_price: customer.new_price,
    });
  };

  // Handle edit
  const handleFormEditedData = async (newValue, field) => {
    setFormCustomer((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  const handleEdit = async () => {
    // Make a PUT request to update the customer
    try {
      await axios.put(
        `http://localhost:3030/customer/${formCustomer.id}`,
        formCustomer
      );

      // Refresh the customer data and exit edit mode
      fetchCustomerData();

      // Rest form
      resetFormCustomer();

      // Print
      console.log(`Updated customer with ID ${formCustomer.id}`);
    } catch (error) {
      console.error(
        `Error updating customer with ID ${formCustomer.id}:`,
        error
      );
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    // setIsEdit(false);
    // setEditedCustomer(null);
  };

  // "Delete" customer
  const handleDelete = (customerId) => {
    // Make a DELETE request to the API endpoint
    axios
      .delete(`http://localhost:3030/customer/${customerId}`)
      .then(() => {
        // Remove the deleted customer from the state
        setCustomerList(
          customerList.filter((customer) => customer.id !== customerId)
        );
        console.log(`Deleted customer with ID ${customerId}`);
      })
      .catch((error) => {
        console.error(`Error deleting customer with ID ${customerId}:`, error);
      });
  };

  // Handle hidden customer form
  const handleHiddenForm = () => {
    setIsFormHidden(!isFormHidden);
    setIsEdit(false);
    resetFormCustomer();
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
          onClick={() => handleHiddenForm()}
        >
          Hidden
        </button>
      )}
      {/* Create customer button */}
      {!isFormHidden && (
        <div className="form-container">
          <div className="form-table">
            <div className="form-row">
              {/* Name */}
              <div className="form-label">Name:</div>
              <div
                className="form-data"
                contentEditable={true}
                onInput={(e) =>
                  handleFormEditedData(e.target.textContent, "name")
                }
              >
                {formCustomer.name}
              </div>
              {/* Server */}
              <div className="form-label">svr:</div>
              <div
                className="form-data"
                contentEditable={true}
                onInput={(e) =>
                  handleFormEditedData(e.target.textContent, "svr")
                }
              >
                {formCustomer.svr}
              </div>
              {/* Set Price */}
              <div className="form-label">set_price:</div>
              <div
                className="form-data"
                contentEditable={true}
                onInput={(e) =>
                  handleFormEditedData(e.target.textContent, "set_price")
                }
              >
                {formCustomer.set_price}
              </div>
              {/* Low Price */}
              <div className="form-label">new_price:</div>
              <div
                className="form-data"
                contentEditable={true}
                onInput={(e) =>
                  handleFormEditedData(e.target.textContent, "new_price")
                }
              >
                {formCustomer.new_price}
              </div>
              {/* Sell or Buy */}
              <div className="form-label">type:</div>
              <div
                className="form-data"
                contentEditable={true}
                onInput={(e) =>
                  handleFormEditedData(e.target.textContent, "type")
                }
              >
                {formCustomer.type}
              </div>
              {/* Button */}

              <div className="form-button-container">
                {/* <div className="form-button" onClick={handleSave}> */}
                {isEdit ? (
                  <div className="form-button" onClick={handleEdit}>
                    Update
                  </div>
                ) : (
                  <div className="form-button" onClick={handleCreate}>
                    Create
                  </div>
                )}
              </div>
            </div>
          </div>
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
            {customerList.map((customer) => (
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
                    onClick={() => enterEditButton(customer)}
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

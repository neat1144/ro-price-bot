import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerTable.css"; // Import a CSS file for styling
// import NewCustomerForm from "./NewCustomerForm"; // Import the new component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

function CustomerTable() {
  const [formCustomer, setFormCustomer] = useState({
    id: "",
    name: "乙太星塵",
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
  const [isRest, setIsRest] = useState(true);

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
    const intervalId = setInterval(fetchCustomerData, 2 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // "Reset" form
  const resetFormCustomer = () => {
    setFormCustomer({
      id: "",
      name: "乙太星塵",
      svr: 2290,
      type: 0,
      set_price: 220000,
      new_price: 0,
      nofi: "",
    });
  };

  // "Create" customer
  // const handleCustomerCreated = () => {
  //   fetchCustomerData(); // Refresh the customer data when a new customer is created
  // };

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

  // "Clean" Handle clean new_price
  const resetButton = (customer) => {
    console.log(customer.id);
    // Set formCustomer
    setFormCustomer({
      id: customer.id,
      name: customer.name,
      svr: customer.svr,
      type: customer.type,
      set_price: customer.set_price,
      new_price: "0",
      nofi: "",
    });
    setIsRest(false);
  };

  const handleResetButton = () => {
    console.log(formCustomer.id);
    handleEdit();
    setIsRest(true);
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
      nofi: customer.nofi,
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

      // Print
      console.log(`Updated customer with ID ${formCustomer.name}`);

      // Refresh the customer data and exit edit mode
      fetchCustomerData();

      // Rest form
      resetFormCustomer();
    } catch (error) {
      console.error(
        `Error updating customer with ID ${formCustomer.name}:`,
        error
      );
    }
  };

  // Cancel edit mode
  // const cancelEdit = () => {
  //   // setIsEdit(false);
  //   // setEditedCustomer(null);
  // };

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
      <div className="form-show-button">
        {isFormHidden ? (
          <button
            className="btn btn-primary"
            onClick={() => setIsFormHidden(!isFormHidden)}
          >
            Add
          </button>
        ) : (
          ""
        )}{" "}
      </div>
      {/* Create customer button */}
      {!isFormHidden && (
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6 mx-auto">
              <form className="border rounded p-4 shadow">
                <div className="form-group mb-2">
                  <label htmlFor="name">名稱:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={formCustomer.name}
                    onChange={(e) =>
                      handleFormEditedData(e.target.value, "name")
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="svr">伺服器:</label>
                  <select
                    className="form-control"
                    id="svr"
                    value={formCustomer.svr}
                    onChange={(e) =>
                      handleFormEditedData(e.target.value, "svr")
                    }
                  >
                    <option value="2290">巴基利 (2290)</option>
                    <option value="3290">查爾斯 (3290)</option>
                    <option value="4290">波利 (4290)</option>
                    <option value="9999">羅札納 (未開放)</option>
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="set_price">設定價格:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="set_price"
                    value={formCustomer.set_price}
                    onChange={(e) =>
                      handleFormEditedData(e.target.value, "set_price")
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="new_price">目前最低價:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="new_price"
                    value={formCustomer.new_price}
                    onChange={(e) =>
                      handleFormEditedData(e.target.value, "new_price")
                    }
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="type">販售/收購:</label>
                  <select
                    className="form-control"
                    id="type"
                    value={formCustomer.type}
                    onChange={(e) =>
                      handleFormEditedData(e.target.value, "type")
                    }
                  >
                    <option value="0">販售</option>
                    <option value="1">收購</option>
                  </select>
                </div>
                <div className="form-group mb-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleHiddenForm()}
                  >
                    Cancel
                  </button>
                  {isEdit ? (
                    <button className="btn btn-warning" onClick={handleEdit}>
                      Update
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={handleCreate}>
                      Create
                    </button>
                  )}
                </div>
              </form>
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
              <th>名稱</th>
              <th>伺服器</th>
              <th>設定價格</th>
              <th>目前最低價</th>
              <th>販售/收購</th>
              <th>已通知</th>
              <th>
                操作
                {/* Refresh button with icon */}
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
                    ? "巴基利 (2290)"
                    : customer.svr === 3290
                    ? "查爾斯 (3290)"
                    : customer.svr === 4290
                    ? "波利 (4290)"
                    : customer.svr === 0
                    ? "羅札納 (未開放)"
                    : ""}
                </td>
                <td>
                  {customer.set_price
                    ? customer.set_price.toLocaleString()
                    : "0"}
                </td>
                <td>
                  {customer.new_price
                    ? customer.new_price.toLocaleString()
                    : "0"}
                </td>
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
                      ? "販售"
                      : customer.type === 1
                      ? "收購"
                      : ""}
                  </span>
                </td>
                <td>{customer.nofi === "" ? "none" : customer.nofi}</td>

                <td>
                  {/* Reset new_price button */}
                  {isRest ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        resetButton(customer);
                      }}
                    >
                      Reset
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        handleResetButton();
                      }}
                    >
                      OK?
                    </button>
                  )}
                  {/* Edit button */}
                  <button
                    className="btn btn-success"
                    onClick={() => enterEditButton(customer)}
                  >
                    Edit
                  </button>
                  {/* Delete button */}
                  <button
                    className="btn btn-danger"
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

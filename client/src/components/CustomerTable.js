import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./CustomerTable.css"; // Import a CSS file for styling
// import NewCustomerForm from "./NewCustomerForm"; // Import the new component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

import notificationSound from "./notification.mp3";

function CustomerTable() {
  const [formCustomer, setFormCustomer] = useState({
    id: "",
    name: "乙太星塵",
    svr: 2290,
    type: 0, // Initialize type as 0 (販賣) by default
    set_price: 200000,
    new_price: 0,
    time: "",
  });
  const [customerList, setCustomerList] = useState([]);
  const [isUpdateButton, setIsUpdateButton] = useState(false);
  const [isFormHidden, setIsFormHidden] = useState(true);
  // const [editedCustomer, setEditedCustomer] = useState(null);
  const [isResetButton, setIsResetButton] = useState(true);
  // For nitify
  const [notifiedCustomers, setNotifiedCustomers] = useState([]);

  const notificationAudio = useMemo(() => new Audio(notificationSound), []);

  // Function to fetch customer data
  const fetchCustomerData = async () => {
    try {
      // Get list of customers
      const response = await axios.get("http://localhost:3030/customer");

      // Set Customer (for table)
      setCustomerList(response.data);

      // Check is_notify
      checkNotifications();
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // Function to check for notifications and play sound
  const checkNotifications = () => {
    // Filter customers with is_notify === 0 who haven't been notified
    const customersToNotify = customerList.filter(
      (customer) => customer.is_notify === 0
    );

    // Play the notification sound for each customer with is_notify === 0
    customersToNotify.forEach((customer) => {
      // Play sound
      notificationAudio.play();

      // Update is_notify for customer
      resetNotifyState(customer);
    });
  };

  useEffect(() => {
    // Function to fetch customer data
    const fetchCustomerData = async () => {
      try {
        // Get list of customers
        const response = await axios.get("http://localhost:3030/customer");

        // Set Customer (for table)
        setCustomerList(response.data);

        // Check is_notify
        checkNotifications();
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    // Function to check for notifications and play sound
    const checkNotifications = () => {
      // Filter customers with is_notify === 0 who haven't been notified
      const customersToNotify = customerList.filter(
        (customer) => customer.is_notify === 0
      );

      // Play the notification sound for each customer with is_notify === 0
      customersToNotify.forEach((customer) => {
        // Play sound
        notificationAudio.play();

        // Update is_notify for customer
        resetNotifyState(customer);
      });
    };

    // Fetch initial customer data
    fetchCustomerData();
    // checkNotifications();

    // Set up an interval to refresh the data every 10 seconds
    const dataRefreshInterval = setInterval(fetchCustomerData, 2 * 1000);

    // Set up an interval to check for notifications every 2 seconds
    // const notificationCheckInterval = setInterval(checkNotifications, 2 * 1000);

    // Clean up intervals when the component unmounts
    return () => {
      clearInterval(dataRefreshInterval);
      // clearInterval(notificationCheckInterval);
    };
  }, [customerList, notificationAudio, notifiedCustomers]);

  // Reset is_notify
  const resetNotifyState = async (customer) => {
    try {
      // Call api
      await axios.put(`http://localhost:3030/customer/${customer.id}`, {
        ...customer,
        is_notify: 1,
      });

      // Update the list of notified customers in state
      setNotifiedCustomers((prevNotifiedCustomers) => [
        ...prevNotifiedCustomers,
        customer.id,
      ]);
    } catch (error) {
      console.error(`Error updating customer with ID ${customer.id}:`, error);
    }
  };

  // "Init" form
  const initFormCustomer = () => {
    setFormCustomer({
      id: "",
      name: "乙太星塵",
      svr: 2290,
      type: 0,
      set_price: 220000,
      new_price: 0,
      time: "",
    });
  };

  // "Create" customer
  // const handleCustomerCreated = () => {
  //   fetchCustomerData(); // Refresh the customer data when a new customer is created
  // };

  // Create customer
  const handleCreate = async () => {
    setIsUpdateButton(false);
    try {
      await axios.post("http://localhost:3030/customer", formCustomer);

      // onCustomerCreated(); // Notify the parent component that a new customer has been created
      initFormCustomer();
      console.log("New customer added successfully");
    } catch (error) {
      console.error("Error creating new customer:", error);
    }
  };

  // "Clean" Handle clean new_price and is_notify
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
      time: "",
    });
    setIsResetButton(false);
  };

  const handleResetButton = () => {
    handlePutMethod();
    setIsResetButton(true);
  };

  // "Update" customer
  // Enter edit button
  const editButton = (customer) => {
    // Set button
    setIsUpdateButton(true);

    // Show form
    if (isFormHidden) setIsFormHidden(!isFormHidden);

    // Get value
    setFormCustomer({
      id: customer.id,
      name: customer.name,
      svr: customer.svr,
      type: customer.type,
      set_price: customer.set_price,
      new_price: customer.new_price,
      time: customer.time,
    });
  };

  // Handle edit
  const handleFormData = async (newValue, field) => {
    setFormCustomer((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  const handlePutMethod = async () => {
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
      initFormCustomer();
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
    setIsUpdateButton(false);
    initFormCustomer();
  };

  // Create a variable to track the serial number
  let serialNumber = 1;

  // Nofi when is_notify of customer === 1
  // then notify and set to 1

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
                {/* Name */}
                <div className="form-group mb-2">
                  <label htmlFor="name">名稱:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={formCustomer.name}
                    onChange={(e) => handleFormData(e.target.value, "name")}
                  />
                </div>
                {/* Server */}
                <div className="form-group mb-2">
                  <label htmlFor="svr">伺服器:</label>
                  <select
                    className="form-control"
                    id="svr"
                    value={formCustomer.svr}
                    onChange={(e) => handleFormData(e.target.value, "svr")}
                  >
                    <option value="2290">巴基利 (2290)</option>
                    <option value="3290">查爾斯 (3290)</option>
                    <option value="4290">波利 (4290)</option>
                    <option value="9999">羅札納 (未開放)</option>
                  </select>
                </div>

                {/* Set Price */}
                <div className="form-group mb-2">
                  <label htmlFor="set_price">設定價格:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="set_price"
                    value={formCustomer.set_price}
                    onChange={(e) =>
                      handleFormData(e.target.value, "set_price")
                    }
                  />
                </div>

                {/* New Price */}
                <div className="form-group mb-2">
                  <label htmlFor="new_price">目前最低價:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="new_price"
                    value={formCustomer.new_price}
                    onChange={(e) =>
                      handleFormData(e.target.value, "new_price")
                    }
                  />
                </div>

                {/* Type */}
                <div className="form-group mb-2">
                  <label htmlFor="type">販售/收購:</label>
                  <select
                    className="form-control"
                    id="type"
                    value={formCustomer.type}
                    onChange={(e) => handleFormData(e.target.value, "type")}
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
                  {isUpdateButton ? (
                    <button
                      className="btn btn-warning"
                      onClick={handlePutMethod}
                    >
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
              <th>通知時間</th>
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
                {/* Serial Num */}
                <td>{serialNumber++}</td>
                {/* Name */}
                <td>{customer.name}</td>
                {/* Server */}
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
                {/* Set Price */}
                <td>
                  {customer.set_price
                    ? customer.set_price.toLocaleString()
                    : "0"}
                </td>
                {/* New Price */}
                <td>
                  {customer.new_price
                    ? customer.new_price.toLocaleString()
                    : "0"}
                </td>
                {/* Type */}
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
                {/* Time */}
                <td>
                  {customer.time === 0 ? "none" : customer.time}
                  {/* {customer.is_notify} */}
                </td>

                <td>
                  {/* Reset new_price button */}
                  {isResetButton ? (
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
                    onClick={() => editButton(customer)}
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

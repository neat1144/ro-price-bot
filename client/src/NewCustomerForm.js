import React, { useState } from "react";
import axios from "axios";
import "./NewCustomerForm.css"; // Import a CSS file for styling

function NewCustomerForm({ onCustomerCreated }) {
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    svr: 0,
    type: 0, // Initialize type as 0 (販賣) by default
    set_price: 0,
  });

  const handleCreate = () => {
    axios
      .post("http://localhost:3030/customer", newCustomer)
      .then(() => {
        onCustomerCreated(); // Notify the parent component that a new customer has been created
        setNewCustomer({
          name: "",
          svr: 0,
          type: 0,
          set_price: 0,
        });
        console.log("New customer added successfully");
      })
      .catch((error) => {
        console.error("Error creating new customer:", error);
      });
  };

  return (
    <div className="new-customer-form">
      <h2>Add New Customer</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
        />
      </div>
      <div>
        <label>Server:</label>
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
        <label>Type:</label>
        <select
          value={newCustomer.type}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, type: parseInt(e.target.value) })
          }
        >
          <option value={0}>販賣</option>
          <option value={1}>收購</option>
        </select>
      </div>
      <div>
        <label>Price:</label>
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
  );
}

export default NewCustomerForm;

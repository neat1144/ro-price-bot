import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TGTable.css"; // Import your CSS file

function TGTable() {
  // const [data, setData] = useState({ chat_id: "", token: null });
  const [editedData, setEditedData] = useState({ chat_id: "", token: null });

  const [showTable, setShowTable] = useState(false);

  const handleToggleTable = () => {
    setShowTable(!showTable);
  };

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:3030/chat-id")
      .then((response) => {
        // Extract the values from the API response
        const { chat_id, token } = response.data;
        // setData({ chat_id, token });
        setEditedData({ chat_id, token });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (newValue, field) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  const handleSave = () => {
    // Save the edited data to the API
    axios
      .post("http://localhost:3030/chat-id", editedData)
      .then(() => {
        alert("Data saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <div>
      <div className="telegram-btn-container">
        <button onClick={handleToggleTable} className="btn btn-link btn-sm">
          Telegram
        </button>
      </div>

      {showTable && (
        <div className="container mt-4">
          <h2>Telegram ID/Token</h2>
          <div className="row">
            <div className="col-md-8 mx-auto">
              <form className="border rounded p-4 shadow">
                <div className="form-group mb-2">
                  <label htmlFor="chat_id">ID:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="chat_id"
                    value={editedData.chat_id}
                    onChange={(e) => handleEdit(e.target.value, "chat_id")}
                  />
                </div>

                <div className="form-group mb-2">
                  <label htmlFor="token">Token:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="token"
                    value={editedData.token}
                    onChange={(e) => handleEdit(e.target.value, "token")}
                  />
                </div>

                <div className="form-group mb-2">
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TGTable;

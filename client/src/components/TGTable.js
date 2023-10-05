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
      <button onClick={handleToggleTable} className="tg-show-button">
        Telegram Setting
      </button>

      {showTable && (
        <div className="tg-container">
          <h2>Telegram ID/Token</h2>
          <div className="tg-table">
            <div className="tg-row">
              <div className="tg-label">ID:</div>
              <div
                className="tg-data"
                contentEditable={true}
                onInput={(e) => handleEdit(e.target.textContent, "chat_id")}
              >
                {editedData.chat_id}
              </div>
            </div>

            <div className="tg-row">
              <div className="tg-label">Token:</div>
              <div
                className="tg-data"
                contentEditable={true}
                onInput={(e) => handleEdit(e.target.textContent, "token")}
              >
                {editedData.token}
              </div>
            </div>

            <div className="tg-button-container">
              <div className="tg-button" onClick={handleSave}>
                Save
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TGTable;

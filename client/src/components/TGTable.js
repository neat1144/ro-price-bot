import React, { useState, useEffect } from "react";
import axios from "axios";

function TGTable() {
  // const [data, setData] = useState({ chat_id: "", token: null });
  const [editedData, setEditedData] = useState({ chat_id: "", token: null });

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
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

        console.log("TG ID/Token saved to db!");
        fetchData();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <div>
      <div className="container mt-4">
        <h2>Telegram ID/Token</h2>
        <div className="row">
          <div className="col-md-12">
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

              <div className="form-group mb-2 text-center">
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TGTable;

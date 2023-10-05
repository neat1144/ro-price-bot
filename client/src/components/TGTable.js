import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TGTable.css'; // Import your CSS file

function TGTable() {
  const [data, setData] = useState({ chat_id: '', token: null });
  const [editedData, setEditedData] = useState({ chat_id: '', token: null });

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:3030/chat-id')
      .then((response) => {
        // Extract the values from the API response
        const { chat_id, token } = response.data;
        setData({ chat_id, token });
        setEditedData({ chat_id, token });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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
    axios.post('http://localhost:3030/chat-id', editedData)
      .then(() => {
        alert('Data saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  return (
    <div>
      <h2>Telegram ID/Token</h2>
      <table className="tg-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Token</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td contentEditable={true} onInput={(e) => handleEdit(e.target.textContent, 'chat_id')}>
              {editedData.chat_id}
            </td>
            <td contentEditable={true} onInput={(e) => handleEdit(e.target.textContent, 'token')}>
              {editedData.token}
            </td>
            <td>
              <button onClick={handleSave}>Save</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TGTable;
